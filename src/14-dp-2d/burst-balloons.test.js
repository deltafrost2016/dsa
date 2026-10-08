import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fmt, clone, makeRng, randomArray } from '../../lib/testutil.js';
import { maxCoins } from './burst-balloons.js';

const check = (nums, expected) => {
  const input = clone(nums);
  assert.equal(maxCoins(clone(nums)), expected, `maxCoins(${fmt(input)}): expected ${expected}`);
};

describe('Burst Balloons', () => {
  it('example 1: [3,1,5,8] -> 167', () => check([3, 1, 5, 8], 167));
  it('example 2: [1,5] -> 10', () => check([1, 5], 10));
  it('single balloon uses virtual 1s: [5] -> 5', () => check([5], 5));
  it('single zero -> 0', () => check([0], 0));
  it('all zeros -> 0', () => check([0, 0, 0, 0], 0));
  it('[1,1,1] -> 3', () => check([1, 1, 1], 3));
  it('[1,5,1] -> 15', () => check([1, 5, 1], 15));
  it('[2,2] -> 6', () => check([2, 2], 6));
  it('[7,9] -> 72 (order matters: burst the smaller first)', () => check([7, 9], 72));
  it('a zero between two values: [3,0,4] -> 16', () => check([3, 0, 4], 16));
  it('[9,76,64,21] -> 116718', () => check([9, 76, 64, 21], 116718));
  it('20 mixed balloons including zeros -> 3550', () => {
    check([8, 2, 6, 8, 9, 8, 1, 4, 1, 5, 3, 0, 7, 7, 0, 4, 2, 2, 4, 1], 3550);
  });
  it('300 balloons all 100 (n! brute force and 3^n recursion cannot finish)', () => {
    check(Array(300).fill(100), 298010100);
  }, { timeout: 2000 });
  it('300 seeded random balloons 0..100', () => {
    const rng = makeRng(312);
    check(randomArray(rng, 300, 0, 100), 97260961);
  }, { timeout: 2000 });
  it('300 ones -> 300 (every burst is worth 1)', () => {
    check(Array(300).fill(1), 300);
  }, { timeout: 2000 });
});
