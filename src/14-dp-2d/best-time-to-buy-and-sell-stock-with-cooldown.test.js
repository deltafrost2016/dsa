import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fmt, clone, makeRng, randomArray } from '../../lib/testutil.js';
import { maxProfit } from './best-time-to-buy-and-sell-stock-with-cooldown.js';

const check = (prices, expected) =>
  assert.equal(maxProfit(clone(prices)), expected, `maxProfit(${fmt(prices)}): expected ${expected}`);

describe('Best Time to Buy and Sell Stock with Cooldown', () => {
  it('example 1: [1,2,3,0,2] -> 3', () => check([1, 2, 3, 0, 2], 3));
  it('example 2: single day -> 0', () => check([1], 0));
  it('two days, profit possible', () => check([1, 5], 4));
  it('two days, no profit', () => check([5, 1], 0));
  it('strictly decreasing -> 0', () => check([9, 8, 7, 6, 5], 0));
  it('strictly increasing -> last - first', () => check([1, 2, 3, 4, 5], 4));
  it('all equal -> 0', () => check([4, 4, 4, 4], 0));
  it('cooldown forces skipping a rebuy: [1,2,4] -> 3', () => check([1, 2, 4], 3));
  it('cooldown matters: [2,1,4] -> 3', () => check([2, 1, 4], 3));
  it('[6,1,3,2,4,7] -> 6', () => check([6, 1, 3, 2, 4, 7], 6));
  it('[1,4,2] -> 3', () => check([1, 4, 2], 3));
  it('zeros and a spike: [0,0,5,0,0] -> 5', () => check([0, 0, 5, 0, 0], 5));
  it('sell early, cooldown, rebuy at 0: [1,2,3,0,2,5] -> 6', () => check([1, 2, 3, 0, 2, 5], 6));
  it('5000 increasing prices -> 4999 (O(2^n) recursion is far too slow)', () => {
    check(Array.from({ length: 5000 }, (_, i) => i + 1), 4999);
  }, { timeout: 2000 });
  it('5000 alternating 1,2 prices -> one unit of profit per 4 days (1250)', () => {
    check(Array.from({ length: 5000 }, (_, i) => (i % 2 === 0 ? 1 : 2)), 1250);
  }, { timeout: 2000 });
  it('5000 seeded random prices', () => {
    const rng = makeRng(309);
    check(randomArray(rng, 5000, 0, 1000), 663794);
  }, { timeout: 2000 });
});
