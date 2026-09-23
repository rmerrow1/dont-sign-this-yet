# Don't Sign This Yet — Production Web App

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
- `lib/scoring.js` — provisional Version 1.1 scoring engine
- `lib/scoring-v1.js` — preserved Version 1.0 scoring engine
- `lib/payment.js` — shared loan estimate for scoring and dealer comparison
- `lib/dealer-checks.js` — dealer quote comparisons using the Version 1.1 payment estimate
- `app/globals.css` — mobile-first styling

## Important
Version 1.1 adds entered taxes, title and government fees to the amount financed when the visitor says those charges are included in the loan. If paid upfront, the charges reduce the savings reserve instead. The monthly payment shown with the score and the dealer payment comparison use the same estimate. Unentered charges count as zero, so the visitor should confirm the actual amount financed on the contract. Version 1.0 remains in `lib/scoring-v1.js` for reference.
