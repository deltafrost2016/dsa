import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { twoSum } from './two-sum.js';
import { clone, makeRng, fmt } from '../../lib/testutil.js';

// Any valid pair of distinct indices is accepted, in either order.
const check = (nums, target) => {
  const input = clone(nums);
  const actual = twoSum(input, target);
  const msg = `twoSum(${fmt(nums)}, ${target}) returned ${fmt(actual)}`;
  assert.ok(Array.isArray(actual) && actual.length === 2, `${msg}: expected an array of 2 indices`);
  const [i, j] = actual;
  assert.ok(Number.isInteger(i) && Number.isInteger(j), `${msg}: indices must be integers`);
  assert.ok(i >= 0 && j >= 0 && i < nums.length && j < nums.length, `${msg}: index out of range`);
  assert.notEqual(i, j, `${msg}: cannot use the same element twice`);
  assert.equal(nums[i] + nums[j], target, `${msg}: nums[${i}] + nums[${j}] = ${nums[i] + nums[j]}, not ${target}`);
};

describe('Two Sum', () => {
  it('example 1: [2,7,11,15], 9', () => check([2, 7, 11, 15], 9));
  it('example 2: [3,2,4], 6 (must not reuse 3)', () => check([3, 2, 4], 6));
  it('example 3: [3,3], 6', () => check([3, 3], 6));
  it('exactly two elements', () => check([1, 2], 3));
  it('negative numbers', () => check([-1, -2, -3, -4, -5], -8));
  it('negative and positive cancel to zero', () => check([-3, 4, 3, 90], 0));
  it('zeros', () => check([0, 4, 3, 0], 0));
  it('no pair involving the first element', () => check([5, 1, 9, 2], 11));
  it('pair at the end', () => check([1, 2, 3, 4, 5, 6, 7, 8, 100, 200], 300));
  it('large magnitude values', () => check([1e9, -1e9, 12345, 7], 1e9 + 7));
  it('target negative with duplicates', () => check([-5, -5, 1], -10));

  it('returns indices, not values', () => {
    const actual = twoSum([10, 20, 30], 50);
    assert.deepEqual([...actual].sort((a, b) => a - b), [1, 2], `expected indices [1,2], got ${fmt(actual)}`);
  });

  it('large input (50k) - the only pair sits at the end', { timeout: 2000 }, () => {
    const rng = makeRng(1);
    // Multiples of 3 are 0 mod 3; the two extra values are 1 mod 3, so only they sum to 2 mod 3.
    const nums = rng.shuffle(Array.from({ length: 49998 }, (_, i) => i * 3));
    nums.push(150001, 160003);
    check(nums, 150001 + 160003);
  });
});
