import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { maxProfit } from './best-time-to-buy-and-sell-stock.js';
import { clone, fmt, makeRng, randomArray } from '../../lib/testutil.js';

function check(prices, expected) {
  const actual = maxProfit(clone(prices));
  assert.equal(
    actual,
    expected,
    `maxProfit(${fmt(prices)})\n  expected: ${fmt(expected)}\n  actual:   ${fmt(actual)}`,
  );
}

function brute(prices) {
  let best = 0;
  for (let i = 0; i < prices.length; i++) {
    for (let j = i + 1; j < prices.length; j++) best = Math.max(best, prices[j] - prices[i]);
  }
  return best;
}

describe('Best Time to Buy and Sell Stock', () => {
  it('example 1: [7,1,5,3,6,4] -> 5', () => check([7, 1, 5, 3, 6, 4], 5));
  it('example 2: strictly falling prices -> 0', () => check([7, 6, 4, 3, 1], 0));
  it('single day -> 0', () => check([5], 0));
  it('two days rising', () => check([1, 2], 1));
  it('two days falling', () => check([2, 1], 0));
  it('all equal -> 0', () => check([3, 3, 3, 3], 0));
  it('minimum is after the maximum (cannot sell before buying)', () => check([10, 9, 1, 2], 1));
  it('best trade does not involve the global minimum', () => check([5, 11, 1, 3], 6));
  it('best trade does not involve the global maximum', () => check([2, 4, 1, 7, 3], 6));
  it('zeros are valid prices', () => check([0, 0, 10, 0], 10));
  it('buy on first day, sell on last day', () => check([1, 5, 2, 8], 7));

  it('matches brute force on random small inputs', () => {
    const rng = makeRng(121);
    for (let t = 0; t < 200; t++) {
      const prices = randomArray(rng, rng.int(1, 12), 0, 20);
      check(prices, brute(prices));
    }
  });

  it('large strictly rising input (10^5 days)', { timeout: 2000 }, () => {
    const n = 100000;
    const prices = Array.from({ length: n }, (_, i) => i);
    check(prices, n - 1);
  });

  it('large strictly falling input (10^5 days) -> 0', { timeout: 2000 }, () => {
    const n = 100000;
    const prices = Array.from({ length: n }, (_, i) => 10000 - Math.floor(i / 20));
    check(prices, 0);
  });

  it('large input with the profit hidden in the middle', { timeout: 2000 }, () => {
    const n = 100000;
    const prices = Array.from({ length: n }, () => 5000);
    prices[30000] = 1;
    prices[70000] = 10000;
    check(prices, 9999);
  });
});
