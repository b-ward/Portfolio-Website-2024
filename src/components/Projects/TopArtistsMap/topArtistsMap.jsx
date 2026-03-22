import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import { SpotifyAuthProvider, useSpotifyAuth } from './auth/SpotifyAuthProvider'
import { aggregateArtistsByCountry, resolveArtistsWithCountry } from './services/musicBrainzService'
import './topArtistsMap.css'

const GEO_URL = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson'
const TIME_RANGE_OPTIONS = [
  { label: 'Past 4 weeks', value: 'short_term' },
  { label: 'Past 6 months', value: 'medium_term' },
  { label: 'Several years', value: 'long_term' },
]

const MAP_COLOR_SCALE = ['#fde68a', '#fbbf24', '#f59e0b', '#f97316', '#ef4444', '#b91c1c']
const NO_DATA_FILL = '#d1d5db'
const HOVER_FILL = '#fb7185'

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
  const [mapPosition, setMapPosition] = useState({ coordinates: [0, 0], zoom: 1 })
  const [unmappedArtists, setUnmappedArtists] = useState([])

  const mapWrapperRef = useRef(null)
  const tooltipRef = useRef(null)

  useEffect(() => {
    refreshAuthState()
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

  function updateTooltipPosition(event) {
    const wrapper = mapWrapperRef.current
    if (!wrapper || !event) {
      return
    }

    const bounds = wrapper.getBoundingClientRect()
    const tooltipWidth = tooltipRef.current?.offsetWidth || 320
    const tooltipHeight = tooltipRef.current?.offsetHeight || 180
    const margin = 8

    let x = event.clientX - bounds.left + 12
    let y = event.clientY - bounds.top + 12

    if (x + tooltipWidth > bounds.width - margin) {
      x = bounds.width - tooltipWidth - margin
    }

    if (y + tooltipHeight > bounds.height - margin) {
      y = bounds.height - tooltipHeight - margin
    }

    x = Math.max(margin, x)
    y = Math.max(margin, y)

    setTooltipPosition({ x, y })
  }

  function createCountryDetails(geo, countryCode, bucket) {
    return {
      countryCode,
      countryName: getCountryName(geo),
      count: bucket.count,
      artists: bucket.artists,
    }
  }

  function updateMapZoom(nextZoom) {
    const clampedZoom = Math.max(1, Math.min(8, nextZoom))
    setMapPosition((previous) => ({
      ...previous,
      zoom: clampedZoom,
    }))
  }

  return (
    <div className="top-artists-map">
      <div className="top-artists-card">
        <div className="top-artists-header">
          <h2 className="top-artists-heading">Top Spotify Artists World Map</h2>

          <button type="button" className="top-artists-button info" onClick={() => setShowInfoModal(true)}>
            How it works
          </button>
        </div>

        <div className="top-artists-controls">
          <label htmlFor="timeRange">Time range:</label>
          <select
            id="timeRange"
            className="top-artists-select"
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
            className="top-artists-button"
            onClick={loadTopArtists}
            disabled={isLoading || isAuthenticating}
          >
            {isLoading || isAuthenticating ? (
              <span className="loading-state">
                <span className="loading-spinner" aria-hidden="true" />
                Loading
              </span>
            ) : (
              'Load Top Artists'
            )}
          </button>

          {isAuthenticated && (
            <button type="button" className="top-artists-button secondary" onClick={logout}>
              Log out
            </button>
          )}
        </div>

        {!clientId && (
          <p className="top-artists-hint">
            Missing Spotify config: set VITE_SPOTIFY_CLIENT_ID (and optionally VITE_SPOTIFY_REDIRECT_URI).
          </p>
        )}

        {authError && (
          <p className="top-artists-hint">
            {/register|quota|access_denied|not authorized/i.test(authError) ? (
              <>
                This app is in development mode — only approved users can sign in. Email{' '}
                <a href="mailto:brendon.c.ward@gmail.com" className="top-artists-hint-link">
                  brendon.c.ward@gmail.com
                </a>{' '}
                to request access (include your Spotify account email).
              </>
            ) : (
              <>
                Sign-in failed: {authError}. Email{' '}
                <a href="mailto:brendon.c.ward@gmail.com" className="top-artists-hint-link">
                  brendon.c.ward@gmail.com
                </a>{' '}
                if this persists.
              </>
            )}
          </p>
        )}
        {error && <p className="top-artists-hint">Error: {error}</p>}

        <div
          className="map-wrapper"
          ref={mapWrapperRef}
          onClick={() => {
            setSelectedCountry(null)
            setHoveredCountry(null)
          }}
        >
          <div className="map-zoom-controls">
            <button type="button" className="map-zoom-button" onClick={() => updateMapZoom(mapPosition.zoom + 0.5)}>
              +
            </button>
            <button type="button" className="map-zoom-button" onClick={() => updateMapZoom(mapPosition.zoom - 0.5)}>
              −
            </button>
            <button
              type="button"
              className="map-zoom-button reset"
              onClick={() => setMapPosition({ coordinates: [0, 0], zoom: 1 })}
            >
              Reset
            </button>
          </div>

          <ComposableMap className="top-artists-svg" width={980} height={420} projectionConfig={{ scale: 145 }}>
            <ZoomableGroup
              zoom={mapPosition.zoom}
              center={mapPosition.coordinates}
              minZoom={1}
              maxZoom={8}
              onMoveEnd={(position) => setMapPosition(position)}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const countryCode = getCountryIsoCode(geo)
                    const bucket = countryCode ? countryBuckets[countryCode] : null
                    const count = bucket?.count || 0
                    const fillColor = getFillColor(count, maxCountryCount)

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={(event) => {
                          if (!bucket) {
                            setHoveredCountry(null)
                            return
                          }

                          updateTooltipPosition(event)
                          setHoveredCountry(createCountryDetails(geo, countryCode, bucket))
                        }}
                        onMouseMove={(event) => {
                          if (bucket) {
                            updateTooltipPosition(event)
                          }
                        }}
                        onMouseLeave={() => setHoveredCountry(null)}
                        onClick={(event) => {
                          event.preventDefault()
                          event.stopPropagation()
                          setHoveredCountry(null)

                          if (!bucket) {
                            setSelectedCountry(null)
                            return
                          }

                          updateTooltipPosition(event)
                          const details = createCountryDetails(geo, countryCode, bucket)

                          setSelectedCountry((previous) => {
                            if (previous?.countryCode === details.countryCode) {
                              return null
                            }

                            return details
                          })
                        }}
                        style={{
                          default: {
                            fill: fillColor,
                            stroke: bucket ? '#6b7280' : '#9ca3af',
                            strokeWidth: bucket ? 0.8 : 0.4,
                            outline: 'none',
                          },
                          hover: {
                            fill: HOVER_FILL,
                            stroke: '#475569',
                            strokeWidth: 1.0,
                            outline: 'none',
                          },
                          pressed: {
                            fill: HOVER_FILL,
                            stroke: '#475569',
                            strokeWidth: 1.0,
                            outline: 'none',
                          },
                        }}
                      />
                    )
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          {hoveredCountry && (
            <div
              ref={tooltipRef}
              className="country-tooltip floating"
              style={{ left: `${tooltipPosition.x}px`, top: `${tooltipPosition.y}px` }}
            >
              <h4>
                {hoveredCountry.countryName} ({hoveredCountry.countryCode}) • {hoveredCountry.count} artist
                {hoveredCountry.count > 1 ? 's' : ''}
              </h4>
              <ul>
                {hoveredCountry.artists.map((artist) => (
                  <li key={artist.id}>{artist.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <p className="map-mobile-hint">Pinch to zoom &bull; Tap a highlighted country to see artists</p>

        {hasData && (
          <div className="map-legend" aria-label="Country intensity legend">
            <span className="map-legend-label">Few artists</span>
            <div className="map-legend-scale">
              {MAP_COLOR_SCALE.map((color) => (
                <span key={color} className="map-legend-swatch" style={{ backgroundColor: color }} />
              ))}
            </div>
            <span className="map-legend-label">Most artists ({maxCountryCount})</span>
          </div>
        )}

        {selectedCountry && (
          <div className="country-tooltip tapped">
            <div className="country-tooltip-tapped-header">
              <h4>
                {selectedCountry.countryName} ({selectedCountry.countryCode}) • {selectedCountry.count} artist
                {selectedCountry.count > 1 ? 's' : ''}
              </h4>
              <button
                type="button"
                className="country-tooltip-close"
                onClick={() => setSelectedCountry(null)}
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
            <ul>
              {selectedCountry.artists.map((artist) => (
                <li key={artist.id}>{artist.name}</li>
              ))}
            </ul>
          </div>
        )}

        {!hasData && !isLoading && (
          <p className="top-artists-hint">
            Authenticate with Spotify to fetch your top artists and map their origin country using MusicBrainz.
          </p>
        )}

        {unmappedArtists.length > 0 && (
          <div className="unmapped-list">
            <h4>Artists with unknown origin ({unmappedArtists.length})</h4>
            <p>{unmappedArtists.map((artist) => artist.name).join(', ')}</p>
          </div>
        )}

        {showInfoModal && (
          <div className="info-modal-backdrop" onClick={() => setShowInfoModal(false)}>
            <div
              className="info-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="top-artists-info-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="info-modal-header">
                <h3 id="top-artists-info-title">How this map works</h3>
                <button type="button" className="info-modal-close" onClick={() => setShowInfoModal(false)}>
                  ×
                </button>
              </div>
              <div className="info-modal-body">
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
              </div>
            </div>
          </div>
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
