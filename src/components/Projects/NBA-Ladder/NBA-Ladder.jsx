import React, { useEffect, useState } from 'react'

// In production we proxy the Sportradar request via a Netlify Function so the
// API key is kept server-side. Locally `netlify dev` will run the function too.
const API_URL = '/.netlify/functions/standings'

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

  const selectedConference = conferences.find((c) => c.alias === selectedConfAlias) ?? null

  return (
    <div className="bg-surface rounded-xl border border-white/10 p-4 m-4 max-w-[860px] mx-auto">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="text-accent text-xl font-semibold m-0">NBA Ladder</h2>
        <div className="flex gap-2">
          {conferences.map((c) => (
            <button
              key={c.id}
              type="button"
              className={c.alias === selectedConfAlias
                ? 'bg-white/10 border-transparent text-white px-3 py-1.5 rounded-md cursor-pointer'
                : 'bg-transparent border border-white/10 px-3 py-1.5 rounded-md cursor-pointer text-slate-300 hover:text-white'}
              onClick={() => setSelectedConfAlias(c.alias)}
            >
              {c.alias === 'EASTERN' ? 'Eastern' : c.alias === 'WESTERN' ? 'Western' : c.name}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="py-8 text-slate-400 text-center">Loading standings…</div>}
      {error && <div className="py-8 text-slate-400 text-center">Error: {error}</div>}

      {!loading && !error && (!selectedConference || selectedConference.teams.length === 0) && (
        <div className="py-8 text-slate-400 text-center">No teams found.</div>
      )}

      {!loading && selectedConference && selectedConference.teams.length > 0 && (
        <div className="overflow-x-auto rounded-lg mt-2">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="py-2 px-2 text-left text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-white/10">Team</th>
                <th className="py-2 px-2 text-left text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-white/10">W</th>
                <th className="py-2 px-2 text-left text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-white/10">L</th>
                <th className="py-2 px-2 text-left text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-white/10">PCT</th>
              </tr>
            </thead>
            <tbody>
              {selectedConference.teams.map((t) => (
                <tr key={t.id || t.name} className="even:bg-white/5">
                  <td className="py-2.5 px-2 text-white overflow-hidden text-ellipsis">{t.name}</td>
                  <td className="py-2.5 px-2 text-right text-white w-20 pr-4">{t.wins ?? '-'}</td>
                  <td className="py-2.5 px-2 text-right text-white w-20 pr-4">{t.losses ?? '-'}</td>
                  <td className="py-2.5 px-2 text-right text-white w-20 pr-4">{typeof t.pct === 'number' ? (t.pct * 100).toFixed(1) + '%' : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
