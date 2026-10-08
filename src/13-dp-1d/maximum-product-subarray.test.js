import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { clone, fmt, makeRng, randomArray } from '../../lib/testutil.js';
import { maxProduct } from './maximum-product-subarray.js';

function check(nums, expected) {
  const actual = maxProduct(clone(nums));
  assert.strictEqual(actual, expected, `maxProduct(${fmt(nums)})\n  expected: ${expected}\n  actual:   ${fmt(actual)}`);
}

describe('Maximum Product Subarray', () => {
  it('example 1', () => check([2, 3, -2, 4], 6));
  it('example 2: zero splits the array', () => check([-2, 0, -1], 0));
  it('single negative number', () => check([-2], -2));
  it('single zero', () => check([0], 0));
  it('single positive number', () => check([7], 7));
  it('two negatives make a positive', () => check([-2, 3, -4], 24));
  it('negative in the middle of positives', () => check([3, -1, 4], 4));
  it('three negatives: drop one end', () => check([-1, -2, -3], 6));
  it('LeetCode case', () => check([2, -5, -2, -4, 3], 24));
  it('zero at the start', () => check([0, 2], 2));
  it('all negative even count', () => check([-2, -3, -4, -5], 120));
  it('all negative odd count: best is dropping the smallest magnitude end', () => check([-2, -3, -4], 12));
  it('two negatives', () => check([-3, -1], 3));
  it('all zeros', () => check([0, 0, 0], 0));
  it('zeros and a lone negative', () => check([0, -3, 0], 0));
  it('ones and minus ones', () => check([1, -1, 1, -1, 1], 1));
  it('big powers of two inside the 32-bit range', () => check(new Array(30).fill(2), 2 ** 30));
  it('20000 random values in [-2, 2]', { timeout: 2000 }, () => {
    const nums = randomArray(makeRng(152), 20000, -2, 2);
    check(nums, 524288);
  });
  it('20000 alternating signs of magnitude 1', { timeout: 2000 }, () => {
    const nums = Array.from({ length: 20000 }, (_, i) => (i % 2 === 0 ? 1 : -1));
    check(nums, 1);
  });
});
