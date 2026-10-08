import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { clone, fmt } from '../../lib/testutil.js';
import { rob } from './house-robber.js';

function check(nums, expected) {
  const actual = rob(clone(nums));
  assert.strictEqual(actual, expected, `rob(${fmt(nums)})\n  expected: ${expected}\n  actual:   ${fmt(actual)}`);
}

describe('House Robber', () => {
  it('example 1', () => check([1, 2, 3, 1], 4));
  it('example 2', () => check([2, 7, 9, 3, 1], 12));
  it('single house', () => check([5], 5));
  it('single empty house', () => check([0], 0));
  it('two houses: take the larger', () => check([2, 1], 2));
  it('two houses, second larger', () => check([1, 2], 2));
  it('skipping the middle is best', () => check([1, 3, 1], 3));
  it('two non-adjacent ends beat the middle pair', () => check([2, 1, 1, 2], 4));
  it('big ends', () => check([100, 1, 1, 100], 200));
  it('all zeros', () => check([0, 0, 0, 0], 0));
  it('all equal values', () => check([4, 4, 4, 4, 4], 12));
  it('skipping two in a row is sometimes right', () => check([5, 1, 1, 5], 10));
  it('greedy-by-largest fails here', () => check([2, 10, 3, 3, 10, 2], 20));
  it('alternating 1 and 100, length 100 (exponential recursion is too slow)', { timeout: 2000 }, () => {
    const nums = Array.from({ length: 100 }, (_, i) => (i % 2 === 0 ? 1 : 100));
    check(nums, 50 * 100);
  });
  it('all equal, length 100', { timeout: 2000 }, () => {
    check(new Array(100).fill(9), 50 * 9);
  });
  it('very long row of 10000 equal houses', { timeout: 2000 }, () => {
    check(new Array(10000).fill(2), 5000 * 2);
  });
});
