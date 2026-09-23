import test from "node:test";
import assert from "node:assert/strict";
import { calculateDealScore } from "./scoring.js";
import { calculateDealScore as calculateV11 } from "./scoring-v1.1.js";
import { checkDealerNumbers } from "./dealer-checks.js";

const deal = {
  condition:"used", credit:"prime", price:24000, market:23000, apr:9.5, term:72,
  down:3000, addons:1200, fees:650, income:4500, expenses:2700,
  savings:5000, insurance:180, fuel:160, maintenance:80,
  taxes:1500, titleRegistration:400, otherGovernmentFees:100
};

test("positive trade equity reduces the loan and dealer-check payment equally", () => {
  const traded = {...deal, tradeValue:8000, tradeOwed:3000};
  const current = calculateDealScore(traded);
  const previous = calculateV11(traded);
  const check = checkDealerNumbers(traded, {...traded, payment:current.monthly});
  assert.equal(previous.financed - current.financed, 5000);
  assert.equal(current.financed, 19850);
  assert.ok(current.monthly < previous.monthly);
  assert.equal(current.monthly, check.estimatedPayment);
  assert.equal(check.notes.length, 0);
});

test("negative equity and no trade retain Version 1.1 results", () => {
  for (const trade of [{tradeValue:6000, tradeOwed:8000}, {tradeValue:0, tradeOwed:0}]) {
    const scenario = {...deal, ...trade};
    const current = calculateDealScore(scenario);
    const previous = calculateV11(scenario);
    assert.equal(current.financed, previous.financed);
    assert.equal(current.monthly, previous.monthly);
    assert.equal(current.score, previous.score);
  }
});

test("trade credit cannot create a negative loan", () => {
  const score = calculateDealScore({...deal, tradeValue:50000, tradeOwed:0});
  assert.equal(score.financed, 0);
  assert.equal(score.monthly, 0);
});
