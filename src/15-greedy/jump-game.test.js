import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fmt, clone, makeRng, randomArray } from '../../lib/testutil.js';
import { canJump } from './jump-game.js';

const check = (nums, expected) =>
  assert.equal(canJump(clone(nums)), expected, `canJump(${fmt(nums)}): expected ${expected}`);

describe('Jump Game', () => {
  it('example 1: [2,3,1,1,4] -> true', () => check([2, 3, 1, 1, 4], true));
  it('example 2: [3,2,1,0,4] -> false (stuck at the zero)', () => check([3, 2, 1, 0, 4], false));
  it('single element [0] -> true (already at the end)', () => check([0], true));
  it('single element [5] -> true', () => check([5], true));
  it('[0,1] -> false', () => check([0, 1], false));
  it('[1,0] -> true (zero at the last index is fine)', () => check([1, 0], true));
  it('[2,0,0] -> true (jump over zeros)', () => check([2, 0, 0], true));
  it('[1,1,0,1] -> false', () => check([1, 1, 0, 1], false));
  it('[0,2,3] -> false', () => check([0, 2, 3], false));
  it('[2,5,0,0] -> true', () => check([2, 5, 0, 0], true));
  it('[1,2,3] -> true', () => check([1, 2, 3], true));
  it('[2,0,1,0,1] -> false', () => check([2, 0, 1, 0, 1], false));
  it('big first jump overshoots the end -> true', () => check([100, 0, 0, 0], true));
  it('exactly enough: [3,0,0,0] -> true', () => check([3, 0, 0, 0], true));
  it('one short: [2,0,0,0] -> false', () => check([2, 0, 0, 0], false));
  it('only a middle element reaches the end: [1,1,1,3,0,0,0] -> true', () => check([1, 1, 1, 3, 0, 0, 0], true));
  it('10^4 ones -> true', () => check(Array(10000).fill(1), true), { timeout: 2000 });
  it('10^4 ones with a zero in the middle -> false', () => {
    const nums = Array(10000).fill(1);
    nums[5000] = 0;
    check(nums, false);
  }, { timeout: 2000 });
  it('5000 threes then a wall of four zeros then 1 -> false (plain backtracking explodes)', () => {
    check([...Array(5000).fill(3), 0, 0, 0, 0, 1], false);
  }, { timeout: 2000 });
  it('5000 threes then a wall of two zeros then 1 -> true', () => {
    check([...Array(5000).fill(3), 0, 0, 1], true);
  }, { timeout: 2000 });
  it('seeded random values in [0,3], n=10^4', () => {
    const rng = makeRng(55);
    check(randomArray(rng, 10000, 0, 3), false);
  }, { timeout: 2000 });
});
