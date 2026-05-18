---
phase: 6
slug: mini-projects
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-17
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None installed (v2 requirement TEST-01 deferred) |
| **Config file** | none |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npm run lint` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npm run lint`
- **Before `/gsd-verify-work`:** Full suite must be green + all 7 routes visually verified
- **Max feedback latency:** ~15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| shared-modal | W1 | 1 | TOOL-01, TOOL-02, TOOL-03 | — | N/A | smoke | `npm run build` | ❌ W0 | ⬜ pending |
| arbitrage-css | W1 | 1 | TOOL-01 | — | N/A | smoke+manual | `npm run build` | ✅ | ⬜ pending |
| train-game | W2 | 2 | TOOL-03 | — | N/A | smoke+manual | `npm run build` | ✅ | ⬜ pending |
| trio-home | W2 | 2 | TOOL-02 | — | N/A | smoke+manual | `npm run build` | ✅ | ⬜ pending |
| noisy-detector | W2 | 2 | TOOL-06 | — | N/A | smoke | `npm run build` | ✅ | ⬜ pending |
| pace-calc | W3 | 3 | TOOL-04 | — | N/A | smoke+manual | `npm run build` | ✅ | ⬜ pending |
| 500-scorer | W3 | 3 | TOOL-05 | — | N/A | smoke+manual | `npm run build` | ✅ | ⬜ pending |
| nba-ladder | W3 | 3 | TOOL-07 | — | N/A | smoke+manual | `npm run build` | ✅ | ⬜ pending |
| trio-game | W4 | 4 | TOOL-02 | — | N/A | smoke+manual | `npm run build` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/components/Shared/Modal.jsx` — create shared modal component (referenced by TOOL-01, TOOL-02, TOOL-03 tasks)

*All other phase requirements use existing files. No test framework to install.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Arbitrage odds calculations produce correct output | TOOL-01 | No unit test framework installed | Navigate to `/Projects/Arbitrage`, click "Fetch Bets", verify odds display and profit margins |
| Trio game cards/scoring/win-lose states | TOOL-02 | Complex DOM-manipulated game board | Navigate to `/Projects/TrioGame`, deal cards, play a full hand, verify scoring and win detection |
| Trio carousel → slide indicator shows 13 pages | TOOL-02 | Visual interaction | Open Help modal in TrioGame, click prev/next, verify all 13 instruction images load |
| TrainGame 4-digit input → solutions | TOOL-03 | No unit tests | Navigate to `/Projects/TrainGame`, enter `2384`, verify solutions display |
| PaceCalculator time+distance → pace result | TOOL-04 | No unit tests | Navigate to `/Projects/PaceCalculator`, enter a distance and time, verify pace output |
| 500 Scorer bet recording, undo, reset | TOOL-05 | Complex multi-step game state | Navigate to `/Projects/FiveHundred`, record bets across multiple rounds, verify undo and reset |
| NBA Ladder error state without Netlify dev | TOOL-07 | Requires local Netlify function | Navigate to `/Projects/NBA-Ladder` without `netlify dev` running — verify graceful error message |
| No double top spacing on any tool page | D-12 (CONTEXT) | Visual regression | Inspect each tool page — toolbar gap should be 56px total, not 112px |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
