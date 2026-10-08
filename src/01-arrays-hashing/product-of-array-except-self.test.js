import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { productExceptSelf } from './product-of-array-except-self.js';
import { clone, makeRng, fmt } from '../../lib/testutil.js';

const check = (nums, expected) => {
  const actual = productExceptSelf(clone(nums));
  assert.deepStrictEqual(actual, expected, `productExceptSelf(${fmt(nums)})\n  expected: ${fmt(expected)}\n  actual:   ${fmt(actual)}`);
};

describe('Product of Array Except Self', () => {
  it('example 1: [1,2,3,4]', () => check([1, 2, 3, 4], [24, 12, 8, 6]));
  it('example 2: [-1,1,0,-3,3]', () => check([-1, 1, 0, -3, 3], [0, 0, 9, 0, 0]));
  it('two elements swap', () => check([3, 5], [5, 3]));
  it('two elements with a zero', () => check([0, 5], [5, 0]));
  it('all ones', () => check([1, 1, 1, 1], [1, 1, 1, 1]));
  it('single zero in the middle', () => check([2, 0, 3], [0, 6, 0]));
  it('two zeros give all zeros', () => check([0, 4, 0, 5], [0, 0, 0, 0]));
  it('all zeros', () => check([0, 0, 0], [0, 0, 0]));
  it('negatives only', () => check([-1, -2, -3], [6, 3, 2]));
  it('mixed signs', () => check([-2, 3, -4], [-12, 8, -6]));
  it('zero at the start', () => check([0, 2, 3], [6, 0, 0]));
  it('zero at the end', () => check([2, 3, 0], [0, 0, 6]));
  it('boundary values -30 and 30 (small array)', () => check([-30, 30, 2], [60, -60, -900]));

  it('does not return -0 where the answer is zero', () => {
    const actual = productExceptSelf([-1, 0, 2]);
    assert.ok(Object.is(actual[0], 0), `index 0 should be +0, got ${fmt(actual[0])}`);
    assert.ok(Object.is(actual[2], 0), `index 2 should be +0, got ${fmt(actual[2])}`);
  });

  it('large input (100k) of 1 and -1 compared with a division-based reference', { timeout: 2000 }, () => {
    const rng = makeRng(238);
    const nums = Array.from({ length: 100000 }, () => (rng.int(0, 1) ? 1 : -1));
    let total = 1;
    for (const v of nums) total *= v;
    const expected = nums.map((v) => total * v); // v is +-1 so dividing equals multiplying
    check(nums, expected);
  });

  it('large input (100k) with one zero', { timeout: 2000 }, () => {
    const rng = makeRng(239);
    const nums = Array.from({ length: 100000 }, () => (rng.int(0, 1) ? 1 : -1));
    const z = rng.int(0, nums.length - 1);
    nums[z] = 0;
    let others = 1;
    nums.forEach((v, i) => {
      if (i !== z) others *= v;
    });
    const expected = nums.map((_, i) => (i === z ? others : 0));
    check(nums, expected);
  });
});
