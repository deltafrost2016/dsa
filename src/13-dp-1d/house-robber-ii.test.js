import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { clone, fmt } from '../../lib/testutil.js';
import { rob2 } from './house-robber-ii.js';

function check(nums, expected) {
  const actual = rob2(clone(nums));
  assert.strictEqual(actual, expected, `rob2(${fmt(nums)})\n  expected: ${expected}\n  actual:   ${fmt(actual)}`);
}

describe('House Robber II', () => {
  it('example 1: first and last are neighbours', () => check([2, 3, 2], 3));
  it('example 2', () => check([1, 2, 3, 1], 4));
  it('example 3', () => check([1, 2, 3], 3));
  it('single house', () => check([1], 1));
  it('single empty house', () => check([0], 0));
  it('two houses: take the larger', () => check([1, 2], 2));
  it('two houses, first larger', () => check([7, 3], 7));
  it('LeetCode case', () => check([200, 3, 140, 20, 10], 340));
  it('ends equal and large: can only take one of them', () => check([2, 1, 1, 2], 3));
  it('all zeros', () => check([0, 0, 0], 0));
  it('all equal, length 5', () => check([5, 5, 5, 5, 5], 10));
  it('best answer skips the first house', () => check([1, 10, 1, 1, 10], 20));
  it('best answer skips the last house', () => check([10, 1, 1, 10, 1], 20));
  it('alternating 1 and 100, length 100', { timeout: 2000 }, () => {
    const nums = Array.from({ length: 100 }, (_, i) => (i % 2 === 0 ? 1 : 100));
    check(nums, 50 * 100);
  });
  it('big at both ends, length 99', { timeout: 2000 }, () => {
    const nums = Array.from({ length: 99 }, (_, i) => (i % 2 === 0 ? 100 : 1));
    check(nums, 49 * 100);
  });
});
