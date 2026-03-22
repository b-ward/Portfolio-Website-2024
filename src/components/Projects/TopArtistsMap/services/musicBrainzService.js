const CACHE_KEY = 'top-artists-map:musicbrainz-cache:v6'
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7
const MUSICBRAINZ_URL = 'https://musicbrainz.org/ws/2/artist/'
const FETCH_DELAY_MS = 1100

const COUNTRY_NAME_TO_CODE = {
  uk: 'GB',
  'united kingdom': 'GB',
  'northern ireland': 'GB',
  england: 'GB',
  scotland: 'GB',
  wales: 'GB',
  ireland: 'IE',
  'republic of ireland': 'IE',
  usa: 'US',
  us: 'US',
  'united states': 'US',
  'united states of america': 'US',
  canada: 'CA',
  australia: 'AU',
  germany: 'DE',
  france: 'FR',
  spain: 'ES',
  italy: 'IT',
  netherlands: 'NL',
  sweden: 'SE',
  norway: 'NO',
  denmark: 'DK',
  finland: 'FI',
  japan: 'JP',
  korea: 'KR',
  'south korea': 'KR',
  india: 'IN',
  brazil: 'BR',
  mexico: 'MX',
  argentina: 'AR',
  'new zealand': 'NZ',
  nigeria: 'NG',
  jamaica: 'JM',
  belgium: 'BE',
  switzerland: 'CH',
  austria: 'AT',
  poland: 'PL',
  portugal: 'PT',
  greece: 'GR',
  turkey: 'TR',
  russia: 'RU',
  ukraine: 'UA',
  china: 'CN',
  taiwan: 'TW',
  singapore: 'SG',
  philippines: 'PH',
  indonesia: 'ID',
  thailand: 'TH',
  vietnam: 'VN',
  malaysia: 'MY',
  egypt: 'EG',
  morocco: 'MA',
  ghana: 'GH',
  'south africa': 'ZA',
  chile: 'CL',
  colombia: 'CO',
  peru: 'PE',
}

const CITY_NAME_TO_COUNTRY_CODE = {
  london: 'GB',
  manchester: 'GB',
  liverpool: 'GB',
  birmingham: 'GB',
  glasgow: 'GB',
  edinburgh: 'GB',
  belfast: 'GB',
  cardiff: 'GB',
  bangor: 'GB',
  dublin: 'IE',
  cork: 'IE',
  galway: 'IE',
  'new york': 'US',
  'los angeles': 'US',
  chicago: 'US',
  nashville: 'US',
  atlanta: 'US',
  toronto: 'CA',
  montreal: 'CA',
  vancouver: 'CA',
  sydney: 'AU',
  melbourne: 'AU',
  brisbane: 'AU',
  berlin: 'DE',
  hamburg: 'DE',
  munich: 'DE',
  paris: 'FR',
  lyon: 'FR',
  madrid: 'ES',
  barcelona: 'ES',
  rome: 'IT',
  milan: 'IT',
  amsterdam: 'NL',
  stockholm: 'SE',
  oslo: 'NO',
  copenhagen: 'DK',
  helsinki: 'FI',
  warsaw: 'PL',
  lisbon: 'PT',
  athens: 'GR',
  istanbul: 'TR',
  moscow: 'RU',
  kyiv: 'UA',
  seoul: 'KR',
  tokyo: 'JP',
  osaka: 'JP',
  beijing: 'CN',
  shanghai: 'CN',
  taipei: 'TW',
  singapore: 'SG',
  manila: 'PH',
  jakarta: 'ID',
  bangkok: 'TH',
  hanoi: 'VN',
  'ho chi minh city': 'VN',
  kuala: 'MY',
  kualalumpur: 'MY',
  'kuala lumpur': 'MY',
  cairo: 'EG',
  casablanca: 'MA',
  lagos: 'NG',
  accra: 'GH',
  'cape town': 'ZA',
  johannesburg: 'ZA',
  lagos: 'NG',
  kingston: 'JM',
  'rio de janeiro': 'BR',
  'sao paulo': 'BR',
  'méxico city': 'MX',
  'mexico city': 'MX',
  'buenos aires': 'AR',
  santiago: 'CL',
  bogota: 'CO',
  'bogotá': 'CO',
  lima: 'PE',
  brooklyn: 'US',
}

const ELECTRONIC_GENRE_HINTS = ['drum and bass', 'dnb', 'electronic', 'edm', 'dance', 'house', 'techno']
const NON_ELECTRONIC_STYLE_MARKERS = ['jazz', 'rock band', 'metal', 'orchestra', 'classical']

function parseCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function persistCache(cache) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
}

function getValidCachedValue(cache, artistId) {
  const cached = cache[artistId]
  if (!cached) {
    return null
  }

  if (Date.now() - cached.updatedAt > CACHE_TTL_MS) {
    return null
  }

  return cached.countryCode || null
}

function saveCountryToCache(cache, artistId, countryCode) {
  cache[artistId] = {
    countryCode: countryCode || null,
    updatedAt: Date.now(),
  }
}

function normalizeForMatch(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function hasAnyKeyword(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword))
}

function getCandidateDescriptorText(candidate) {
  return normalizeForMatch(
    [
      candidate?.name,
      candidate?.disambiguation,
      candidate?.type,
      candidate?.['sort-name'],
      candidate?.area?.name,
      candidate?.['begin-area']?.name,
      ...(candidate?.tags || []).map((tag) => tag?.name),
      ...(candidate?.genres || []).map((genre) => genre?.name),
      ...(candidate?.aliases || []).map((alias) => alias?.name),
    ]
      .filter(Boolean)
      .join(' ')
  )
}

async function fetchArtistDetails(artistId) {
  const response = await fetch(`${MUSICBRAINZ_URL}${artistId}?fmt=json&inc=tags+genres+aliases`, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`MusicBrainz artist details request failed (${response.status})`)
  }

  return response.json()
}

function scoreCandidate(candidate, spotifyArtist) {
  const normalizedSpotifyName = normalizeForMatch(spotifyArtist?.name)
  const normalizedCandidateName = normalizeForMatch(candidate?.name)
  const candidateText = getCandidateDescriptorText(candidate)

  const genres = Array.isArray(spotifyArtist?.genres)
    ? spotifyArtist.genres.map((genre) => normalizeForMatch(genre)).filter(Boolean)
    : []

  let score = Number(candidate?.score || 0)

  if (normalizedCandidateName === normalizedSpotifyName) {
    score += 120
  }

  for (let genreIndex = 0; genreIndex < genres.length; genreIndex += 1) {
    const genre = genres[genreIndex]
    if (candidateText.includes(genre)) {
      score += 45
    }

    const genreTokens = genre.split(' ').filter((token) => token.length >= 4)
    const tokenMatches = genreTokens.filter((token) => candidateText.includes(token)).length
    score += Math.min(tokenMatches * 4, 20)
  }

  const isElectronicListener = genres.some((genre) =>
    ELECTRONIC_GENRE_HINTS.some((hint) => genre.includes(hint))
  )

  if (isElectronicListener) {
    if (candidate?.type === 'Person') {
      score += 20
    }

    if (candidate?.type === 'Group') {
      score -= 8
    }

    if (hasAnyKeyword(candidateText, ['dj', 'producer', 'drum and bass', 'dnb', 'electronic'])) {
      score += 35
    }

    if (hasAnyKeyword(candidateText, NON_ELECTRONIC_STYLE_MARKERS)) {
      score -= 60
    }
  }

  if (hasAnyKeyword(candidateText, ['japan', 'japanese']) && isElectronicListener) {
    score -= 20
  }

  return score
}

async function getBestCandidate(artists, spotifyArtist) {
  if (!Array.isArray(artists) || artists.length === 0) {
    return null
  }

  const normalizedTarget = normalizeForMatch(spotifyArtist?.name)

  const exactMatches = artists.filter(
    (artist) => normalizeForMatch(artist?.name) === normalizedTarget
  )

  const candidates = exactMatches.length > 0 ? exactMatches : artists
  if (candidates.length === 1) {
    return candidates[0]
  }

  const sortedBySearchScore = [...candidates].sort((left, right) => Number(right.score || 0) - Number(left.score || 0))
  const topCandidates = sortedBySearchScore.slice(0, 3)
  const enrichedCandidates = []

  for (let index = 0; index < topCandidates.length; index += 1) {
    const candidate = topCandidates[index]

    try {
      const details = await fetchArtistDetails(candidate.id)
      enrichedCandidates.push({ ...candidate, ...details })
    } catch {
      enrichedCandidates.push(candidate)
    }

    if (index < topCandidates.length - 1) {
      await delay(FETCH_DELAY_MS)
    }
  }

  const remainingCandidates = sortedBySearchScore.slice(3)
  const sortableCandidates = [...enrichedCandidates, ...remainingCandidates]
  const sorted = sortableCandidates.sort(
    (left, right) => scoreCandidate(right, spotifyArtist) - scoreCandidate(left, spotifyArtist)
  )

  return sorted[0]
}

function toCountryCodeFromName(value) {
  if (!value) {
    return null
  }

  const normalized = String(value).trim().toLowerCase()
  return COUNTRY_NAME_TO_CODE[normalized] || null
}

function toCountryCodeFromCity(value) {
  if (!value) {
    return null
  }

  const normalized = String(value).trim().toLowerCase()
  return CITY_NAME_TO_COUNTRY_CODE[normalized] || null
}

function toCountryCodeFromAreaValue(value) {
  if (!value) {
    return null
  }

  const directCountryCode = toCountryCodeFromName(value)
  if (directCountryCode) {
    return directCountryCode
  }

  const directCityCode = toCountryCodeFromCity(value)
  if (directCityCode) {
    return directCityCode
  }

  const normalized = String(value)
    .toLowerCase()
    .replace(/[()]/g, ',')
    .replace(/\s+/g, ' ')
    .trim()

  const tokens = normalized.split(',').map((token) => token.trim()).filter(Boolean)

  for (let index = tokens.length - 1; index >= 0; index -= 1) {
    const token = tokens[index]
    const countryCode = toCountryCodeFromName(token)
    if (countryCode) {
      return countryCode
    }

    const cityCode = toCountryCodeFromCity(token)
    if (cityCode) {
      return cityCode
    }
  }

  return null
}

function extractCountryCode(artist) {
  if (!artist) {
    return null
  }

  if (artist.country) {
    const normalizedCountry = String(artist.country).trim().toUpperCase()
    if (/^[A-Z]{2}$/.test(normalizedCountry)) {
      return normalizedCountry
    }

    return toCountryCodeFromAreaValue(artist.country)
  }

  const areaCode = artist.area?.['iso-3166-1-codes']?.[0]
  if (areaCode) {
    return areaCode.toUpperCase()
  }

  const beginAreaCode = artist['begin-area']?.['iso-3166-1-codes']?.[0]
  if (beginAreaCode) {
    return beginAreaCode.toUpperCase()
  }

  const areaNameCode = toCountryCodeFromAreaValue(artist.area?.name)
  if (areaNameCode) {
    return areaNameCode
  }

  const areaSortNameCode = toCountryCodeFromAreaValue(artist.area?.['sort-name'])
  if (areaSortNameCode) {
    return areaSortNameCode
  }

  const beginAreaNameCode = toCountryCodeFromAreaValue(artist['begin-area']?.name)
  if (beginAreaNameCode) {
    return beginAreaNameCode
  }

  const beginAreaSortNameCode = toCountryCodeFromAreaValue(artist['begin-area']?.['sort-name'])
  if (beginAreaSortNameCode) {
    return beginAreaSortNameCode
  }

  return null
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function lookupArtistCountry(spotifyArtist) {
  const artistName = spotifyArtist?.name || ''
  const sanitizedArtistName = String(artistName || '').replace(/"/g, '')
  const query = `artist:"${sanitizedArtistName}"`
  const url = `${MUSICBRAINZ_URL}?query=${encodeURIComponent(query)}&fmt=json&limit=5`

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`MusicBrainz request failed (${response.status})`)
  }

  const data = await response.json()
  const bestCandidate = await getBestCandidate(data?.artists || [], spotifyArtist)
  return extractCountryCode(bestCandidate)
}

export async function resolveArtistsWithCountry(artists) {
  const cache = parseCache()
  const results = []

  for (let index = 0; index < artists.length; index += 1) {
    const artist = artists[index]
    const cachedCountryCode = getValidCachedValue(cache, artist.id)

    if (cachedCountryCode) {
      results.push({ ...artist, countryCode: cachedCountryCode })
      continue
    }

    try {
      const countryCode = await lookupArtistCountry(artist)

      saveCountryToCache(cache, artist.id, countryCode)
      results.push({ ...artist, countryCode })
    } catch {
      saveCountryToCache(cache, artist.id, null)
      results.push({ ...artist, countryCode: null })
    }

    if (index < artists.length - 1) {
      await delay(FETCH_DELAY_MS)
    }
  }

  persistCache(cache)

  return results
}

export function aggregateArtistsByCountry(artistsWithCountries) {
  return artistsWithCountries.reduce(
    (accumulator, artist) => {
      if (!artist.countryCode) {
        accumulator.unmapped.push(artist)
        return accumulator
      }

      const code = artist.countryCode.toUpperCase()

      if (!accumulator.byCountry[code]) {
        accumulator.byCountry[code] = {
          countryCode: code,
          count: 0,
          artists: [],
        }
      }

      accumulator.byCountry[code].count += 1
      accumulator.byCountry[code].artists.push(artist)
      return accumulator
    },
    { byCountry: {}, unmapped: [] }
  )
}
