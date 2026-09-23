import test from "node:test";
import assert from "node:assert/strict";
import { checkDealerNumbers } from "./dealer-checks.js";

const deal = {price:20000, addons:500, fees:400, apr:6, term:60, down:2000, tradeValue:0, tradeOwed:0};
const details = {outTheDoor:"22500", taxes:"1200", titleRegistration:"300", otherGovernmentFees:"100", payment:"396"};

test("compares a complete dealer breakdown without duplicate deal entries", () => {
  const check = checkDealerNumbers(deal, details);
  assert.equal(check.total, 22500);
  assert.equal(check.comparisons, 2);
  assert.deepEqual(check.notes, []);
});

test("flags a mismatch in the dealer total and payment", () => {
  const check = checkDealerNumbers(deal, {...details, outTheDoor:"23000", payment:"500"});
  assert.equal(check.notes.length, 2);
  assert.match(check.notes[0], /\$500 higher/);
  assert.match(check.notes[1], /monthly payment/);
});

test("does not accuse the dealer when itemized taxes are missing", () => {
  const check = checkDealerNumbers(deal, {...details, taxes:""});
  assert.equal(check.completeCosts, false);
  assert.equal(check.comparisons, 0);
  assert.deepEqual(check.notes, []);
});
