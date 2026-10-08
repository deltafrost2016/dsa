import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { search } from './search-in-rotated-sorted-array.js';
import { clone, fmt, makeRng } from '../../lib/testutil.js';

function check(nums, target, expected) {
  const actual = search(clone(nums), target);
  assert.equal(actual, expected, `search(${fmt(nums)}, ${target}): expected ${expected}, got ${fmt(actual)}`);
}

const rotate = (arr, k) => [...arr.slice(k), ...arr.slice(0, k)];

describe('Search in Rotated Sorted Array (#33)', () => {
  it('example 1: target in the right (rotated) part', () => check([4, 5, 6, 7, 0, 1, 2], 0, 4));
  it('example 2: target missing', () => check([4, 5, 6, 7, 0, 1, 2], 3, -1));
  it('example 3: single element, missing', () => check([1], 0, -1));
  it('single element, found', () => check([1], 1, 0));
  it('two elements, rotated', () => {
    check([3, 1], 1, 1);
    check([3, 1], 3, 0);
    check([3, 1], 2, -1);
  });
  it('two elements, not rotated', () => {
    check([1, 3], 1, 0);
    check([1, 3], 3, 1);
  });
  it('not rotated at all', () => check([1, 2, 3, 4, 5, 6], 5, 4));
  it('target in left (larger) part', () => check([6, 7, 8, 1, 2, 3, 4, 5], 7, 1));
  it('target is the pivot minimum', () => check([6, 7, 8, 1, 2, 3, 4, 5], 1, 3));
  it('target is the maximum', () => check([6, 7, 8, 1, 2, 3, 4, 5], 8, 2));
  it('target is first and last element', () => {
    check([6, 7, 8, 1, 2, 3, 4, 5], 6, 0);
    check([6, 7, 8, 1, 2, 3, 4, 5], 5, 7);
  });
  it('negative values', () => check([-2, -1, 3, 5, -9, -7], -9, 4));
  it('target below and above everything', () => {
    check([4, 5, 6, 7, 0, 1, 2], -1, -1);
    check([4, 5, 6, 7, 0, 1, 2], 8, -1);
  });
  it('every rotation, every element and every gap for lengths 1..10', () => {
    for (let n = 1; n <= 10; n++) {
      const base = Array.from({ length: n }, (_, i) => i * 2 - 5);
      for (let k = 0; k < n; k++) {
        const nums = rotate(base, k);
        nums.forEach((v, i) => check(nums, v, i));
        check(nums, -6, -1);
        check(nums, n * 2 - 5, -1);
        for (let i = 0; i + 1 < n; i++) check(nums, base[i] + 1, -1);
      }
    }
  });

  it('large rotated array with many queries (must be logarithmic)', { timeout: 2000 }, () => {
    const rng = makeRng(33);
    const n = 1_000_000;
    const base = Array.from({ length: n }, (_, i) => i * 2); // evens
    const k = rng.int(1, n - 1);
    const nums = rotate(base, k);
    for (let q = 0; q < 20000; q++) {
      const target = rng.int(-5, n * 2 + 5);
      const baseIdx = target >= 0 && target % 2 === 0 && target / 2 < n ? target / 2 : -1;
      const expected = baseIdx === -1 ? -1 : (baseIdx - k + n) % n;
      const actual = search(nums, target);
      if (actual !== expected) assert.fail(`large array (rotation ${k}): target ${target} expected ${expected}, got ${fmt(actual)}`);
    }
  });
});
