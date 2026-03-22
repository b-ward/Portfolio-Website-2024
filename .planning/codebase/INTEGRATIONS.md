# INTEGRATIONS

## External Services

### Sportradar NBA API
- Consumer UI: `src/components/Projects/NBA-Ladder/NBA-Ladder.jsx`.
- Server-side proxy: `netlify/functions/standings.js`.
- Frontend calls local function path `/.netlify/functions/standings`.
- Serverless function reads `process.env.SPORTRADAR_NBA_API_KEY` and calls Sportradar standings endpoint.

### The Odds API
- Consumer logic: `src/components/Projects/Arbitrage/arbitrageCalcutations.jsx`.
- Direct browser requests made to `api.the-odds-api.com` via `fetch`.
- Multiple API keys are hardcoded directly in the client file (security and quota exposure risk).

### Embedded Media
- YouTube iframe embedded in `src/components/Projects/Trio/trioGame.jsx`.

## Platform Integrations
- Netlify Functions runtime under `netlify/functions/`.
- Netlify SPA routing fallback via `public/_redirects`.
- README documents Netlify CLI deployment flow (`netlify dev`, `netlify deploy`, `netlify deploy --prod`).

## Internal Integration Boundaries
- Frontend route layer: `src/components/main.jsx`.
- App shell integration: `src/App.jsx` combines `Toolbar`, `SideDrawer`, `Backdrop`, and page content.
- Feature pages integrate mostly through route navigation and local component state.

## Authentication, Database, and Storage
- No first-party auth provider integration detected.
- No DB ORM/SDK detected (no Prisma/Firebase/Supabase/Mongoose usage found).
- Asset storage appears static (under `public/` and `src/assets/`).

## Secrets & Config Handling
- Positive pattern: Sportradar key in server env var (`netlify/functions/standings.js`).
- High-risk pattern: The Odds API keys hardcoded in browser code (`src/components/Projects/Arbitrage/arbitrageCalcutations.jsx`).
- No dedicated `.env.example` or centralized runtime config file detected.
