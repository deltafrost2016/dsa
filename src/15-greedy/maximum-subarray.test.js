import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fmt, clone, makeRng, randomArray } from '../../lib/testutil.js';
import { maxSubArray } from './maximum-subarray.js';

const check = (nums, expected) =>
  assert.equal(maxSubArray(clone(nums)), expected, `maxSubArray(${fmt(nums)}): expected ${expected}`);

describe('Maximum Subarray', () => {
  it('example 1: [-2,1,-3,4,-1,2,1,-5,4] -> 6', () => check([-2, 1, -3, 4, -1, 2, 1, -5, 4], 6));
  it('example 2: [1] -> 1', () => check([1], 1));
  it('example 3: [5,4,-1,7,8] -> 23 (take everything)', () => check([5, 4, -1, 7, 8], 23));
  it('single negative -> that value', () => check([-1], -1));
  it('single zero -> 0', () => check([0], 0));
  it('all negative -> the largest (least negative) element', () => check([-3, -2, -1, -5], -1));
  it('all negative, two elements', () => check([-2, -1], -1));
  it('all positive -> total sum', () => check([1, 2, 3, 4], 10));
  it('all zeros -> 0', () => check([0, 0, 0], 0));
  it('positive at the end after a negative: [-2,1] -> 1', () => check([-2, 1], 1));
  it('[8,-19,5,-4,20] -> 21', () => check([8, -19, 5, -4, 20], 21));
  it('best subarray at the start', () => check([5, 5, -20, 1, 1], 10));
  it('best subarray at the end', () => check([1, 1, -20, 5, 5], 10));
  it('a big negative splits two good runs: pick the larger', () => check([3, 3, -10, 4, 4, 4], 12));
  it('a small negative is bridged: [4,-1,2,1] -> 6', () => check([4, -1, 2, 1], 6));
  it('mixed zeros and negatives: [-1,0,-2] -> 0', () => check([-1, 0, -2], 0));
  it('10^5 elements of 10^4 -> 10^9', () => check(Array(100000).fill(10000), 1000000000), { timeout: 2000 });
  it('10^5 elements of -10^4 -> -10^4', () => check(Array(100000).fill(-10000), -10000), { timeout: 2000 });
  it('10^5 alternating +10^4/-10^4 -> 10^4', () => {
    check(Array.from({ length: 100000 }, (_, i) => (i % 2 === 0 ? 10000 : -10000)), 10000);
  }, { timeout: 2000 });
  it('10^5 seeded random values in [-10^4, 10^4] (O(n^2) is too slow)', () => {
    const rng = makeRng(53);
    check(randomArray(rng, 100000, -10000, 10000), 1112350);
  }, { timeout: 2000 });
});
