import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { search } from './binary-search.js';
import { clone, fmt, makeRng } from '../../lib/testutil.js';

function check(nums, target, expected) {
  const actual = search(clone(nums), target);
  assert.equal(actual, expected, `search(${fmt(nums)}, ${target}): expected ${expected}, got ${fmt(actual)}`);
}

describe('Binary Search (#704)', () => {
  it('example 1: target present in the middle', () => check([-1, 0, 3, 5, 9, 12], 9, 4));
  it('example 2: target missing', () => check([-1, 0, 3, 5, 9, 12], 2, -1));
  it('single element, found', () => check([5], 5, 0));
  it('single element, not found', () => check([5], -5, -1));
  it('target is the first element', () => check([1, 3, 5, 7], 1, 0));
  it('target is the last element', () => check([1, 3, 5, 7], 7, 3));
  it('target smaller than everything', () => check([1, 3, 5, 7], -100, -1));
  it('target larger than everything', () => check([1, 3, 5, 7], 100, -1));
  it('target falls between two elements', () => check([1, 3, 5, 7], 4, -1));
  it('two elements, both positions', () => {
    check([2, 4], 2, 0);
    check([2, 4], 4, 1);
  });
  it('all negative values', () => check([-9, -7, -5, -3], -5, 2));
  it('handles the full constraint range', () => check([-10000, 0, 10000], 10000, 2));
  it('every index of even-length and odd-length arrays can be found', () => {
    for (const n of [2, 3, 4, 5, 8, 9, 16, 17]) {
      const nums = Array.from({ length: n }, (_, i) => i * 3 - 7);
      nums.forEach((v, i) => check(nums, v, i));
      check(nums, -8, -1);
      check(nums, n * 3, -1);
    }
  });

  it('large sorted array with many queries (must be logarithmic)', { timeout: 2000 }, () => {
    const rng = makeRng(704);
    const n = 1_000_000;
    const nums = Array.from({ length: n }, (_, i) => i * 2); // evens only
    for (let q = 0; q < 20000; q++) {
      const target = rng.int(-10, n * 2 + 10);
      const expected = target >= 0 && target % 2 === 0 && target / 2 < n ? target / 2 : -1;
      const actual = search(nums, target);
      if (actual !== expected) assert.fail(`large array: search(<${n} evens>, ${target}) expected ${expected}, got ${fmt(actual)}`);
    }
  });
});
