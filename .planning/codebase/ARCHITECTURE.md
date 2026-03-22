# ARCHITECTURE

## High-Level Pattern
- Single-page React application with route-based page modules.
- Lightweight serverless edge for one protected upstream API call (Sportradar).
- Predominantly component-local state (no global state library detected).

## Entry Points
- Frontend bootstrap: `src/index.jsx`.
- App shell: `src/App.jsx`.
- Routing table: `src/components/main.jsx`.
- Serverless function entry: `netlify/functions/standings.js`.

## Layering
1. **App Shell Layer**
   - Navigation/frame behavior in `src/App.jsx`, `src/components/Toolbar/Toolbar.jsx`, `src/components/SideDrawer/SideDrawer.jsx`, `src/components/Backdrop/Backdrop.jsx`.
2. **Route/Page Layer**
   - Route components in `src/components/main.jsx` map URLs to pages and project tools.
3. **Feature Layer**
   - Feature-specific components under `src/components/Projects/*` and other top-level sections (`About`, `Photos`, `Music`, etc.).
4. **Integration Layer**
   - External fetches inside feature code and Netlify function (`NBA-Ladder`, `Arbitrage`, `netlify/functions/standings.js`).

## Data Flow
- User navigation triggers route rendering through BrowserRouter.
- Most data originates from local state (`useState` or class `state`).
- API-backed flows:
  - NBA standings: Browser -> Netlify Function -> Sportradar -> response transformed in component.
  - Arbitrage: Browser -> The Odds API directly.

## Architectural Characteristics
- Feature modules are mostly isolated by route.
- Business logic and presentation are often colocated in component files.
- Legacy and modern React paradigms coexist (class components + hooks).

## Notable Architectural Constraints
- No shared service layer for HTTP/integration logic.
- No explicit domain module boundaries beyond folders.
- Several components use anchor-based navigation (`<a href>`), reducing SPA-native navigation benefits.
