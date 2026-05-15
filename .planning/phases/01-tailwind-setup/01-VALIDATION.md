---
phase: 1
slug: tailwind-setup
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-15
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None (no test framework installed — deferred to v2 TEST-01/TEST-02) |
| **Config file** | none |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npm run lint` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npm run lint`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** ~15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | SETUP-01 | — | N/A | grep | `node -e "const p=require('./package.json'); if(p.dependencies?.bootstrap||p.devDependencies?.bootstrap||p.dependencies?.['react-bootstrap']||p.devDependencies?.['react-bootstrap']) process.exit(1)"` | ✅ | ⬜ pending |
| 1-01-02 | 01 | 1 | SETUP-02 | — | N/A | grep | `grep -c "color-bg\|color-surface\|color-accent\|color-text" src/index.css` | ✅ | ⬜ pending |
| 1-01-03 | 01 | 1 | SETUP-03 | — | N/A | build | `npm run build` | ✅ | ⬜ pending |
| 1-01-04 | 01 | 1 | SETUP-04 | — | N/A | build | `npm run build` | ✅ | ⬜ pending |
| 1-01-05 | 01 | 1 | QUAL-03 | — | N/A | grep | `grep -c "bootstrap" src/index.jsx` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements. This is a pure infrastructure swap — no test files are needed. Verification is via `npm run build` (exit code 0) and grep checks.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Dev server starts with no CSS import errors in terminal | SETUP-03 | Requires running dev server and inspecting terminal output | Run `npm run dev`, confirm no CSS/import errors in terminal or browser console |
| Tailwind CSS is active in browser (DevTools shows Tailwind-generated CSS) | SETUP-02 | Requires browser inspection | Open DevTools → Elements → Styles, confirm Tailwind utility classes resolve |
| Routes that import react-bootstrap show expected module error (accepted) | SETUP-01 | Expected regression per D-09 | Visit /about, /cv, /projects routes — confirm all other routes (landing page) load without errors |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
