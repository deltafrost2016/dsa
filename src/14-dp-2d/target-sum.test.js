import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fmt, clone } from '../../lib/testutil.js';
import { findTargetSumWays } from './target-sum.js';

const check = (nums, target, expected) =>
  assert.equal(
    findTargetSumWays(clone(nums), target),
    expected,
    `findTargetSumWays(${fmt(nums)}, ${target}): expected ${expected}`,
  );

describe('Target Sum', () => {
  it('example 1: [1,1,1,1,1], 3 -> 5', () => check([1, 1, 1, 1, 1], 3, 5));
  it('example 2: [1], 1 -> 1', () => check([1], 1, 1));
  it('single element, unreachable target -> 0', () => check([1], 2, 0));
  it('single element, negative target -> 1', () => check([1], -1, 1));
  it('single zero, target 0 -> 2 (+0 and -0 differ)', () => check([0], 0, 2));
  it('zeros multiply the count: eight 0s then 1, target 1 -> 256', () => check([0, 0, 0, 0, 0, 0, 0, 0, 1], 1, 256));
  it('parity mismatch -> 0: [1,2], 0', () => check([1, 2], 0, 0));
  it('target larger than total sum -> 0', () => check([1, 2, 3], 7, 0));
  it('target equal to total sum -> 1', () => check([1, 2, 3], 6, 1));
  it('target equal to minus total sum -> 1', () => check([1, 2, 3], -6, 1));
  it('[1,2,1], 2 -> 2', () => check([1, 2, 1], 2, 2));
  it('symmetry: target and -target give the same count', () => {
    const nums = [2, 7, 4, 1, 8, 1];
    assert.equal(findTargetSumWays(clone(nums), 5), findTargetSumWays(clone(nums), -5));
  });
  it('[1000], -1000 -> 1', () => check([1000], -1000, 1));
  it('[100], -200 -> 0', () => check([100], -200, 0));
  it('[7,9,3,8,0,2,4,8,3,9,0], 0 -> 0 (odd total, no solution)', () => check([7, 9, 3, 8, 0, 2, 4, 8, 3, 9, 0], 0, 0));
  it('twenty 1s, target 0 -> C(20,10) = 184756', () => check(Array(20).fill(1), 0, 184756), { timeout: 2000 });
  it('twenty 50s (sum 1000), target 0 -> 184756', () => check(Array(20).fill(50), 0, 184756), { timeout: 2000 });
  it('twenty 0s, any target 0 -> 2^20', () => check(Array(20).fill(0), 0, 1048576), { timeout: 2000 });
  it('twenty 1s, target 20 -> 1', () => check(Array(20).fill(1), 20, 1), { timeout: 2000 });
});
