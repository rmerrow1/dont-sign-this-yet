import test from "node:test";
import assert from "node:assert/strict";
import { compareLoanTerms } from "./payment.js";

test("84 months compares the same financed amount and APR against 60 months", () => {
  const comparison = compareLoanTerms({price:28000,fees:500,taxes:1100,titleRegistration:250,otherGovernmentFees:100,down:2000,apr:11.5,term:84});
  assert.equal(comparison.shorterTerm, 60);
  assert.equal(Math.round(comparison.currentPayment * 100), 48595);
  assert.equal(Math.round(comparison.shorterPayment * 100), 61469);
  assert.equal(Math.round(comparison.currentInterest * 100), 1286993);
  assert.equal(Math.round(comparison.shorterInterest * 100), 893160);
});

test("0% APR compares payment without inventing interest", () => {
  const comparison = compareLoanTerms({price:30000,down:3000,apr:0,term:60});
  assert.equal(comparison.shorterTerm,48);
  assert.equal(comparison.currentPayment,450);
  assert.equal(comparison.shorterPayment,562.5);
  assert.equal(comparison.currentInterest,0);
  assert.equal(comparison.shorterInterest,0);
  assert.equal(compareLoanTerms({price:30000,apr:5,term:36}),null);
});
