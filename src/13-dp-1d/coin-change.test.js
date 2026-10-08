import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { clone, fmt } from '../../lib/testutil.js';
import { coinChange } from './coin-change.js';

function check(coins, amount, expected) {
  const actual = coinChange(clone(coins), amount);
  assert.strictEqual(actual, expected, `coinChange(${fmt(coins)}, ${amount})\n  expected: ${expected}\n  actual:   ${fmt(actual)}`);
}

describe('Coin Change', () => {
  it('example 1: 11 = 5 + 5 + 1', () => check([1, 2, 5], 11, 3));
  it('example 2: impossible', () => check([2], 3, -1));
  it('example 3: amount 0 needs no coins', () => check([1], 0, 0));
  it('single coin equals amount', () => check([1], 1, 1));
  it('single coin used repeatedly', () => check([1], 2, 2));
  it('greedy fails: 6 = 3 + 3, not 4 + 1 + 1', () => check([1, 3, 4], 6, 2));
  it('LeetCode case', () => check([186, 419, 83, 408], 6249, 20));
  it('unsorted coins', () => check([2, 5, 10, 1], 27, 4));
  it('coin larger than amount is ignored', () => check([5, 100], 5, 1));
  it('all coins larger than the amount', () => check([5, 10], 3, -1));
  it('huge coin value (2^31 - 1)', () => check([2147483647], 2, -1));
  it('huge coin plus a small coin', () => check([2147483647, 1], 3, 3));
  it('amount 0 with an unusable coin', () => check([7], 0, 0));
  it('parity makes it impossible', () => check([2, 4, 6], 9999, -1));
  it('amount 10^4 with [1,2,5] (exponential recursion is too slow)', { timeout: 2000 }, () => {
    check([1, 2, 5], 10000, 2000);
  });
  it('amount 9999 with US coins [1,5,10,25]', { timeout: 2000 }, () => check([1, 5, 10, 25], 9999, 405));
  it('amount 10^4 with [3,7]: 7*1426 + 3*6', { timeout: 2000 }, () => {
    check([3, 7], 10000, 1432);
  });
  it('amount 10^4 with awkward coins [5000, 3333, 2]', { timeout: 2000 }, () => {
    check([5000, 3333, 2], 10000, 2);
  });
});
