import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { maxSlidingWindow } from './sliding-window-maximum.js';
import { clone, fmt, makeRng, randomArray } from '../../lib/testutil.js';

function check(nums, k, expected) {
  const actual = maxSlidingWindow(clone(nums), k);
  assert.deepStrictEqual(
    actual,
    expected,
    `maxSlidingWindow(${fmt(nums)}, ${k})\n  expected: ${fmt(expected)}\n  actual:   ${fmt(actual)}`,
  );
}

function brute(nums, k) {
  const out = [];
  for (let i = 0; i + k <= nums.length; i++) out.push(Math.max(...nums.slice(i, i + k)));
  return out;
}

describe('Sliding Window Maximum', () => {
  it('example 1: [1,3,-1,-3,5,3,6,7], k=3', () => check([1, 3, -1, -3, 5, 3, 6, 7], 3, [3, 3, 5, 5, 6, 7]));
  it('example 2: [1], k=1', () => check([1], 1, [1]));
  it('k=1 returns the array itself', () => check([4, -2, 7, 0], 1, [4, -2, 7, 0]));
  it('k equals length: one window', () => check([2, 9, 4], 3, [9]));
  it('k equals length, max first', () => check([9, 2, 4], 3, [9]));
  it('k equals length, max last', () => check([2, 4, 9], 3, [9]));
  it('all equal values', () => check([5, 5, 5, 5, 5], 2, [5, 5, 5, 5]));
  it('strictly increasing', () => check([1, 2, 3, 4, 5], 2, [2, 3, 4, 5]));
  it('strictly decreasing (max leaves the window each step)', () => check([5, 4, 3, 2, 1], 2, [5, 4, 3, 2]));
  it('all negative numbers', () => check([-5, -3, -8, -1, -9], 2, [-3, -3, -1, -1]));
  it('mix of negatives, zero and positives', () => check([-1, 0, -2, 3, -4], 3, [0, 3, 3]));
  it('duplicate maxima: the old copy expires but the new one stays', () => check([7, 2, 7, 1, 1], 3, [7, 7, 7]));
  it('boundary values', () => check([-10000, 10000, -10000, 10000], 2, [10000, 10000, 10000]));
  it('two elements, k=2', () => check([1, -1], 2, [1]));
  it('two elements, k=1', () => check([1, -1], 1, [1, -1]));

  it('matches brute force on random small inputs', () => {
    const rng = makeRng(239);
    for (let t = 0; t < 300; t++) {
      const nums = randomArray(rng, rng.int(1, 15), -6, 6);
      const k = rng.int(1, nums.length);
      check(nums, k, brute(nums, k));
    }
  });

  it('returns an array of length n-k+1', () => {
    const nums = [3, 1, 2];
    const actual = maxSlidingWindow(clone(nums), 2);
    assert.ok(Array.isArray(actual), `expected an array but got ${fmt(actual)}`);
    assert.equal(actual.length, 2);
  });

  it('large input: increasing sequence, window 50000', { timeout: 2000 }, () => {
    const n = 100000;
    const k = 50000;
    const nums = Array.from({ length: n }, (_, i) => i - 50000);
    const expected = Array.from({ length: n - k + 1 }, (_, i) => i + k - 1 - 50000);
    check(nums, k, expected);
  });

  it('large input: decreasing sequence, window 50000', { timeout: 2000 }, () => {
    const n = 100000;
    const k = 50000;
    const nums = Array.from({ length: n }, (_, i) => 10000 - Math.floor(i / 10));
    const expected = Array.from({ length: n - k + 1 }, (_, i) => nums[i]);
    check(nums, k, expected);
  });

  it('large input: constant sequence with a single peak', { timeout: 2000 }, () => {
    const n = 100000;
    const k = 40000;
    const nums = Array.from({ length: n }, () => 0);
    nums[60000] = 10000;
    const expected = Array.from({ length: n - k + 1 }, (_, i) => (i <= 60000 && 60000 < i + k ? 10000 : 0));
    check(nums, k, expected);
  });
});
