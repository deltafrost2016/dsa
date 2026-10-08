import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { missingNumber } from './missing-number.js';
import { clone, fmt, makeRng } from '../../lib/testutil.js';

function check(nums, expected) {
  const actual = missingNumber(clone(nums));
  assert.equal(actual, expected, `missingNumber(${fmt(nums)})\n  expected: ${expected}\n  actual:   ${fmt(actual)}`);
}

describe('Missing Number', () => {
  it('example 1', () => {
    check([3, 0, 1], 2);
  });
  it('example 2', () => {
    check([0, 1], 2);
  });
  it('example 3', () => {
    check([9, 6, 4, 2, 3, 5, 7, 0, 1], 8);
  });
  it('single element 0 means 1 is missing', () => {
    check([0], 1);
  });
  it('single element 1 means 0 is missing', () => {
    check([1], 0);
  });
  it('0 is missing', () => {
    check([1, 2, 3, 4], 0);
  });
  it('n is missing (all of 0..n-1 present)', () => {
    check([2, 0, 1, 3], 4);
  });
  it('sorted and reverse-sorted input', () => {
    check([0, 1, 2, 4, 5], 3);
    check([5, 4, 2, 1, 0], 3);
  });
  it('every possible missing value for n = 20', () => {
    const rng = makeRng(268);
    for (let missing = 0; missing <= 20; missing++) {
      const nums = [];
      for (let v = 0; v <= 20; v++) if (v !== missing) nums.push(v);
      check(rng.shuffle(nums), missing);
    }
  });
  it('large input: n = 10000 (and larger), shuffled', { timeout: 2000 }, () => {
    const rng = makeRng(2680);
    for (const [n, missing] of [[10000, 7777], [10000, 0], [10000, 10000], [100000, 54321]]) {
      const nums = [];
      for (let v = 0; v <= n; v++) if (v !== missing) nums.push(v);
      check(rng.shuffle(nums), missing);
    }
  });
});
