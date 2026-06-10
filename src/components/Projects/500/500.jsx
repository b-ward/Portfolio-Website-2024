import { useEffect, useMemo, useState } from "react";
import Modal from "../../Shared/Modal";

// ==========================
// CONSTANTS / DATA
// ==========================
const SUITS = [
  { key: "S", label: "Spades", icon: "♠", iconColor: "text-black" },
  { key: "C", label: "Clubs", icon: "♣", iconColor: "text-black" },
  { key: "D", label: "Diamonds", icon: "♦", iconColor: "text-red-600" },
  { key: "H", label: "Hearts", icon: "♥", iconColor: "text-red-600" },
  { key: "NT", label: "No Trumps", icon: "NT", iconColor: "text-black" },
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
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showRules, setShowRules] = useState(false);
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
    setShowResetConfirm(true);
  }

  function confirmReset() {
    setShowResetConfirm(false);
    setModel((m) => ({
      ...m,
      teams: m.teams.map((t) => ({ ...t, score: 0 })),
      history: [],
    }));
  }

  const renameTeam = (i, name) =>
    setModel((m) => ({ ...m, teams: m.teams.map((t, idx) => (idx === i ? { ...t, name } : t)) }));
  const manualAdjust = (i, amt) => record(i, amt, `Manual +${amt}`);

  return (
    <div className="min-h-screen bg-surface text-black p-5 max-w-[1100px] mx-auto sm:p-5 [padding:16px_12px_calc(20px+env(safe-area-inset-bottom))_12px] sm:[padding:20px]">
      <Header onShowRules={() => setShowRules(true)} />

      {/* Scores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
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

      {/* Bet selector */}
      <section className="border-2 border-accent rounded-2xl p-4 bg-white text-black mb-4 sm:p-4 [padding:12px]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <h2 className="m-0 text-black text-2xl font-extrabold tracking-wide">Current Bet</h2>
          <div className="flex gap-2 flex-wrap">
            <button
              className="bg-white border-2 border-accent text-black px-3 py-2 rounded-xl cursor-pointer font-extrabold"
              onClick={() => setModel((m) => ({ ...m, showTable: true }))}
            >
              View Scoring Table
            </button>
            <button
              className="bg-white border-2 border-accent text-black px-3 py-2 rounded-xl cursor-pointer font-extrabold disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={undo}
              disabled={!model.history.length}
            >
              Undo
            </button>
            {showResetConfirm ? (
              <span className="inline-flex gap-2 items-center">
                <span className="text-sm font-semibold text-black">Reset all scores?</span>
                <button
                  className="bg-red-600 border-2 border-red-600 text-white px-3 py-2 rounded-xl cursor-pointer font-extrabold"
                  onClick={confirmReset}
                >
                  Yes, reset
                </button>
                <button
                  className="bg-white border-2 border-accent text-black px-3 py-2 rounded-xl cursor-pointer font-extrabold"
                  onClick={() => setShowResetConfirm(false)}
                >
                  Cancel
                </button>
              </span>
            ) : (
              <button
                className="bg-white border-2 border-accent text-black px-3 py-2 rounded-xl cursor-pointer font-extrabold"
                onClick={resetScores}
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4 items-center">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">Bidding Team</label>
            <div className="flex gap-2 flex-wrap">
              {model.teams.map((t, i) => (
                <button
                  key={i}
                  className={`px-3 py-2.5 rounded-full border-2 bg-white text-black cursor-pointer font-extrabold transition-all w-full sm:w-auto ${
                    model.biddingTeam === i
                      ? "bg-yellow-100 border-yellow-600 shadow-[0_0_0_4px_rgba(252,192,1,0.31)]"
                      : "border-accent"
                  }`}
                  onClick={() => setModel((m) => ({ ...m, biddingTeam: i }))}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">Bet Type</label>
            <div className="flex gap-2 flex-wrap">
              {[
                { key: "none", label: "Standard" },
                { key: "MISERE", label: "Misère" },
                { key: "OPEN_MISERE", label: "Open Misère" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  className={`px-3 py-2.5 rounded-full border-2 bg-white text-black cursor-pointer font-extrabold transition-all w-full sm:w-auto ${
                    model.special === opt.key
                      ? "bg-yellow-100 border-yellow-600 shadow-[0_0_0_4px_rgba(252,192,1,0.31)]"
                      : "border-accent"
                  }`}
                  onClick={() => setModel((m) => ({ ...m, special: opt.key }))}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">Value</label>
            <div className="font-extrabold">{currentBidValue}</div>
          </div>
        </div>

        {model.special === "none" && (
          <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4 items-center mt-4">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wide">Level</label>
              <div className="flex gap-2 flex-wrap">
                {[6, 7, 8, 9, 10].map((lvl) => (
                  <button
                    key={lvl}
                    className={`w-12 h-12 rounded-full border-2 bg-white text-black cursor-pointer font-extrabold transition-all flex-none flex items-center justify-center ${
                      model.level === lvl
                        ? "bg-yellow-100 border-yellow-600 shadow-[0_0_0_4px_rgba(252,192,1,0.31)]"
                        : "border-accent"
                    }`}
                    onClick={() => setModel((m) => ({ ...m, level: lvl }))}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wide">Suit</label>
              <div className="flex gap-2 flex-wrap">
                {SUITS.map((s) => (
                  <button
                    key={s.key}
                    className={`px-3 py-2.5 rounded-full border-2 bg-white text-black cursor-pointer font-extrabold transition-all sm:flex-none flex-1 basis-[120px] ${
                      model.suit === s.key
                        ? "bg-yellow-100 border-yellow-600 shadow-[0_0_0_4px_rgba(252,192,1,0.31)]"
                        : "border-accent"
                    }`}
                    onClick={() => setModel((m) => ({ ...m, suit: s.key }))}
                  >
                    <span className={`mr-1.5 text-base leading-none ${s.iconColor}`}>{s.icon}</span>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div />
          </div>
        )}

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 mt-5">
          <button
            className="w-full py-3.5 px-4 rounded-2xl font-black text-[1.05rem] cursor-pointer bg-green-600 text-white border-2 border-green-600 text-center"
            onClick={() => applyRound(true)}
            aria-label={`Made Bet worth ${currentBidValue}`}
          >
            ✓ Made Bet (+{currentBidValue})
          </button>
          <button
            className="w-full py-3.5 px-4 rounded-2xl font-black text-[1.05rem] cursor-pointer bg-red-600 text-white border-2 border-red-600 text-center"
            onClick={() => applyRound(false)}
            aria-label={`Failed Bet worth ${currentBidValue}`}
          >
            ✗ Failed Bet (−{currentBidValue})
          </button>
        </div>
      </section>

      {/* History */}
      <section className="border-2 border-accent rounded-2xl bg-white text-black mb-16 p-4 sm:p-4 [padding:12px]">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h2 className="m-0 text-black">History</h2>
        </div>
        {model.history.length === 0 ? (
          <div className="text-gray-500">No rounds yet. Record a result above.</div>
        ) : (
          <ul className="list-none p-0 m-0">
            {model.history.map((h, idx) => (
              <li
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto] items-center px-1.5 py-2.5 border-b border-accent/30 gap-2 sm:gap-2"
              >
                <span className="font-semibold text-black">{model.teams[h.teamIndex]?.name}</span>
                <span className="text-gray-500">{h.reason}</span>
                <span className={`font-extrabold ${h.delta >= 0 ? "text-green-600" : "text-red-600"}`}>
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

      {showRules && (
        <Modal onClose={() => setShowRules(false)} title="How to Play 500">
          <RulesContent />
        </Modal>
      )}
    </div>
  );
}

function Header({ onShowRules }) {
  return (
    <header className="mb-6 border-b-[3px] border-accent pb-3 bg-white text-black rounded-xl p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-2.5">
          <div className="w-3.5 h-3.5 rounded-full bg-accent" />
          <h1 className="m-0 font-extrabold tracking-wide text-black" style={{ fontSize: "clamp(1.25rem, 1rem + 2vw, 2.25rem)" }}>
            500 Scorekeeper
          </h1>
        </div>
        <button
          className="bg-white border-2 border-accent text-black px-3 py-2 rounded-xl cursor-pointer font-extrabold text-sm whitespace-nowrap"
          onClick={onShowRules}
        >
          How to Play
        </button>
      </div>
    </header>
  );
}

function TeamCard({ team, onNameChange, onAdjust, onSelectBidder, active }) {
  return (
    <div className="border-2 border-accent rounded-2xl p-4 bg-white text-black sm:p-4 [padding:12px]">
      <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
        <input
          value={team.name}
          onChange={(e) => onNameChange(e.target.value)}
          className="text-lg font-bold border-2 border-accent px-2.5 py-1.5 rounded-xl text-black bg-white outline-none min-w-0 flex-[1_1_180px] w-full sm:w-auto"
        />
        <button
          onClick={onSelectBidder}
          className={`border-2 border-accent px-3 py-1.5 rounded-full bg-white text-black cursor-pointer font-extrabold ${
            active ? "bg-yellow-100 border-yellow-600 shadow-[0_0_0_3px_rgba(252,192,1,0.44)_inset]" : ""
          }`}
          aria-pressed={active}
        >
          {active ? "Bidding" : "Set Bidder"}
        </button>
      </div>
      <div className="font-black leading-none mt-2 text-black" style={{ fontSize: "clamp(2.75rem, 2.1rem + 4vw, 4rem)" }}>
        {team.score}
      </div>
      <div className="grid grid-cols-5 gap-1.5 mt-3">
        {[10, 20, 30, 40, 50].map((amt) => (
          <button
            key={amt}
            className="py-2.5 px-1.5 bg-white border-2 border-accent rounded-xl cursor-pointer font-bold text-black"
            onClick={() => onAdjust(amt)}
          >
            +{amt}
          </button>
        ))}
      </div>
    </div>
  );
}

function RulesContent() {
  return (
    <div className="space-y-4 text-sm leading-relaxed">
      <section>
        <h3 className="font-extrabold text-base mb-1">Overview</h3>
        <p>500 is a trick-taking card game for 4 players in 2 partnerships. The goal is to be the first team to reach 500 points — or to force the opponents to −500.</p>
      </section>

      <section>
        <h3 className="font-extrabold text-base mb-1">The Deck</h3>
        <p>500 uses a 43-card deck. To build one from a standard 52-card deck:</p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Remove all <strong>2s</strong> and <strong>3s</strong> (8 cards)</li>
          <li>Remove the <strong>4♠</strong> and <strong>4♣</strong> (2 cards)</li>
          <li>Add <strong>one Joker</strong></li>
        </ul>
        <p className="mt-1">This leaves: A–5 in ♥/♦ (11 cards each) and A–5 in ♠/♣ (10 cards each), plus the Joker.</p>
        <p className="mt-2">Trump card ranking (highest → lowest): <strong>Joker</strong>, <strong>Right Bower</strong> (J of trump suit), <strong>Left Bower</strong> (J of same-colour suit), then A K Q 10 … of trump.</p>
      </section>

      <section>
        <h3 className="font-extrabold text-base mb-1">Bidding</h3>
        <p>Players take turns bidding the number of tricks (6–10) they expect their team to win, along with a trump suit or No Trumps. Each bid must be higher in value than the last. The highest bidder wins the contract.</p>
        <p className="mt-1">Special bids:</p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li><strong>Misère (250 pts):</strong> The bidder plays alone with no trumps, attempting to lose every single trick.</li>
          <li><strong>Open Misère (500 pts):</strong> Same as Misère, but the bidder's hand is laid face-up on the table after the first trick.</li>
        </ul>
      </section>

      <section>
        <h3 className="font-extrabold text-base mb-1">Playing</h3>
        <p>The winning bidder leads the first trick. Players must follow suit if able; otherwise they may play any card. The highest trump wins the trick, or the highest card of the led suit if no trumps are played.</p>
      </section>

      <section>
        <h3 className="font-extrabold text-base mb-1">Scoring</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Made the bid:</strong> The bidding team scores the bid value (see scoring table).</li>
          <li><strong>Failed the bid:</strong> The bid value is deducted from the bidding team's score.</li>
          <li><strong>Non-bidding team:</strong> Score 10 points per trick won regardless of outcome.</li>
          <li><strong>Slam bonus:</strong> If the bidding team wins all 10 tricks and their bid was worth less than 250, they score 250 instead.</li>
        </ul>
      </section>

      <section>
        <h3 className="font-extrabold text-base mb-1">Winning</h3>
        <p>The first team to reach <strong>+500 points</strong> wins. A team that reaches <strong>−500 points</strong> immediately loses.</p>
      </section>
    </div>
  );
}

function ScoringTable() {
  return (
    <div className="text-black overflow-x-auto">
      <table className="w-full border-collapse border-2 border-accent rounded-xl overflow-hidden">
        <thead>
          <tr>
            <th className="text-left p-2.5 bg-white text-black border-b-2 border-accent">Tricks</th>
            <th className="text-left p-2.5 bg-white text-black border-b-2 border-accent"><span className="text-xl">♠</span></th>
            <th className="text-left p-2.5 bg-white text-black border-b-2 border-accent"><span className="text-xl">♣</span></th>
            <th className="text-left p-2.5 bg-white text-black border-b-2 border-accent"><span className="text-xl text-red-600">♦</span></th>
            <th className="text-left p-2.5 bg-white text-black border-b-2 border-accent"><span className="text-xl text-red-600">♥</span></th>
            <th className="text-left p-2.5 bg-white text-black border-b-2 border-accent">No Trumps</th>
          </tr>
        </thead>
        <tbody>
          {[6, 7, 8, 9, 10].map((lvl) => (
            <tr key={lvl}>
              <td className="p-2.5 border-t border-accent/30 bg-white text-black">{lvl} Tricks</td>
              <td className="p-2.5 border-t border-accent/30 bg-white text-black">{SCORE_TABLE[lvl].S}</td>
              <td className="p-2.5 border-t border-accent/30 bg-white text-black">{SCORE_TABLE[lvl].C}</td>
              <td className="p-2.5 border-t border-accent/30 bg-white text-black">{SCORE_TABLE[lvl].D}</td>
              <td className="p-2.5 border-t border-accent/30 bg-white text-black">{SCORE_TABLE[lvl].H}</td>
              <td className="p-2.5 border-t border-accent/30 bg-white text-black">{SCORE_TABLE[lvl].NT}</td>
            </tr>
          ))}
          <tr>
            <td className="p-2.5 border-t border-accent/30 bg-white text-black">
              <em>Misère</em>
            </td>
            <td className="p-2.5 border-t border-accent/30 bg-white text-black" colSpan={5}>
              {SCORE_TABLE.MISERE}
            </td>
          </tr>
          <tr>
            <td className="p-2.5 border-t border-accent/30 bg-white text-black">
              <em>Open Misère</em>
            </td>
            <td className="p-2.5 border-t border-accent/30 bg-white text-black" colSpan={5}>
              {SCORE_TABLE.OPEN_MISERE}
            </td>
          </tr>
        </tbody>
      </table>

    </div>
  );
}
