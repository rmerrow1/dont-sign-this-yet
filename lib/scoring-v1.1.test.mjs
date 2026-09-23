import test from "node:test";
import assert from "node:assert/strict";
import { calculateDealScore } from "./scoring.js";
import { calculateDealScore as calculateV1 } from "./scoring-v1.js";
import { checkDealerNumbers } from "./dealer-checks.js";

const deal = {
  condition:"used", credit:"prime", price:20000, market:20000, apr:6, term:60,
  down:2000, addons:500, fees:400, tradeValue:0, tradeOwed:0,
  income:4500, expenses:2500, savings:8000, insurance:150, fuel:100, maintenance:50
};
const charges = {taxes:1200, titleRegistration:300, otherGovernmentFees:100};

test("Version 1.0 remains reproducible and Version 1.1 retains its baseline when charges are unknown", () => {
  const old = calculateV1(deal);
  const current = calculateDealScore(deal);
  assert.equal(current.financed, old.financed);
  assert.equal(current.monthly, old.monthly);
  assert.equal(current.score, old.score);
});

test("financed charges yield one consistent payment in score and dealer comparison", () => {
  const score = calculateDealScore({...deal, ...charges});
  const check = checkDealerNumbers(deal, {...charges, outTheDoor:22500, payment:score.monthly});
  assert.equal(score.financed, 20500);
  assert.ok(score.monthly > calculateV1(deal).monthly);
  assert.equal(score.monthly, check.estimatedPayment);
  assert.equal(check.notes.length, 0);
});

test("financed charges affect affordability and can lower the Version 1.1 score", () => {
  const scenario = {...deal, income:3100, expenses:1000};
  const before = calculateV1(scenario);
  const after = calculateDealScore({...scenario, ...charges});
  assert.ok(after.categories.affordability < before.categories.affordability);
  assert.ok(after.score < before.score);
});

test("charges paid upfront stay out of the loan and reduce cash reserves", () => {
  const comparison = {...deal, savings:7000};
  const cash = calculateDealScore({...comparison, ...charges, financeGovernmentCharges:false});
  const financed = calculateDealScore({...comparison, ...charges});
  const old = calculateV1(comparison);
  assert.equal(cash.financed, old.financed);
  assert.equal(cash.monthly, old.monthly);
  assert.ok(cash.categories.affordability < old.categories.affordability);
  assert.equal(financed.financed - cash.financed, 1600);
  assert.equal(checkDealerNumbers(comparison, {...charges, financeGovernmentCharges:false, payment:cash.monthly}).estimatedPayment, cash.monthly);
});
