import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fmt, clone, makeRng, randomArray } from '../../lib/testutil.js';
import { jump } from './jump-game-ii.js';

const check = (nums, expected) =>
  assert.equal(jump(clone(nums)), expected, `jump(${fmt(nums)}): expected ${expected}`);

describe('Jump Game II', () => {
  it('example 1: [2,3,1,1,4] -> 2', () => check([2, 3, 1, 1, 4], 2));
  it('example 2: [2,3,0,1,4] -> 2', () => check([2, 3, 0, 1, 4], 2));
  it('single element [0] -> 0 jumps', () => check([0], 0));
  it('single non-zero element -> 0 jumps', () => check([5], 0));
  it('[1,2] -> 1', () => check([1, 2], 1));
  it('[2,1] -> 1', () => check([2, 1], 1));
  it('[1,1,1,1] -> 3 (one step at a time)', () => check([1, 1, 1, 1], 3));
  it('one huge jump: [10,9,8,7,6,5,4,3,2,1] -> 1', () => check([10, 9, 8, 7, 6, 5, 4, 3, 2, 1], 1));
  it('[1,2,3] -> 2', () => check([1, 2, 3], 2));
  it('[2,1,1,1,1] -> 3', () => check([2, 1, 1, 1, 1], 3));
  it('[1,2,1,1,1] -> 3', () => check([1, 2, 1, 1, 1], 3));
  it('[3,2,1,1,4] -> 2', () => check([3, 2, 1, 1, 4], 2));
  it('[2,3,1,1,1,1,4] -> 4', () => check([2, 3, 1, 1, 1, 1, 4], 4));
  it('[5,9,3,2,1,0,2,3,3,1,0,0] -> 3', () => check([5, 9, 3, 2, 1, 0, 2, 3, 3, 1, 0, 0], 3));
  it('zeros in the middle are skipped: [3,0,0,0] -> 1', () => check([3, 0, 0, 0], 1));
  it('[4,1,1,3,1,1,1] -> 2', () => check([4, 1, 1, 3, 1, 1, 1], 2));
  it('10^4 ones -> 9999', () => check(Array(10000).fill(1), 9999), { timeout: 2000 });
  it('10^4 elements of 1000 -> 10', () => check(Array(10000).fill(1000), 10), { timeout: 2000 });
  it('10^4 seeded random values in [1,1000]', () => {
    const rng = makeRng(45);
    check(randomArray(rng, 10000, 1, 1000), 12);
  }, { timeout: 2000 });
  it('10^4 seeded random values in [1,3] (long chain of jumps)', () => {
    const rng = makeRng(46);
    check(randomArray(rng, 10000, 1, 3), 4824);
  }, { timeout: 2000 });
});
