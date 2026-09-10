export const APRS = {
  new: { super: 4.5, prime: 6.0, near: 8.5, sub: 11.5, deep: 15.5 },
  used: { super: 5.0, prime: 8.5, near: 11.0, sub: 14.5, deep: 19.0 }
};

const tier = (x, rules) => rules.find(([limit]) => x <= limit)[1];

export function calculateDealScore(x) {
  const price = Math.max(0, Number(x.price) || 0);
  const market = Math.max(1, Number(x.market) || 1);
  const apr = Math.max(0, Number(x.apr) || 0);
  const term = Math.max(1, Number(x.term) || 1);
  const down = Math.max(0, Number(x.down) || 0);
  const addons = Math.max(0, Number(x.addons) || 0);
  const fees = Math.max(0, Number(x.fees) || 0);
  const income = Math.max(1, Number(x.income) || 1);
  const savings = Math.max(0, Number(x.savings) || 0);
  const expenses = Math.max(1, Number(x.expenses) || 1);
  const insurance = Math.max(0, Number(x.insurance) || 0);
  const fuel = Math.max(0, Number(x.fuel) || 0);
  const maintenance = Math.max(0, Number(x.maintenance) || 0);
  const neg = Math.max(0, (Number(x.tradeOwed)||0) - (Number(x.tradeValue)||0));
  const benchmark = APRS[x.condition][x.credit];

  const financed = Math.max(0, price + addons + fees + neg - down);
  const r = apr / 100 / 12;
  const monthly = r === 0 ? financed / term : financed * r * Math.pow(1+r, term) / (Math.pow(1+r, term)-1);
  const interest = Math.max(0, monthly * term - financed);

  const priceDiff = ((price-market)/market)*100;
  const addonPct = addons/Math.max(price,1)*100;
  const feePct = fees/Math.max(price,1)*100;
  const aprDiff = Math.max(0, apr-benchmark);
  const negPct = neg/Math.max(price,1)*100;
  const interestPct = interest/Math.max(financed,1)*100;
  const paymentRatio = monthly/income*100;
  const transportRatio = (monthly+insurance+fuel+maintenance)/income*100;
  const reserveMonths = Math.max(0,savings-down)/expenses;

  const pricePenalty = priceDiff<=0 ? 0 : tier(priceDiff, [[2,2],[5,6],[8,12],[12,19],[Infinity,25]]);
  const addonPenalty = tier(addonPct, [[1,0],[3,2],[5,5],[10,8],[Infinity,12]]);
  const feePenalty = tier(feePct, [[1,0],[2,1],[4,3],[Infinity,5]]);
  const vehicle = Math.max(3, 25-pricePenalty);

  const aprPenalty = tier(aprDiff, [[0,0],[1,2],[2,5],[3,9],[5,14],[Infinity,18]]);
  const termPenalty = tier(term, [[48,0],[60,2],[72,6],[84,11],[Infinity,15]]);
  const interestPenalty = tier(interestPct, [[5,0],[10,1],[20,3],[30,5],[Infinity,7]]);
  const finance = Math.max(3, 25-aprPenalty-termPenalty-interestPenalty);

  const paymentPenalty = tier(paymentRatio, [[8,0],[12,2],[15,5],[20,10],[Infinity,14]]);
  const transportPenalty = tier(transportRatio, [[12,0],[15,2],[20,5],[25,9],[30,12],[Infinity,15]]);
  const reservePenalty = tier(reserveMonths, [[.99,8],[1.99,5],[2.99,2],[Infinity,0]]);
  const affordability = Math.max(2, 25-paymentPenalty-transportPenalty-reservePenalty);

  const negPenalty = tier(negPct, [[0,0],[5,2],[10,5],[15,10],[25,16],[Infinity,20]]);
  const structure = Math.max(2, 25-negPenalty-addonPenalty-feePenalty);

  const base = Math.min(100, vehicle+finance+affordability+structure);
  const caps = [];
  if (aprDiff >= 8) caps.push({max:59, reason:"APR is at least 8 percentage points above the estimated benchmark."});
  else if (aprDiff >= 5) caps.push({max:69, reason:"APR is at least 5 percentage points above the estimated benchmark."});
  if (negPct >= 25) caps.push({max:59, reason:"Negative equity is at least 25% of the vehicle price."});
  if (addonPct >= 15) caps.push({max:64, reason:"Dealer add-ons are at least 15% of the vehicle price."});
  if (transportRatio > 30) caps.push({max:59, reason:"Estimated transportation costs exceed 30% of take-home pay."});
  if (term >= 84 && aprDiff >= 3) caps.push({max:64, reason:"A long loan term is combined with an APR substantially above the benchmark."});

  const score = Math.round(Math.min(base, ...caps.map(c=>c.max), 100));
  let verdict = "DON'T SIGN YET", color = "red";
  if (score >= 85) { verdict = "THIS APPEARS TO BE A GOOD DEAL"; color = "green"; }
  else if (score >= 70) { verdict = "THIS APPEARS REASONABLE"; color = "green"; }
  else if (score >= 50) { verdict = "THIS DEAL HAS SOME CONCERNS"; color = "yellow"; }

  return {score, verdict, color, base:Math.round(base), categories:{vehicle,finance,affordability,structure},
    caps, monthly, financed, interest, benchmark, aprDiff, term, addonPct, negPct};
}
