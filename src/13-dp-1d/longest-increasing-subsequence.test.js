import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { clone, fmt, makeRng, randomArray } from '../../lib/testutil.js';
import { lengthOfLIS } from './longest-increasing-subsequence.js';

function check(nums, expected) {
  const actual = lengthOfLIS(clone(nums));
  assert.strictEqual(actual, expected, `lengthOfLIS(${fmt(nums)})\n  expected: ${expected}\n  actual:   ${fmt(actual)}`);
}

describe('Longest Increasing Subsequence', () => {
  it('example 1', () => check([10, 9, 2, 5, 3, 7, 101, 18], 4));
  it('example 2', () => check([0, 1, 0, 3, 2, 3], 4));
  it('example 3: all equal (strictly increasing needed)', () => check([7, 7, 7, 7, 7, 7, 7], 1));
  it('single element', () => check([1], 1));
  it('two increasing', () => check([1, 2], 2));
  it('two decreasing', () => check([2, 1], 1));
  it('already sorted', () => check([1, 2, 3, 4, 5], 5));
  it('strictly decreasing', () => check([5, 4, 3, 2, 1], 1));
  it('LeetCode case with duplicates', () => check([4, 10, 4, 3, 8, 9], 3));
  it('longest is not contiguous', () => check([1, 3, 6, 7, 9, 4, 10, 5, 6], 6));
  it('negative numbers', () => check([-2, -1], 2));
  it('mixed negatives and positives', () => check([-5, 3, -2, 8, -1, 9], 4));
  it('extreme values', () => check([10000, -10000, 10000, -10000], 2));
  it('duplicates must not extend the subsequence', () => check([1, 2, 2, 3], 3));
  it('strictly increasing array of 2500', { timeout: 2000 }, () => {
    check(Array.from({ length: 2500 }, (_, i) => i - 1000), 2500);
  });
  it('strictly decreasing array of 2500', { timeout: 2000 }, () => {
    check(Array.from({ length: 2500 }, (_, i) => 1000 - i), 1);
  });
  it('2500 equal values', { timeout: 2000 }, () => {
    check(new Array(2500).fill(3), 1);
  });
  it('2500 random values in [-10000, 10000]', { timeout: 2000 }, () => {
    check(randomArray(makeRng(300), 2500, -10000, 10000), 94);
  });
  it('interleaved low and high runs: take lows then switch to highs once', { timeout: 2000 }, () => {
    const nums = [];
    for (let i = 0; i < 1250; i++) nums.push(i, 5000 + i);
    check(nums, 1251);
  });
});
