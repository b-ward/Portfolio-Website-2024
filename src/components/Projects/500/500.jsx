import React, { useEffect, useMemo, useState } from "react";

// ==========================
// THEME
// ==========================
const COLORS = {
  primary: "#fcc001",     // brand yellow
  primaryDark: "#b48700",  // for borders/shadows
  surface: "#ffffff",
  ink: "#000000",
  backdrop: "#333134",
  success: "#16a34a",      // Made Bet
  danger: "#dc2626",       // Failed Bet
  selectedFill: "#ffef9c", // filled look for selected pills/badges
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

function useSmallScreen(breakpoint = 520) {
  const [isSmall, setIsSmall] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(max-width:${breakpoint}px)`);
    const update = () => setIsSmall(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, [breakpoint]);
  return isSmall;
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

  const isSmall = useSmallScreen(520);

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
    const reason = `${made ? "Made Bet" : "Failed Bet"}: ${describeBid(model)}`;
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

  const renameTeam = (i, name) =>
    setModel((m) => ({ ...m, teams: m.teams.map((t, idx) => (idx === i ? { ...t, name } : t)) }));
  const manualAdjust = (i, amt) => record(i, amt, `Manual +${amt}`);

  // --- responsive style tweaks
  const scoresRowStyle = {
    ...styles.scoresRow,
    ...(isSmall ? { gridTemplateColumns: "1fr" } : {}),
  };
  const grid3Style = {
    ...styles.grid3,
    ...(isSmall ? { gridTemplateColumns: "1fr" } : {}),
  };
  const ctaRowStyle = {
    display: "flex",
    gap: 12,
    marginTop: 20,
    ...(isSmall ? { flexDirection: "column" } : {}),
  };
  const appStyle = {
    ...styles.app,
    ...(isSmall ? { padding: "16px 12px calc(20px + env(safe-area-inset-bottom))" } : {}),
  };
  const panelHeadStyle = {
    ...styles.panelHead,
    ...(isSmall ? { flexDirection: "column", alignItems: "stretch", gap: 10 } : {}),
  };
  const titleStyle = { ...styles.title, fontSize: "clamp(1.25rem, 1rem + 2vw, 2.25rem)" };
  const scoreNumberStyle = { ...styles.scoreNumber, fontSize: "clamp(2.75rem, 2.1rem + 4vw, 4rem)" };

  return (
    <div style={appStyle}>
      <Header titleStyle={titleStyle} />

      {/* Scores */}
      <div style={scoresRowStyle}>
        {model.teams.map((t, i) => (
          <TeamCard
            key={i}
            team={t}
            active={model.biddingTeam === i}
            onNameChange={(name) => renameTeam(i, name)}
            onAdjust={(amt) => manualAdjust(i, amt)}
            onSelectBidder={() => setModel((m) => ({ ...m, biddingTeam: i }))}
            scoreNumberStyle={scoreNumberStyle}
            isSmall={isSmall}
          />
        ))}
      </div>

      {/* Bet selector */}
      <section style={{ ...styles.panel, ...(isSmall ? { padding: 12 } : {}) }}>
        <div style={panelHeadStyle}>
          <h2 style={styles.panelTitle}>Current Bet</h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button style={styles.linkBtn} onClick={() => setModel((m) => ({ ...m, showTable: true }))}>
              View Scoring Table
            </button>
            <button style={styles.linkBtn} onClick={undo} disabled={!model.history.length}>
              Undo
            </button>
            <button style={styles.linkBtn} onClick={resetScores}>
              Reset
            </button>
          </div>
        </div>

        <div style={grid3Style}>
          <div>
            <label style={styles.label}>Bidding Team</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {model.teams.map((t, i) => (
                <button
                  key={i}
                  style={{
                    ...styles.pill,
                    ...(model.biddingTeam === i ? styles.pillActive : {}),
                    ...(isSmall ? { width: "100%" } : {}),
                  }}
                  onClick={() => setModel((m) => ({ ...m, biddingTeam: i }))}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={styles.label}>Bet Type</label>
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
                    ...(isSmall ? { width: "100%" } : {}),
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
          <div style={{ ...grid3Style, marginTop: 16 }}>
            <div>
              <label style={styles.label}>Level</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[6, 7, 8, 9, 10].map((lvl) => (
                  <button
                    key={lvl}
                    style={{
                      ...styles.pill,
                      ...(model.level === lvl ? styles.pillActive : {}),
                      ...(isSmall ? { flex: "1 1 80px" } : {}),
                    }}
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
                    style={{
                      ...styles.pill,
                      ...(model.suit === s.key ? styles.pillActive : {}),
                      ...(isSmall ? { flex: "1 1 120px" } : {}),
                    }}
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

        {/* Primary CTAs */}
        <div style={ctaRowStyle}>
          <button
            style={styles.ctaSuccess}
            onClick={() => applyRound(true)}
            aria-label={`Made Bet worth ${currentBidValue}`}
          >
            ✓ Made Bet (+{currentBidValue})
          </button>
          <button
            style={styles.ctaDanger}
            onClick={() => applyRound(false)}
            aria-label={`Failed Bet worth ${currentBidValue}`}
          >
            ✗ Failed Bet (−{currentBidValue})
          </button>
        </div>
      </section>

      {/* History */}
      <section style={{ ...styles.panel, marginBottom: 64, ...(isSmall ? { padding: 12 } : {}) }}>
        <div style={styles.panelHead}>
          <h2 style={styles.panelTitle}>History</h2>
        </div>
        {model.history.length === 0 ? (
          <div style={{ color: "#666" }}>No rounds yet. Record a result above.</div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {model.history.map((h, idx) => (
              <li
                key={idx}
                style={{
                  ...styles.historyItem,
                  ...(isSmall ? { gridTemplateColumns: "1fr", gap: 4 } : {}),
                }}
              >
                <span style={{ fontWeight: 600 }}>{model.teams[h.teamIndex]?.name}</span>
                <span style={{ flex: 1, color: "#666" }}>{h.reason}</span>
                <span style={{ fontWeight: 800, color: h.delta >= 0 ? COLORS.success : COLORS.danger }}>
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

function Header({ titleStyle }) {
  return (
    <header style={styles.header}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <div style={styles.logoDot} />
        <h1 style={titleStyle}>500 Scorekeeper</h1>
      </div>
    </header>
  );
}

function TeamCard({ team, onNameChange, onAdjust, onSelectBidder, active, scoreNumberStyle, isSmall }) {
  return (
    <div style={{ ...styles.teamCard, ...(isSmall ? { padding: 12 } : {}) }}>
      <div style={styles.teamHeader}>
        <input
          value={team.name}
          onChange={(e) => onNameChange(e.target.value)}
          style={{ ...styles.teamNameInput, ...(isSmall ? { width: "100%" } : {}) }}
        />
        <button
          onClick={onSelectBidder}
          style={{
            ...styles.badge,
            ...(active ? styles.badgeActive : {}),
          }}
          aria-pressed={active}
        >
          {active ? "Bidding" : "Set Bidder"}
        </button>
      </div>
      <div style={scoreNumberStyle}>{team.score}</div>
      <div
        style={{
          ...styles.adjustRow,
          ...(isSmall ? { gridTemplateColumns: "repeat(5, minmax(44px, 1fr))" } : {}),
        }}
      >
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
            <td style={styles.td}>
              <em>Misère</em>
            </td>
            <td style={styles.td} colSpan={5}>
              {SCORE_TABLE.MISERE}
            </td>
          </tr>
          <tr>
            <td style={styles.td}>
              <em>Open Misère</em>
            </td>
            <td style={styles.td} colSpan={5}>
              {SCORE_TABLE.OPEN_MISERE}
            </td>
          </tr>
        </tbody>
      </table>
      <p style={{ color: "#666", marginTop: 12 }}>
        Tip: Pick a bet above, then tap <strong>Made Bet</strong> or <strong>Failed Bet</strong>.
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
          <button style={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

function StyleTag() {
  return (
    <style>{`
      :root { color-scheme: light only; }
      * { box-sizing: border-box; }
      body { margin: 0; background: ${COLORS.backdrop}; color: ${COLORS.ink}; font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; }
      button:disabled { opacity: .6; cursor: not-allowed; }
      button:focus-visible { outline: 3px solid ${COLORS.primaryDark}; outline-offset: 2px; }
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
  teamHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" },
  teamNameInput: {
    fontSize: 18,
    fontWeight: 700,
    border: `2px solid ${COLORS.primary}`,
    padding: "6px 10px",
    borderRadius: 10,
    color: COLORS.ink,
    background: COLORS.surface,
    outline: "none",
    minWidth: 0,
    flex: "1 1 180px",
  },
  scoreNumber: { fontSize: 64, fontWeight: 900, lineHeight: 1, marginTop: 8 },
  adjustRow: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, marginTop: 12 },
  adjustBtn: {
    padding: "10px 6px",
    background: COLORS.surface,
    border: `2px solid ${COLORS.primary}`,
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
  },
  badge: {
    border: `2px solid ${COLORS.primary}`,
    padding: "6px 12px",
    borderRadius: 999,
    background: COLORS.surface,
    color: COLORS.ink,
    cursor: "pointer",
    fontWeight: 800,
  },
  // CLEAR, FILLED SELECTED STATE
  badgeActive: {
    background: COLORS.selectedFill,
    borderColor: COLORS.primaryDark,
    boxShadow: `0 0 0 3px ${COLORS.primary}70 inset`,
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
    padding: "10px 12px",
    borderRadius: 999,
    border: `2px solid ${COLORS.primary}`,
    background: COLORS.surface,
    color: COLORS.ink,
    cursor: "pointer",
    fontWeight: 800,
    transition: "background .15s ease, box-shadow .15s ease, border-color .15s ease",
  },
  // CLEAR, FILLED SELECTED STATE
  pillActive: {
    background: COLORS.selectedFill,
    borderColor: COLORS.primaryDark,
    boxShadow: `0 0 0 4px ${COLORS.primary}50`,
  },

  // PROMINENT PRIMARY ACTIONS
  ctaSuccess: {
    width: "100%",
    padding: "14px 18px",
    borderRadius: 14,
    fontWeight: 900,
    fontSize: "1.05rem",
    cursor: "pointer",
    background: COLORS.success,
    color: "#fff",
    border: `2px solid ${COLORS.success}`,
    textAlign: "center",
  },
  ctaDanger: {
    width: "100%",
    padding: "14px 18px",
    borderRadius: 14,
    fontWeight: 900,
    fontSize: "1.05rem",
    cursor: "pointer",
    background: COLORS.danger,
    color: "#fff",
    border: `2px solid ${COLORS.danger}`,
    textAlign: "center",
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
    gap: 8,
  },
  linkBtn: {
    background: COLORS.surface,
    border: `2px solid ${COLORS.primary}`,
    color: COLORS.ink,
    padding: "8px 14px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 800,
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
