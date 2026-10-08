import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { twoSum } from './two-sum-ii-input-array-is-sorted.js';
import { clone, fmt } from '../../lib/testutil.js';

// Exactly one solution exists in every test, so the 1-based answer is checked exactly.
const check = (numbers, target, expected) => {
  const actual = twoSum(clone(numbers), target);
  assert.deepStrictEqual(actual, expected, `twoSum(${fmt(numbers)}, ${target})\n  expected: ${fmt(expected)}\n  actual:   ${fmt(actual)}`);
};

describe('Two Sum II - Input Array Is Sorted', () => {
  it('example 1: [2,7,11,15], 9 -> [1,2]', () => check([2, 7, 11, 15], 9, [1, 2]));
  it('example 2: [2,3,4], 6 -> [1,3]', () => check([2, 3, 4], 6, [1, 3]));
  it('example 3: [-1,0], -1 -> [1,2]', () => check([-1, 0], -1, [1, 2]));
  it('two equal values', () => check([3, 3], 6, [1, 2]));
  it('negative values', () => check([-10, -4, -3, 0, 5], -7, [2, 3]));
  it('mixed signs summing to zero', () => check([-5, -2, 1, 2, 9], 0, [2, 4]));
  it('duplicates, answer uses a duplicated value once each', () => check([1, 2, 2, 7], 4, [2, 3]));
  it('answer at the extremes', () => check([1, 4, 5, 6, 8, 20], 21, [1, 6]));
  it('answer in the middle', () => check([1, 2, 6, 9, 30, 40], 15, [3, 4]));
  it('must not use the single 4 twice', () => check([1, 3, 4, 5], 8, [2, 4]));
  it('boundary values -1000 and 1000', () => check([-1000, -1, 0, 1000], 0, [1, 4]));
  it('zeros', () => check([0, 0, 3, 4], 0, [1, 2]));

  it('large input (30k): the only pair is the last two elements', { timeout: 2000 }, () => {
    // base values are 0 mod 3, the two extras are 1 mod 3: only the extras sum to 2 mod 3
    const numbers = [...Array.from({ length: 29998 }, (_, i) => i * 3), 100000, 100003];
    check(numbers, 200003, [29999, 30000]);
  });

  it('large input (30k): the only pair is the first and last element', { timeout: 2000 }, () => {
    const numbers = Array.from({ length: 30000 }, (_, i) => 1 + i * 3);
    numbers[29999] = 5000000;
    check(numbers, 5000001, [1, 30000]);
  });
});
