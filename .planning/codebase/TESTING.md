# TESTING

## Current Testing State
- No unit/integration test files detected by common glob patterns (`*.test.*`, `*.spec.*`).
- No dedicated test runner script in `package.json`.
- No CI test workflow files detected in this repository snapshot.

## Existing Quality Gates
- Linting is available through `npm run lint`.
- Build validation is available through `npm run build`.
- Local runtime validation is done via `npm run dev` and optionally `netlify dev` (per `README.md`).

## Manual Validation Footprint
- Most validation appears manual by visiting routes and using project tools.
- API flows can be validated manually:
  - NBA standings through `/.netlify/functions/standings` path usage.
  - Arbitrage outputs rendered from The Odds API requests.

## Testability Observations
- Smaller functional components are straightforward to isolate.
- Very large components with heavy mutable state (for example `trioGame.jsx`) increase test setup complexity.
- Direct DOM manipulation patterns in legacy code complicate deterministic testing.

## Coverage Estimate
- Automated test coverage: effectively 0% (no test suite present).
- Static analysis coverage: partial via ESLint rules.

## Risks from Current State
- Regressions are likely to be detected late (manual-only checks).
- Integration failures may surface only during runtime/deployment.
- Refactors in large legacy modules are high risk without baseline tests.
