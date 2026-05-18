import React, { useState } from 'react'
import Modal from '../../Shared/Modal'
import getArbitrageBets from './arbitrageCalcutations'

function ArbitrageCard({ bet }) {
  // v4 API returns actual outcome names (team names / 'Draw')
  const outcomeLabels = bet.outcomeNames && bet.outcomeNames.length === bet.outcomeCount
    ? bet.outcomeNames
    : bet.outcomeCount === 3 ? ['Home', 'Away', 'Draw'] : ['Home', 'Away']

  return (
    <div className="border border-green-400/25 rounded-xl p-4">
      <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
        <span className="rounded-full px-2.5 py-0.5 text-xs font-bold bg-green-400/15 text-green-400 border border-green-400/30">
          +${bet.winnings.toFixed(2)} guaranteed
        </span>
        <span className="text-slate-500 text-xs">
          {bet.gameTime.toLocaleString('en-AU', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </span>
      </div>
      <h4 className="m-0 mb-3 text-white text-base">{bet.teams.join(' vs ')}</h4>
      <div className="flex items-center gap-2 mb-3 text-slate-400 text-sm">
        Margin: <strong>{bet.margin.toFixed(2)}%</strong>
        <span className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <span className="block h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full" style={{ width: `${bet.margin}%` }} />
        </span>
      </div>
      <div className="overflow-x-auto"><table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="text-slate-500 font-semibold text-left px-2 py-1.5 border-b border-white/10 text-xs uppercase tracking-wider">Outcome</th>
            <th className="text-slate-500 font-semibold text-left px-2 py-1.5 border-b border-white/10 text-xs uppercase tracking-wider">Best Odds</th>
            <th className="text-slate-500 font-semibold text-left px-2 py-1.5 border-b border-white/10 text-xs uppercase tracking-wider">Site</th>
            <th className="text-slate-500 font-semibold text-left px-2 py-1.5 border-b border-white/10 text-xs uppercase tracking-wider">Bet ($100 stake)</th>
          </tr>
        </thead>
        <tbody>
          {bet.odds.map((odd, i) => (
            <tr key={i}>
              <td className="px-2 py-1.5 border-b border-white/5 text-slate-200 last:border-b-0 sm:px-1.5 sm:py-1.5">{outcomeLabels[i] || `Outcome ${i + 1}`}</td>
              <td className="px-2 py-1.5 border-b border-white/5 text-slate-200 last:border-b-0 sm:px-1.5 sm:py-1.5 text-accent font-bold">{odd}</td>
              <td className="px-2 py-1.5 border-b border-white/5 text-slate-200 last:border-b-0 sm:px-1.5 sm:py-1.5">{bet.sites[i] || '—'}</td>
              <td className="px-2 py-1.5 border-b border-white/5 text-slate-200 last:border-b-0 sm:px-1.5 sm:py-1.5 text-green-400 font-semibold">${bet.bets[i].toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </div>
  )
}

function LayBetCard({ bet }) {
  return (
    <div className="border border-blue-400/25 rounded-xl p-4">
      <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
        <span className="rounded-full px-2.5 py-0.5 text-xs font-bold bg-blue-400/15 text-blue-400 border border-blue-400/30">Lay Opportunity</span>
        <span className="text-slate-500 text-xs">
          {bet.gameTime.toLocaleString('en-AU', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </span>
      </div>
      <h4 className="m-0 mb-3 text-white text-base">{bet.teams.join(' vs ')}</h4>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Bet on</span>
          <span className="text-slate-200 text-base">{bet.betOn}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Betting site</span>
          <span className="text-slate-200 text-base">{bet.bettingSite}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Back odds</span>
          <span className="text-slate-200 text-base text-accent font-bold">{bet.bet}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Lay odds (Betfair)</span>
          <span className="text-slate-200 text-base text-accent font-bold">{bet.lay}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Difference</span>
          <span className="text-slate-200 text-base rounded-full px-2.5 py-0.5 text-xs font-bold bg-yellow-400/15 text-yellow-400 border border-yellow-400/30 inline-block">+{bet.difference.toFixed(3)}</span>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ message }) {
  return <p className="text-slate-500 text-center py-8">{message}</p>
}

export default function Arbitrage() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [helpOpen, setHelpOpen] = useState(false)
  const [madeOpen, setMadeOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('arbitrage')

  async function handleFetch() {
    setLoading(true)
    setError(null)
    setResults(null)
    try {
      const data = await getArbitrageBets()
      setResults(data)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const arbCount = results?.arbitrageBets?.length ?? 0
  const layCount = results?.layBets?.length ?? 0
  const diagnostics = results?.diagnostics

  return (
    <div className="min-h-screen p-5 text-white sm:p-3">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 mb-5">
        <h1 className="text-accent text-2xl font-semibold text-center m-0 sm:text-xl">Arbitrage Betting</h1>
        <div className="flex items-center gap-2">
          <button className="bg-transparent border border-accent/50 text-accent rounded-lg px-3.5 py-1.5 text-sm font-semibold cursor-pointer hover:bg-accent/10 hover:border-accent" onClick={() => setMadeOpen(true)}>Creation</button>
          <button className="bg-transparent border border-accent/50 text-accent rounded-lg px-3.5 py-1.5 text-sm font-semibold cursor-pointer hover:bg-accent/10 hover:border-accent" onClick={() => setHelpOpen(true)}>Help</button>
        </div>
      </div>

      {/* Fetch button */}
      <div className="text-center mb-6">
        <button className="border border-accent bg-accent text-black rounded-lg px-5 py-2.5 text-base font-bold cursor-pointer disabled:opacity-65 disabled:cursor-not-allowed" onClick={handleFetch} disabled={loading}>
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-black/35 border-t-black animate-spin" aria-hidden="true" />
              Scanning odds…
            </span>
          ) : (
            'Get Arbitrage Bets'
          )}
        </button>
        {loading && (
          <p className="mt-3 mx-auto max-w-[480px] text-slate-400 text-sm">
            Checking 50+ sports across multiple bookmakers — this may take 30–60 seconds.
          </p>
        )}
      </div>

      {error && <p className="text-red-400 bg-red-400/10 border border-red-400/35 rounded-lg px-4 py-3 mb-4">{error}</p>}

      {/* Results */}
      {results && (
        <div className="max-w-[900px] mx-auto">
          {diagnostics && (
            <div className="mb-3 text-slate-400 text-sm bg-slate-400/8 border border-slate-400/25 rounded-lg px-3 py-2" role="status" aria-live="polite">
              Scanned {diagnostics.matchesWithBookmakers}/{diagnostics.matchesScanned} matches with bookmaker odds
              across {diagnostics.sportsScanned}/{diagnostics.sportsRequested} sports
              {diagnostics.sportsWithErrors > 0 ? ` (${diagnostics.sportsWithErrors} sports returned API errors)` : ''}
              {diagnostics.rateLimitHits > 0 ? `, ${diagnostics.rateLimitHits} rate-limit retries` : ''}.
            </div>
          )}

          {/* Tab switcher */}
          <div className="flex border-b-2 border-accent/25 mb-5">
            <button
              className={`bg-transparent border-0 border-b-2 border-transparent -mb-0.5 px-5 py-2.5 text-slate-400 text-base font-semibold cursor-pointer flex items-center gap-2 hover:text-accent ${activeTab === 'arbitrage' ? 'text-accent border-b-accent' : ''}`}
              onClick={() => setActiveTab('arbitrage')}
            >
              Arbitrage Bets
              <span className="bg-accent/15 text-accent rounded-full px-2 py-0.5 text-xs font-bold">{arbCount}</span>
            </button>
            <button
              className={`bg-transparent border-0 border-b-2 border-transparent -mb-0.5 px-5 py-2.5 text-slate-400 text-base font-semibold cursor-pointer flex items-center gap-2 hover:text-accent ${activeTab === 'lay' ? 'text-accent border-b-accent' : ''}`}
              onClick={() => setActiveTab('lay')}
            >
              Lay Bets
              <span className="bg-accent/15 text-accent rounded-full px-2 py-0.5 text-xs font-bold">{layCount}</span>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {activeTab === 'arbitrage' && (
              <>
                {arbCount === 0 ? (
                  <EmptyState message="No arbitrage opportunities found right now. Try again later." />
                ) : (
                  results.arbitrageBets.map((bet, i) => <ArbitrageCard key={i} bet={bet} />)
                )}
              </>
            )}
            {activeTab === 'lay' && (
              <>
                {layCount === 0 ? (
                  <EmptyState message="No lay bet opportunities found right now." />
                ) : (
                  results.layBets.map((bet, i) => <LayBetCard key={i} bet={bet} />)
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Help Modal */}
      {helpOpen && (
        <Modal title="How it works" onClose={() => setHelpOpen(false)}>
          <p>
            This tool finds betting odds where you can make a profit through <strong>arbitrage</strong> and{' '}
            <strong>lay betting</strong>. It uses{' '}
            <a href="https://the-odds-api.com/" target="_blank" rel="noreferrer">the-odds-api.com</a> to retrieve
            live odds from multiple bookmakers.
          </p>
          <p>
            <strong>Arbitrage betting</strong> means placing bets on all outcomes of an event across different
            bookmakers such that the combined implied probability is under 100% — guaranteeing a profit regardless
            of the result.
          </p>
          <p>
            Example: Chelsea vs Liverpool. Chelsea win pays $4 (TAB), Liverpool win pays $1.90 (Ladbrokes),
            Draw pays $5 (SportsBet). Total implied probability = 25% + 52.6% + 20% = 97.6%.
            Betting $25.60, $53.90 and $20.50 on each outcome guarantees a profit no matter who wins.
          </p>
          <p>
            Useful tools:{' '}
            <a href="https://www.aussportsbetting.com/tools/online-calculators/arbitrage-calculator/" target="_blank" rel="noreferrer">
              Arbitrage calculator
            </a>
          </p>
          <p>
            <strong>Lay betting</strong> means betting on an outcome NOT happening via Betfair. If the lay odds on
            Betfair are lower than the back odds on another bookmaker, you can hedge for a guaranteed profit.
            Note that Betfair takes a commission (typically 2–10%).
          </p>
          <p>
            Lay calculator:{' '}
            <a href="https://www.oddsmonkey.com/Tools/Calculator.aspx" target="_blank" rel="noreferrer">
              OddsMonkey
            </a>
          </p>
        </Modal>
      )}

      {/* Creation Modal */}
      {madeOpen && (
        <Modal title="How this was made" onClose={() => setMadeOpen(false)}>
          <p>
            During COVID-19 lockdowns I stumbled across{' '}
            <a href="https://www.youtube.com/watch?v=TGinzvSDayU&ab_channel=NewMoney" target="_blank" rel="noreferrer">
              this YouTube video
            </a>{' '}
            explaining arbitrage betting and realised I could automate the tedious process of scanning multiple
            bookmakers by hand.
          </p>
          <p>
            I wrote a Python script using{' '}
            <a href="https://the-odds-api.com/" target="_blank" rel="noreferrer">The Odds API</a> which covers
            10+ bookmakers across 50+ sports. When I built this portfolio I converted it to JavaScript so it runs
            entirely in the browser — no backend needed.
          </p>
          <p>
            Because the API only allows 50 requests per month per key, I implemented automatic key rotation across
            multiple free-tier accounts so you can actually use it without hitting limits immediately.
          </p>
          <p>
            Note: arbitrage betting is legal but frowned upon by bookmakers. If they suspect guaranteed profits,
            they may limit or ban your account. Keep bet amounts modest (close to round dollar values).
          </p>
        </Modal>
      )}
    </div>
  )
}
