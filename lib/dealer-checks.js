import { estimateLoan } from "./payment.js";

const amount = value => Number(value) || 0;
const filled = value => String(value ?? "").trim() !== "";

export function checkDealerNumbers(deal, details) {
  const notes = [];
  const completeCosts = ["taxes", "titleRegistration", "otherGovernmentFees"]
    .every(key => filled(details[key]) && Number(details[key]) >= 0);
  const price = amount(deal.price);
  const total = price + amount(deal.addons) + amount(deal.fees) +
    amount(details.taxes) + amount(details.titleRegistration) + amount(details.otherGovernmentFees);
  let comparisons = 0;

  if (filled(details.outTheDoor) && amount(details.outTheDoor) > 0 && price > 0 && completeCosts) {
    comparisons++;
    const difference = amount(details.outTheDoor) - total;
    if (Math.abs(difference) > 25) {
      notes.push(`The dealer's out-the-door price is $${Math.abs(difference).toLocaleString()} ${difference > 0 ? "higher" : "lower"} than the itemized total. Ask the dealer to explain the difference.`);
    }
  }

  const apr = amount(deal.apr);
  const term = amount(deal.term);
  const estimate = estimateLoan({...deal, ...details});
  const financed = estimate.financed;
  const estimatedPayment = estimate.monthly;

  if (filled(details.payment) && amount(details.payment) > 0 && price > 0 && term > 0 && apr > 0 && completeCosts && financed > 0) {
    comparisons++;
    const difference = amount(details.payment) - estimatedPayment;
    if (Math.abs(difference) > 25) {
      notes.push(`The dealer's monthly payment is about $${Math.abs(difference).toLocaleString(undefined, {maximumFractionDigits: 0})} ${difference > 0 ? "higher" : "lower"} than our estimate. Verify the amount financed, APR, term, taxes and fees with the dealer.`);
    }
  }

  return { notes, total, estimatedPayment, completeCosts, comparisons };
}
