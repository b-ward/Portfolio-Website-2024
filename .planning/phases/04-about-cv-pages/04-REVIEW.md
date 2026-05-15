---
phase: 04-about-cv-pages
reviewed: 2026-05-15T00:00:00Z
depth: standard
files_reviewed: 3
files_reviewed_list:
  - src/components/Shared/card.jsx
  - src/components/About/about.jsx
  - src/components/CV/cv.jsx
findings:
  critical: 0
  warning: 2
  info: 2
  total: 4
status: issues_found
---

# Phase 4: Code Review Report

**Reviewed:** 2026-05-15
**Depth:** standard
**Files Reviewed:** 3
**Status:** issues_found

## Summary

All three files are fully converted from Bootstrap class components to Tailwind functional components. The migration is structurally correct: Bootstrap imports removed, CSS files deleted, functional arrow-function form used throughout, colour tokens applied correctly (`bg-surface`, `text-accent`), image paths use the public-root convention (`/BrendonWard.png`, `/CV/*.jpg`), and the `SharedCard` component is imported and consumed properly.

Two warnings and two info items are noted. The most actionable is duplicate React `key` values across sibling arrays in `cv.jsx`, which causes React to emit console warnings and degrades reconciliation. The `card.jsx` image alignment has a minor layout deviation from the PATTERNS.md spec (extra `mt-6 ml-6` not in plan). The two info items are cosmetic/minor.

---

## Warnings

### WR-01: Duplicate `key` values across sibling `cardBody` arrays in `cv.jsx`

**File:** `src/components/CV/cv.jsx:21-35`

**Issue:** The two bullet-list `cardBody` arrays (WiseTech Global, line 21; EY, line 30) both use `key="1"` through `key="4"` on their `<br/>` elements. Within each individual array these keys are unique, but the pattern is fragile: if the two arrays are ever merged, hoisted, or iterated together React will produce duplicate-key warnings. More importantly, the keys are scoped inside a `<div>{cardBody}</div>` in `SharedCard`, so right now each card is its own React subtree and the duplication is benign — but this is a bug waiting to surface. Conventionally, keys should be unique within their immediate sibling list and descriptive enough to be unambiguous.

**Fix:** Use stable, semantically distinct keys for each `<br/>` in each array. A simple approach is a compound key that includes the section name:

```jsx
// WiseTech card
cardBody={[
  "- Product lead ...", <br key="wtg-1"/>,
  "- Working closely ...", <br key="wtg-2"/>,
  "- Developed ongoing ...", <br key="wtg-3"/>,
  "- Responsible for ...", <br key="wtg-4"/>,
  "- Actioning technical ..."
]}

// EY card
cardBody={[
  "- Involved in development ...", <br key="ey-1"/>,
  "- Completed third party ...", <br key="ey-2"/>,
  "- Carried out security ...", <br key="ey-3"/>,
  "- Completed Security Architecture ...", <br key="ey-4"/>,
  "- Performed penetration test ..."
]}
```

---

### WR-02: `card.jsx` image element has extra spacing classes not present in PATTERNS.md spec

**File:** `src/components/Shared/card.jsx:10`

**Issue:** The image renders with `mt-6 ml-6` in addition to the planned `pr-4 self-start`. The PATTERNS.md planned pattern (line 57) is:

```jsx
className="max-h-[100px] w-auto pr-4 self-start"
```

The implemented classes are:

```jsx
className="max-h-[100px] w-auto pr-4 self-start mt-6 ml-6"
```

With `mt-6 ml-6` on the image and `p-6` on the sibling text container, the image gains 24px top/left padding via margin while the text has 24px padding on all sides. This creates visual asymmetry: when the image is present the image top sits flush with the card top only after 24px of top margin, while the text starts at the same offset from `p-6`. This may look intentional but it is undocumented and deviates from the spec. If the visual result is correct and intentional, the PATTERNS.md note at line 57 should be updated. If not intentional, remove `mt-6 ml-6`.

**Fix — if intentional (document it):** Add a comment to PATTERNS.md or card.jsx noting why the extra margins are needed.

**Fix — if not intentional (remove extra margins):**

```jsx
<img
  src={imageSrc}
  alt=""
  className="max-h-[100px] w-auto pr-4 self-start"
/>
```

---

## Info

### IN-01: `cardBody` bullet arrays could use `<br/>` instead of `<br key="..."/>` via a different structure

**File:** `src/components/CV/cv.jsx:21-35`

**Issue:** Using arrays of mixed strings and `<br/>` elements is a valid but unconventional React pattern. The pattern works, but a `<ul>`/`<li>` list would be semantically cleaner and would eliminate the need for explicit keys entirely. This is a suggestion only; the current pattern is not broken.

**Fix (optional):** Replace the array + `<br/>` pattern with a proper list:

```jsx
cardBody={
  <ul className="list-none pl-0 space-y-1">
    <li>Product lead for MDM CORE sub-team ...</li>
    <li>Working closely with the Product Manager ...</li>
    ...
  </ul>
}
```

---

### IN-02: `flex flex-row` on the inner div in `card.jsx` is redundant — `flex-row` is the Tailwind default

**File:** `src/components/Shared/card.jsx:5`

**Issue:** `flex-row` is the default direction for a flex container, so `flex flex-row` is equivalent to just `flex`. This does not cause any bug but adds a redundant class.

**Fix:**

```jsx
<div className="flex">
```

---

_Reviewed: 2026-05-15_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
