  import React, { useEffect, useState } from 'react'
  import './nbaLadder.css'

  // Replace the placeholder below with your Sportradar API key
  const API_KEY = 'lqNXAWRvTp0TxnSI7PpFF15ALGQrZyQgRZd8DLex'

  // Use the Vite dev-server proxy prefix so requests are same-origin in dev.
  // Requests to `/sportradar/*` are forwarded to https://api.sportradar.com by Vite.
  const API_URL = `/sportradar/nba/trial/v8/en/seasons/2025/REG/standings.json?api_key=${API_KEY}`

  export default function NBALadder() {
    const [conferences, setConferences] = useState([])
    const [selectedConfAlias, setSelectedConfAlias] = useState('EASTERN')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
      async function load() {
        setLoading(true)
        setError(null)
        try {
          const res = await fetch(API_URL)
          if (!res.ok) {
            // Friendly error messages for common auth issues
            if (res.status === 403) {
              setError('Access forbidden (403). Your Sportradar API key may be invalid, expired, or lacks access — check the key or your account.')
            } else if (res.status === 401) {
              setError('Unauthorized (401). The API key appears invalid. Please update it in the component or use an environment-based approach.')
            } else {
              setError(`Network error: ${res.status} ${res.statusText}`)
            }
            setLoading(false)
            return
          }

          const data = await res.json()
          const parsed = parseSportradarStandings(data)
          setConferences(parsed)
          // pick EASTERN if present else first alias
          const hasEastern = parsed.some((c) => c.alias === 'EASTERN')
          setSelectedConfAlias(hasEastern ? 'EASTERN' : (parsed[0] && parsed[0].alias) || '')
        } catch (e) {
          setError('Failed to load standings. ' + (e && e.message ? e.message : 'Unknown error'))
        } finally {
          setLoading(false)
        }
      }
      load()
    }, [])

    function parseSportradarStandings(data) {
      if (!data) return []

      const confs = (data.conferences || []).map((conf) => {
        const teams = (conf.divisions || [])
          .flatMap((div) => (div.teams || []).map((t) => ({
            id: t.id,
            name: t.name || t.display_name || `${t.market ?? ''} ${t.name ?? ''}`.trim(),
            wins: t.wins ?? null,
            losses: t.losses ?? null,
            pct: t.win_pct ?? t.pct ?? null,
          })))
          .sort((a, b) => (b.wins ?? 0) - (a.wins ?? 0))

        return {
          id: conf.id,
          name: conf.name,
          alias: conf.alias,
          teams,
        }
      })

      return confs
    }

    const selectedConference = conferences.find((c) => c.alias === selectedConfAlias) || conferences[0]

    return (
      <div className="nba-ladder card">
        <div className="nba-header">
          <h2>NBA Ladder</h2>
          <div className="conf-tabs">
            {conferences.map((c) => (
              <button
                key={c.id}
                type="button"
                className={"conf-tab" + (c.alias === selectedConfAlias ? ' active' : '')}
                onClick={() => setSelectedConfAlias(c.alias)}
              >
                {c.alias === 'EASTERN' ? 'Eastern' : c.alias === 'WESTERN' ? 'Western' : c.name}
              </button>
            ))}
          </div>
        </div>

        {loading && <div className="nba-loading">Loading standings…</div>}
        {error && <div className="nba-error">Error: {error}</div>}

        {!loading && !error && (!selectedConference || selectedConference.teams.length === 0) && (
          <div className="nba-empty">No teams found.</div>
        )}

        {!loading && selectedConference && selectedConference.teams.length > 0 && (
          <div className="table-wrap">
            <table className="nba-table">
              <thead>
                <tr>
                  <th>Team</th>
                  <th>W</th>
                  <th>L</th>
                  <th>PCT</th>
                </tr>
              </thead>
              <tbody>
                {selectedConference.teams.map((t) => (
                  <tr key={t.id || t.name}>
                    <td className="team-name">{t.name}</td>
                    <td className="team-w">{t.wins ?? '-'}</td>
                    <td className="team-l">{t.losses ?? '-'}</td>
                    <td className="team-pct">{typeof t.pct === 'number' ? (t.pct * 100).toFixed(1) + '%' : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }
