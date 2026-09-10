# Don't Sign This Yet — Production Web App V1

## Run locally
1. Install Node.js 20+
2. Open a terminal in this folder
3. Run:
   npm install
   npm run dev
4. Open http://localhost:3000

## Production build
npm run build
npm run start

## Architecture
- `app/page.js` — responsive React UI
- `lib/scoring.js` — frozen provisional Version 1.0 scoring engine
- `app/globals.css` — mobile-first styling

## Important
The scoring engine is intentionally isolated from the UI so future changes can be versioned without silently changing Version 1.0.
