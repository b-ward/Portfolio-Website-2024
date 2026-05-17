---
phase: 06-mini-projects
reviewed: 2026-05-17T00:00:00Z
depth: standard
files_reviewed: 10
files_reviewed_list:
  - src/components/Shared/Modal.jsx
  - src/components/Projects/TrainGame/trainGame.jsx
  - src/components/Projects/Trio/trioHome.jsx
  - src/components/Projects/NoisyDetector/noisyDetector.jsx
  - src/components/Projects/Arbitrage/arbitrage.jsx
  - src/components/Projects/NBA-Ladder/NBA-Ladder.jsx
  - src/components/Projects/PaceCalculator/paceCalculator.jsx
  - src/components/Projects/500/500.jsx
  - src/components/Projects/Trio/trioGame.jsx
  - src/components/Projects/Trio/trioGame.css
findings:
  critical: 0
  warning: 6
  info: 9
  total: 15
status: issues_found
---

# Phase 6: Code Review Report

**Reviewed:** 2026-05-17
**Depth:** standard
**Files Reviewed:** 10
**Status:** issues_found

## Summary

All ten files were reviewed. No critical security vulnerabilities or data-loss risks were found. Bootstrap has been fully removed across all reviewed components. Tailwind CSS is applied consistently throughout, and all calculation logic has been correctly preserved.

Six warnings were found, the most notable being a side-effect call to `setError` inside a `useMemo` callback in `paceCalculator.jsx` (React rules violation that can cause unexpected behaviour), an infinite-loop risk in `trioGame.jsx`'s `CPU_turn` while loop, and wrong modal content copy-pasted into `trioHome.jsx` and `trioGame.jsx`. Nine informational items cover dead code, `console.log` debug statements left in production, and minor quality issues.

---

## Warnings

### WR-01: `setError` called inside `useMemo` — React rules violation

**File:** `src/components/Projects/PaceCalculator/paceCalculator.jsx:53`
**Issue:** `setError("")` is called as a side-effect inside `useMemo`. React's rules of hooks prohibit state updates inside `useMemo`; this will trigger a warning in StrictMode and can cause render loops or stale state because the memo runs during render but the state setter schedules another render.
**Fix:** Remove the `setError("")` from the `useMemo` body. Error clearing already happens inside `onCalculate` and `onReset`. If the computed result should also clear the error, derive that in the same location where `calc` is consumed or handle it in `onCalculate`:
```js
// Remove this line from inside useMemo:
// setError("");

// The existing onCalculate already calls setError("") when input is valid.
// If you want error to clear automatically as user types valid values,
// add a useEffect that watches [distance, seconds]:
useEffect(() => {
  if (distance && seconds && seconds > 0) setError("");
}, [distance, seconds]);
```

---

### WR-02: Infinite loop risk in `CPU_turn` — while loop never terminates if deck runs out

**File:** `src/components/Projects/Trio/trioGame.jsx:608`
**Issue:** The `while (pile_decision === true)` loop iterates through `this.state.CPU_hand` looking for a matching card. The loop body only sets `pile_decision = false` inside a block that runs when `card_check_counter === this.state.CPU_hand.length - 1`. However, `card_check_counter` is incremented at line 685 _inside_ the outer while loop, not inside the if-block at line 611, meaning the counter increments even when no exit condition is met. If `this.state.deck` is empty (deck exhausted), `this.state.deck[0]` is `undefined`, and comparisons like `this.state.deck[0][0]` will throw `TypeError: Cannot read properties of undefined`. This would crash the component mid-game when the draw pile runs low.
**Fix:** Add a deck-empty guard at the top of `CPU_turn`:
```js
CPU_turn() {
  if (this.state.game_over === false) {
    if (this.state.deck.length < 2) {
      // Deck exhausted — handle gracefully (e.g., reshuffle discard pile or end game)
      window.alert('The deck is empty!');
      this.state.game_over = true;
      return;
    }
    // ... rest of CPU_turn
  }
}
```

---

### WR-03: Wrong modal content in `trioHome.jsx` — arbitrage text shown for Trio

**File:** `src/components/Projects/Trio/trioHome.jsx:39-66`
**Issue:** The Help modal in `TrioHome` renders arbitrage betting instructions (text about "The odds API", "betting odds", "lay betting", etc.), not Trio card-game instructions. The content is the wrong copy and will mislead users of the Trio page.
**Fix:** Replace the modal body with the actual Trio help text, or leave a clear placeholder:
```jsx
<Modal title="Help" onClose={() => setHelpModalShow(false)}>
  <p>Trio is a card game. [Add correct Trio rules here.]</p>
</Modal>
```

---

### WR-04: Wrong modal content in `trioGame.jsx` — `MadeModal` has arbitrage copy

**File:** `src/components/Projects/Trio/trioGame.jsx:46-68`
**Issue:** The `MadeModal` component (lines 46–68) contains the arbitrage betting backstory ("During the COVID-19 lockdown… I stumbled across this YouTube video that explained the arbitrage process"), not the story of how the Trio card game was built. The component also has a comment `/*Needs to be updated*/` at line 44 acknowledging this is stale content.

Additionally, the `MadeModal` is commented out in the render method at lines 1072–1075, so it is currently unreachable dead code. The "Creation" button at line 985 therefore has no visible effect.

**Fix:** Either write correct Trio creation content and uncomment the `MadeModal` in render, or remove the dead component entirely until the content is ready.

---

### WR-05: Direct `this.state` mutation throughout `trioGame.jsx`

**File:** `src/components/Projects/Trio/trioGame.jsx:243,256,259,284,287,299,345,355,360,370` (representative lines)
**Issue:** Many methods mutate `this.state` directly (e.g. `this.state.pile_card_to_get = …`, `this.state.deck = this.shuffle(…)`, `this.state.hand.push(…)`) rather than using `this.setState()`. Direct state mutation bypasses React's change detection, meaning renders triggered by these mutations are unpredictable and dependent on other `setState` calls happening to flush at the right time. This is flagged because it is the root cause of several known game glitches (acknowledged in the TODO comment at line 73).

This is pre-existing code and is intentionally kept as a class component per project constraints, but the mutation pattern is the primary source of game bugs and should be tracked for a future refactor.

**Fix (near-term):** At minimum, key state transitions (pick-up, discard, CPU turn completion) should use `this.setState({...})`. The `componentDidMount` initialisation at lines 256–276 is the most impactful place to fix first since it mutates `deck`, `hand`, and `CPU_hand` before any React render has occurred.

---

### WR-06: `trioHome.jsx` still uses non-Tailwind layout constructs and `window.location.href` navigation

**File:** `src/components/Projects/Trio/trioHome.jsx:9-33`
**Issue:** The component wrapper uses `className="trio-wrapper"` (line 9), which requires a CSS class that no longer exists (its CSS file was intentionally deleted in Phase 6). It also uses raw `className="row"` (line 10) — a Bootstrap grid class — that has no Tailwind equivalent applied. Both classes will silently produce no styling. Additionally, `window.location.href='TrioGame'` (line 27) and `window.location.href='TrioInstructions'` (line 31) perform full-page navigations that bypass React Router, causing full page reloads instead of client-side transitions.
**Fix:** Replace the wrapper class with Tailwind (`className="relative w-full"` or similar), remove `className="row"`, and replace `window.location.href` with `useNavigate` from `react-router-dom`:
```jsx
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
// ...
<div onClick={() => navigate('/TrioGame')}>
```

---

## Info

### IN-01: `noisyDetector.jsx` is a stub — component does nothing

**File:** `src/components/Projects/NoisyDetector/noisyDetector.jsx:1-7`
**Issue:** The component renders an empty `<div />`. If it is linked from the navigation, users will see a blank page. The `import React from 'react'` is also an unused import in React 18 (JSX transform no longer requires it).
**Fix:** Either implement the component or add a visible placeholder. Remove the unused React import:
```jsx
const NoisyDetector = () => <div className="p-8 text-white">Coming soon.</div>;
```

---

### IN-02: `console.log` debug statements left in `trioGame.jsx`

**File:** `src/components/Projects/Trio/trioGame.jsx:295,296,601,602,687,700,701,722,724,726,731,732,739,745,750,752,808,818,903,905,906,921`
**Issue:** Numerous `console.log` calls remain throughout the game logic (CPU turn, find trio, etc.), including logging full hand arrays. These produce high-frequency noise in the browser console and expose internal game state during production play.
**Fix:** Remove all `console.log` calls or replace with a debug flag guard:
```js
const DEBUG = false;
if (DEBUG) console.log('CPU START', this.state.CPU_hand);
```

---

### IN-03: `console.log` calls in `pick_up_pile`

**File:** `src/components/Projects/Trio/trioGame.jsx:295-296`
**Issue:** `console.log(this.state.hand)` and `console.log(this.state.deck)` are called every time the player picks up from the pile.
**Fix:** Remove these two debug statements.

---

### IN-04: Typo in `arbitrage.jsx` import — `arbitrageCalcutations`

**File:** `src/components/Projects/Arbitrage/arbitrage.jsx:3`
**Issue:** The import path is `'./arbitrageCalcutations'` (missing an 'l' — should be `arbitrageCalculations`). This works only because the file on disk is presumably also misnamed. If the file is ever renamed to fix the typo, the import will break.
**Fix:** Verify the filename on disk and correct both the filename and the import consistently:
```js
import getArbitrageBets from './arbitrageCalculations'
```

---

### IN-05: `trainGame.jsx` — JSX nodes built imperatively inside `validateAndSubmit`

**File:** `src/components/Projects/TrainGame/trainGame.jsx:21-29`
**Issue:** `validateAndSubmit` builds an array of JSX elements (`solutionRows`) by pushing `<h3>` and `<div>` nodes into a mutable array and storing them in state. Storing JSX in state is an anti-pattern — it makes testing and serialisation impossible and tightly couples state to rendering. The index `i` used as `key` is also fragile if the list can be re-ordered (it cannot here, but it is a subtle smell).
**Fix:** Store the raw `solutions` array from `getSolutions` in state and render JSX in the component return:
```jsx
const [solutions, setSolutions] = useState([]);
// In validateAndSubmit:
setSolutions(getSolutions(num)); // store raw strings, not JSX

// In render:
{solutions.length > 0
  ? <><h3>Solutions</h3>{solutions.map((s, i) => <div key={i}>{s}</div>)}</>
  : hasSolved && <h3>No Solutions Found</h3>}
```

---

### IN-06: `paceCalculator.jsx` — exported function name has typo (`PaceCalcualtor`)

**File:** `src/components/Projects/PaceCalculator/paceCalculator.jsx:5`
**Issue:** The function is named `PaceCalcualtor` (transposed 'u' and 'a'). This is benign as long as all import sites use the default export, but it makes the codebase inconsistent and will cause confusion if anyone imports by name.
**Fix:**
```js
export default function PaceCalculator() {
```

---

### IN-07: `500.jsx` — `usePersistentState` swallows `localStorage.setItem` errors silently

**File:** `src/components/Projects/500/500.jsx:41-45`
**Issue:** The `useEffect` that persists state to `localStorage` has an empty `catch {}` block. If storage is full (QuotaExceededError) or in a private-browsing context, the failure is silent and the user's game state is lost with no feedback.
**Fix:** At minimum log the error:
```js
} catch (e) {
  console.warn('Failed to persist game state:', e);
}
```

---

### IN-08: `trioHome.jsx` — image paths use relative `../Trio/Images/` which may not resolve correctly from the public directory

**File:** `src/components/Projects/Trio/trioHome.jsx:26-33`
**Issue:** Image `src` values use relative paths like `'../Trio/Images/background.png'` and `'../Trio/Images/card_back.png'`. In a Vite-built SPA these paths are resolved relative to the HTML file's URL at runtime, not the JSX file's location. If the assets are in `public/`, the correct path is `/Trio/Images/background.png` (absolute from root). The same pattern exists in `trioGame.jsx` throughout.
**Fix:** Use absolute paths from the public root:
```jsx
<img src="/Trio/Images/background.png" ... />
```

---

### IN-09: `trioGame.jsx` — `add_to_CPU_trio_2` button incorrectly positioned (`left: 950px`) places it at the same horizontal position as `add_to_player_trio_2`

**File:** `src/components/Projects/Trio/trioGame.css:476`
**Issue:** `#add_to_CPU_trio_2` has `left: 950px` and `#add_to_player_trio_2` also has `left: 950px` (line 458). The two orange "add" buttons overlap horizontally, differing only in their `top` value (140px vs 350px). This appears intentional given the two-row layout, but it means they are directly above each other with no visual label distinguishing them. This is a pre-existing CSS design issue, not introduced in Phase 6.
**Fix:** No action required in this phase, but worth tracking as a UX improvement.

---

_Reviewed: 2026-05-17_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
