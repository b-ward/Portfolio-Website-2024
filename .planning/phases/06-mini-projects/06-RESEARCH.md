# Phase 6: Mini-Projects - Research

**Researched:** 2026-05-17
**Domain:** React component migration — Bootstrap removal, Tailwind CSS adoption, class-to-functional conversion
**Confidence:** HIGH (all source files read directly)

---

## Summary

Phase 6 migrates 8 files across 7 project routes from Bootstrap/custom CSS to Tailwind CSS. Every source file has been read in full. The findings below are derived entirely from the actual codebase, not from assumptions.

The 8 files split into three tiers of effort:

1. **CSS-only migration** (already functional, no Bootstrap in JSX): Arbitrage, NBALadder. Arbitrage has 429 lines of custom CSS classes to replace inline; NBALadder has 105 lines of CSS including a light-mode colour palette that must be flipped to dark.

2. **Inline-styles migration** (no CSS file, no Bootstrap): PaceCalculator, 500 Scorer. Both use a large `styles` object and `COLORS` constant that become Tailwind inline classes. 500 Scorer also has a custom `Modal` and an injected `<StyleTag>` that forces `color-scheme: light only` — this must be removed.

3. **Bootstrap removal + class-to-functional conversion**: TrainGame, TrioHome, NoisyDetector. These import `{Modal, Button}` from `react-bootstrap`. The stub in `vite.config.js` currently passes all children through as a Fragment, so these components render without crashing but the modals and buttons are unstyled/broken. Conversion to functional components required.

4. **Bootstrap removal, stay class component**: TrioGame (1090 lines). Imports `{Modal, Button, Carousel}` from `react-bootstrap`. The class structure, `this.state`, `this.setState`, and all lifecycle methods must remain intact. Only the Bootstrap JSX imports and `trioGame.css` are in scope.

**Primary recommendation:** Create a shared `src/components/Shared/Modal.jsx` first (Wave 1, Task 1). All three modal-using components (TrainGame, TrioHome, TrioGame) import from this single source. Then migrate each tool in its own task. The `src/components/Shared/` directory already exists (contains `card.jsx`).

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Replace Bootstrap `Modal`/`Button` with a custom Tailwind modal — `fixed inset-0 bg-black/50 flex items-center justify-center z-50` backdrop with centred content panel. Applies to TrainGame, TrioHome, TrioGame.
- **D-02:** Bootstrap `Carousel` in TrioGame → replace with a simple step indicator or slide wrapper (no library). Game flow is already state-driven.
- **D-03:** Leave TrioGame as a class component. Only replace Bootstrap imports and migrate CSS. Do NOT convert to functional.
- **D-04:** TrioGame's `Modal`, `Button`, `Carousel` imports replaced with custom Tailwind modal and plain `<button>` elements. `this.state`, `this.setState`, lifecycle methods stay untouched.
- **D-05:** TrainGame — convert class to functional, replace Bootstrap Modal with custom Tailwind modal, delete `trainGame.css`.
- **D-06:** TrioHome — convert class to functional, replace Bootstrap Modal with custom Tailwind modal, delete `trioHome.css`.
- **D-07:** NoisyDetector — convert class to functional, remove all commented-out Bootstrap modal blocks (dead code), migrate `noisyDetector.css` to Tailwind, delete CSS file.
- **D-08:** Arbitrage — already functional, no Bootstrap. Full Tailwind rewrite: replace all `arb-*` CSS classes with inline Tailwind utilities. Delete `arbitrage.css` (429 lines).
- **D-09:** NBALadder — already functional. Migrate `nbaLadder.css` to Tailwind inline, delete CSS file. Preserve `/.netlify/functions/standings` API call exactly.
- **D-10:** PaceCalculator — already functional with inline styles. Replace inline `styles` object with Tailwind classes. No CSS file to delete.
- **D-11:** 500 Scorer — already functional. Replace hardcoded `COLORS` object and inline styles with Tailwind utilities. No CSS file to delete.
- **D-12:** All tools use `mt-0` — `App.jsx <main className="pt-14">` already clears the toolbar. No `mt-14` on tool wrappers.
- **D-13:** Dark background: `bg-bg` or no background class (inherits from `bg-surface` body).
- **D-14:** Gold accent (`text-accent`) for headings/titles; white for body text.
- **D-15:** Delete all per-component CSS files after Tailwind migration.

### Claude's Discretion

- Exact Tailwind classes for button styles within each tool (starting point: `bg-accent text-black font-semibold px-4 py-2 rounded`)
- Custom Tailwind modal exact structure
- Whether PaceCalculator or 500 Scorer need layout wrapper adjustments for mobile

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TOOL-01 | Arbitrage calculator renders and all calculations function correctly | Arbitrage is already functional. Migration is CSS class replacement only. `getArbitrageBets` import from `./arbitrageCalcutations` (note typo in filename) is preserved verbatim. |
| TOOL-02 | Trio game renders and all game interactions (cards, scoring, win/lose states) work correctly | TrioGame stays class component. Bootstrap Modal/Button/Carousel removed. trioGame.css kept structurally (absolute positioning) with colour updates. trioGame-state.jsx is a near-identical second file — planner must decide which is canonical. |
| TOOL-03 | Train game renders and functions correctly | TrainGame converted class→functional. getSolutions import from `./trainGameCalculations` preserved. Bootstrap Modal replaced with shared Tailwind Modal. |
| TOOL-04 | Pace calculator renders and calculates correctly | PaceCalculator already functional. Inline `styles` object replaced with Tailwind classes. All calculation logic untouched. |
| TOOL-05 | 500 card game renders and functions correctly | 500 Scorer already functional. `COLORS` constant and inline styles replaced with Tailwind utilities. `<StyleTag>` forcing `color-scheme: light only` must be removed/replaced to fit dark site theme. `localStorage` persistence preserved. |
| TOOL-06 | Noisy detector renders and functions correctly | NoisyDetector converted class→functional. All commented-out Bootstrap and RNSoundLevel code deleted. Renders empty `<div>` — that is the intended behaviour (tool is a stub). |
| TOOL-07 | NBA Ladder renders and fetches standings data via the Netlify function | NBALadder already functional. CSS migration only. Light-mode colour variables (`var(--text-color, #222)`, `var(--card-background, #fff)`) replaced with dark Tailwind tokens. API_URL `/.netlify/functions/standings` preserved exactly. |
</phase_requirements>

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Game logic (TrainGame, TrioGame, 500) | Browser / Client | — | Runs entirely client-side, no server involvement |
| Arbitrage calculations | Browser / Client | External API | `getArbitrageBets()` calls external odds API from browser |
| NBA Ladder data fetch | Browser / Client | Netlify Function (API gateway) | Fetch goes to `/.netlify/functions/standings` which proxies Sportradar |
| Modal UI | Browser / Client | — | Pure presentational — fixed overlay, no server role |
| PaceCalculator state | Browser / Client | URL params | Uses `window.history.replaceState` to persist state in URL query string |
| 500 Scorer persistence | Browser / Client | localStorage | Saves/restores game state via `localStorage` key `fivehundred-scorer-v1` |
| NoisyDetector | Browser / Client | — | Stub only — renders empty `<div>`, no active logic |

---

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 18.2.0 | Component framework | Already in use |
| Tailwind CSS | 4.3.0 | Utility-first CSS | Phase 1 decision, Vite plugin installed |
| react-router-dom | 7.12.0 | Routing | Already in use; routes in `main.jsx` unchanged |

### Bootstrap Stub (to be eliminated in this phase)
The `vite.config.js` `reactBootstrapStub` plugin intercepts all `import ... from 'react-bootstrap'` calls and returns pass-through Fragment components. This means the app builds without errors but modals and styled buttons are invisible. Phase 6 removes every `react-bootstrap` import, making the stub irrelevant for these 8 files (other files in scope for later phases may still need it).

### No New Dependencies
Phase 6 adds zero new npm packages. Everything is Tailwind utility classes inline.

---

## Architecture Patterns

### System Architecture Diagram

```
User Browser
    |
    v
React Router (main.jsx)
    |
    +-- /Projects/Arbitrage     --> arbitrage.jsx  (fetch -> external odds API)
    +-- /Projects/Trio          --> trioHome.jsx   (navigate to TrioGame)
    +-- /Projects/TrioGame      --> trioGame.jsx   (DOM-manipulated card game)
    +-- /Projects/TrainGame     --> trainGame.jsx  (getSolutions local calc)
    +-- /Projects/PaceCalculator --> paceCalculator.jsx (local calc, URL state)
    +-- /Projects/FiveHundred  --> 500.jsx         (local calc, localStorage)
    +-- /Projects/Noise        --> noisyDetector.jsx (stub, empty div)
    +-- /Projects/NBA-Ladder   --> NBA-Ladder.jsx  (fetch -> /.netlify/functions/standings -> Sportradar)
```

### Shared Component: Modal

Create `src/components/Shared/Modal.jsx` — used by TrainGame, TrioHome, and TrioGame (as HelpModal/MadeModal wrappers).

```jsx
// src/components/Shared/Modal.jsx
export default function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-accent/25 rounded-xl w-full max-w-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 p-4 border-b border-white/10">
          <h3 className="text-accent text-lg font-semibold m-0">{title}</h3>
          <button
            className="text-slate-400 hover:text-white text-2xl leading-none bg-transparent border-none cursor-pointer"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="p-4 max-h-[70vh] overflow-y-auto text-white/80 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
```

### Carousel Replacement for TrioGame HelpModal

The `Carousel` in TrioGame's `HelpModal` shows 13 instruction images (pages 1–13 of a PDF manual) loaded from `../Trio/Instruction_images/Trio - User Manual - N.png`. The decision (D-02) is to replace it with a simple state-driven slide indicator.

Pattern:

```jsx
// Inside HelpModal in trioGame.jsx — replacing <Carousel>
// instructionImages array is built the same way (13 img elements)
// Add a currentSlide state variable (can use useState in the HelpModal function component)
// Since HelpModal is already a function component, useState is available
const [slide, setSlide] = React.useState(0);
// Render current image + prev/next buttons
```

Note: `HelpModal` in trioGame.jsx is already a function component (not a class) even though `TrioGame` is a class. `useState` can be used inside it.

### Functional Component Conversion Pattern (established in Phase 2–5)

```jsx
// BEFORE (class)
class TrainGame extends Component {
  constructor(props) {
    super(props);
    this.state = { number: '', error: '', solutions: '', madeModalShow: false, helpModalShow: false };
    this.onInputChange = this.onInputChange.bind(this);
  }
  onInputChange(event) { this.setState({ [event.target.name]: event.target.value }); }
  render() { ... }
}

// AFTER (functional)
const TrainGame = () => {
  const [number, setNumber] = useState('');
  const [error, setError] = useState('');
  const [solutions, setSolutions] = useState('');
  const [madeModalShow, setMadeModalShow] = useState(false);
  const [helpModalShow, setHelpModalShow] = useState(false);

  function onInputChange(event) { setNumber(event.target.value); }
  ...
};
```

### Anti-Patterns to Avoid

- **Adding `mt-14` to tool wrappers:** `App.jsx <main>` already has `pt-14`. Lesson from Phase 5.
- **`margin-top: 56px` in Tailwind classes:** Same issue — arb-page, trainGame-wrapper, trio-wrapper, nbaLadder all have this in their CSS. Remove it.
- **Light-mode colours on dark site:** nbaLadder.css uses `var(--card-background, #fff)` and `var(--text-color, #222)`. NBALadder will appear as a white box on the dark site until replaced with Tailwind dark tokens.
- **`StyleTag` in 500 Scorer:** The `<StyleTag>` component injects `color-scheme: light only` into the document root. This overrides the site's `color-scheme: dark` set in `index.css`. The tag must be removed.
- **Mutating `this.state` directly (TrioGame):** `trioGame.jsx` has extensive direct mutation of state arrays (`this.state.hand.push(...)`, `this.state.deck.splice(...)`). This is intentional legacy code — do NOT convert to immutable patterns. Leave all mutations intact; only replace Bootstrap.
- **`trioGame-state.jsx` confusion:** Both `trioGame.jsx` and `trioGame-state.jsx` exist and are nearly identical. `trioGame-state.jsx` was an incremental setState refactor attempt. The router imports `trioGame.jsx` (not the state file). Apply changes only to `trioGame.jsx`.

---

## Per-Component Migration Guide

### 1. Arbitrage (`arbitrage.jsx` + `arbitrage.css`)

**Type:** Functional — CSS class replacement only

**Bootstrap imports:** None. No Bootstrap in this file.

**CSS classes used in JSX (all in `arbitrage.css`, all to be replaced inline):**

| CSS class | Where used | Tailwind equivalent |
|-----------|-----------|---------------------|
| `arb-page` | root div | `min-h-screen p-5 text-white` (drop `margin-top: 56px`) |
| `arb-header` | header div | `flex items-center justify-between gap-4 mb-5` |
| `arb-title` | h1 | `text-accent text-2xl font-semibold text-center flex-1 m-0` |
| `arb-header-actions` | button wrapper div | `flex-none` |
| `arb-link-button` | Creation/Help buttons | `bg-transparent border border-accent/50 text-accent rounded-lg px-3.5 py-1.5 text-sm font-semibold cursor-pointer hover:bg-accent/10 hover:border-accent` |
| `arb-controls` | fetch button wrapper | `text-center mb-6` |
| `arb-fetch-button` | main fetch button | `border border-accent bg-accent text-black rounded-lg px-5 py-2.5 text-base font-bold cursor-pointer disabled:opacity-65 disabled:cursor-not-allowed` |
| `arb-loading-state` | loading span | `inline-flex items-center gap-2` |
| `arb-spinner` | spinner span | `w-3.5 h-3.5 rounded-full border-2 border-black/35 border-t-black animate-spin` |
| `arb-loading-hint` | loading hint p | `mt-3 mx-auto max-w-[480px] text-slate-400 text-sm` |
| `arb-error` | error p | `text-red-400 bg-red-400/10 border border-red-400/35 rounded-lg px-4 py-3 mb-4` |
| `arb-results` | results wrapper | `max-w-[900px] mx-auto` |
| `arb-diagnostics` | diagnostics div | `mb-3 text-slate-400 text-sm bg-slate-400/8 border border-slate-400/25 rounded-lg px-3 py-2` |
| `arb-tabs` | tabs div | `flex border-b-2 border-accent/25 mb-5` |
| `arb-tab` | tab buttons | `bg-transparent border-0 border-b-2 border-transparent -mb-0.5 px-5 py-2.5 text-slate-400 text-base font-semibold cursor-pointer flex items-center gap-2 hover:text-accent` |
| `arb-tab--active` | active tab modifier | `text-accent border-b-accent` |
| `arb-tab-count` | count badge span | `bg-accent/15 text-accent rounded-full px-2 py-0.5 text-xs font-bold` |
| `arb-tab-content` | content wrapper | `flex flex-col gap-4` |
| `arb-empty` | empty state p | `text-slate-500 text-center py-8` |
| `arb-card` | card container | `border border-white/10 rounded-xl p-4` |
| `arb-card--arb` | arb card modifier | `border-green-400/25` |
| `arb-card--lay` | lay card modifier | `border-blue-400/25` |
| `arb-card-header` | card header div | `flex items-center justify-between gap-3 mb-2 flex-wrap` |
| `arb-card-time` | time span | `text-slate-500 text-xs` |
| `arb-card-title` | h4 | `m-0 mb-3 text-white text-base` |
| `arb-badge` | badge span | `rounded-full px-2.5 py-0.5 text-xs font-bold` |
| `arb-badge--profit` | profit badge | `bg-green-400/15 text-green-400 border border-green-400/30` |
| `arb-badge--lay` | lay badge | `bg-blue-400/15 text-blue-400 border border-blue-400/30` |
| `arb-badge--diff` | diff badge | `bg-yellow-400/15 text-yellow-400 border border-yellow-400/30 inline-block` |
| `arb-card-margin` | margin row div | `flex items-center gap-2 mb-3 text-slate-400 text-sm` |
| `arb-margin-bar` | margin bar span | `flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden` |
| `arb-margin-fill` | margin fill span | `block h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full` |
| `arb-table` | table | `w-full border-collapse text-sm` |
| `arb-odds` | odds td/td | `text-accent font-bold` |
| `arb-bet` | bet amount td | `text-green-400 font-semibold` |
| `arb-lay-grid` | lay grid | `grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-2` |
| `arb-lay-row` | lay row | `flex flex-col gap-0.5` |
| `arb-lay-label` | label span | `text-slate-500 text-xs uppercase tracking-wider font-semibold` |
| `arb-lay-value` | value span | `text-slate-200 text-base` |
| `arb-modal-backdrop` | backdrop div | Use shared `Modal` component |
| `arb-modal` / `arb-modal-header` / etc. | modal internals | Use shared `Modal` component |

**Mobile breakpoint (@media max-width: 640px):** The CSS has a mobile override for `arb-page` (padding change), `arb-title` (font size), `arb-header` (flex-wrap), and `arb-table` cell padding. Use Tailwind responsive prefixes (`sm:`) inline.

**Action:** Remove `import './arbitrage.css'`. Replace all `className="arb-*"` values with Tailwind inline equivalents. The `InfoModal` component should use the shared `Modal` component.

---

### 2. TrainGame (`trainGame.jsx` + `trainGame.css`)

**Type:** Class → Functional conversion + Bootstrap removal

**Bootstrap imports:** `import {Modal, Button} from 'react-bootstrap'`

**Bootstrap usages in JSX:**
- `<Button className="made-button" variant="primary" onClick=...>Creation</Button>` (line 132)
- `<Button className="help-button" variant="primary" onClick=...>Help</Button>` (line 140)
- `<Button style={{marginTop: '-3px'}} onClick=...>Submit</Button>` (line 147)
- `<HelpModal show={...} onHide={...} />` — HelpModal is a function component using `<Modal>`, `<Modal.Header>`, `<Modal.Title>`, `<Modal.Body>`
- `<MadeModal show={...} onHide={...} />` — same Bootstrap modal pattern; body contains two `<img>` with `className="app-image"` (defined in trainGame.css as `width: 50%`)

**CSS classes in trainGame.css:**
| CSS class | Where used | Replacement |
|-----------|-----------|-------------|
| `trainGame-wrapper` | root div | `text-center text-accent min-h-screen` (drop `margin-top: 56px`) |
| `trainGame-title` | title wrapper div | `pb-2 w-3/5 mx-auto` |
| `solutions` | solutions div | `pt-2 pb-40` |
| `error` | error div | `pt-2 text-red-500` |
| `app-image` | img in MadeModal | `w-1/2` |

**Inline styles to remove:**
- `style={{width: '100%', margin: 'auto'}}` on the row div
- `style={{position: "absolute", left: "40%"}}` on Creation button wrapper
- `style={{width: '100%'}}` on inner div
- `style={{position: "absolute", right: "40%"}}` on Help button wrapper
- `style={{height: '33px'}}` on input
- `style={{marginTop: '-3px'}}` on Submit button

**State variables:** `number`, `error`, `solutions` (array of React elements), `madeModalShow`, `helpModalShow`
**Logic to preserve:** `onInputChange`, `validateAndSubmit` (calls `getSolutions(number)` from `./trainGameCalculations`)
**Import:** `import getSolutions from './trainGameCalculations'` — preserved verbatim

**Layout after conversion:** Header row with Creation button left, title center, Help button right. Below: text input + Submit button row. Error div. Solutions div.

---

### 3. PaceCalculator (`paceCalculator.jsx`)

**Type:** Functional — inline style object replacement only. No CSS file.

**Bootstrap imports:** None.

**Inline style object (`styles`) — key mappings:**
| Style key | Current value | Tailwind replacement |
|-----------|--------------|---------------------|
| `styles.wrap` | `display:grid, placeItems:center, padding:2rem 1rem, background:#333134` | `grid place-items-center p-8 px-4 w-full bg-surface` (or just inherit) |
| `styles.card` | white panel, border, radius 16, maxWidth 760 | `bg-white border border-gray-200 rounded-2xl max-w-[760px] w-full shadow-lg` |
| `styles.header` | padding | `px-5 pt-5 pb-3` |
| `styles.h2` | clamp font | `m-0 text-2xl font-semibold` |
| `styles.muted` | slate-500 | `mt-1.5 text-slate-500` |
| `styles.content` | grid gap | `px-5 pb-5 grid gap-4` |
| `styles.row` | grid gap | `grid gap-2` |
| `styles.label` | font-weight 600 | `font-semibold text-sm` |
| `styles.input` | bg white, border, rounded, padding | `bg-white text-inherit border border-gray-200 rounded-xl p-3.5 text-base outline-none w-full` |
| `styles.chips` | flex gap wrap | `flex gap-2 flex-wrap items-center` |
| `styles.chip` | inline-flex, border, rounded-full | `inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full cursor-pointer select-none` |
| `styles.chipChecked` | blue border + shadow | `border-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.2)]` |
| `styles.primaryBtn` | bg accent blue | `bg-blue-600 text-white border-0 rounded-xl p-3.5 text-base font-bold cursor-pointer` |
| `styles.secondaryBtn` | transparent + border | `bg-transparent border border-gray-200 rounded-xl p-3.5 text-base font-bold cursor-pointer` |
| `styles.divider` | 1px line | `h-px bg-gray-200 my-1` |
| `styles.result` | grid gap, padding | `px-5 pb-5 pt-3 grid gap-2` |
| `styles.pace` | clamp big font bold | `text-5xl font-extrabold` |
| `styles.paceSup` | sup styling | `text-[55%] text-slate-500 font-bold ml-1` |
| `styles.detail` | slate-500 | `text-slate-500` |
| `styles.error` | red-600 | `text-red-600 font-semibold` |

**Note:** PaceCalculator uses `var(--bg, #333134)` and `var(--text, #0f172a)` CSS variables. The card itself is intentionally light (white card on dark background). Do not dark-mode the card interior — it was designed as a white card with dark text.

**Responsive logic:** The `isSmall` state and `inlineRowStyle`/`actionsStyle` computed values handle mobile. These can be removed in favour of Tailwind `sm:` responsive classes.

**Special concern:** `autoAdvance` function uses `nextRef.current.focus()` for auto-tabbing between time inputs. This is DOM ref usage — preserve via `React.useRef`.

---

### 4. 500 Scorer (`500.jsx`)

**Type:** Functional — `COLORS` constant + inline style object replacement. No CSS file.

**Bootstrap imports:** None.

**Critical issues found:**
1. `<StyleTag>` component injects `:root { color-scheme: light only; }` via a `<style>` tag. This overrides the dark site's `color-scheme: dark`. Must be deleted — do not include a `StyleTag` in the migrated version.
2. The 500 Scorer is a **light-themed** UI by design (white cards, black text, yellow border). After removing `StyleTag`, the site's global `color: rgba(255,255,255,0.87)` from `index.css` will bleed in. The card elements explicitly set `color: COLORS.ink` (`#000000`). This explicit colour must be preserved via Tailwind's `text-black`.

**`COLORS` constant mapping to Tailwind:**
| COLORS key | Value | Tailwind |
|-----------|-------|----------|
| `COLORS.primary` | `#fcc001` | `accent` token (`#ffc200`) is close; use `border-accent bg-accent` |
| `COLORS.primaryDark` | `#b48700` | No exact token — use `border-yellow-600` or keep as inline |
| `COLORS.surface` | `#ffffff` | `bg-white` |
| `COLORS.ink` | `#000000` | `text-black` |
| `COLORS.backdrop` | `#333134` | `bg-surface` |
| `COLORS.success` | `#16a34a` | `bg-green-600 text-white` |
| `COLORS.danger` | `#dc2626` | `bg-red-600 text-white` |
| `COLORS.selectedFill` | `#ffef9c` | `bg-yellow-100` |

**Inline `Modal` component inside 500.jsx:** Already a custom Tailwind-style modal (not Bootstrap). Uses `styles.modalBackdrop` and `styles.modal`. Migrate to shared `Modal` component or replace inline classes directly — either is acceptable per Claude's discretion.

**`usePersistentState` hook:** Uses `localStorage.getItem/setItem('fivehundred-scorer-v1')`. Preserve this exactly.

**`useSmallScreen` hook:** Breakpoint at 520px. Keep logic but replace computed style objects with Tailwind `sm:` classes.

---

### 5. NoisyDetector (`noisyDetector.jsx` + `noisyDetector.css`)

**Type:** Class → Functional conversion (trivial — very little active code)

**Bootstrap imports:** Commented out: `// import {Modal, Button} from 'react-bootstrap'`
**ReactNative import:** Commented out: `// import RNSoundLevel from 'react-native-sound-level'`

**Current render:** Returns `<div></div>` — an empty div. The entire UI is commented out.

**Class state:** `number`, `error`, `solutions`, `madeModalShow`, `helpModalShow` — none of these are used in the active render.

**Lifecycle methods:** `componentDidMount` and `componentWillUnmount` — both bodies are commented out. They can be removed.

**CSS in `noisyDetector.css`:**
| Rule | Used by | Status |
|------|---------|--------|
| `.noisy-wrapper` | Commented-out JSX | Dead code |
| `.noisy-title` | Commented-out JSX | Dead code |
| `#noisy-image` | Commented-out JSX | Dead code |
| `.solutions` | Commented-out JSX | Dead code |
| `.error` | Commented-out JSX | Dead code |
| `.app-image` | Commented-out JSX | Dead code |

**Action:** Convert to trivial functional component. Remove all commented blocks. The active render is just `return <div />;` (or a minimal placeholder). Delete `noisyDetector.css`.

```jsx
import React from 'react';

const NoisyDetector = () => {
  return <div />;
};

export default NoisyDetector;
```

---

### 6. NBALadder (`NBA-Ladder.jsx` + `nbaLadder.css`)

**Type:** Functional — CSS class replacement only

**Bootstrap imports:** None.

**API integration (must not change):**
```js
const API_URL = '/.netlify/functions/standings'
// ...
const res = await fetch(API_URL)
```

**CSS classes in JSX:**
| CSS class | Where used | Notes |
|-----------|-----------|-------|
| `nba-ladder card` | root div | Two classes: `nba-ladder` + Bootstrap's `card` class — the `card` is from Bootstrap legacy |
| `nba-header` | header div | flex, space-between |
| `conf-tabs` | tabs wrapper | flex gap-2 |
| `conf-tab` | conference tab button | border, cursor-pointer |
| `conf-tab active` | active tab modifier | background accent |
| `table-wrap` | table container | overflow-x-auto |
| `nba-table` | table | full width |
| `nba-loading` | loading div | padding, muted |
| `nba-error` | error div | padding, muted |
| `nba-empty` | empty div | padding, muted |
| `team-name` | td | overflow ellipsis |
| `team-w`, `team-l`, `team-pct` | td | text-right, padding-right, fixed width |

**Colour issues:** The CSS uses light-mode colours: `var(--text-color, #222)`, `var(--card-background, #fff)`, `var(--muted-color, #374151)`, `var(--heading-color, #1f2937)`. These must be replaced with dark equivalents. The `.nba-ladder` rule has `margin: 18px 18px 18px 80px` — this large left margin (designed to avoid the sidebar) must be changed to standard spacing since the navbar is top-mounted.

**`card` class:** The root div has `className="nba-ladder card"`. The `card` is a Bootstrap utility class that adds a white background and border. Remove it — the Tailwind styles will supply background/border directly.

---

### 7. TrioHome (`trioHome.jsx` + `trioHome.css`)

**Type:** Class → Functional conversion + Bootstrap removal

**Bootstrap imports:** `import {Modal, Button} from 'react-bootstrap'`

**Bootstrap usages in JSX:**
- `<Button className="made-button" variant="primary" onClick=...>Creation</Button>` (line 122)
- `<Button className="help-button" variant="primary" onClick=...>Help</Button>` (line 129)
- `<HelpModal show={...} onHide={...} />` — modal with arbitrage help content (WRONG content — it's the arbitrage help text, not Trio help; this is a copy-paste error in the original code, preserve it verbatim)
- `<MadeModal show={...} onHide={...} />` — modal with arbitrage made-by content (same copy-paste error, preserve verbatim)

**DOM manipulation methods (to be removed):**
- `onMouseOverCard(cardName)` — calls `document.getElementById(cardName).style.*` — this violates QUAL-01. The method is already assigned to `onMouseOver` in the JSX but the card interactive overlay is essentially not functional due to absolute image positioning. These event handlers can be removed.
- `onMouseOutCard(cardName)` — same issue, can be removed.

**CSS in `trioHome.css`:**
Most rules are commented out. Active rules:
| Rule | Value | Action |
|------|-------|--------|
| `#play` | `position:absolute, width:100%, height:700px, overflow-x:auto` | This is the background image rule. Preserve via inline style since it's an absolute-positioned game canvas. |
| `#playGame` | absolute, 126x182px, left:300, top:200 | Inline style on `<img id="playGame">` |
| `#instructions` | absolute, 126x182px, left:650, top:200 | Inline style on `<img id="instructions">` |

**JSX issues:**
- Line 137: `<div class="playContainer"` — uses `class` not `className` (a bug). The `onClick` navigates via `window.location.href='TrioGame'` — this should be `useNavigate` from react-router-dom per QUAL-03 intent, but since we're only fixing styling and the rule says preserve content, this is low priority and in Claude's discretion.
- Line 141: Same `class` attribute bug on `instructionContainer`.
- The "TrioInstructions" route (`window.location.href='TrioInstructions'`) does not exist in `main.jsx`. It's a dead link — preserve verbatim (content preservation rule).

**Class state to convert:** `arbitrageBets` (unused), `madeModalShow`, `helpModalShow`, `loadingResults` (unused).

---

### 8. TrioGame (`trioGame.jsx` + `trioGame.css`) — HIGH RISK

**Type:** CSS migration + Bootstrap removal only. **DO NOT convert to functional component.**

**Bootstrap imports:** `import {Modal, Button, Carousel} from 'react-bootstrap'`

**Bootstrap usages in JSX:**
- `<Button className="made-button" variant="primary" onClick=...>Creation</Button>` (line 995)
- `<Button className="help-button" variant="primary" onClick=...>Help</Button>` (line 1002)
- Inside `HelpModal` function component: `<Modal>`, `<Modal.Header>`, `<Modal.Title>`, `<Modal.Body>`, `<Carousel>`, `<Carousel.Item>` (carousel of 13 instruction images)
- Inside `MadeModal` function component: `<Modal>`, `<Modal.Header>`, `<Modal.Title>`, `<Modal.Body>`
- Note: `MadeModal` in trioGame.jsx is commented out in the render at line 1082: `{/* <MadeModal ...> */}` — it exists in code but is not rendered

**Class structure to preserve (verbatim — do not touch):**
- `constructor`, all `this.state.*` properties
- `shuffle()`, `instruction_change()`, `hand_refresh()`, `pile_refresh()`, `componentDidMount()`
- `pick_up_deck()`, `pick_up_pile()`, `move_cards_pos()`, `move_cards_pos_back()`
- `discard_initialise()`, `play_initialise()`, `rearrange_initialise()`
- `add_trio_1/2/3/4()`, `trio_refresh()`, `player_discard()`, `add_cards()`, `card_clicked()`
- `discard1()` through `discard13()` — note: in `trioGame.jsx`, `discard9()` uses index 9 not 8, `discard13()` uses 13 not 12 (may be a bug — preserve as-is)
- `CPU_turn()`, `CPU_find_trio()`, `CPU_change_for_joker()`

**`trioGame.css` strategy:** This CSS is entirely absolute-positioned IDs (`#player_card_1` through `#CPU_trio_2_card_8`, `#pile`, `#deck`, `#play_button`, etc.). The positions define the game board layout and are essential to gameplay. Do NOT convert these to Tailwind — absolute pixel positions cannot be expressed as Tailwind utilities. Keep the CSS file for all ID-based position rules.

What CAN be migrated from `trioGame.css` to Tailwind:
- `.trio-wrapper` (root div class — only used for `text-align: center; margin-top: 56px; height: 100vh`)
- `.trio-title` (the "Trio" heading div)
- `.trio-button:hover { cursor: pointer }` — replace with Tailwind `cursor-pointer` on each element
- `.video-container` / `.instruction-video` — used inside HelpModal (the iframe embed)
- `#play { background-color: #006400 }` (dark green game table background) — can stay in CSS or become `style={{backgroundColor:'#006400'}}`

After migration, `trioGame.css` will be significantly smaller (position rules remain) but IS NOT deleted — the game is unplayable without the absolute-position ID rules.

**Carousel replacement (D-02):** Inside `HelpModal` (function component inside `trioGame.jsx`):

```jsx
// Replace Carousel with step-based navigator
function HelpModal({ show, onHide }) {
  const [slide, setSlide] = React.useState(0);
  const total = 13;
  if (!show) return null;
  return (
    <Modal title="Help" onClose={onHide}>
      {/* ... video embed ... */}
      <div className="flex flex-col items-center gap-4">
        <img
          src={`../Trio/Instruction_images/Trio - User Manual - ${slide + 1}.png`}
          alt={`Instruction ${slide + 1} of ${total}`}
          className="w-full"
        />
        <div className="flex items-center gap-4">
          <button onClick={() => setSlide(s => Math.max(0, s - 1))} disabled={slide === 0}
            className="px-3 py-1 bg-surface border border-white/20 rounded disabled:opacity-40">
            ←
          </button>
          <span className="text-sm text-slate-400">{slide + 1} / {total}</span>
          <button onClick={() => setSlide(s => Math.min(total - 1, s + 1))} disabled={slide === total - 1}
            className="px-3 py-1 bg-surface border border-white/20 rounded disabled:opacity-40">
            →
          </button>
        </div>
      </div>
    </Modal>
  );
}
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Modal overlay | Custom CSS backdrop + JS event listeners | Shared `src/components/Shared/Modal.jsx` with Tailwind | Consistency across 3 components, click-outside-to-close already implemented |
| Image carousel | Custom carousel with touch/swipe | Simple prev/next state counter | D-02 decision — game flow is state-driven already |
| Responsive detection | `window.matchMedia` + `useState` pattern | Tailwind `sm:` responsive prefixes | Eliminates `isSmall` state entirely in PaceCalculator and 500 |

---

## Common Pitfalls

### Pitfall 1: `margin-top: 56px` in per-component CSS
**What goes wrong:** Tool page has doubled top spacing — toolbar area repeated by both `pt-14` on `<main>` and `margin-top: 56px` in the tool's CSS.
**Why it happens:** Pre-Tailwind CSS compensated for the fixed toolbar manually. Now `App.jsx` `<main className="pt-14">` already handles it.
**How to avoid:** When replacing `arb-page`, `trainGame-wrapper`, `trio-wrapper` CSS — ensure no `mt-14` or `margin-top` equivalent is added.
**Warning signs:** Tool content appears below an unusually large gap.

### Pitfall 2: 500 Scorer `StyleTag` colour inversion
**What goes wrong:** 500 Scorer sets `color-scheme: light only` via injected `<style>`. This prevents the browser from applying dark-mode scrollbar/system UI. More critically it conflicts with `index.css` `color-scheme: dark`.
**Why it happens:** 500 Scorer was designed as a standalone light-mode tool.
**How to avoid:** Delete the `StyleTag` component and its usage. The white card background is preserved via `bg-white text-black` on card elements explicitly.
**Warning signs:** Scrollbars flash between light/dark, or browser devtools show conflicting `color-scheme` declarations.

### Pitfall 3: NBALadder left margin assumption
**What goes wrong:** `nbaLadder.css` has `margin: 18px 18px 18px 80px` with a comment "leave a larger left gap to avoid overlapping the toolbar". The original site had a sidebar toolbar.
**Why it happens:** Legacy CSS assumption that toolbar is vertical/left-mounted.
**How to avoid:** Replace with standard responsive spacing — no large left margin.
**Warning signs:** NBALadder component appears offset to the right.

### Pitfall 4: TrioGame direct state mutation
**What goes wrong:** Attempting to refactor `this.state.hand.push(...)` to `setState` causes race conditions and game state corruption — the logic was written assuming synchronous mutation.
**Why it happens:** The game was written as synchronous imperative code before React best practices.
**How to avoid:** Leave ALL mutations exactly as they are (D-03, D-04). Only change import statements, the Bootstrap JSX, and CSS class names.
**Warning signs:** Cards disappear incorrectly, CPU doesn't take turns, game crashes on discard.

### Pitfall 5: `trioGame-state.jsx` vs `trioGame.jsx`
**What goes wrong:** Changes applied to `trioGame-state.jsx` instead of `trioGame.jsx`. The router imports `trioGame.jsx`.
**Why it happens:** Two near-identical files exist in the Trio folder.
**How to avoid:** Apply all Phase 6 changes only to `trioGame.jsx`. Leave `trioGame-state.jsx` untouched.
**Warning signs:** Changes appear to have no effect when navigating to `/Projects/TrioGame`.

### Pitfall 6: TrioHome `class` attribute typos
**What goes wrong:** `trioHome.jsx` lines 137 and 141 use `class="playContainer"` and `class="instructionContainer"` instead of `className`. React will warn about this during conversion.
**Why it happens:** Copy-paste from HTML template.
**How to avoid:** Fix `class` → `className` during functional conversion (content preservation does not require preserving HTML attribute name bugs). These class names reference CSS that doesn't exist anyway.

### Pitfall 7: Arbitrage `InfoModal` → Shared `Modal` interface mismatch
**What goes wrong:** The existing `InfoModal` uses `title` + `children` + `onClose` props. The shared `Modal` must use the same interface to be a drop-in replacement.
**Why it happens:** Interface design.
**How to avoid:** Design shared `Modal` with `{ title, onClose, children }` props — exactly the interface `InfoModal` already uses. Arbitrage just needs to replace `InfoModal` with the shared `Modal` component.

---

## Code Examples

### Shared Modal (to create)
```jsx
// src/components/Shared/Modal.jsx
export default function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-accent/25 rounded-xl w-full max-w-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 p-4 border-b border-white/10">
          <h3 className="text-accent text-lg font-semibold m-0">{title}</h3>
          <button
            className="text-slate-400 hover:text-white text-2xl leading-none bg-transparent border-none cursor-pointer p-0"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="p-4 max-h-[70vh] overflow-y-auto text-white/80 leading-relaxed [&_a]:text-accent [&_a]:underline [&_p]:mb-3 [&_p:last-child]:mb-0">
          {children}
        </div>
      </div>
    </div>
  );
}
```

### TrainGame functional conversion skeleton
```jsx
import React, { useState } from 'react';
import getSolutions from './trainGameCalculations';
import Modal from '../../Shared/Modal';

const TrainGame = () => {
  const [number, setNumber] = useState('');
  const [error, setError] = useState('');
  const [solutions, setSolutions] = useState([]);
  const [helpModalShow, setHelpModalShow] = useState(false);
  const [madeModalShow, setMadeModalShow] = useState(false);

  function validateAndSubmit(num) {
    if (num.length === 4 && /^\d+$/.test(num)) {
      setError('');
      const sols = getSolutions(num);
      if (sols.length > 0) {
        setSolutions([<h3 key="title">Solutions</h3>, ...sols.map((s, i) => <div key={i}>{s}</div>)]);
      } else {
        setSolutions([<h3 key="title">No Solutions Found</h3>]);
      }
    } else {
      setSolutions([]);
      setError('Please enter a 4-digit number');
    }
  }

  return (
    <div className="text-center text-accent min-h-screen">
      {/* header row with Creation left, title center, Help right */}
      {/* input + submit */}
      {/* error + solutions */}
      {helpModalShow && <Modal title="Help" onClose={() => setHelpModalShow(false)}>...</Modal>}
      {madeModalShow && <Modal title="How this was made" onClose={() => setMadeModalShow(false)}>...</Modal>}
    </div>
  );
};
export default TrainGame;
```

### NBALadder Tailwind class mapping (key classes)
```jsx
// root div: was className="nba-ladder card"
<div className="bg-surface rounded-xl border border-white/10 p-4 m-4 max-w-[860px] mx-auto">
// header: was className="nba-header"
<div className="flex items-center justify-between gap-3 mb-3">
// conf-tabs
<div className="flex gap-2">
// conf-tab
<button className="bg-transparent border border-white/10 px-3 py-1.5 rounded-md cursor-pointer text-slate-300 hover:text-white">
// active tab
<button className="bg-white/10 border-transparent text-white ...">
// table-wrap
<div className="overflow-x-auto rounded-lg mt-2">
// team cells
<td className="py-2.5 px-2 text-white overflow-hidden text-ellipsis">
<td className="py-2.5 px-2 text-right text-white w-20 pr-4">
```

---

## Runtime State Inventory

Step 2.6: SKIPPED — this is a CSS migration / component refactor phase. No renames or data migrations. No runtime state affected.

- **Stored data:** None — no string renaming. The `fivehundred-scorer-v1` localStorage key remains unchanged.
- **Live service config:** None affected. NBA Ladder API URL `/.netlify/functions/standings` preserved.
- **OS-registered state:** None.
- **Secrets/env vars:** Arbitrage API keys are hardcoded in `arbitrageCalcutations.jsx` (noted in STATE.md as out-of-scope security concern). No changes to these.
- **Build artifacts:** None.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js / npm | Build, dev server | ✓ | (project running) | — |
| Vite | Dev server + build | ✓ | 6.4.2 | — |
| Tailwind CSS v4 | All styling | ✓ | 4.3.0 | — |
| `/.netlify/functions/standings` | NBALadder TOOL-07 | Requires `netlify dev` locally | — | Error state already implemented in component |

**Note on NBA Ladder local testing:** The Netlify function requires `netlify dev` to run locally. The component already handles 401/403/network errors with user-friendly messages. Manual verification of the happy path requires `netlify dev`.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None installed (v2 requirement TEST-01 deferred) |
| Config file | none |
| Quick run command | `npm run build` (build success = no import errors) |
| Full suite command | `npm run build && npm run lint` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TOOL-01 | Arbitrage renders, CSS classes replaced, calculations intact | smoke/visual | `npm run build` | ✅ `arbitrage.jsx` |
| TOOL-02 | Trio game renders, cards clickable, win/lose fires | manual | navigate to `/Projects/TrioGame` | ✅ `trioGame.jsx` |
| TOOL-03 | TrainGame renders, 4-digit input → solutions | manual | navigate to `/Projects/TrainGame`, enter `2384` | ✅ `trainGame.jsx` |
| TOOL-04 | PaceCalculator renders, time+distance → pace | manual | navigate to `/Projects/PaceCalculator` | ✅ `paceCalculator.jsx` |
| TOOL-05 | 500 Scorer renders, bet recording, undo, reset | manual | navigate to `/Projects/FiveHundred` | ✅ `500.jsx` |
| TOOL-06 | NoisyDetector renders (empty div, no crash) | smoke | `npm run build` | ✅ `noisyDetector.jsx` |
| TOOL-07 | NBALadder renders, error state shows without Netlify | manual | navigate to `/Projects/NBA-Ladder` | ✅ `NBA-Ladder.jsx` |

### Sampling Rate
- **Per task commit:** `npm run build` — confirms no import errors
- **Per wave merge:** `npm run build && npm run lint`
- **Phase gate:** Visual inspection of all 7 routes before `/gsd-verify-work`

### Wave 0 Gaps
None — no test files to create. This phase has no automated unit tests (deferred to v2 TEST-01).

---

## Security Domain

This phase makes no changes to authentication, session management, or data validation. The hardcoded API keys in `arbitrageCalcutations.jsx` are a known concern tracked in `fix/security` branch and are explicitly out of scope. No ASVS controls are implicated by CSS migration.

---

## Open Questions

1. **`trioGame-state.jsx` disposition**
   - What we know: Two nearly-identical files exist (`trioGame.jsx` and `trioGame-state.jsx`). The router imports `trioGame.jsx`. `trioGame-state.jsx` uses `setState` for some values that `trioGame.jsx` mutates directly.
   - What's unclear: Should `trioGame-state.jsx` be deleted as dead code, or left in place?
   - Recommendation: Leave untouched for Phase 6. Consider cleanup in a separate housekeeping phase.

2. **TrioHome DOM manipulation (`onMouseOverCard`/`onMouseOutCard`)**
   - What we know: These methods directly manipulate DOM via `document.getElementById`. They are called from `onMouseOver`/`onMouseOut` event handlers on the play/instructions card images.
   - What's unclear: Should they be converted to React state (`useState` to track hover), or simply removed (the image hover effect is cosmetic)?
   - Recommendation: Remove the handlers during functional conversion (simplest path, reduces scope). The game navigation still works via the `onClick`.

3. **500 Scorer light-theme card on dark site**
   - What we know: 500 Scorer was designed as a standalone light-mode UI (white cards, black text). The site is dark.
   - What's unclear: Should the card remain white (contrasting island) or be dark-themed to match the site?
   - Recommendation: Per D-11 and Claude's discretion, preserve the white card aesthetic. It reads as an intentional design choice. Apply `text-black` explicitly on all card content.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `trioGame-state.jsx` is unused dead code — the router imports `trioGame.jsx` exclusively | Per-Component Guide §8 | Low — verified by reading `main.jsx` directly |
| A2 | The `card` CSS class on NBALadder root div is a Bootstrap utility (white bg, border) | Per-Component Guide §6 | Low — Bootstrap stub passes children through; removing it safe |
| A3 | Absolute pixel positions in `trioGame.css` must be kept as-is for gameplay | Per-Component Guide §8 | LOW — removing them would obviously break the game canvas |

All three are LOW risk — verified directly from source.

---

## Sources

### Primary (HIGH confidence — source files read directly)
- `src/components/Projects/Arbitrage/arbitrage.jsx` — full read
- `src/components/Projects/Arbitrage/arbitrage.css` — full read (429 lines)
- `src/components/Projects/TrainGame/trainGame.jsx` — full read
- `src/components/Projects/TrainGame/trainGame.css` — full read
- `src/components/Projects/PaceCalculator/paceCalculator.jsx` — full read
- `src/components/Projects/500/500.jsx` — full read
- `src/components/Projects/NoisyDetector/noisyDetector.jsx` — full read
- `src/components/Projects/NoisyDetector/noisyDetector.css` — full read
- `src/components/Projects/NBA-Ladder/NBA-Ladder.jsx` — full read
- `src/components/Projects/NBA-Ladder/nbaLadder.css` — full read
- `src/components/Projects/Trio/trioHome.jsx` — full read
- `src/components/Projects/Trio/trioHome.css` — full read
- `src/components/Projects/Trio/trioGame.jsx` — full read (1090 lines)
- `src/components/Projects/Trio/trioGame-state.jsx` — full read (1110 lines)
- `src/components/Projects/Trio/trioGame.css` — full read
- `src/components/main.jsx` — full read (routing)
- `src/index.css` — full read (Tailwind tokens)
- `vite.config.js` — full read (Bootstrap stub)
- `package.json` — full read (dependencies)
- `.planning/phases/06-mini-projects/06-CONTEXT.md` — full read (decisions)
- `.planning/REQUIREMENTS.md` — full read

---

## Project Constraints (from CLAUDE.md)

- Preserve all content — no text, links, or data changes
- Colour tokens: `#242424` bg, `#333134` surface, `#ffc200` accent, `#ffffff` text
- No framework change — React + Vite only
- Spotify auth logic in TopArtistsMap — not in scope for Phase 6
- `trioGame.jsx` is 1000+ lines — test thoroughly after migration
- No `mt-14` on tool wrappers (Phase 5 lesson)
- Delete all per-component CSS files after Tailwind migration

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — read directly from package.json and vite.config.js
- Architecture: HIGH — all source files read, routing confirmed in main.jsx
- Pitfalls: HIGH — identified from actual code patterns, not assumptions
- CSS class mappings: HIGH — derived from reading all CSS files directly

**Research date:** 2026-05-17
**Valid until:** 2026-06-17 (stable codebase, 30-day window)
