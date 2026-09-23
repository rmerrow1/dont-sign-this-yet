const nonnegative = value => Math.max(0, Number(value) || 0);

export function estimateLoan(x) {
  const governmentCharges = nonnegative(x.taxes) + nonnegative(x.titleRegistration) + nonnegative(x.otherGovernmentFees);
  const financedGovernmentCharges = x.financeGovernmentCharges === false ? 0 : governmentCharges;
  const upfrontGovernmentCharges = governmentCharges - financedGovernmentCharges;
  const tradeBalance = nonnegative(x.tradeOwed) - nonnegative(x.tradeValue);
  const financed = Math.max(0, nonnegative(x.price) + nonnegative(x.addons) + nonnegative(x.fees) +
    financedGovernmentCharges + tradeBalance - nonnegative(x.down));
  const term = Math.max(1, Number(x.term) || 1);
  const monthlyRate = nonnegative(x.apr) / 1200;
  const monthly = monthlyRate === 0
    ? financed / term
    : financed * monthlyRate * Math.pow(1 + monthlyRate, term) / (Math.pow(1 + monthlyRate, term) - 1);
  return {financed, monthly, financedGovernmentCharges, upfrontGovernmentCharges};
}

export function compareLoanTerms(x) {
  const term = Number(x.term);
  if (!Number.isFinite(term) || term <= 36) return null;
  const shorterTerm = term > 60 ? 60 : term > 48 ? 48 : 36;
  const current = estimateLoan(x);
  const shorter = estimateLoan({...x, term:shorterTerm});
  return {
    term,
    shorterTerm,
    currentPayment:current.monthly,
    shorterPayment:shorter.monthly,
    currentInterest:Math.max(0, current.monthly * term - current.financed),
    shorterInterest:Math.max(0, shorter.monthly * shorterTerm - shorter.financed)
  };
}
