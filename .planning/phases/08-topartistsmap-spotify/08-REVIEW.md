---
phase: 08-topartistsmap-spotify
reviewed: 2026-05-18T00:00:00Z
depth: standard
files_reviewed: 1
files_reviewed_list:
  - src/components/Projects/TopArtistsMap/topArtistsMap.jsx
findings:
  critical: 0
  warning: 4
  info: 3
  total: 7
status: issues_found
---

# Phase 8: Code Review Report

**Reviewed:** 2026-05-18
**Depth:** standard
**Files Reviewed:** 1 (plus supporting files read for context: `SpotifyAuthProvider.jsx`, `musicBrainzService.js`)
**Status:** issues_found

## Summary

`topArtistsMap.jsx` is well-structured: clean separation of concerns, proper error boundaries around async work, good defensive coding throughout (optional chaining, null guards, clamped zoom/pan). The Spotify auth logic in `SpotifyAuthProvider.jsx` is solid and correctly preserved.

Four warnings were found — two in the main component and two in the service layer read for cross-file context. No critical (security or crash) issues. Three info-level items cover a duplicate map key, a silent GeoJSON failure, and a scoring heuristic that could produce surprising country assignments.

---

## Warnings

### WR-01: Conflicting cursor classes when dragging

**File:** `src/components/Projects/TopArtistsMap/topArtistsMap.jsx:561-562`

**Issue:** The map container applies `cursor-grab` when `zoomLevel > 1` and `cursor-grabbing` when `isDragging` is true as two independent template-literal conditions. While dragging, both classes are present simultaneously (`cursor-grab cursor-grabbing`). CSS resolves this by the order Tailwind emits the rules, which is an implementation detail rather than a guarantee. The intent is clearly "grab unless dragging, then grabbing" — the two conditions should be mutually exclusive.

**Fix:**
```jsx
className={`... ${
  isDragging ? 'cursor-grabbing' : zoomLevel > 1 ? 'cursor-grab' : ''
}`}
```

---

### WR-02: MusicBrainz query not sanitized for Lucene special characters

**File:** `src/components/Projects/TopArtistsMap/services/musicBrainzService.js:439`

**Issue:** `lookupArtistCountry` strips double-quotes from the artist name but does not escape other Lucene special characters used by MusicBrainz's search syntax (`+`, `-`, `&&`, `||`, `!`, `(`, `)`, `{`, `}`, `[`, `]`, `^`, `~`, `*`, `?`, `:`, `\`). An artist name such as `"P!nk"`, `"Panic! at the Disco"`, or any name containing parentheses or colons will produce a malformed query, which MusicBrainz may reject (400) or interpret as an unintended Lucene expression, returning wrong candidates. The Spotify top-20 results are a controlled set, so this is unlikely to cause total failure, but several common artist names contain these characters.

**Fix:**
```js
const sanitizedArtistName = String(artistName || '')
  .replace(/[+\-!(){}\[\]^~*?:\\&|"]/g, '\\$&')
```
Or, take the simpler approach of stripping special characters entirely rather than quoting the name in Lucene field syntax, which reduces robustness of the search but is safe:
```js
const sanitizedArtistName = String(artistName || '').replace(/[^a-zA-Z0-9\s']/g, ' ').trim()
```

---

### WR-03: `persistCache` throws unhandled when localStorage quota is exceeded

**File:** `src/components/Projects/TopArtistsMap/services/musicBrainzService.js:157-159`

**Issue:** `persistCache` calls `localStorage.setItem` without error handling. If localStorage is full (`QuotaExceededError`) or unavailable (e.g., storage blocked in some private-browsing configurations), the exception propagates up through `resolveArtistsWithCountry` and is caught by the `loadTopArtists` catch block, where it surfaces to the user as a generic "Failed to load Spotify top artists" error — even though all the API work succeeded. `parseCache` already defends against parse errors; `persistCache` should match that pattern.

**Fix:**
```js
function persistCache(cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {
    // Quota exceeded or storage unavailable — results still correct, just not cached
  }
}
```

---

### WR-04: GeoJSON load failure is silent to the user

**File:** `src/components/Projects/TopArtistsMap/topArtistsMap.jsx:84-87`

**Issue:** When the GeoJSON fetch fails, the error is logged to `console.error` and `geojsonData` remains `null`, causing the map container to render empty with no explanation. The component already has an `error` state displayed to the user; this failure path should populate it.

**Fix:**
```js
fetch(GEO_URL)
  .then((res) => res.json())
  .then((data) => setGeojsonData(data))
  .catch((err) => {
    console.error('Failed to load GeoJSON:', err)
    setError('Failed to load the world map. Please refresh the page.')
  })
```

---

## Info

### IN-01: Duplicate key `lagos` in `CITY_NAME_TO_COUNTRY_CODE`

**File:** `src/components/Projects/TopArtistsMap/services/musicBrainzService.js:131-132`

**Issue:** The `CITY_NAME_TO_COUNTRY_CODE` lookup object has `lagos: 'NG'` defined twice (lines 131 and 132). The second definition silently overwrites the first in JavaScript. Both map to `'NG'` so there is no behavioral impact, but it indicates a copy-paste error and will produce a lint warning in stricter ESLint configs.

**Fix:** Remove one of the duplicate `lagos` entries.

---

### IN-02: `getViewBox()` called three times in a single JSX expression

**File:** `src/components/Projects/TopArtistsMap/topArtistsMap.jsx:596`

**Issue:** The SVG `viewBox` attribute calls `getViewBox()` three times on the same render: once per `x`, `y`, `width`, and `height` destructuring spread. Because React renders synchronously this produces identical values, but it is unnecessary computation and slightly harder to read.

**Fix:**
```jsx
const vb = getViewBox()
// ...
viewBox={`${vb.x} ${vb.y} ${vb.width} ${vb.height}`}
```
Or inline the computation directly with `useMemo` / `useCallback` if preferred.

---

### IN-03: Electronic-genre scoring heuristic applies globally when *any* listener genre matches

**File:** `src/components/Projects/TopArtistsMap/services/musicBrainzService.js:254-274`

**Issue:** `scoreCandidate` computes `isElectronicListener` by checking whether any of the Spotify listener's genres contain electronic hints. When true, it applies bonuses and penalties to *every* artist lookup in that session — including artists that are rock bands, jazz musicians, etc. — because the check is made per-candidate but based on the listener's aggregate genre list. An account that listens to a mix of electronic and rock will have all candidates evaluated as if the listener is an electronic fan, which could incorrectly penalise non-DJ `Person` type candidates for non-electronic artists. This is a design choice rather than a clear bug, but the asymmetric application is worth reviewing when accuracy issues are reported.

**Fix (suggestion):** Gate `isElectronicListener` on the specific artist being looked up having electronic genres rather than the listener's full genre pool, or limit the heuristic to only boost/penalise candidates whose own descriptor text matches electronic markers.

---

_Reviewed: 2026-05-18_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
