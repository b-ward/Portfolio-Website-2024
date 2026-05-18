# Phase 8: TopArtistsMap / Spotify - Pattern Map

**Mapped:** 2026-05-18
**Files analyzed:** 2 (topArtistsMap.jsx modified, topArtistsMap.css deleted)
**Analogs found:** 4 / 4

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/components/Projects/TopArtistsMap/topArtistsMap.jsx` | component | event-driven + request-response | `src/components/Projects/Arbitrage/arbitrage.jsx` | exact |
| `src/components/Projects/TopArtistsMap/topArtistsMap.css` | config | — | *(deleted — no analog needed)* | — |

---

## Pattern Assignments

### `src/components/Projects/TopArtistsMap/topArtistsMap.jsx`

**Primary analog:** `src/components/Projects/Arbitrage/arbitrage.jsx`
**Secondary analog:** `src/components/Projects/NBA-Ladder/NBA-Ladder.jsx`

---

#### Imports pattern

**From:** `src/components/Projects/Arbitrage/arbitrage.jsx` lines 1-3

```jsx
import React, { useState } from 'react'
import Modal from '../../Shared/Modal'
import getArbitrageBets from './arbitrageCalcutations'
```

**Apply to topArtistsMap.jsx:**
- Replace `import './topArtistsMap.css'` (line 4) with `import Modal from '../../Shared/Modal'`
  — but note topArtistsMap is one level deeper: `../../Shared/Modal` resolves from
  `src/components/Projects/TopArtistsMap/` correctly to `src/components/Shared/Modal`.
- Remove the CSS import entirely (D-10).

---

#### Outer wrapper — no margin-top, simple padding

**From:** `src/components/Projects/Arbitrage/arbitrage.jsx` line 125

```jsx
<div className="min-h-screen p-5 text-white sm:p-3">
```

**Apply to `.top-artists-map`:**
- Remove `margin-top: 56px` and `margin-top: 52px` (D-05). `pt-14` on `<main>` handles toolbar clearance.
- Map CSS:
  ```
  color: #ffffff              → text-white
  padding: 1.25rem 1.25rem 1.5rem 1.25rem → p-5
  margin-top: 52px (mobile)  → (removed — use md: prefix if needed)
  padding: 0.65rem (mobile)  → sm:p-2.5
  ```
- Result: `<div className="text-white p-5 sm:p-2.5">`

---

#### Card wrapper — surface bg + accent border

**From:** `src/components/Projects/NBA-Ladder/NBA-Ladder.jsx` line 75

```jsx
<div className="bg-surface rounded-xl border border-white/10 p-4 m-4 max-w-[860px] mx-auto">
```

**From:** `src/components/Projects/500/500.jsx` line 144

```jsx
<section className="border-2 border-accent rounded-2xl p-4 bg-white text-black mb-4 sm:p-4 [padding:12px]">
```

**Apply to `.top-artists-card`:**
- CSS had `border: 2px solid #ffc200`, `border-radius: 12px`, `background: #333134`, `padding: 1rem`
- Result: `<div className="bg-surface border-2 border-accent rounded-xl p-4 sm:p-3">`

---

#### Card header row (heading + info button)

**From:** `src/components/Projects/Arbitrage/arbitrage.jsx` lines 127-132

```jsx
<div className="flex flex-col items-center gap-2 mb-5">
  <h1 className="text-accent text-2xl font-semibold text-center m-0 sm:text-xl">Arbitrage Betting</h1>
  <div className="flex items-center gap-2">
    <button className="bg-transparent border border-accent/50 text-accent rounded-lg px-3.5 py-1.5 text-sm font-semibold cursor-pointer hover:bg-accent/10 hover:border-accent" onClick={() => setMadeOpen(true)}>Creation</button>
  </div>
</div>
```

**Apply to `.top-artists-header` + `.top-artists-heading`:**
- CSS had `display:flex; align-items:center; justify-content:space-between; gap:1rem; margin-bottom:0.75rem`
  and on mobile: `flex-direction:column; align-items:flex-start`
- Result:
  ```jsx
  <div className="flex items-center justify-between gap-4 mb-3 md:flex-col md:items-start">
    <h2 className="text-accent text-xl font-semibold m-0">Top Spotify Artists World Map</h2>
    {/* info button — see button pattern below */}
  </div>
  ```

---

#### Primary action button (accent fill)

**From:** `src/components/Projects/Arbitrage/arbitrage.jsx` line 137

```jsx
<button className="border border-accent bg-accent text-black rounded-lg px-5 py-2.5 text-base font-bold cursor-pointer disabled:opacity-65 disabled:cursor-not-allowed" onClick={handleFetch} disabled={loading}>
```

**Apply to `.top-artists-button` (default/primary):**
- CSS had `border: 1px solid #ffc200; color: #333134; background: #ffc200; border-radius: 8px; padding: 0.45rem 0.75rem; font-weight: 600`
- Result: `className="border border-accent bg-accent text-black rounded-lg px-3 py-1.5 text-sm font-semibold cursor-pointer disabled:opacity-65 disabled:cursor-not-allowed"`

---

#### Secondary button (transparent + accent border)

**From:** `src/components/Projects/Arbitrage/arbitrage.jsx` line 130

```jsx
<button className="bg-transparent border border-accent/50 text-accent rounded-lg px-3.5 py-1.5 text-sm font-semibold cursor-pointer hover:bg-accent/10 hover:border-accent" ...>
```

**Apply to `.top-artists-button.secondary`:**
- CSS had `background: transparent; color: #ffc200; border: 1px solid #ffc200`
- Result: `className="bg-transparent border border-accent text-accent rounded-lg px-3 py-1.5 text-sm font-semibold cursor-pointer hover:bg-accent/10"`

---

#### Info / "How it works" button

**From:** CSS: `.top-artists-button.info { background: #ffffff; color: #334155; border-color: #cbd5e1 }`

No exact analog in codebase — closest is secondary button style. Use:
```jsx
className="bg-white text-slate-700 border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-semibold cursor-pointer hover:bg-slate-50"
```

---

#### Loading spinner — animate-spin

**From:** `src/components/Projects/Arbitrage/arbitrage.jsx` lines 139-142

```jsx
{loading ? (
  <span className="inline-flex items-center gap-2">
    <span className="w-3.5 h-3.5 rounded-full border-2 border-black/35 border-t-black animate-spin" aria-hidden="true" />
    Scanning odds…
  </span>
) : (
  'Get Arbitrage Bets'
)}
```

**Apply to `.loading-state` + `.loading-spinner`:**
- CSS had custom `@keyframes spin` — replaced entirely by `animate-spin` (D-07)
- Spinner border: `border: 2px solid rgba(51,49,52,0.35); border-top-color: #333134` → `border-2 border-black/35 border-t-black`
- Result:
  ```jsx
  {isLoading || isAuthenticating ? (
    <span className="inline-flex items-center gap-1.5">
      <span className="w-3.5 h-3.5 rounded-full border-2 border-black/35 border-t-black animate-spin" aria-hidden="true" />
      Loading
    </span>
  ) : (
    'Load Top Artists'
  )}
  ```

---

#### Select element (dark background, accent border)

**Apply to `.top-artists-select`:**
- CSS had `border-radius:8px; border:1px solid #ffc200; padding:0.45rem 0.65rem; background:#1f1d20; color:#ffffff`
- No close codebase analog — use direct Tailwind:
  ```jsx
  className="border border-accent rounded-lg px-2.5 py-1.5 bg-[#1f1d20] text-white text-sm"
  ```

---

#### Controls row (label + select + buttons)

**Apply to `.top-artists-controls`:**
- CSS had `display:flex; flex-wrap:wrap; gap:0.75rem; align-items:center; margin-bottom:0.75rem`
- Result: `className="flex flex-wrap items-center gap-3 mb-3"`

---

#### Hint / error text

**From:** `src/components/Projects/NBA-Ladder/NBA-Ladder.jsx` line 94-95

```jsx
{loading && <div className="py-8 text-slate-400 text-center">Loading standings…</div>}
{error && <div className="py-8 text-slate-400 text-center">Error: {error}</div>}
```

**Apply to `.top-artists-hint`:**
- CSS had `color: #d8d8d8; font-size: 0.95rem; margin: 0`
- Result: `className="m-0 text-white/80 text-sm"`

**Apply to `.top-artists-hint-link`:**
- CSS had `color: #ffc200; text-decoration: underline`
- Result: `className="text-accent underline"`

---

#### Map wrapper — bg-white + dynamic cursor (D-03, D-06)

**Apply to `.map-wrapper` / `.is-zoomed` / `.is-dragging`:**
- CSS had `position:relative; width:100%; max-width:1100px; border:1px solid rgba(148,163,184,0.6); border-radius:8px; overflow:hidden; background:#ffffff; margin:0.75rem auto 0; touch-action:none; height:420px`
- D-06: Replace class toggles with inline conditional Tailwind:
  ```jsx
  <div
    className={`relative w-full max-w-[1100px] mx-auto mt-3 border border-slate-400/60 rounded-lg overflow-hidden bg-white touch-none h-[420px] ${zoomLevel > 1 ? 'cursor-grab' : ''} ${isDragging ? 'cursor-grabbing' : ''}`}
    ref={mapWrapperRef}
    ...
  >
  ```
- Note: `cursor-grabbing` overrides `cursor-grab` in the DOM because it appears later in the string. Both classes are applied simultaneously when dragging (`isDragging` implies `zoomLevel > 1`), but `cursor-grabbing` wins via specificity order in Tailwind.

---

#### Zoom controls (desktop: top-right horizontal row; mobile: bottom-right vertical column)

**Apply to `.map-zoom-controls` (desktop) + `@media (max-width:768px)` override:**
- Desktop CSS: `position:absolute; top:0.6rem; right:0.6rem; z-index:6; display:flex; gap:0.4rem`
- Mobile CSS: `top:auto; bottom:0.6rem; right:0.6rem; flex-direction:column; gap:0.45rem`
- Result:
  ```jsx
  <div className="absolute top-2.5 right-2.5 z-[6] flex gap-1.5 md:flex-col md:top-auto md:bottom-2.5">
  ```
  (Using `md:` for the `max-width:768px` breakpoint — in Tailwind `md:` is `min-width:768px` so the mobile-first equivalent is: default = desktop layout, `max-md:` = mobile layout. Use `max-md:` variants.)

  Corrected result:
  ```jsx
  <div className="absolute top-2.5 right-2.5 z-[6] flex gap-1.5 max-md:flex-col max-md:top-auto max-md:bottom-2.5">
  ```

---

#### Zoom buttons (desktop small, mobile larger)

**Apply to `.map-zoom-button`:**
- Desktop CSS: `border:1px solid rgba(100,116,139,0.75); background:rgba(255,255,255,0.92); color:#334155; border-radius:6px; min-width:2rem; height:2rem; font-size:1rem; font-weight:700; padding:0 0.5rem`
- Mobile CSS override: `min-width:2.75rem; height:2.75rem; font-size:1.4rem; border-radius:8px; padding:0; display:flex; align-items:center; justify-content:center; touch-action:manipulation`
- Result:
  ```jsx
  <button
    type="button"
    className="border border-slate-500/75 bg-white/90 text-slate-700 rounded-md min-w-8 h-8 text-base font-bold px-2 max-md:min-w-11 max-md:h-11 max-md:text-xl max-md:rounded-lg max-md:p-0 max-md:flex max-md:items-center max-md:justify-center max-md:[touch-action:manipulation]"
    onClick={zoomIn}
  >
    +
  </button>
  ```

**Apply to `.map-zoom-button.reset` differences:**
- Desktop: `min-width:auto; padding:0 0.6rem; font-size:0.85rem; font-weight:600`
- Mobile: `font-size:0.8rem; padding:0; min-width:2.75rem`
- Result adds to base: `text-sm font-semibold px-2.5 max-md:text-xs max-md:px-0 max-md:min-w-11`

---

#### SVG element (inline styles preserved per D-04)

```jsx
<svg
  className="block w-full h-full [touch-action:none]"
  width="100%"
  height={MAP_HEIGHT}
  viewBox={`${getViewBox().x} ${getViewBox().y} ${getViewBox().width} ${getViewBox().height}`}
  preserveAspectRatio="xMidYMid meet"
  style={{ background: '#ffffff', display: 'block' }}
>
```
- `.top-artists-svg` CSS: `display:block; width:100%; height:100%; touch-action:none`
- `display:block` is in both className and the existing inline style — keep both as-is per D-04.

---

#### SVG path hovered class removal (D-08)

**Current (to be removed):**
```jsx
className={hoveredCountry?.countryCode === countryCode ? 'hovered' : ''}
```
**After D-08:** Remove the `className` prop entirely from the `<path>` element. No Tailwind replacement needed — the hover effect is driven by `fill` prop.

---

#### Floating tooltip (hidden on mobile)

**Apply to `.country-tooltip.floating`:**
- Desktop CSS: `position:absolute; z-index:5; margin-top:0; min-width:220px; max-width:320px; pointer-events:none`
- Mobile CSS: `display:none`
- Base tooltip CSS: `border:1px solid rgba(251,146,60,0.45); border-radius:8px; padding:0.75rem; background:rgba(24,24,27,0.96)`
- Result:
  ```jsx
  <div
    className="absolute z-[5] min-w-[220px] max-w-[320px] pointer-events-none border border-orange-400/45 rounded-lg p-3 bg-zinc-950/95 max-md:hidden"
    style={{ left: `${tooltipPosition.x}px`, top: `${tooltipPosition.y}px` }}
  >
  ```

**Tooltip heading (`.country-tooltip h4`):**
- CSS: `margin:0 0 0.4rem 0; color:#fb923c`
- Result: `className="m-0 mb-1.5 text-orange-400"`

**Tooltip list:**
- `ul`: `margin:0; padding-left:1rem` → `className="m-0 pl-4"`
- `li`: `margin-bottom:0.2rem` → `className="mb-1"`

---

#### Tapped/selected country tooltip

**Apply to `.country-tooltip.tapped`:**
- CSS: same base as `.country-tooltip` plus `margin-top:0.75rem`
- Result:
  ```jsx
  <div className="mt-3 border border-orange-400/45 rounded-lg p-3 bg-zinc-950/95">
  ```

**Tapped header row (`.country-tooltip-tapped-header`):**
- CSS: `display:flex; align-items:flex-start; justify-content:space-between; gap:0.5rem; margin-bottom:0.4rem`
- Result: `className="flex items-start justify-between gap-2 mb-1.5"`

**Close button (`.country-tooltip-close`):**
- CSS: `border:none; background:transparent; color:#94a3b8; font-size:1.4rem; line-height:1; padding:0; flex-shrink:0; cursor:pointer` + `hover:color:#ffffff`
- Result: `className="border-none bg-transparent text-slate-400 hover:text-white text-2xl leading-none p-0 shrink-0 cursor-pointer"`

---

#### Mobile hint (hidden desktop, visible mobile)

**Apply to `.map-mobile-hint`:**
- CSS: `display:none` normally; `display:block` on mobile
- Result: `className="hidden max-md:block text-center text-slate-400 text-xs mt-1.5"`

---

#### Legend

**Apply to `.map-legend`:**
- CSS: `margin-top:0.7rem; display:flex; align-items:center; gap:0.5rem; color:#cbd5e1; font-size:0.86rem; flex-wrap:wrap`
- Result: `className="mt-3 flex items-center gap-2 text-slate-300 text-sm flex-wrap"`

**`.map-legend-label`:** `className="text-slate-300"`

**`.map-legend-scale`:**
- CSS: `display:inline-flex; border-radius:999px; overflow:hidden; border:1px solid rgba(251,146,60,0.4)`
- Result: `className="inline-flex rounded-full overflow-hidden border border-orange-400/40"`

**`.map-legend-swatch`:**
- CSS: `width:20px; height:12px; display:inline-block`
- Result: `className="w-5 h-3 inline-block"`

---

#### Unmapped artists list

**Apply to `.unmapped-list`:**
- CSS: `margin-top:0.75rem; border:1px solid rgba(255,194,0,0.35); border-radius:8px; padding:0.75rem`
- Result: `className="mt-3 border border-accent/35 rounded-lg p-3"`

**`.unmapped-list h4`:** `margin:0 0 0.5rem 0; color:#ffc200` → `className="m-0 mb-2 text-accent"`
**`.unmapped-list p`:** `margin:0; color:#d8d8d8` → `className="m-0 text-white/80"`

---

#### Info modal — replaced by Modal.jsx (D-01, D-02)

**From:** `src/components/Shared/Modal.jsx` lines 1-27 (full file)

```jsx
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

**From:** `src/components/Projects/Arbitrage/arbitrage.jsx` lines 209-246 (usage pattern)

```jsx
{helpOpen && (
  <Modal title="How it works" onClose={() => setHelpOpen(false)}>
    <p>...</p>
    <p>...</p>
  </Modal>
)}
```

**Replace current bespoke `.info-modal-backdrop` + `.info-modal` with:**
```jsx
{showInfoModal && (
  <Modal title="How this map works" onClose={() => setShowInfoModal(false)}>
    <p>When you click <strong>Load Top Artists</strong>...</p>
    {/* ... remaining paragraphs unchanged ... */}
  </Modal>
)}
```
- Modal handles backdrop dismiss via `onClick={onClose}` on the outer div (D-02)
- Modal handles `stopPropagation` on inner div
- Dark theme (`bg-surface`, `text-accent` title) is already baked into Modal.jsx (D-01)
- No `role="dialog"` or `aria-modal` needed on call-site — Modal.jsx does not apply these (add if required)

---

## Shared Patterns

### Theme Colour Tokens
**Source:** `src/index.css` lines 3-6
```css
@theme {
  --color-bg: #242424;
  --color-surface: #333134;
  --color-accent: #ffc200;
}
```
**Apply to:** All className strings — use `bg-surface`, `bg-bg`, `text-accent`, `border-accent` instead of hardcoded hex values.

### animate-spin (Loading Spinner)
**Source:** `src/components/Projects/Arbitrage/arbitrage.jsx` lines 139-142
```jsx
<span className="w-3.5 h-3.5 rounded-full border-2 border-black/35 border-t-black animate-spin" aria-hidden="true" />
```
**Apply to:** The `<span className="loading-spinner">` element. Replaces custom `@keyframes spin` in topArtistsMap.css (D-07).

### Modal Usage Pattern
**Source:** `src/components/Projects/Arbitrage/arbitrage.jsx` lines 209-246
```jsx
{helpOpen && (
  <Modal title="How it works" onClose={() => setHelpOpen(false)}>
    <p>...</p>
  </Modal>
)}
```
**Apply to:** `showInfoModal` modal in topArtistsMap.jsx. Import from `../../Shared/Modal` (D-01, D-02).

### Conditional Cursor Classes
**Source:** `src/components/Projects/TopArtistsMap/topArtistsMap.jsx` (pattern described in D-06, no prior codebase example — new pattern for this component)
```jsx
className={`... ${zoomLevel > 1 ? 'cursor-grab' : ''} ${isDragging ? 'cursor-grabbing' : ''}`}
```
**Apply to:** Map wrapper div only.

### No Outer margin-top
**Source:** `src/components/Projects/Arbitrage/arbitrage.jsx` line 125 and `src/components/Music/music.jsx` line 4
```jsx
<div className="min-h-screen p-5 text-white sm:p-3">   // Arbitrage
<div className="pb-8">                                  // Music
```
Neither has `margin-top`. Established in Phase 6 D-12, carried to Phase 8 D-05.
**Apply to:** Outer wrapper `.top-artists-map` — drop `margin-top: 56px` / `margin-top: 52px`.

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `.top-artists-select` dark styling | utility | — | No other component in codebase has a dark-background `<select>` with accent border; use direct Tailwind values `bg-[#1f1d20]` |
| Zoom controls responsive flip | utility | — | No other component has position-switching absolute controls; use `max-md:` responsive variants directly |

---

## Metadata

**Analog search scope:** `src/components/` (all `.jsx` files)
**Files scanned:** 8 analogs examined; 4 provided strong patterns
**Pattern extraction date:** 2026-05-18
