---
status: partial
phase: 06-mini-projects
source: [06-VERIFICATION.md]
started: 2026-05-17T00:00:00.000Z
updated: 2026-05-17T00:00:00.000Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. TrainGame — calculation and modals
expected: Navigate to /Projects/TrainGame, enter 2384 → solutions list appears; Help modal opens/closes; Creation modal opens/closes; no double top spacing
result: [pending]

### 2. TrioHome — renders, modals open
expected: Navigate to /Projects/Trio → page renders with Creation and Help buttons; both modals open/close via shared Modal; no double top spacing
result: [pending]

### 3. TrioGame — game board and Help step indicator
expected: Navigate to /Projects/TrioGame → dark green game canvas renders; Help modal opens with step indicator showing image 1/13; ← → arrows navigate all 13 images; game cards respond to clicks
result: [pending]

### 4. PaceCalculator — calculation and auto-tab
expected: Navigate to /Projects/PaceCalculator → white card on dark background; enter distance + time, Calculate → pace result; tab between time inputs triggers auto-advance (nextRef); no double top spacing
result: [pending]

### 5. 500 Scorer — game state, localStorage, no color-scheme: light
expected: Navigate to /Projects/FiveHundred → white card on dark background; record a bet; undo works; reset works; refresh → state restores; browser devtools shows no color-scheme: light only
result: [pending]

### 6. NoisyDetector — blank page, no errors
expected: Navigate to /Projects/Noise → blank page renders without console errors
result: [pending]

### 7. Arbitrage — dark Tailwind styling, fetch
expected: Navigate to /Projects/Arbitrage → dark background, gold title; click Fetch Bets → loading spinner visible; Info modal opens/closes; no double top spacing
result: [pending]

### 8. NBA Ladder — dark theme, centred layout
expected: Navigate to /Projects/NBA-Ladder → dark bg-surface card, centred (no 80px left offset); without netlify dev: graceful error/loading message; no white box
result: [pending]

## Summary

total: 8
passed: 0
issues: 0
pending: 8
skipped: 0
blocked: 0

## Gaps
