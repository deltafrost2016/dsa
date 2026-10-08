import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { clone, fmt, makeRng, randomArray } from '../../lib/testutil.js';
import { findKthLargest } from './kth-largest-element-in-an-array.js';

const check = (nums, k, expected) => {
  const input = clone(nums);
  assert.equal(
    findKthLargest(input, k),
    expected,
    `findKthLargest(${fmt(nums)}, ${k}) expected ${expected}`,
  );
};

const oracle = (nums, k) => [...nums].sort((a, b) => b - a)[k - 1];

describe('Kth Largest Element in an Array', () => {
  it('official example 1: [3,2,1,5,6,4], k=2 -> 5', () => check([3, 2, 1, 5, 6, 4], 2, 5));
  it('official example 2: [3,2,3,1,2,4,5,5,6], k=4 -> 4', () =>
    check([3, 2, 3, 1, 2, 4, 5, 5, 6], 4, 4));
  it('single element', () => check([1], 1, 1));
  it('k=1 returns the maximum', () => check([7, 2, 9, 4], 1, 9));
  it('k=n returns the minimum', () => check([7, 2, 9, 4], 4, 2));
  it('all equal values', () => check([5, 5, 5, 5, 5], 3, 5));
  it('duplicates count separately (not distinct)', () => check([5, 5, 1], 2, 5));
  it('duplicates of the maximum push the answer down', () => check([9, 9, 9, 1], 3, 9));
  it('negative numbers', () => check([-1, -5, -3, -2], 2, -2));
  it('mixed signs with zero', () => check([0, -1, 1, 0, -1], 3, 0));
  it('already sorted ascending', () => check([1, 2, 3, 4, 5, 6], 2, 5));
  it('already sorted descending', () => check([6, 5, 4, 3, 2, 1], 5, 2));
  it('boundary values', () => check([10000, -10000, 0], 2, 0));

  it('100000 random numbers for several k', { timeout: 2000 }, () => {
    const rng = makeRng(215);
    const nums = randomArray(rng, 100000, -10000, 10000);
    for (const k of [1, 2, 500, 50000, 99999, 100000]) check(nums, k, oracle(nums, k));
  });

  it('50000 numbers with many duplicates', { timeout: 2000 }, () => {
    const rng = makeRng(2151);
    const nums = randomArray(rng, 50000, 0, 1000);
    for (const k of [1, 777, 25000, 49999]) check(nums, k, oracle(nums, k));
  });

  it('20000 already-sorted numbers', { timeout: 2000 }, () => {
    const nums = Array.from({ length: 20000 }, (_, i) => i - 10000);
    check(nums, 30, oracle(nums, 30));
    check(nums, 19000, oracle(nums, 19000));
  });
});
