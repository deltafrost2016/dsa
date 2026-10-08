import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fmt, clone } from '../../lib/testutil.js';
import { change } from './coin-change-ii.js';

const check = (amount, coins, expected) =>
  assert.equal(change(amount, clone(coins)), expected, `change(${amount}, ${fmt(coins)}): expected ${expected}`);

describe('Coin Change II', () => {
  it('example 1: amount 5, coins [1,2,5] -> 4', () => check(5, [1, 2, 5], 4));
  it('example 2: amount 3, coins [2] -> 0', () => check(3, [2], 0));
  it('example 3: amount 10, coins [10] -> 1', () => check(10, [10], 1));
  it('amount 0 -> 1 (the empty combination)', () => check(0, [7], 1));
  it('amount 0 with several coins -> 1', () => check(0, [1, 2, 5], 1));
  it('single coin 1 -> 1', () => check(7, [1], 1));
  it('coin larger than amount -> 0', () => check(3, [5], 0));
  it('coin larger than amount is ignored: amount 4, [1,5] -> 1', () => check(4, [1, 5], 1));
  it('order does not matter: amount 3, [1,2] -> 2', () => check(3, [1, 2], 2));
  it('unsorted coins: amount 5, [5,1,2] -> 4', () => check(5, [5, 1, 2], 4));
  it('amount 4, [1,2,3] -> 4', () => check(4, [1, 2, 3], 4));
  it('amount 8, [2,3,5] -> 3', () => check(8, [2, 3, 5], 3));
  it('amount 100, [1,5,10,25,50] -> 292', () => check(100, [1, 5, 10, 25, 50], 292));
  it('amount 500, [3,5,7,8,9,10,11] -> 35502874 (exponential recursion cannot finish)', () => {
    check(500, [3, 5, 7, 8, 9, 10, 11], 35502874);
  }, { timeout: 2000 });
  it('amount 5000, [1] -> 1', () => check(5000, [1], 1), { timeout: 2000 });
  it('amount 5000, [1,2,5] -> 1252001', () => check(5000, [1, 2, 5], 1252001), { timeout: 2000 });
  it('amount 5000, [5000] -> 1', () => check(5000, [5000], 1));
});
