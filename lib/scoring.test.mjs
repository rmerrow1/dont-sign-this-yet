import test from "node:test";
import assert from "node:assert/strict";
import { calculateDealScore, APRS } from "./scoring.js";

function baseDeal(overrides = {}) {
  return {
    condition: "new",
    credit: "prime",
    price: 40000,
    market: 40000,
    apr: APRS.new.prime,
    term: 48,
    down: 5000,
    addons: 0,
    fees: 0,
    income: 8000,
    savings: 25000,
    expenses: 3500,
    insurance: 150,
    fuel: 150,
    maintenance: 75,
    tradeOwed: 0,
    tradeValue: 0,
    ...overrides
  };
}

test("baseline deal has no critical caps", () => {
  const result = calculateDealScore(baseDeal());

  assert.equal(result.caps.length, 0);
  assert.ok(result.score >= 85);
});

test("APR just below +5 does not trigger 69 cap", () => {
  const benchmark = APRS.new.prime;
  const result = calculateDealScore(
    baseDeal({ apr: benchmark + 4.99 })
  );

  assert.equal(
    result.caps.some((cap) => cap.max === 69),
    false
  );
});

test("APR at +5 triggers 69 cap", () => {
  const benchmark = APRS.new.prime;
  const result = calculateDealScore(
    baseDeal({ apr: benchmark + 5 })
  );

  assert.equal(
    result.caps.some((cap) => cap.max === 69),
    true
  );
  assert.ok(result.score <= 69);
});

test("APR just below +8 does not trigger 59 APR cap", () => {
  const benchmark = APRS.new.prime;
  const result = calculateDealScore(
    baseDeal({ apr: benchmark + 7.99 })
  );

  assert.equal(
    result.caps.some(
      (cap) =>
        cap.max === 59 &&
        cap.reason.startsWith("APR")
    ),
    false
  );
});

test("APR at +8 triggers 59 cap", () => {
  const benchmark = APRS.new.prime;
  const result = calculateDealScore(
    baseDeal({ apr: benchmark + 8 })
  );

  assert.equal(
    result.caps.some(
      (cap) =>
        cap.max === 59 &&
        cap.reason.startsWith("APR")
    ),
    true
  );
  assert.ok(result.score <= 59);
});

test("negative equity just below 25% does not trigger cap", () => {
  const result = calculateDealScore(
    baseDeal({
      tradeValue: 0,
      tradeOwed: 9999
    })
  );

  assert.equal(
    result.caps.some(
      (cap) =>
        cap.max === 59 &&
        cap.reason.startsWith("Negative equity")
    ),
    false
  );
});

test("negative equity at 25% triggers 59 cap", () => {
  const result = calculateDealScore(
    baseDeal({
      tradeValue: 0,
      tradeOwed: 10000
    })
  );

  assert.equal(
    result.caps.some(
      (cap) =>
        cap.max === 59 &&
        cap.reason.startsWith("Negative equity")
    ),
    true
  );
  assert.ok(result.score <= 59);
});

test("add-ons just below 15% do not trigger cap", () => {
  const result = calculateDealScore(
    baseDeal({ addons: 5999 })
  );

  assert.equal(
    result.caps.some(
      (cap) =>
        cap.max === 64 &&
        cap.reason.startsWith("Dealer add-ons")
    ),
    false
  );
});

test("add-ons at 15% trigger 64 cap", () => {
  const result = calculateDealScore(
    baseDeal({ addons: 6000 })
  );

  assert.equal(
    result.caps.some(
      (cap) =>
        cap.max === 64 &&
        cap.reason.startsWith("Dealer add-ons")
    ),
    true
  );
  assert.ok(result.score <= 64);
});

test("84-month term with APR below +3 does not trigger combo cap", () => {
  const benchmark = APRS.new.prime;
  const result = calculateDealScore(
    baseDeal({
      term: 84,
      apr: benchmark + 2.99
    })
  );

  assert.equal(
    result.caps.some(
      (cap) =>
        cap.max === 64 &&
        cap.reason.startsWith("A long loan term")
    ),
    false
  );
});

test("84-month term with APR at +3 triggers 64 combo cap", () => {
  const benchmark = APRS.new.prime;
  const result = calculateDealScore(
    baseDeal({
      term: 84,
      apr: benchmark + 3
    })
  );

  assert.equal(
    result.caps.some(
      (cap) =>
        cap.max === 64 &&
        cap.reason.startsWith("A long loan term")
    ),
    true
  );
  assert.ok(result.score <= 64);
});

test("category floors are preserved in an extreme deal", () => {
  const result = calculateDealScore(
    baseDeal({
      price: 60000,
      market: 30000,
      apr: 30,
      term: 96,
      down: 0,
      addons: 15000,
      fees: 5000,
      income: 2500,
      savings: 0,
      expenses: 2400,
      insurance: 500,
      fuel: 400,
      maintenance: 300,
      tradeValue: 0,
      tradeOwed: 20000
    })
  );

  assert.ok(result.categories.vehicle >= 3);
  assert.ok(result.categories.finance >= 3);
  assert.ok(result.categories.affordability >= 2);
  assert.ok(result.categories.structure >= 2);
});

test("final score never exceeds the lowest applicable cap", () => {
  const benchmark = APRS.new.prime;
  const result = calculateDealScore(
    baseDeal({
      apr: benchmark + 8,
      addons: 6000
    })
  );

  const lowestCap = Math.min(
    ...result.caps.map((cap) => cap.max)
  );

  assert.ok(result.score <= lowestCap);
});

test("market markups of 15% and 30% receive capped verdicts", () => {
  const deal = baseDeal({condition:"used", price:30000, market:30000, apr:8.5, down:5000});
  assert.equal(calculateDealScore({...deal, price:34499}).caps.some(c => c.reason.startsWith("Vehicle price")), false);
  assert.equal(calculateDealScore({...deal, price:34500}).score, 69);
  assert.equal(calculateDealScore({...deal, price:39000}).score, 59);
});

test("dealer fees of 10% and 15% receive capped verdicts", () => {
  const deal = baseDeal({condition:"used", price:30000, market:30000, apr:8.5, down:5000});
  assert.equal(calculateDealScore({...deal, fees:2999}).caps.some(c => c.reason.startsWith("Dealer fees")), false);
  assert.equal(calculateDealScore({...deal, fees:3000}).score, 69);
  assert.equal(calculateDealScore({...deal, fees:4500}).score, 64);
});

test("a monthly cash shortfall cannot receive a green verdict", () => {
  const deal = baseDeal({condition:"used", price:30000, market:30000, apr:8.5, down:5000, income:3500, expenses:3400});
  const score = calculateDealScore(deal);
  assert.equal(score.score, 59);
  assert.equal(score.color, "yellow");
  const transport = score.monthly + deal.insurance + deal.fuel + deal.maintenance;
  assert.equal(calculateDealScore({...deal, expenses:deal.income-transport}).caps.some(c => c.reason.startsWith("Listed essential")), false);
});
