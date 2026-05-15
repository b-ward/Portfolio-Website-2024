---
phase: 03-landing-page
reviewed: 2026-05-15T00:00:00Z
depth: standard
files_reviewed: 1
files_reviewed_list:
  - src/components/Landing/landingpage.jsx
findings:
  critical: 0
  warning: 3
  info: 2
  total: 5
status: issues_found
---

# Phase 3: Code Review Report

**Reviewed:** 2026-05-15
**Depth:** standard
**Files Reviewed:** 1
**Status:** issues_found

## Summary

Reviewed `src/components/Landing/landingpage.jsx` — the functional component rewrite produced by Phase 3 plan 01. The conversion from class component to functional component is correct: `useRef`/`useEffect` replace `componentDidMount`/`document.querySelector`, Tailwind classes are applied consistently using project tokens (`bg-surface`, `text-accent`, `text-white`), the image path is correctly set to `/BrendonWard.png`, and `landingpage.css` is absent with no stray import.

Three warnings were found. The most impactful is a block-in-inline HTML invalidity on line 31 (`<div>` inside `<span>`) that prevents the accent colour from applying to the typing animation. The second is a missing `ityped` cleanup that leaks an animation interval on unmount. The third is a missing null guard in the `useEffect` that could cause a throw in React 18 Strict Mode development builds.

---

## Warnings

### WR-01: `<div>` nested inside `<span>` — accent colour styling lost

**File:** `src/components/Landing/landingpage.jsx:31`
**Issue:** The `ityped` target `<div ref={typingRef}>` is a child of `<span className="text-accent inline-block">`. A block-level element inside an inline element is invalid HTML per the HTML spec. Browsers silently fix this by closing the `<span>` before the `<div>`, which means the `text-accent` colour class on the span is never applied to the rendered typing text — it renders white (inheriting `text-white` from the `h3`) instead of the intended `#ffc200` accent colour.

**Fix:** Replace the `<div>` with a `<span>` so the typing target is inline and the parent span's classes remain in effect:
```jsx
<h3 className="bg-surface text-white text-[20px]">
  I'm a <span className="text-accent inline-block" ref={typingRef}></span>
</h3>
```
Attach the `ref` directly to the outer `<span>` and remove the inner `<div>`. `ityped` appends text content into whichever element receives the ref — a `<span>` works identically to a `<div>` as the target.

---

### WR-02: Missing `ityped` cleanup — animation interval leaks on unmount

**File:** `src/components/Landing/landingpage.jsx:9-15`
**Issue:** `ityped.init()` starts a repeating interval for the typing animation. The `useEffect` has no cleanup function, so if the `Landing` component unmounts (e.g., user navigates to another route) the interval continues running against a detached DOM node. This will produce React warnings about state updates on unmounted components and can accumulate leaked intervals if the page is visited repeatedly during a session.

**Fix:** Capture the instance returned by `init()` and call `destroy()` in the cleanup:
```jsx
useEffect(() => {
  const instance = init(typingRef.current, {
    showCursor: false,
    backDelay: 1500,
    strings: ['Product Manager', 'Tester', 'Developer', 'Technology Enthusiast'],
  });
  return () => {
    instance.destroy();
  };
}, []);
```
Note: verify that `ityped`'s `init()` returns a destroyable instance in the version installed — if it returns `void`, check the `ityped` docs for the destroy API (some versions expose `window.iTyped.destroy()` or a callback instead).

---

### WR-03: No null guard on `typingRef.current` before `ityped` init

**File:** `src/components/Landing/landingpage.jsx:10`
**Issue:** `init(typingRef.current, {...})` is called unconditionally. In React 18 Strict Mode (development builds), effects run twice — the first invocation may fire when `typingRef.current` is `null` if the component has not fully committed. Passing `null` as the target DOM node to `ityped` will throw or silently fail, potentially breaking the animation in development and masking real issues.

**Fix:** Add a null guard before calling `init`:
```jsx
useEffect(() => {
  if (!typingRef.current) return;
  const instance = init(typingRef.current, {
    showCursor: false,
    backDelay: 1500,
    strings: ['Product Manager', 'Tester', 'Developer', 'Technology Enthusiast'],
  });
  return () => {
    instance.destroy();
  };
}, []);
```

---

## Info

### IN-01: Desktop image `h-[70%]` may not resolve correctly in a flex child

**File:** `src/components/Landing/landingpage.jsx:23`
**Issue:** At `lg` breakpoint, the image switches to `lg:static lg:h-[70%]`. A percentage height on a statically-positioned flex child resolves relative to the flex item's own height, not the flex container's height. The flex item (`div.flex-1`) has no explicit height — its height is determined by the flex algorithm from the parent `h-[calc(100vh-3.5rem)]` container. Percentage heights on children of flex items without an explicit `height` set may collapse in some browsers. This is worth a visual check at desktop widths to confirm the image renders at the intended 70% of the column height rather than 0 or auto.

**Fix:** If the image collapses on desktop, add an explicit height to the left flex column:
```jsx
<div className="flex-1 relative overflow-hidden flex items-center justify-center h-full">
```
Then `h-[70%]` on the image will resolve against the column's `h-full` (which itself resolves against the parent's `h-[calc(100vh-3.5rem)]`).

---

### IN-02: `React` imported but not used directly

**File:** `src/components/Landing/landingpage.jsx:3`
**Issue:** `import React, { useRef, useEffect } from 'react'` imports the `React` default export, which is not referenced anywhere in the file body. With the automatic JSX runtime (Vite + React 18), the default `React` import is not needed. This is consistent with the project's other converted components (e.g., `SideDrawer.jsx`) so it is not a deviation from convention, but it is technically unused.

**Fix:** Either remove the default import or leave it for consistency — no functional impact:
```jsx
import { useRef, useEffect } from 'react';
```

---

_Reviewed: 2026-05-15_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
