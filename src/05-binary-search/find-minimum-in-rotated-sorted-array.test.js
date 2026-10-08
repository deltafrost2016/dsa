import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { findMin } from './find-minimum-in-rotated-sorted-array.js';
import { clone, fmt, makeRng } from '../../lib/testutil.js';

function check(nums, expected) {
  const actual = findMin(clone(nums));
  assert.equal(actual, expected, `findMin(${fmt(nums)}): expected ${expected}, got ${fmt(actual)}`);
}

const rotate = (arr, k) => [...arr.slice(k), ...arr.slice(0, k)];

describe('Find Minimum in Rotated Sorted Array (#153)', () => {
  it('example 1', () => check([3, 4, 5, 1, 2], 1));
  it('example 2', () => check([4, 5, 6, 7, 0, 1, 2], 0));
  it('example 3: rotated n times (unchanged)', () => check([11, 13, 15, 17], 11));
  it('single element', () => check([1], 1));
  it('two elements, rotated', () => check([2, 1], 1));
  it('two elements, sorted', () => check([1, 2], 1));
  it('minimum is the last element', () => check([2, 3, 4, 5, 1], 1));
  it('minimum is the second element', () => check([5, 1, 2, 3, 4], 1));
  it('all negative values', () => check([-3, -2, -9, -8, -5], -9));
  it('spans zero', () => check([2, 5, 8, -4, -1, 0], -4));
  it('boundary values', () => check([5000, -5000], -5000));
  it('every rotation of arrays of length 1..12', () => {
    for (let n = 1; n <= 12; n++) {
      const base = Array.from({ length: n }, (_, i) => i * 2 - 7);
      for (let k = 0; k < n; k++) check(rotate(base, k), base[0]);
    }
  });

  it('large rotated array, many rotations (must be logarithmic)', { timeout: 2000 }, () => {
    const rng = makeRng(153);
    const n = 1_000_000;
    const base = Array.from({ length: n }, (_, i) => i - 500_000);
    for (let t = 0; t < 40; t++) {
      const nums = rotate(base, rng.int(0, n - 1));
      const actual = findMin(nums);
      if (actual !== base[0]) assert.fail(`large array: expected ${base[0]}, got ${fmt(actual)}`);
    }
  });
});
