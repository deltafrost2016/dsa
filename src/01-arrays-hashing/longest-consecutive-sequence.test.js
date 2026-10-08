import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { longestConsecutive } from './longest-consecutive-sequence.js';
import { clone, makeRng, fmt } from '../../lib/testutil.js';

const check = (nums, expected) => {
  const actual = longestConsecutive(clone(nums));
  assert.equal(actual, expected, `longestConsecutive(${fmt(nums)}) expected ${expected}, got ${fmt(actual)}`);
};

describe('Longest Consecutive Sequence', () => {
  it('example 1: [100,4,200,1,3,2] -> 4', () => check([100, 4, 200, 1, 3, 2], 4));
  it('example 2: [0,3,7,2,5,8,4,6,0,1] -> 9', () => check([0, 3, 7, 2, 5, 8, 4, 6, 0, 1], 9));
  it('example 3: [1,0,1,2] -> 3', () => check([1, 0, 1, 2], 3));
  it('empty array -> 0', () => check([], 0));
  it('single element -> 1', () => check([42], 1));
  it('all duplicates -> 1', () => check([5, 5, 5, 5], 1));
  it('no two consecutive -> 1', () => check([10, 20, 30, 40], 1));
  it('two separate runs, longer one later', () => check([1, 2, 10, 11, 12, 13], 4));
  it('negative numbers', () => check([-3, -2, -1, -5, -4], 5));
  it('run crossing zero', () => check([-2, -1, 0, 1, 2, 9], 5));
  it('descending order input', () => check([5, 4, 3, 2, 1], 5));
  it('duplicates inside a run do not extend it', () => check([1, 2, 2, 3, 3, 3, 4], 4));
  it('gap of two is not consecutive', () => check([1, 3, 5, 7], 1));
  it('boundary values', () => check([-1e9, -1e9 + 1, 1e9, 1e9 - 1, 1e9 - 2], 3));

  it('large shuffled consecutive range (100k) -> 100000', { timeout: 2000 }, () => {
    const rng = makeRng(128);
    const nums = rng.shuffle(Array.from({ length: 100000 }, (_, i) => i - 50000));
    check(nums, 100000);
  });

  it('large input (100k): many separate runs, longest is 777', { timeout: 2000 }, () => {
    const rng = makeRng(129);
    const nums = [];
    let start = -400000;
    let total = 0;
    // First run has length 777; every other run is at most 600. Each run is followed by a gap of one missing value.
    for (let first = true; total < 100000; first = false) {
      const len = first ? 777 : rng.int(1, 600);
      for (let i = 0; i < len; i++) nums.push(start + i);
      start += len + 1;
      total += len;
    }
    check(rng.shuffle(nums), 777);
  });

  it('large input (100k) with many duplicates', { timeout: 2000 }, () => {
    const rng = makeRng(130);
    const base = Array.from({ length: 2000 }, (_, i) => i);
    const nums = [];
    for (let i = 0; i < 100000; i++) nums.push(rng.pick(base));
    const unique = new Set(nums);
    // longest run of the unique set, computed by a simple sort-based reference
    const sorted = [...unique].sort((a, b) => a - b);
    let best = 1;
    let cur = 1;
    for (let i = 1; i < sorted.length; i++) {
      cur = sorted[i] === sorted[i - 1] + 1 ? cur + 1 : 1;
      best = Math.max(best, cur);
    }
    check(nums, best);
  });
});
