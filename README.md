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
- `lib/scoring.js` — provisional Version 1.4 scoring engine
- `lib/scoring-v1.js` — preserved Version 1.0 scoring engine
- `lib/payment.js` — shared loan estimate for scoring and dealer comparison
- `lib/dealer-checks.js` — dealer quote comparisons using the Version 1.2 payment estimate
- `app/globals.css` — mobile-first styling

## Important
Version 1.1 adds entered taxes, title and government fees to the amount financed when the visitor says those charges are included in the loan. If paid upfront, the charges reduce the savings reserve instead. The monthly payment shown with the score and the dealer payment comparison use the same estimate. Unentered charges count as zero, so the visitor should confirm the actual amount financed on the contract. Version 1.0 remains in `lib/scoring-v1.js` for reference.

Version 1.2 applies the net trade balance to the loan estimate: trade value above the payoff reduces the amount financed, while a payoff above trade value increases it. The Version 1.1 scoring and payment formulas remain in `lib/scoring-v1.1.js` and `lib/payment-v1.1.js` for reference.

Version 1.3 retains the Version 1.2 payment calculation and adds score caps: price at least 15% above estimated market value (maximum 69), price at least 30% above (maximum 59), dealer fees at least 10% of vehicle price (maximum 69), fees at least 15% (maximum 64), and listed essential expenses plus estimated transportation greater than take-home pay (maximum 59). The market value and listed expenses are user supplied; verify them before relying on the verdict. The Version 1.2 baseline is available at Git commit `020e54e`.

Version 1.4 limits the overall score to 69 when the affordability category is 5 out of 25 or lower, so strong vehicle and financing categories cannot produce a green verdict with very weak affordability. It retains the Version 1.3 payment and other scoring calculations. The Version 1.3 baseline is available at Git commit `16693ef`.
