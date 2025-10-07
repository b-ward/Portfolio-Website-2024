import React, { useEffect, useMemo, useState } from "react";

// ==========================
// THEME
// ==========================
const COLORS = {
  primary: "#fcc001", // accent
  surface: "#ffffff", // cards / panels / table background (white)
  ink: "#000000", // black text
  backdrop: "#333134", // page background
};

// ==========================
// CONSTANTS / DATA
// ==========================
const SUITS = [
  { key: "S", label: "Spades", icon: "♠" },
  { key: "C", label: "Clubs", icon: "♣" },
  { key: "D", label: "Diamonds", icon: "♦" },
  { key: "H", label: "Hearts", icon: "♥" },
  { key: "NT", label: "No Trumps", icon: "NT" },
];

const SCORE_TABLE = {
  6: { S: 40, C: 60, D: 80, H: 100, NT: 120 },
  7: { S: 140, C: 160, D: 180, H: 200, NT: 220 },
  8: { S: 240, C: 260, D: 280, H: 300, NT: 320 },
  9: { S: 340, C: 360, D: 380, H: 400, NT: 420 },
  10: { S: 440, C: 460, D: 480, H: 500, NT: 520 },
  MISERE: 250,
  OPEN_MISERE: 500,
};

const STORAGE_KEY = "fivehundred-scorer-v1";

// ==========================
// UTIL / STATE HOOKS
// ==========================
function usePersistentState(defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  return [state, setState];
}

function describeBid(model) {
  if (model.special === "MISERE") return "Misère";
  if (model.special === "OPEN_MISERE") return "Open Misère";
  const suit = SUITS.find((s) => s.key === model.suit)?.label ?? "";
  return `${model.level} ${suit}`;
}

function addDelta(teams, index, delta) {
  return teams.map((t, i) => (i === index ? { ...t, score: t.score + delta } : t));
}

// ==========================
// MAIN COMPONENT
// ==========================
export default function FiveHundredScorer() {
  const [model, setModel] = usePersistentState({
    teams: [
      { name: "Team A", score: 0 },
      { name: "Team B", score: 0 },
    ],
    biddingTeam: 0,
    level: 7,
    suit: "H",
    special: "none",
    history: [],
    showTable: false,
  });

  const currentBidValue = useMemo(() => {
    if (model.special === "MISERE") return SCORE_TABLE.MISERE;
    if (model.special === "OPEN_MISERE") return SCORE_TABLE.OPEN_MISERE;
    return SCORE_TABLE[model.level]?.[model.suit] ?? 0;
  }, [model.level, model.suit, model.special]);

  function record(teamIndex, delta, reason) {
    setModel((m) => ({
      ...m,
      teams: addDelta(m.teams, teamIndex, delta),
      history: [
        { teamIndex, delta, reason, timestamp: Date.now() },
        ...m.history,
      ].slice(0, 50),
    }));
  }

  function applyRound(made) {
    const delta = made ? currentBidValue : -currentBidValue;
    const reason = `${made ? "Made" : "Set"} ${describeBid(model)}`;
    record(model.biddingTeam, delta, reason);
  }

  function undo() {
    setModel((m) => {
      const [last, ...rest] = m.history;
      if (!last) return m;
      return {
        ...m,
        history: rest,
        teams: addDelta(m.teams, last.teamIndex, -last.delta),
      };
    });
  }

  function resetScores() {
    if (!window.confirm("Reset all scores to 0 and clear history?")) return;
    setModel((m) => ({
      ...m,
      teams: m.teams.map((t) => ({ ...t, score: 0 })),
      history: [],
    }));
  }

  const renameTeam = (i, name) => setModel((m) => ({ ...m, teams: m.teams.map((t, idx) => (idx === i ? { ...t, name } : t)) }));
  const manualAdjust = (i, amt) => record(i, amt, `Manual +${amt}`);

  return (
    <div style={styles.app}>
      <Header />

      {/* Scores */}
      <div style={styles.scoresRow}>
        {model.teams.map((t, i) => (
          <TeamCard
            key={i}
            team={t}
            active={model.biddingTeam === i}
            onNameChange={(name) => renameTeam(i, name)}
            onAdjust={(amt) => manualAdjust(i, amt)}
            onSelectBidder={() => setModel((m) => ({ ...m, biddingTeam: i }))}
          />
        ))}
      </div>

      {/* Bid selector */}
      <section style={styles.panel}>
        <div style={styles.panelHead}>
          <h2 style={styles.panelTitle}>Current Contract</h2>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={styles.linkBtn} onClick={() => setModel((m) => ({ ...m, showTable: true }))}>
              View Scoring Table
            </button>
            <button style={styles.linkBtn} onClick={undo} disabled={!model.history.length}>
              Undo
            </button>
            <button style={styles.linkBtn} onClick={resetScores}>Reset</button>
          </div>
        </div>

        <div style={styles.grid3}>
          <div>
            <label style={styles.label}>Bidding Team</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {model.teams.map((t, i) => (
                <button
                  key={i}
                  style={{
                    ...styles.pill,
                    ...(model.biddingTeam === i ? styles.pillActive : {}),
                  }}
                  onClick={() => setModel((m) => ({ ...m, biddingTeam: i }))}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={styles.label}>Contract Type</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { key: "none", label: "Standard" },
                { key: "MISERE", label: "Misère" },
                { key: "OPEN_MISERE", label: "Open Misère" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  style={{
                    ...styles.pill,
                    ...(model.special === opt.key ? styles.pillActive : {}),
                  }}
                  onClick={() => setModel((m) => ({ ...m, special: opt.key }))}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={styles.label}>Value</label>
            <div style={{ fontWeight: 800 }}>{currentBidValue}</div>
          </div>
        </div>

        {model.special === "none" && (
          <div style={{ ...styles.grid3, marginTop: 16 }}>
            <div>
              <label style={styles.label}>Level</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[6, 7, 8, 9, 10].map((lvl) => (
                  <button
                    key={lvl}
                    style={{ ...styles.pill, ...(model.level === lvl ? styles.pillActive : {}) }}
                    onClick={() => setModel((m) => ({ ...m, level: lvl }))}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={styles.label}>Suit</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {SUITS.map((s) => (
                  <button
                    key={s.key}
                    style={{ ...styles.pill, ...(model.suit === s.key ? styles.pillActive : {}) }}
                    onClick={() => setModel((m) => ({ ...m, suit: s.key }))}
                  >
                    <span style={{ marginRight: 6 }}>{s.icon}</span>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div />
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <button style={{ ...styles.cta, ...styles.ctaPrimary }} onClick={() => applyRound(true)}>
            ✓ Made Contract (+{currentBidValue})
          </button>
          <button style={{ ...styles.cta, ...styles.ctaOutline }} onClick={() => applyRound(false)}>
            ✗ Set Contract (−{currentBidValue})
          </button>
        </div>
      </section>

      {/* History */}
      <section style={{ ...styles.panel, marginBottom: 64 }}>
        <div style={styles.panelHead}>
          <h2 style={styles.panelTitle}>History</h2>
        </div>
        {model.history.length === 0 ? (
          <div style={{ color: "#666" }}>No rounds yet. Record a result above.</div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {model.history.map((h, idx) => (
              <li key={idx} style={styles.historyItem}>
                <span style={{ fontWeight: 600 }}>{model.teams[h.teamIndex]?.name}</span>
                <span style={{ flex: 1, color: "#666" }}>{h.reason}</span>
                <span style={{ fontWeight: 800, color: h.delta >= 0 ? COLORS.ink : "#c2410c" }}>
                  {h.delta >= 0 ? `+${h.delta}` : h.delta}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {model.showTable && (
        <Modal onClose={() => setModel((m) => ({ ...m, showTable: false }))} title="500 Scoring Table">
          <ScoringTable />
        </Modal>
      )}

      <StyleTag />
    </div>
  );
}

function Header() {
  return (
    <header style={styles.header}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <div style={styles.logoDot} />
        <h1 style={styles.title}>500 Scorekeeper</h1>
      </div>
    </header>
  );
}

function TeamCard({ team, onNameChange, onAdjust, onSelectBidder, active }) {
  return (
    <div style={styles.teamCard}>
      <div style={styles.teamHeader}>
        <input value={team.name} onChange={(e) => onNameChange(e.target.value)} style={styles.teamNameInput} />
        <button onClick={onSelectBidder} style={{ ...styles.badge, ...(active ? styles.badgeActive : {}) }}>
          {active ? "Bidding" : "Set Bidder"}
        </button>
      </div>
      <div style={styles.scoreNumber}>{team.score}</div>
      <div style={styles.adjustRow}>
        {[10, 20, 30, 40, 50].map((amt) => (
          <button key={amt} style={styles.adjustBtn} onClick={() => onAdjust(amt)}>
            +{amt}
          </button>
        ))}
      </div>
    </div>
  );
}

function ScoringTable() {
  return (
    <div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Tricks</th>
            <th style={styles.th}>♠</th>
            <th style={styles.th}>♣</th>
            <th style={styles.th}>♦</th>
            <th style={styles.th}>♥</th>
            <th style={styles.th}>No Trumps</th>
          </tr>
        </thead>
        <tbody>
          {[6, 7, 8, 9, 10].map((lvl) => (
            <tr key={lvl}>
              <td style={styles.td}>{lvl} Tricks</td>
              <td style={styles.td}>{SCORE_TABLE[lvl].S}</td>
              <td style={styles.td}>{SCORE_TABLE[lvl].C}</td>
              <td style={styles.td}>{SCORE_TABLE[lvl].D}</td>
              <td style={styles.td}>{SCORE_TABLE[lvl].H}</td>
              <td style={styles.td}>{SCORE_TABLE[lvl].NT}</td>
            </tr>
          ))}
          <tr>
            <td style={styles.td}><em>Misère</em></td>
            <td style={styles.td} colSpan={5}>{SCORE_TABLE.MISERE}</td>
          </tr>
          <tr>
            <td style={styles.td}><em>Open Misère</em></td>
            <td style={styles.td} colSpan={5}>{SCORE_TABLE.OPEN_MISERE}</td>
          </tr>
        </tbody>
      </table>
      <p style={{ color: "#666", marginTop: 12 }}>
        Tip: Select a contract on the main screen, then click <strong>Made</strong> or <strong>Set</strong> to add or subtract that value for the bidding team.
      </p>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div style={styles.modalBackdrop} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h3 style={{ margin: 0, color: COLORS.ink }}>{title}</h3>
          <button style={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

function StyleTag() {
  // Global resets to keep content black on white; dark outer background handled by app.container
  return (
    <style>{`
      :root { color-scheme: light only; }
      * { box-sizing: border-box; }
      body { margin: 0; background: ${COLORS.backdrop}; color: ${COLORS.ink}; font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; }
      button:disabled { opacity: .6; cursor: not-allowed; }
    `}</style>
  );
}

// ==========================
// STYLES
// ==========================
const styles = {
  app: {
    minHeight: "100vh",
    background: COLORS.backdrop,
    color: COLORS.ink,
    padding: 20,
    maxWidth: 1100,
    margin: "0 auto",
  },
  header: {
    marginBottom: 24,
    borderBottom: `3px solid ${COLORS.primary}`,
    paddingBottom: 12,
    background: COLORS.surface,
    color: COLORS.ink,
    borderRadius: 12,
    padding: 12,
  },
  logoDot: {
    width: 14,
    height: 14,
    borderRadius: 14,
    background: COLORS.primary,
  },
  title: {
    margin: 0,
    fontWeight: 800,
    letterSpacing: 0.5,
  },
  scoresRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginBottom: 20,
  },
  teamCard: {
    border: `2px solid ${COLORS.primary}`,
    borderRadius: 16,
    padding: 16,
    background: COLORS.surface,
    color: COLORS.ink,
  },
  teamHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 },
  teamNameInput: {
    fontSize: 18,
    fontWeight: 700,
    border: `2px solid ${COLORS.primary}`,
    padding: "6px 10px",
    borderRadius: 10,
    color: COLORS.ink,
    background: COLORS.surface,
    outline: "none",
  },
  scoreNumber: { fontSize: 64, fontWeight: 900, lineHeight: 1, marginTop: 8 },
  adjustRow: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, marginTop: 12 },
  adjustBtn: {
    padding: "8px 6px",
    background: COLORS.surface,
    border: `2px solid ${COLORS.primary}`,
    borderRadius: 10,
    cursor: "pointer",
  },
  badge: {
    border: `2px solid ${COLORS.primary}`,
    padding: "4px 10px",
    borderRadius: 999,
    background: COLORS.surface,
    color: COLORS.ink,
    cursor: "pointer",
    fontWeight: 700,
  },
  badgeActive: {
    boxShadow: `0 0 0 3px ${COLORS.primary}55 inset`,
  },
  panel: {
    border: `2px solid ${COLORS.primary}`,
    borderRadius: 16,
    padding: 16,
    background: COLORS.surface,
    color: COLORS.ink,
    marginBottom: 16,
  },
  panelHead: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 },
  panelTitle: { margin: 0 },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
    alignItems: "center",
  },
  label: { fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.6 },
  pill: {
    padding: "8px 12px",
    borderRadius: 999,
    border: `2px solid ${COLORS.primary}`,
    background: COLORS.surface,
    color: COLORS.ink,
    cursor: "pointer",
    fontWeight: 700,
  },
  pillActive: {
    boxShadow: `0 0 0 3px ${COLORS.primary}55 inset`,
  },
  cta: {
    padding: "12px 16px",
    borderRadius: 12,
    fontWeight: 800,
    cursor: "pointer",
    background: COLORS.surface,
    color: COLORS.ink,
  },
  ctaPrimary: {
    border: `2px solid ${COLORS.primary}`,
  },
  ctaOutline: {
    border: `2px dashed ${COLORS.primary}`,
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    border: `2px solid ${COLORS.primary}`,
    borderRadius: 12,
    overflow: "hidden",
  },
  th: {
    textAlign: "left",
    padding: 10,
    background: COLORS.surface,
    color: COLORS.ink,
    borderBottom: `2px solid ${COLORS.primary}`,
  },
  td: {
    padding: 10,
    borderTop: `1px solid ${COLORS.primary}55`,
  },
  historyItem: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr auto",
    alignItems: "center",
    padding: "10px 6px",
    borderBottom: `1px solid ${COLORS.primary}55`,
  },
  linkBtn: {
    background: COLORS.surface,
    border: `2px solid ${COLORS.primary}`,
    color: COLORS.ink,
    padding: "6px 12px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modal: {
    width: "min(720px, 100%)",
    background: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 20px 60px rgba(0,0,0,.25)",
    border: `2px solid ${COLORS.primary}`,
    color: COLORS.ink,
  },
  closeBtn: {
    border: `2px solid ${COLORS.primary}`,
    background: COLORS.surface,
    color: COLORS.ink,
    borderRadius: 999,
    width: 36,
    height: 36,
    cursor: "pointer",
    fontSize: 18,
  },
};
