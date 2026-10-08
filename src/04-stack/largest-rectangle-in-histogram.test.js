import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { largestRectangleArea } from './largest-rectangle-in-histogram.js';
import { clone, fmt, makeRng, randomArray } from '../../lib/testutil.js';

function check(heights, expected) {
  const actual = largestRectangleArea(clone(heights));
  assert.equal(
    actual,
    expected,
    `largestRectangleArea(${fmt(heights)})\n  expected: ${fmt(expected)}\n  actual:   ${fmt(actual)}`,
  );
}

function brute(heights) {
  let best = 0;
  for (let i = 0; i < heights.length; i++) {
    let min = Infinity;
    for (let j = i; j < heights.length; j++) {
      min = Math.min(min, heights[j]);
      best = Math.max(best, min * (j - i + 1));
    }
  }
  return best;
}

describe('Largest Rectangle in Histogram', () => {
  it('example 1: [2,1,5,6,2,3] -> 10', () => check([2, 1, 5, 6, 2, 3], 10));
  it('example 2: [2,4] -> 4', () => check([2, 4], 4));
  it('single bar', () => check([5], 5));
  it('single zero-height bar', () => check([0], 0));
  it('all zeros', () => check([0, 0, 0], 0));
  it('all equal heights: full width', () => check([3, 3, 3, 3], 12));
  it('strictly increasing', () => check([1, 2, 3, 4, 5], 9));
  it('strictly decreasing', () => check([5, 4, 3, 2, 1], 9));
  it('single tall bar between short ones', () => check([1, 10, 1], 10));
  it('wide short rectangle beats tall narrow bar', () => check([2, 2, 2, 2, 2, 9], 12));
  it('zero in the middle splits the histogram', () => check([4, 4, 0, 3, 3, 3], 9));
  it('valley: the best rectangle spans across a dip', () => check([6, 2, 5, 4, 5, 1, 6], 12));
  it('rectangle at the right end', () => check([1, 1, 1, 7, 7, 7], 21));
  it('rectangle at the left end', () => check([7, 7, 7, 1, 1, 1], 21));
  it('two bars', () => check([2, 1], 2));
  it('bars separated by zeros: tallest single bar wins', () => check([3, 0, 5, 0, 4], 5));
  it('boundary height 10^4 repeated', () => check(new Array(10).fill(10000), 100000));
  it('mountain shape', () => check([1, 3, 5, 7, 5, 3, 1], 15));

  it('matches brute force on random small inputs', () => {
    const rng = makeRng(84);
    for (let t = 0; t < 400; t++) {
      const heights = randomArray(rng, rng.int(1, 12), 0, 8);
      check(heights, brute(heights));
    }
  });

  it('large input: 10^5 equal bars -> 10^9', { timeout: 2000 }, () => {
    const n = 100000;
    check(new Array(n).fill(10000), n * 10000);
  });

  it('large input: strictly increasing staircase', { timeout: 2000 }, () => {
    const n = 100000;
    const heights = Array.from({ length: n }, (_, i) => Math.floor((i * 10000) / n) + 1);
    let expected = 0;
    // for a non-decreasing histogram the best rectangle is anchored at some bar i and extends to the right end
    for (let i = 0; i < n; i++) expected = Math.max(expected, heights[i] * (n - i));
    check(heights, expected);
  });

  it('large input: strictly decreasing staircase', { timeout: 2000 }, () => {
    const n = 100000;
    const heights = Array.from({ length: n }, (_, i) => 10000 - Math.floor((i * 9999) / n));
    let expected = 0;
    // for a non-increasing histogram the best rectangle is anchored at some bar i and extends to the left end
    for (let i = 0; i < n; i++) expected = Math.max(expected, heights[i] * (i + 1));
    check(heights, expected);
  });

  it('large input: alternating 0 and 10^4 -> 10^4', { timeout: 2000 }, () => {
    const heights = Array.from({ length: 100000 }, (_, i) => (i % 2 === 0 ? 0 : 10000));
    check(heights, 10000);
  });
});
