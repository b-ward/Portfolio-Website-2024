import React, { useEffect, useMemo, useRef, useState } from 'react'
import { SpotifyAuthProvider, useSpotifyAuth } from './auth/SpotifyAuthProvider'
import { aggregateArtistsByCountry, resolveArtistsWithCountry } from './services/musicBrainzService'
import Modal from '../../Shared/Modal'

const GEO_URL = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson'
const TIME_RANGE_OPTIONS = [
  { label: 'Past 4 weeks', value: 'short_term' },
  { label: 'Past 6 months', value: 'medium_term' },
  { label: 'Several years', value: 'long_term' },
]

const MAP_COLOR_SCALE = ['#fde68a', '#fbbf24', '#f59e0b', '#f97316', '#ef4444', '#b91c1c']
const NO_DATA_FILL = '#d1d5db'
const HOVER_FILL = '#fb7185'
const MAP_WIDTH = 980
const MAP_HEIGHT = 420
const MIN_ZOOM = 1
const MAX_ZOOM = 8
const ZOOM_STEP = 1.25
const LAT_MIN = -60
const LAT_MAX = 85

function getCountryIsoCode(geo) {
  const isoCode =
    geo?.properties?.ISO_A2 ||
    geo?.properties?.iso_a2 ||
    geo?.properties?.['ISO3166-1-Alpha-2'] ||
    geo?.properties?.['iso3166-1-alpha-2']

  if (!isoCode || isoCode === '-99') {
    return null
  }

  return String(isoCode).toUpperCase()
}

function getCountryName(geo) {
  return geo?.properties?.ADMIN || geo?.properties?.name || 'Unknown country'
}

function getFillColor(count, maxCount) {
  if (!count) {
    return NO_DATA_FILL
  }

  if (!maxCount || maxCount <= 1) {
    return MAP_COLOR_SCALE[2]
  }

  const ratio = count / maxCount
  const colorIndex = Math.min(MAP_COLOR_SCALE.length - 1, Math.max(0, Math.ceil(ratio * MAP_COLOR_SCALE.length) - 1))
  return MAP_COLOR_SCALE[colorIndex]
}

function TopArtistsMapContent() {
  const { sdk, clientId, isAuthenticated, isAuthenticating, authError, login, logout, refreshAuthState } =
    useSpotifyAuth()

  const [timeRange, setTimeRange] = useState('medium_term')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [countryBuckets, setCountryBuckets] = useState({})
  const [hoveredCountry, setHoveredCountry] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [unmappedArtists, setUnmappedArtists] = useState([])
  const [geojsonData, setGeojsonData] = useState(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const mapWrapperRef = useRef(null)
  const pinchStartDistanceRef = useRef(null)
  const pinchStartZoomRef = useRef(1)
  const dragStartPointRef = useRef(null)
  const dragStartPanRef = useRef({ x: 0, y: 0 })
  const suppressClickRef = useRef(false)

  useEffect(() => {
    refreshAuthState()
    // Load GeoJSON data
    fetch(GEO_URL)
      .then((res) => res.json())
      .then((data) => setGeojsonData(data))
      .catch((err) => console.error('Failed to load GeoJSON:', err))
  }, [refreshAuthState])

  const hasData = useMemo(() => Object.keys(countryBuckets).length > 0, [countryBuckets])
  const maxCountryCount = useMemo(() => {
    const counts = Object.values(countryBuckets).map((bucket) => bucket?.count || 0)
    return counts.length ? Math.max(...counts) : 0
  }, [countryBuckets])

  async function loadTopArtists() {
    if (!sdk) {
      setError('Spotify client is not configured. Add VITE_SPOTIFY_CLIENT_ID to your environment.')
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      const tokenPresent = await refreshAuthState()
      if (!tokenPresent) {
        const authenticated = await login()
        if (!authenticated) {
          setIsLoading(false)
          return
        }
      }

      const response = await sdk.currentUser.topItems('artists', timeRange, 20, 0)
      const artists = (response?.items || []).map((artist) => ({
        id: artist.id,
        name: artist.name,
        genres: artist.genres || [],
      }))

      const artistsWithCountry = await resolveArtistsWithCountry(artists)
      const aggregated = aggregateArtistsByCountry(artistsWithCountry)

      setCountryBuckets(aggregated.byCountry)
      setUnmappedArtists(aggregated.unmapped)
    } catch (loadError) {
      setError(loadError?.message || 'Failed to load Spotify top artists.')
      setCountryBuckets({})
      setUnmappedArtists([])
    } finally {
      setIsLoading(false)
    }
  }

  function createCountryDetails(geo, countryCode, bucket) {
    return {
      countryCode,
      countryName: getCountryName(geo),
      count: bucket.count,
      artists: bucket.artists,
    }
  }

  function projectToViewport(lon, lat) {
    const safeLat = Math.max(LAT_MIN, Math.min(LAT_MAX, lat))
    const x = ((lon + 180) / 360) * MAP_WIDTH
    const y = ((LAT_MAX - safeLat) / (LAT_MAX - LAT_MIN)) * MAP_HEIGHT
    return [x, y]
  }

  function clampZoom(nextZoom) {
    return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, nextZoom))
  }

  function clampPan(nextPan, targetZoom = zoomLevel) {
    const width = MAP_WIDTH / targetZoom
    const height = MAP_HEIGHT / targetZoom
    const maxPanX = (MAP_WIDTH - width) / 2
    const maxPanY = (MAP_HEIGHT - height) / 2

    return {
      x: Math.max(-maxPanX, Math.min(maxPanX, nextPan.x)),
      y: Math.max(-maxPanY, Math.min(maxPanY, nextPan.y)),
    }
  }

  function getTouchDistance(touches) {
    const [a, b] = touches
    if (!a || !b) {
      return 0
    }

    const dx = a.clientX - b.clientX
    const dy = a.clientY - b.clientY
    return Math.hypot(dx, dy)
  }

  function handlePinchStart(event) {
    if (event.touches.length === 2) {
      pinchStartDistanceRef.current = getTouchDistance(event.touches)
      pinchStartZoomRef.current = zoomLevel
      setIsDragging(false)
      dragStartPointRef.current = null
      return
    }

    if (event.touches.length === 1 && zoomLevel > 1) {
      const touch = event.touches[0]
      dragStartPointRef.current = { x: touch.clientX, y: touch.clientY }
      dragStartPanRef.current = panOffset
      suppressClickRef.current = false
      setIsDragging(true)
    }
  }

  function handlePinchMove(event) {
    if (event.touches.length === 2 && pinchStartDistanceRef.current) {
      if (event.cancelable) {
        event.preventDefault()
      }
      const currentDistance = getTouchDistance(event.touches)
      if (!currentDistance) {
        return
      }

      const scale = currentDistance / pinchStartDistanceRef.current
      const nextZoom = clampZoom(pinchStartZoomRef.current * scale)
      setZoomLevel(nextZoom)
      setPanOffset((previous) => clampPan(previous, nextZoom))
      return
    }

    if (event.touches.length !== 1 || !dragStartPointRef.current || zoomLevel <= 1) {
      return
    }

    if (event.cancelable) {
      event.preventDefault()
    }

    const touch = event.touches[0]
    const bounds = mapWrapperRef.current?.getBoundingClientRect()
    if (!bounds) {
      return
    }

    const dx = touch.clientX - dragStartPointRef.current.x
    const dy = touch.clientY - dragStartPointRef.current.y
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      suppressClickRef.current = true
    }

    const viewWidth = MAP_WIDTH / zoomLevel
    const viewHeight = MAP_HEIGHT / zoomLevel
    const dxSvg = (dx / bounds.width) * viewWidth
    const dySvg = (dy / bounds.height) * viewHeight

    setPanOffset(
      clampPan({
        x: dragStartPanRef.current.x - dxSvg,
        y: dragStartPanRef.current.y - dySvg,
      })
    )
  }

  function handlePinchEnd() {
    if (pinchStartDistanceRef.current) {
      pinchStartDistanceRef.current = null
    }

    if (dragStartPointRef.current) {
      dragStartPointRef.current = null
    }

    setIsDragging(false)
  }

  function zoomIn() {
    setZoomLevel((previous) => {
      const next = clampZoom(previous * ZOOM_STEP)
      setPanOffset((current) => clampPan(current, next))
      return next
    })
  }

  function zoomOut() {
    setZoomLevel((previous) => {
      const next = clampZoom(previous / ZOOM_STEP)
      setPanOffset((current) => clampPan(current, next))
      return next
    })
  }

  function resetZoom() {
    setZoomLevel(1)
    setPanOffset({ x: 0, y: 0 })
  }

  function getViewBox() {
    const width = MAP_WIDTH / zoomLevel
    const height = MAP_HEIGHT / zoomLevel
    const centerX = (MAP_WIDTH - width) / 2
    const centerY = (MAP_HEIGHT - height) / 2
    const x = centerX + panOffset.x
    const y = centerY + panOffset.y
    return { x, y, width, height }
  }

  function handleDragStart(event) {
    if (zoomLevel <= 1) {
      return
    }

    dragStartPointRef.current = { x: event.clientX, y: event.clientY }
    dragStartPanRef.current = panOffset
    suppressClickRef.current = false
    setIsDragging(true)
  }

  function handleDragMove(event) {
    if (!isDragging || !dragStartPointRef.current || zoomLevel <= 1) {
      return
    }

    const bounds = mapWrapperRef.current?.getBoundingClientRect()
    if (!bounds) {
      return
    }

    const dx = event.clientX - dragStartPointRef.current.x
    const dy = event.clientY - dragStartPointRef.current.y
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      suppressClickRef.current = true
    }

    const viewWidth = MAP_WIDTH / zoomLevel
    const viewHeight = MAP_HEIGHT / zoomLevel
    const dxSvg = (dx / bounds.width) * viewWidth
    const dySvg = (dy / bounds.height) * viewHeight

    setPanOffset(
      clampPan({
        x: dragStartPanRef.current.x - dxSvg,
        y: dragStartPanRef.current.y - dySvg,
      })
    )
  }

  function handleDragEnd() {
    if (!isDragging) {
      return
    }

    dragStartPointRef.current = null
    setIsDragging(false)
  }

  function handleWheelZoom(event) {
    if (event.cancelable) {
      event.preventDefault()
    }

    const wrapper = mapWrapperRef.current
    if (!wrapper) {
      return
    }

    const bounds = wrapper.getBoundingClientRect()
    if (!bounds.width || !bounds.height) {
      return
    }

    const relativeX = (event.clientX - bounds.left) / bounds.width
    const relativeY = (event.clientY - bounds.top) / bounds.height
    const safeRelativeX = Math.max(0, Math.min(1, relativeX))
    const safeRelativeY = Math.max(0, Math.min(1, relativeY))

    const currentView = getViewBox()
    const focalX = currentView.x + safeRelativeX * currentView.width
    const focalY = currentView.y + safeRelativeY * currentView.height

    const wheelScale = Math.exp(-event.deltaY * 0.002)
    const nextZoom = clampZoom(zoomLevel * wheelScale)

    if (nextZoom === zoomLevel) {
      return
    }

    const nextWidth = MAP_WIDTH / nextZoom
    const nextHeight = MAP_HEIGHT / nextZoom
    const nextCenterX = (MAP_WIDTH - nextWidth) / 2
    const nextCenterY = (MAP_HEIGHT - nextHeight) / 2

    const nextPan = clampPan(
      {
        x: focalX - safeRelativeX * nextWidth - nextCenterX,
        y: focalY - safeRelativeY * nextHeight - nextCenterY,
      },
      nextZoom
    )

    setZoomLevel(nextZoom)
    setPanOffset(nextPan)
  }

  function updateTooltipPosition(event) {
    const wrapper = mapWrapperRef.current
    if (!wrapper || !event) {
      return
    }

    const bounds = wrapper.getBoundingClientRect()
    const margin = 8
    let x = event.clientX - bounds.left + 12
    let y = event.clientY - bounds.top + 12

    x = Math.max(margin, Math.min(bounds.width - 240, x))
    y = Math.max(margin, Math.min(bounds.height - 120, y))

    setTooltipPosition({ x, y })
  }

  function coordinatesToPath(coordinates) {
    if (!Array.isArray(coordinates[0])) {
      return null
    }
    return coordinates
      .map((coord) => projectToViewport(coord[0], coord[1]))
      .map((point, i) => `${i === 0 ? 'M' : 'L'} ${point[0]} ${point[1]}`)
      .join(' ')
  }

  function renderGeoJSONFeature(feature, index) {
    const countryCode = getCountryIsoCode(feature)
    const bucket = countryCode ? countryBuckets[countryCode] : null
    const count = bucket?.count || 0
    const fillColor = getFillColor(count, maxCountryCount)

    const geometry = feature.geometry
    let pathData = ''

    if (geometry.type === 'Polygon') {
      pathData = geometry.coordinates
        .map((ring) => coordinatesToPath(ring) + ' Z')
        .join(' ')
    } else if (geometry.type === 'MultiPolygon') {
      pathData = geometry.coordinates
        .map((polygon) =>
          polygon
            .map((ring) => coordinatesToPath(ring) + ' Z')
            .join(' ')
        )
        .join(' ')
    }

    if (!pathData) return null

    return (
      <path
        key={`${countryCode}-${index}`}
        d={pathData}
        fill={fillColor}
        stroke={bucket ? '#6b7280' : '#9ca3af'}
        strokeWidth={bucket ? 0.8 : 0.4}
        opacity={1}
        fillOpacity={0.7}
        onMouseEnter={(event) => {
          if (bucket) {
            updateTooltipPosition(event)
            setHoveredCountry(createCountryDetails(feature, countryCode, bucket))
          }
        }}
        onMouseMove={(event) => {
          if (bucket) {
            updateTooltipPosition(event)
          }
        }}
        onMouseLeave={() => setHoveredCountry(null)}
        onClick={(event) => {
          if (suppressClickRef.current) {
            suppressClickRef.current = false
            return
          }

          event.stopPropagation()
          if (!bucket) {
            setSelectedCountry(null)
            return
          }
          const details = createCountryDetails(feature, countryCode, bucket)
          setSelectedCountry((previous) => (previous?.countryCode === details.countryCode ? null : details))
        }}
        style={{
          cursor: bucket ? 'pointer' : 'default',
          transition: 'fill 0.2s ease',
        }}
      />
    )
  }

  return (
    <div className="text-white p-5 sm:p-2.5">
      <div className="bg-surface border-2 border-accent rounded-xl p-4 sm:p-3">
        <div className="flex items-center justify-between gap-4 mb-3 max-md:flex-col max-md:items-start">
          <h2 className="text-accent text-xl font-semibold m-0">Top Spotify Artists World Map</h2>

          <button type="button" className="bg-white text-slate-700 border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-semibold cursor-pointer hover:bg-slate-50" onClick={() => setShowInfoModal(true)}>
            How it works
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-3">
          <label htmlFor="timeRange">Time range:</label>
          <select
            id="timeRange"
            className="border border-accent rounded-lg px-2.5 py-1.5 bg-[#1f1d20] text-white text-sm"
            value={timeRange}
            onChange={(event) => setTimeRange(event.target.value)}
          >
            {TIME_RANGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="border border-accent bg-accent text-black rounded-lg px-3 py-1.5 text-sm font-semibold cursor-pointer disabled:opacity-65 disabled:cursor-not-allowed"
            onClick={loadTopArtists}
            disabled={isLoading || isAuthenticating}
          >
            {isLoading || isAuthenticating ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-black/35 border-t-black animate-spin" aria-hidden="true" />
                Loading
              </span>
            ) : (
              'Load Top Artists'
            )}
          </button>

          {isAuthenticated && (
            <button type="button" className="bg-transparent border border-accent text-accent rounded-lg px-3 py-1.5 text-sm font-semibold cursor-pointer hover:bg-accent/10" onClick={logout}>
              Log out
            </button>
          )}
        </div>

        {!clientId && (
          <p className="m-0 text-white/80 text-sm">
            Missing Spotify config: set VITE_SPOTIFY_CLIENT_ID (and optionally VITE_SPOTIFY_REDIRECT_URI).
          </p>
        )}

        {authError && (
          <p className="m-0 text-white/80 text-sm">
            {/register|quota|access_denied|not authorized/i.test(authError) ? (
              <>
                This app is in development mode — only approved users can sign in. Email{' '}
                <a href="mailto:brendon.c.ward@gmail.com" className="text-accent underline">
                  brendon.c.ward@gmail.com
                </a>{' '}
                to request access (include your Spotify account email).
              </>
            ) : (
              <>
                Sign-in failed: {authError}. Email{' '}
                <a href="mailto:brendon.c.ward@gmail.com" className="text-accent underline">
                  brendon.c.ward@gmail.com
                </a>{' '}
                if this persists.
              </>
            )}
          </p>
        )}
        {error && <p className="m-0 text-white/80 text-sm">Error: {error}</p>}

        <div
          className={`relative w-full max-w-[1100px] mx-auto mt-3 border border-slate-400/60 rounded-lg overflow-hidden bg-white touch-none h-[420px] ${zoomLevel > 1 ? 'cursor-grab' : ''} ${isDragging ? 'cursor-grabbing' : ''}`}
          ref={mapWrapperRef}
          onClick={() => {
            if (suppressClickRef.current) {
              suppressClickRef.current = false
              return
            }
            setSelectedCountry(null)
          }}
          onTouchStart={handlePinchStart}
          onTouchMove={handlePinchMove}
          onTouchEnd={handlePinchEnd}
          onTouchCancel={handlePinchEnd}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onWheel={handleWheelZoom}
        >
          <div className="absolute top-2.5 right-2.5 z-[6] flex gap-1.5 max-md:flex-col max-md:top-auto max-md:bottom-2.5">
            <button type="button" className="border border-slate-500/75 bg-white/90 text-slate-700 rounded-md min-w-8 h-8 text-base font-bold px-2 max-md:min-w-11 max-md:h-11 max-md:text-xl max-md:rounded-lg max-md:p-0 max-md:flex max-md:items-center max-md:justify-center" onClick={zoomIn}>
              +
            </button>
            <button type="button" className="border border-slate-500/75 bg-white/90 text-slate-700 rounded-md min-w-8 h-8 text-base font-bold px-2 max-md:min-w-11 max-md:h-11 max-md:text-xl max-md:rounded-lg max-md:p-0 max-md:flex max-md:items-center max-md:justify-center" onClick={zoomOut}>
              −
            </button>
            <button type="button" className="border border-slate-500/75 bg-white/90 text-slate-700 rounded-md min-w-8 h-8 text-sm font-semibold px-2.5 max-md:min-w-11 max-md:h-11 max-md:text-xs max-md:rounded-lg max-md:p-0 max-md:flex max-md:items-center max-md:justify-center" onClick={resetZoom}>
              Reset
            </button>
          </div>

          <svg
            className="block w-full h-full [touch-action:none]"
            width="100%"
            height={MAP_HEIGHT}
            viewBox={`${getViewBox().x} ${getViewBox().y} ${getViewBox().width} ${getViewBox().height}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ background: '#ffffff', display: 'block' }}
          >
            {geojsonData?.features?.map((feature, index) => renderGeoJSONFeature(feature, index))}
          </svg>

          {hoveredCountry && (
            <div
              className="absolute z-[5] min-w-[220px] max-w-[320px] pointer-events-none border border-orange-400/45 rounded-lg p-3 bg-zinc-950/95 max-md:hidden"
              style={{ left: `${tooltipPosition.x}px`, top: `${tooltipPosition.y}px` }}
            >
              <h4 className="m-0 mb-1.5 text-orange-400">
                {hoveredCountry.countryName} ({hoveredCountry.countryCode}) • {hoveredCountry.count} artist
                {hoveredCountry.count > 1 ? 's' : ''}
              </h4>
              <ul className="m-0 pl-4">
                {hoveredCountry.artists.map((artist) => (
                  <li key={artist.id} className="mb-1">{artist.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <p className="hidden max-md:block text-center text-slate-400 text-xs mt-1.5">Pinch to zoom &bull; Tap a highlighted country to see artists</p>

        {hasData && (
          <div className="mt-3 flex items-center gap-2 text-slate-300 text-sm flex-wrap" aria-label="Country intensity legend">
            <span className="text-slate-300">Few artists</span>
            <div className="inline-flex rounded-full overflow-hidden border border-orange-400/40">
              {MAP_COLOR_SCALE.map((color) => (
                <span key={color} className="w-5 h-3 inline-block" style={{ backgroundColor: color }} />
              ))}
            </div>
            <span className="text-slate-300">Most artists ({maxCountryCount})</span>
          </div>
        )}

        {selectedCountry && (
          <div className="mt-3 border border-orange-400/45 rounded-lg p-3 bg-zinc-950/95">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h4 className="m-0 text-orange-400">
                {selectedCountry.countryName} ({selectedCountry.countryCode}) • {selectedCountry.count} artist
                {selectedCountry.count > 1 ? 's' : ''}
              </h4>
              <button
                type="button"
                className="border-none bg-transparent text-slate-400 hover:text-white text-2xl leading-none p-0 shrink-0 cursor-pointer"
                onClick={() => setSelectedCountry(null)}
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
            <ul className="m-0 pl-4">
              {selectedCountry.artists.map((artist) => (
                <li key={artist.id} className="mb-1">{artist.name}</li>
              ))}
            </ul>
          </div>
        )}

        {!hasData && !isLoading && (
          <p className="m-0 text-white/80 text-sm">
            Authenticate with Spotify to fetch your top artists and map their origin country using MusicBrainz.
          </p>
        )}

        {unmappedArtists.length > 0 && (
          <div className="mt-3 border border-accent/35 rounded-lg p-3">
            <h4 className="m-0 mb-2 text-accent">Artists with unknown origin ({unmappedArtists.length})</h4>
            <p className="m-0 text-white/80">{unmappedArtists.map((artist) => artist.name).join(', ')}</p>
          </div>
        )}

        {showInfoModal && (
          <Modal title="How this map works" onClose={() => setShowInfoModal(false)}>
            <p>
              When you click <strong>Load Top Artists</strong>, the app asks you to sign in with Spotify using
              Spotify&apos;s secure authorization flow.
            </p>
            <p>
              After you approve access, it reads your top artists for the selected time range directly from your
              Spotify account.
            </p>
            <p>
              The app then sends each artist name to MusicBrainz to look up likely origin location metadata.
            </p>
            <p>
              Those matches are converted into country codes, grouped by country, and plotted onto the world map.
            </p>
            <p>
              Stronger map colours mean more of your top artists were matched to that country, and tapping or
              hovering reveals the artist names behind each result.
            </p>
            <p>
              If an artist cannot be matched confidently, they are left off the map and shown separately as an
              unknown origin.
            </p>
          </Modal>
        )}
      </div>
    </div>
  )
}

export default function TopArtistsMap() {
  return (
    <SpotifyAuthProvider>
      <TopArtistsMapContent />
    </SpotifyAuthProvider>
  )
}
