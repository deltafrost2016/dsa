import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { containsDuplicate } from './contains-duplicate.js';
import { clone, makeRng, randomArray, fmt } from '../../lib/testutil.js';

const check = (nums, expected) => {
  const actual = containsDuplicate(clone(nums));
  assert.equal(actual, expected, `containsDuplicate(${fmt(nums)}) expected ${expected}, got ${fmt(actual)}`);
};

describe('Contains Duplicate', () => {
  it('example 1: [1,2,3,1] -> true', () => check([1, 2, 3, 1], true));
  it('example 2: [1,2,3,4] -> false', () => check([1, 2, 3, 4], false));
  it('example 3: many repeats -> true', () => check([1, 1, 1, 3, 3, 4, 3, 2, 4, 2], true));
  it('single element -> false', () => check([7], false));
  it('two equal elements -> true', () => check([5, 5], true));
  it('two different elements -> false', () => check([5, 6], false));
  it('negative numbers with a duplicate', () => check([-1, -2, -3, -1], true));
  it('negatives and positives that are distinct', () => check([-1, 1, -2, 2, 0], false));
  it('zero repeated', () => check([0, 1, 0], true));
  it('boundary values 1e9 and -1e9 distinct', () => check([1e9, -1e9, 0], false));
  it('boundary value duplicated', () => check([-1e9, 3, -1e9], true));
  it('duplicate at the very end', () => check([1, 2, 3, 4, 5, 6, 7, 8, 9, 1], true));
  it('all equal', () => check([2, 2, 2, 2], true));

  it('large input, all distinct (100k)', { timeout: 2000 }, () => {
    const rng = makeRng(217);
    const nums = rng.shuffle(Array.from({ length: 100000 }, (_, i) => i * 3 - 150000));
    check(nums, false);
  });

  it('large input, single duplicate hidden at the ends (100k)', { timeout: 2000 }, () => {
    const rng = makeRng(218);
    const nums = rng.shuffle(Array.from({ length: 99999 }, (_, i) => i));
    nums.push(nums[0]);
    check(nums, true);
  });

  it('large random input with small value range has a duplicate', { timeout: 2000 }, () => {
    const rng = makeRng(219);
    check(randomArray(rng, 100000, -1000, 1000), true);
  });
});
