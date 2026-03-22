import React, { useState } from 'react'
import './arbitrage.css'
import getArbitrageBets from './arbitrageCalcutations'

function InfoModal({ title, children, onClose }) {
  return (
    <div className="arb-modal-backdrop" onClick={onClose}>
      <div className="arb-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="arb-modal-header">
          <h3>{title}</h3>
          <button className="arb-modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="arb-modal-body">{children}</div>
      </div>
    </div>
  )
}

function ArbitrageCard({ bet }) {
  // v4 API returns actual outcome names (team names / 'Draw')
  const outcomeLabels = bet.outcomeNames && bet.outcomeNames.length === bet.outcomeCount
    ? bet.outcomeNames
    : bet.outcomeCount === 3 ? ['Home', 'Away', 'Draw'] : ['Home', 'Away']

  return (
    <div className="arb-card arb-card--arb">
      <div className="arb-card-header">
        <span className="arb-badge arb-badge--profit">
          +${bet.winnings.toFixed(2)} guaranteed
        </span>
        <span className="arb-card-time">
          {bet.gameTime.toLocaleString('en-AU', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </span>
      </div>
      <h4 className="arb-card-title">{bet.teams.join(' vs ')}</h4>
      <div className="arb-card-margin">
        Margin: <strong>{bet.margin.toFixed(2)}%</strong>
        <span className="arb-margin-bar">
          <span className="arb-margin-fill" style={{ width: `${bet.margin}%` }} />
        </span>
      </div>
      <table className="arb-table">
        <thead>
          <tr>
            <th>Outcome</th>
            <th>Best Odds</th>
            <th>Site</th>
            <th>Bet ($100 stake)</th>
          </tr>
        </thead>
        <tbody>
          {bet.odds.map((odd, i) => (
            <tr key={i}>
              <td>{outcomeLabels[i] || `Outcome ${i + 1}`}</td>
              <td className="arb-odds">{odd}</td>
              <td>{bet.sites[i] || '—'}</td>
              <td className="arb-bet">${bet.bets[i].toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function LayBetCard({ bet }) {
  return (
    <div className="arb-card arb-card--lay">
      <div className="arb-card-header">
        <span className="arb-badge arb-badge--lay">Lay Opportunity</span>
        <span className="arb-card-time">
          {bet.gameTime.toLocaleString('en-AU', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </span>
      </div>
      <h4 className="arb-card-title">{bet.teams.join(' vs ')}</h4>
      <div className="arb-lay-grid">
        <div className="arb-lay-row">
          <span className="arb-lay-label">Bet on</span>
          <span className="arb-lay-value">{bet.betOn}</span>
        </div>
        <div className="arb-lay-row">
          <span className="arb-lay-label">Betting site</span>
          <span className="arb-lay-value">{bet.bettingSite}</span>
        </div>
        <div className="arb-lay-row">
          <span className="arb-lay-label">Back odds</span>
          <span className="arb-lay-value arb-odds">{bet.bet}</span>
        </div>
        <div className="arb-lay-row">
          <span className="arb-lay-label">Lay odds (Betfair)</span>
          <span className="arb-lay-value arb-odds">{bet.lay}</span>
        </div>
        <div className="arb-lay-row">
          <span className="arb-lay-label">Difference</span>
          <span className="arb-lay-value arb-badge arb-badge--diff">+{bet.difference.toFixed(3)}</span>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ message }) {
  return <p className="arb-empty">{message}</p>
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

  return (
    <div className="arb-page">
      {/* Header */}
      <div className="arb-header">
        <div className="arb-header-actions arb-header-actions--left">
          <button className="arb-link-button" onClick={() => setMadeOpen(true)}>Creation</button>
        </div>
        <h1 className="arb-title">Arbitrage Betting</h1>
        <div className="arb-header-actions arb-header-actions--right">
          <button className="arb-link-button" onClick={() => setHelpOpen(true)}>Help</button>
        </div>
      </div>

      {/* Fetch button */}
      <div className="arb-controls">
        <button className="arb-fetch-button" onClick={handleFetch} disabled={loading}>
          {loading ? (
            <span className="arb-loading-state">
              <span className="arb-spinner" aria-hidden="true" />
              Scanning odds…
            </span>
          ) : (
            'Get Arbitrage Bets'
          )}
        </button>
        {loading && (
          <p className="arb-loading-hint">
            Checking 50+ sports across multiple bookmakers — this may take 30–60 seconds.
          </p>
        )}
      </div>

      {error && <p className="arb-error">{error}</p>}

      {/* Results */}
      {results && (
        <div className="arb-results">
          {/* Tab switcher */}
          <div className="arb-tabs">
            <button
              className={`arb-tab ${activeTab === 'arbitrage' ? 'arb-tab--active' : ''}`}
              onClick={() => setActiveTab('arbitrage')}
            >
              Arbitrage Bets
              <span className="arb-tab-count">{arbCount}</span>
            </button>
            <button
              className={`arb-tab ${activeTab === 'lay' ? 'arb-tab--active' : ''}`}
              onClick={() => setActiveTab('lay')}
            >
              Lay Bets
              <span className="arb-tab-count">{layCount}</span>
            </button>
          </div>

          <div className="arb-tab-content">
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
        <InfoModal title="How it works" onClose={() => setHelpOpen(false)}>
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
        </InfoModal>
      )}

      {/* Creation Modal */}
      {madeOpen && (
        <InfoModal title="How this was made" onClose={() => setMadeOpen(false)}>
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
        </InfoModal>
      )}
    </div>
  )
}