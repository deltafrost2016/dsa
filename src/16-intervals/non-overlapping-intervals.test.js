import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { eraseOverlapIntervals } from './non-overlapping-intervals.js';
import { clone, fmt, makeRng } from '../../lib/testutil.js';

function check(intervals, expected) {
  const actual = eraseOverlapIntervals(clone(intervals));
  assert.equal(actual, expected, `eraseOverlapIntervals(${fmt(intervals)})\n  expected: ${expected}\n  actual:   ${fmt(actual)}`);
}

describe('Non-overlapping Intervals', () => {
  it('example 1', () => {
    check([[1, 2], [2, 3], [3, 4], [1, 3]], 1);
  });
  it('example 2: identical intervals', () => {
    check([[1, 2], [1, 2], [1, 2]], 2);
  });
  it('example 3: touching intervals do not overlap', () => {
    check([[1, 2], [2, 3]], 0);
  });
  it('single interval', () => {
    check([[1, 5]], 0);
  });
  it('already disjoint', () => {
    check([[1, 2], [4, 5], [7, 8]], 0);
  });
  it('one long interval covering many short ones', () => {
    check([[1, 100], [1, 2], [3, 4], [5, 6]], 1);
  });
  it('greedy trap: keeping the earliest start is wrong', () => {
    check([[1, 10], [2, 3], [3, 4], [4, 5]], 1);
  });
  it('unsorted input', () => {
    check([[3, 4], [1, 3], [2, 3], [1, 2]], 1);
  });
  it('negative values', () => {
    check([[-10, -5], [-7, -3], [-3, 0], [-5, -3]], 1);
  });
  it('chain where each overlaps the next', () => {
    check([[1, 4], [2, 5], [3, 6], [4, 7]], 2);
  });
  it('nested chain', () => {
    check([[1, 8], [2, 7], [3, 6], [4, 5]], 3);
  });
  it('extreme bounds', () => {
    check([[-50000, 50000], [-50000, 0], [0, 50000]], 1);
  });
  it('large input: 100000 intervals in groups of mutual overlap', { timeout: 2000 }, () => {
    const rng = makeRng(77);
    const groups = 20000;
    const perGroup = 5;
    const intervals = [];
    for (let g = 0; g < groups; g++) {
      const base = g * 10 - 100000;
      // every interval in a group contains the point base+4..base+5, groups are 5 apart
      for (let k = 0; k < perGroup; k++) intervals.push([base + k, base + 5]);
    }
    check(rng.shuffle(intervals), groups * (perGroup - 1));
  });
});
