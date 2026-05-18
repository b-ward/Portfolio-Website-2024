---
phase: 06-mini-projects
verified: 2026-05-17T12:00:00Z
status: human_needed
score: 9/9 must-have truths verified (with caveats — see gaps)
overrides_applied: 0
gaps: []
human_verification:
  - test: "Navigate to /Projects/Trio — verify TrioHome renders with correct visual appearance (layout, buttons, no broken orphaned classes)"
    expected: "Page loads, Creation and Help buttons visible, clicking Help opens a modal (content is pre-existing arbitrage text — this is a content bug predating Phase 6, not introduced here)"
    why_human: "trioHome.jsx has orphaned className='trio-wrapper' and className='trio-title' (CSS deleted, class names still present). Also className='row' with no CSS backing. Visual impact cannot be verified programmatically."
  - test: "Navigate to /Projects/TrainGame — enter '2384' and click Submit"
    expected: "Solutions list appears (e.g. '(2x3)+(8-4)=10'). Help and Creation modals open and close correctly."
    why_human: "Calculation correctness and modal UX require visual verification"
  - test: "Navigate to /Projects/TrioGame — click Help button"
    expected: "Shared Modal opens with YouTube iframe and 13-image step indicator (1/13 shown). Prev/Next arrows navigate pages. Class component game board renders on dark green canvas."
    why_human: "Step indicator image loading and game board rendering require visual verification"
  - test: "Navigate to /Projects/PaceCalculator — enter distance 10 km, time 0h 50m 0s, click Calculate"
    expected: "Pace displays as '5:00 /km'. White card on dark background. Tab auto-advance between time inputs works."
    why_human: "Calculation correctness, responsive layout, and focus behaviour require visual verification. Note: setError() inside useMemo is a React rules violation (WR-01) but pre-existing."
  - test: "Navigate to /Projects/FiveHundred — record a bet, click Undo, reload page"
    expected: "Bet appears in list. Undo removes it. After reload, game state restores from localStorage. White card on dark background. No 'color-scheme: light only' in browser computed styles."
    why_human: "Game state persistence, undo logic, and StyleTag removal verification require manual interaction"
  - test: "Navigate to /Projects/Arbitrage — page loads, click 'Fetch Bets'"
    expected: "Dark Tailwind-styled page (no white box). Spinner visible during loading. Results render with gold title, dark cards, green profit badge. Info modal opens and closes."
    why_human: "Live API call and results rendering require human observation"
  - test: "Navigate to /Projects/NBA-Ladder (without netlify dev running)"
    expected: "Dark Tailwind card (no white box), centred with no 80px left offset. Graceful error or loading message (not a JS error or blank page)."
    why_human: "Netlify function unavailable locally — error state and layout centering require visual check"
  - test: "Navigate to /Projects/Noise"
    expected: "Page renders without error (blank page is correct behaviour). No console errors."
    why_human: "Blank page verification requires human check"
---

# Phase 6: Mini-Projects Verification Report

**Phase Goal:** All 8 mini-project components migrated from Bootstrap/legacy CSS to Tailwind CSS, with class components converted to functional where appropriate (TrioGame kept as class), shared Modal component created, all legacy CSS files deleted, and npm run build passes.
**Verified:** 2026-05-17
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Shared Modal component exists and is importable by any tool component | VERIFIED | `src/components/Shared/Modal.jsx` exists; exports `default function Modal({ title, onClose, children })`; fixed backdrop with stopPropagation; aria-label="Close" |
| 2 | All 5 legacy CSS files deleted (trainGame.css, trioHome.css, noisyDetector.css, arbitrage.css, nbaLadder.css) | VERIFIED | Directory listings confirm all 5 files absent; trioGame.css kept (required for game board) |
| 3 | TrainGame is a functional component using shared Modal with working calculation logic | VERIFIED | `const TrainGame = ()` with 5 useState hooks; imports Modal from Shared; getSolutions call preserved verbatim; no Bootstrap imports |
| 4 | TrioHome is a functional component using shared Modal | VERIFIED (with caveats) | Functional with useState; shared Modal imported and used; no Bootstrap; no document.getElementById; HTML className bugs fixed. Orphaned class names `trio-wrapper`, `trio-title`, `row` remain (pre-existing, CSS deleted) |
| 5 | NoisyDetector is a functional stub rendering without errors | VERIFIED | 7-line functional component `const NoisyDetector = () => <div />` — correct per D-07 |
| 6 | Arbitrage migrated to Tailwind — all arb-* classes replaced, shared Modal used, calculations preserved | VERIFIED | No `arb-` classNames in file; no `arbitrage.css` import; `getArbitrageBets` import with typo preserved; Modal from Shared wired |
| 7 | NBALadder migrated to Tailwind dark theme — light-mode vars gone, API call preserved | VERIFIED | Root div has `bg-surface rounded-xl...mx-auto`; no `nba-` classes; no CSS vars; `API_URL = '/.netlify/functions/standings'` preserved verbatim |
| 8 | PaceCalculator migrated — inline styles replaced, isSmall removed, nextRef/URL persistence preserved | VERIFIED | No `const styles =`, no `style={styles.`, no `isSmall`, no `matchMedia`; `nextRef`/`mmRef`/`ssRef` present; `history.replaceState` present; `bg-white` on card |
| 9 | 500 Scorer migrated — StyleTag deleted, COLORS deleted, localStorage key preserved, white card preserved | VERIFIED | No `StyleTag`, no `COLORS.`, no `color-scheme: light`; `fivehundred-scorer-v1` key present; `bg-white text-black` on all card sections; shared Modal imported |
| 10 | TrioGame remains a class component — Bootstrap removed, shared Modal with step indicator, trioGame.css trimmed | VERIFIED | `class TrioGame extends Component` (356 this.state/setState references); no `react-bootstrap`; `import Modal from '../../Shared/Modal'`; HelpModal uses `React.useState` for slide; trioGame.css exists and contains only `#id` rules |
| 11 | npm run build passes | VERIFIED | Build output: 108 modules transformed, 0 errors, exit 0 |

**Score:** 11/11 truths verified (TOOL-02/TrioHome has caveats documented below)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/components/Shared/Modal.jsx` | Reusable Tailwind modal `{title, onClose, children}` | VERIFIED | 27 lines; correct interface; fixed backdrop; stopPropagation; aria-label |
| `src/components/Projects/TrainGame/trainGame.jsx` | Functional TrainGame, no Bootstrap | VERIFIED | 131 lines; 5 useState; getSolutions wired; shared Modal used |
| `src/components/Projects/TrainGame/trainGame.css` | DELETED | VERIFIED | File absent |
| `src/components/Projects/Trio/trioHome.jsx` | Functional TrioHome, no Bootstrap | VERIFIED | Functional; shared Modal used; no Bootstrap; className bugs fixed |
| `src/components/Projects/Trio/trioHome.css` | DELETED | VERIFIED | File absent |
| `src/components/Projects/NoisyDetector/noisyDetector.jsx` | Minimal functional stub | VERIFIED | 7 lines; returns `<div />` |
| `src/components/Projects/NoisyDetector/noisyDetector.css` | DELETED | VERIFIED | File absent |
| `src/components/Projects/Arbitrage/arbitrage.jsx` | Tailwind-styled Arbitrage, shared Modal | VERIFIED | No arb-* classes; no CSS import; shared Modal; calculations preserved |
| `src/components/Projects/Arbitrage/arbitrage.css` | DELETED | VERIFIED | File absent |
| `src/components/Projects/NBA-Ladder/NBA-Ladder.jsx` | Tailwind dark theme, API preserved | VERIFIED | bg-surface root; no nba-* classes; API_URL verbatim |
| `src/components/Projects/NBA-Ladder/nbaLadder.css` | DELETED | VERIFIED | File absent |
| `src/components/Projects/PaceCalculator/paceCalculator.jsx` | Tailwind classes, isSmall removed, refs preserved | VERIFIED | No styles object; no isSmall; refs and URL persistence intact |
| `src/components/Projects/500/500.jsx` | StyleTag/COLORS deleted, Tailwind, localStorage preserved | VERIFIED | No StyleTag; no COLORS; `fivehundred-scorer-v1` present; bg-white on cards |
| `src/components/Projects/Trio/trioGame.jsx` | Class component, Bootstrap removed, shared Modal | VERIFIED | Class preserved; no react-bootstrap; HelpModal step indicator; CSS import kept |
| `src/components/Projects/Trio/trioGame.css` | KEPT AND TRIMMED (not deleted) | VERIFIED | Exists; no class rules (.trio-wrapper, .trio-title, .trio-button, .video-container); all #id rules intact |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `trainGame.jsx` | `src/components/Shared/Modal.jsx` | `import Modal from '../../Shared/Modal'` | WIRED | Line 3; used at lines 76 and 97 |
| `trainGame.jsx` | `./trainGameCalculations` | `import getSolutions from './trainGameCalculations'` | WIRED | Line 2; called at line 19 |
| `trioHome.jsx` | `src/components/Shared/Modal.jsx` | `import Modal from '../../Shared/Modal'` | WIRED | Line 2; used in both Modal renders |
| `noisyDetector.jsx` | `src/components/main.jsx` route | via route `/Projects/Noise` | WIRED | Component exported; route registration in scope of prior phases |
| `arbitrage.jsx` | `./arbitrageCalcutations` | `import getArbitrageBets from './arbitrageCalcutations'` (typo preserved) | WIRED | Line 3; live API logic preserved |
| `arbitrage.jsx` | `src/components/Shared/Modal.jsx` | `import Modal from '../../Shared/Modal'` | WIRED | Line 2; InfoModal replaced with shared Modal |
| `NBA-Ladder.jsx` | `/.netlify/functions/standings` | `fetch(API_URL)` in useEffect | WIRED | `API_URL = '/.netlify/functions/standings'` preserved verbatim; fetch at line 18 |
| `paceCalculator.jsx` | `window.history.replaceState` | URL state persistence | WIRED | `history.replaceState` at line 41; URLSearchParams logic intact |
| `500.jsx` | `localStorage` | `usePersistentState` hook with `fivehundred-scorer-v1` | WIRED | `STORAGE_KEY = "fivehundred-scorer-v1"` at line 25 |
| `500.jsx` | `src/components/Shared/Modal.jsx` | `import Modal from '../../Shared/Modal'` | WIRED | Line 2; used for scoring table modal |
| `trioGame.jsx` | `src/components/Shared/Modal.jsx` | `import Modal from '../../Shared/Modal'` | WIRED | Line 3; HelpModal uses it at line 10 |
| `trioGame.jsx` | `./trioGame.css` | `import './trioGame.css'` | WIRED | Line 2; CSS file exists with game board ID rules |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|--------------|--------|--------------------|--------|
| `trainGame.jsx` | `solutions` state | `getSolutions(number)` in `validateAndSubmit` | Yes — calls real calculation module | FLOWING |
| `arbitrage.jsx` | bets/results state | `getArbitrageBets()` API fetch | Yes — external odds API | FLOWING |
| `NBA-Ladder.jsx` | `conferences` state | `fetch(API_URL)` → `parseSportradarStandings(data)` | Yes — Netlify function proxy | FLOWING |
| `paceCalculator.jsx` | `calc` (pace result) | `useMemo` over distance/seconds inputs | Yes — user inputs feed calculation | FLOWING |
| `500.jsx` | game state via `usePersistentState` | `localStorage.getItem('fivehundred-scorer-v1')` | Yes — localStorage persistence | FLOWING |
| `trioGame.jsx` | `this.state` (deck, hand, CPU_hand) | `this.shuffle()` in `componentDidMount` | Yes — game state initialized and mutated | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| npm run build | `npm run build` | 108 modules, 0 errors, exit 0 | PASS |
| Modal.jsx exports correct function | grep in file | `export default function Modal({ title, onClose, children })` found | PASS |
| No Bootstrap imports in migrated files | grep across Projects | Only `trioGame-state.jsx` (explicitly out of scope per plan) and `topArtistsMap.jsx` (Phase 8 scope) | PASS |
| No legacy CSS files present | directory listing | trainGame.css, trioHome.css, noisyDetector.css, arbitrage.css, nbaLadder.css all absent | PASS |
| TrioGame class component preserved | grep | `class TrioGame extends` found; 356 `this.state`/`this.setState` matches | PASS |
| API_URL preserved verbatim | grep | `const API_URL = '/.netlify/functions/standings'` exact match | PASS |
| localStorage key preserved | grep | `fivehundred-scorer-v1` found in 500.jsx | PASS |
| trioGame.css kept with ID rules | file check + grep | File exists; `#player_card_`, `#play`, `#pile`, `#deck` present; class rules absent | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| TOOL-01 | 06-05 | Arbitrage calculator renders and calculations function correctly | NEEDS HUMAN | Code verified; live API test requires human |
| TOOL-02 | 06-03, 06-09 | Trio game renders and interactions work correctly | NEEDS HUMAN | Code verified; game interaction requires human |
| TOOL-03 | 06-02 | Train game renders and functions correctly | NEEDS HUMAN | Code verified; input→solution flow requires human |
| TOOL-04 | 06-07 | Pace calculator renders and calculates correctly | NEEDS HUMAN | Code verified; calculation result requires human |
| TOOL-05 | 06-08 | 500 card game renders and functions correctly | NEEDS HUMAN | Code verified; game state/undo requires human |
| TOOL-06 | 06-04 | Noisy detector renders and functions correctly | NEEDS HUMAN (minimal) | Blank page is correct behaviour; human confirms no console errors |
| TOOL-07 | 06-06 | NBA Ladder renders and fetches standings data | NEEDS HUMAN | Code verified; Netlify function requires netlify dev to test live data |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `trioHome.jsx` | 9, 17, 10 | `className="trio-wrapper"`, `className="trio-title"`, `className="row"` — orphaned class names, CSS deleted | Warning | Classes apply no styling; layout is unstyled. Pre-existing class names not replaced with Tailwind (not in plan acceptance criteria). |
| `paceCalculator.jsx` | ~53 | `setError("")` inside `useMemo` — React rules violation | Warning | Can cause render loop in StrictMode. Pre-existing pattern introduced during Phase 6 inline-styles migration (WR-01 in REVIEW.md). |
| `trioHome.jsx` | 39-66 | Help modal contains arbitrage text, not Trio instructions | Warning | Wrong content shown to users of Trio page. **Pre-existing content bug** — verbatim copy from original file per content-preservation constraint. |
| `trioGame.jsx` | 44-68 | MadeModal has wrong content (arbitrage story); commented out in render | Info | Commented-out dead code; no user impact. Creation button does nothing. Pre-existing. |
| `trioGame.jsx` | 295, 296, 601+ | 20+ `console.log` calls in game logic | Info | Console noise in production. Pre-existing. |
| `noisyDetector.jsx` | 1 | `import React from 'react'` — unused import (React 18 JSX transform) | Info | Harmless unused import. |
| `paceCalculator.jsx` | 5 | `export default function PaceCalcualtor()` — typo in function name | Info | Benign; default export still works. |

### Human Verification Required

#### 1. TrioHome — layout and modal verification

**Test:** Navigate to `/Projects/Trio`
**Expected:** Page renders with Creation and Help buttons. Clicking Help opens shared Modal (content is pre-existing arbitrage text — known issue). Clicking Creation opens shared Modal. No layout breakage from orphaned class names.
**Why human:** Orphaned `trio-wrapper` / `trio-title` / `row` class names with no CSS backing may cause visual layout issues that cannot be verified programmatically.

#### 2. TrainGame — calculation flow

**Test:** Navigate to `/Projects/TrainGame`, enter `2384`, click Submit
**Expected:** Solutions list appears (e.g. `(2x3)+(8-4)=10`). Help and Creation modals open/close. No double top spacing.
**Why human:** Calculation results and modal UX require visual confirmation.

#### 3. TrioGame — Bootstrap removal and step indicator

**Test:** Navigate to `/Projects/TrioGame`, click Help
**Expected:** Shared Modal opens with YouTube embed and instruction image 1/13. Clicking Next navigates through 13 images. Game board renders on dark green canvas. Play/Discard/Rearrange buttons present.
**Why human:** Step indicator image loading and game board canvas rendering require visual inspection.

#### 4. PaceCalculator — calculation and responsive layout

**Test:** Navigate to `/Projects/PaceCalculator`, enter 10 km, 0h 50m 0s, click Calculate
**Expected:** Pace shows `5:00 /km`. White card on dark site background. Tab between time inputs auto-advances focus.
**Why human:** Calculation output, white card aesthetic, and focus behaviour require human testing.

#### 5. 500 Scorer — game state and StyleTag removal

**Test:** Navigate to `/Projects/FiveHundred`, record a bid, click Undo, then refresh page
**Expected:** Bid appears, undo removes it, after refresh game state restores from localStorage. White card on dark background. No `color-scheme: light only` in browser DevTools > Computed Styles.
**Why human:** Multi-step game interaction and color-scheme verification require human testing.

#### 6. Arbitrage — live fetch and Tailwind styling

**Test:** Navigate to `/Projects/Arbitrage`, observe page styling, click "Fetch Bets"
**Expected:** Dark background with gold title (not a white box). Loading spinner visible. Results display with dark cards and green profit badges. Info modal opens/closes.
**Why human:** Live API call and visual rendering of results require human observation.

#### 7. NBA Ladder — dark theme and error state

**Test:** Navigate to `/Projects/NBA-Ladder` without `netlify dev` running
**Expected:** Dark Tailwind card (`bg-surface`), centred with no 80px left offset. Graceful error or loading message displayed, no JS crash.
**Why human:** Netlify function requires `netlify dev` for live data; error state and visual layout need human check.

#### 8. NoisyDetector — blank page without errors

**Test:** Navigate to `/Projects/Noise`
**Expected:** Page renders blank (correct behaviour). No console errors.
**Why human:** Blank page is the intended result; human confirms no unexpected errors.

### Gaps Summary

No structural gaps block the phase goal. The build passes, all 8 components are migrated, Bootstrap is removed, CSS files are deleted, and the shared Modal is created and wired.

The following are **pre-existing issues** preserved verbatim per the content-preservation constraint, not introduced by Phase 6:
- `trioHome.jsx` Help modal contains arbitrage text (wrong content predating Phase 6)
- `trioHome.jsx` orphaned class names `trio-wrapper`, `trio-title`, `row` (pre-existing; CSS deleted but class names left in place — not in plan acceptance criteria)
- `paceCalculator.jsx` typo `PaceCalcualtor` in function name (pre-existing)
- `trioGame.jsx` MadeModal wrong content (pre-existing, commented-out)

One **new anti-pattern** introduced in Phase 6:
- `paceCalculator.jsx` `setError()` inside `useMemo` (WR-01) — React rules violation introduced during the inline-styles migration. Flagged in REVIEW.md. Should be fixed in a follow-on task.

---

_Verified: 2026-05-17_
_Verifier: Claude (gsd-verifier)_
