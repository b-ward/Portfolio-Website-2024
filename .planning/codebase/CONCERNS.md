# CONCERNS

## High Severity

### Hardcoded API keys in client code
- `src/components/Projects/Arbitrage/arbitrageCalcutations.jsx` includes multiple The Odds API keys directly in frontend-delivered code.
- Impact: credential exposure, key abuse, unexpected billing/quota exhaustion, forced key rotation.
- Priority: immediate migration to server-side proxy + environment variables.

## Medium/High Severity

### Very large stateful component complexity
- `src/components/Projects/Trio/trioGame.jsx` exceeds 1,000 lines with extensive mutable game state and imperative logic.
- Impact: difficult maintenance, debugging friction, high regression probability.

### Legacy/modern React mix
- Class components and hooks coexist across core areas (`src/App.jsx` vs newer functional modules).
- Impact: inconsistent patterns, onboarding overhead, uneven refactor paths.

### Navigation pattern bypasses SPA primitives
- Several route transitions use `<a href>` instead of router links.
- Impact: full page reload behavior and less consistent client-side navigation experience.

## Medium Severity

### Potential router version mismatch risk
- Route definitions still use `exact` props in `src/components/main.jsx` while dependency is modern `react-router-dom`.
- Impact: silent no-op props and confusion when upgrading/maintaining routes.

### No automated tests
- No test suite detected; validation appears manual.
- Impact: fragile changes, slower confidence during feature updates.

### Dependency hygiene
- `@vitejs/plugin-react` appears in both dependencies and devDependencies.
- Impact: lockfile/package clarity issues and avoidable maintenance noise.

## Known Debt Signals in Code
- Explicit cleanup comments such as `//NEED TO:` in:
  - `src/components/Projects/Arbitrage/arbitrageCalcutations.jsx`
  - `src/components/Projects/Trio/trioGame.jsx`
  - `src/components/Projects/Trio/trioGame-state.jsx`

## Additional Notes
- The security posture is currently uneven: NBA API key is server-side protected, while Odds API keys are not.
- Prioritize secret handling and high-complexity module decomposition before major feature expansion.
