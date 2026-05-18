---
phase: 07-remaining-pages
reviewed: 2026-05-18T00:00:00Z
depth: standard
files_reviewed: 3
files_reviewed_list:
  - src/components/Photos/photos.jsx
  - src/components/Music/music.jsx
  - src/components/BusinessBrains/businessBrains.jsx
findings:
  critical: 0
  warning: 4
  info: 4
  total: 8
status: issues_found
---

# Phase 7: Code Review Report

**Reviewed:** 2026-05-18
**Depth:** standard
**Files Reviewed:** 3
**Status:** issues_found

## Summary

Three static render components freshly migrated from Bootstrap class components to Tailwind functional components. All render embedded third-party iframes (YouTube, Mixcloud, Spotify). No user input, no state, no data fetching.

Security posture is clean — all iframe `src` values are HTTPS URLs pointing to well-known trusted hosts, no user-supplied data flows into any attribute, and there is no XSS vector. No hardcoded secrets, no `eval`, no `dangerouslySetInnerHTML`.

Four warnings were found: two accessibility issues with duplicate/missing iframe titles, and two instances of deprecated HTML attributes (`frameBorder`, `allowTransparency`) that survive from the Bootstrap era and represent unfinished migration work. Four info items cover the redundant React import, trailing semicolons in `allow` attributes, inline sizing attributes that break Tailwind consistency, and a missing `allowFullScreen` prop on YouTube iframes.

---

## Warnings

### WR-01: Duplicate iframe `title` — second YouTube video is inaccessible to screen readers

**File:** `src/components/Photos/photos.jsx:14`
**Issue:** Both the first and second `<iframe>` share `title="Northern Territory 2021"`. The `title` attribute is the primary identifier screen readers use to describe an iframe. A duplicate title makes the second video indistinguishable from the first for assistive technology users.
**Fix:** Give the second iframe its own descriptive title matching its actual content.
```jsx
// Line 13-18 — change the title on the second iframe
<iframe
  className="aspect-video w-3/5 mx-auto block mb-8"
  title="Northern Territory 2021 — Part 2"
  src="https://www.youtube.com/embed/0yzM_pxB0qY"
  allow="fullscreen"
></iframe>
```

---

### WR-02: Deprecated `frameBorder` attribute in Music component

**File:** `src/components/Music/music.jsx:13` (and lines 19, 25, 31, 37, 43, 49, 55)
**Issue:** `frameBorder="0"` is a deprecated presentational HTML attribute removed from the HTML living standard. It is a leftover Bootstrap-era pattern. In JSX the correct approach is a Tailwind border utility or an inline style.
**Fix:** Remove `frameBorder="0"` from all eight Mixcloud iframes and add `className="border-0 mb-8"` (merging the existing `mb-8`):
```jsx
<iframe
  className="border-0 mb-8"
  title="Mix 8"
  width="100%"
  height="120"
  src="https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&feed=%2Fbrendon-ward%2Fprogressive-house-mix-1%2F"
></iframe>
```

---

### WR-03: Deprecated `frameBorder` and `allowTransparency` attributes in BusinessBrains component

**File:** `src/components/BusinessBrains/businessBrains.jsx:13` (and line 22)
**Issue:** Both Spotify iframes use `frameBorder="0"` (deprecated, same as WR-02) and `allowTransparency={true}` (removed from the HTML spec). `allowTransparency` has been dropped from Spotify's own current embed documentation. These are Bootstrap-era attributes that should have been removed during migration.
**Fix:** Remove both deprecated attributes; the Spotify embed renders correctly without them:
```jsx
<iframe
  className="border-0 mb-8"
  title="Pod 2"
  src="https://open.spotify.com/embed/episode/3uqsIqXuVVHPeMTlB5FQ1i?theme=0"
  width="100%"
  height="232"
  allow="encrypted-media"
></iframe>
```

---

### WR-04: Inline `width` and `height` HTML attributes bypass Tailwind sizing system

**File:** `src/components/Music/music.jsx:10-11` (all eight iframes); `src/components/BusinessBrains/businessBrains.jsx:11-12` (both iframes)
**Issue:** Both migrated components set `width="100%"` and a fixed pixel `height` as raw HTML attributes rather than Tailwind classes. This is inconsistent with the rest of the migration (Photos uses only Tailwind for sizing) and means these values are invisible to Tailwind's responsive utilities.
**Fix:** Replace inline sizing attributes with Tailwind classes. For Music (fixed-height audio widget):
```jsx
<iframe
  className="border-0 mb-8 w-full h-[120px]"
  title="Mix 8"
  src="..."
></iframe>
```
For BusinessBrains (Spotify embed):
```jsx
<iframe
  className="border-0 mb-8 w-full h-[232px]"
  title="Pod 2"
  src="..."
></iframe>
```

---

## Info

### IN-01: Redundant React import — not required with the automatic JSX runtime

**File:** `src/components/Photos/photos.jsx:1`; `src/components/Music/music.jsx:1`; `src/components/BusinessBrains/businessBrains.jsx:1`
**Issue:** All three files begin with `import React from 'react'`. Vite + React 18 uses the automatic JSX transform (`@vitejs/plugin-react`), which injects the JSX runtime automatically. The explicit import is dead code in this configuration, though harmless.
**Fix:** Remove the import from all three files. Consistent with the project's other recently-migrated components if they have already dropped it.
```jsx
// Delete line 1 in all three files:
// import React from 'react';
```

---

### IN-02: Trailing semicolon in `allow` attribute value on YouTube iframes

**File:** `src/components/Photos/photos.jsx:11` (and lines 17, 23, 29, 35)
**Issue:** All five YouTube iframes use `allow="fullscreen;"` with a trailing semicolon. The `allow` attribute uses a semicolon-separated list for *multiple* permissions; a trailing semicolon after the last (or only) permission is technically malformed. Browsers tolerate it, but it is non-standard.
**Fix:** Remove the trailing semicolons:
```jsx
allow="fullscreen"
```

---

### IN-03: Missing `allowFullScreen` boolean prop on YouTube iframes

**File:** `src/components/Photos/photos.jsx:7-12` (all five iframes)
**Issue:** The YouTube iframes use `allow="fullscreen"` (the Permissions Policy header approach) but omit the `allowFullScreen` JSX boolean prop. The legacy `allowFullScreen` attribute is still required by some browsers (notably Safari) and is part of YouTube's own embed code snippet. Without it, the fullscreen button may be non-functional in certain browsers.
**Fix:** Add `allowFullScreen` to each YouTube iframe:
```jsx
<iframe
  className="aspect-video w-3/5 mx-auto block mb-8"
  title="Northern Territory 2021"
  src="https://www.youtube.com/embed/z_7wfXeZL-g?si=2c-qHQHLI3aRFfkB"
  allow="fullscreen"
  allowFullScreen
></iframe>
```

---

### IN-04: Inconsistent Mixcloud widget subdomain across Music iframes

**File:** `src/components/Music/music.jsx:12` and `src/components/Music/music.jsx:19`
**Issue:** Mix 7 and Mix 8 use the `player-widget.mixcloud.com` subdomain while Mix 1-6 use `www.mixcloud.com`. Both work, but the inconsistency suggests a copy-paste variation rather than a deliberate choice. If Mixcloud ever deprecates the `player-widget` subdomain, two iframes would break silently.
**Fix:** Normalise all eight iframes to the same subdomain. The current Mixcloud embed documentation uses `www.mixcloud.com/widget/iframe/`:
```
// Mix 7 (line 19) — change subdomain:
src="https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=%2Fbrendon-ward%2Ftech-house-crowd-favs%2F"

// Mix 8 (line 12) — change subdomain:
src="https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=%2Fbrendon-ward%2Fprogressive-house-mix-1%2F"
```

---

_Reviewed: 2026-05-18_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
