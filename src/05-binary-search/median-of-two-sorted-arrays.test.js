import { describe, it } from 'node:test';
import { findMedianSortedArrays } from './median-of-two-sorted-arrays.js';
import { clone, closeTo, fmt, makeRng, randomArray } from '../../lib/testutil.js';

function check(a, b, expected) {
  const actual = findMedianSortedArrays(clone(a), clone(b));
  closeTo(actual, expected, 1e-5, `findMedianSortedArrays(${fmt(a)}, ${fmt(b)}): expected ${expected}, got ${fmt(actual)}`);
}

/** Test oracle: sort the concatenation and take the middle. */
function oracle(a, b) {
  const all = [...a, ...b].sort((x, y) => x - y);
  const m = all.length >> 1;
  return all.length % 2 ? all[m] : (all[m - 1] + all[m]) / 2;
}

describe('Median of Two Sorted Arrays (#4)', () => {
  it('example 1: odd total', () => check([1, 3], [2], 2));
  it('example 2: even total', () => check([1, 2], [3, 4], 2.5));
  it('first array empty, odd total', () => check([], [1], 1));
  it('second array empty, odd total', () => check([2], [], 2));
  it('first array empty, even total', () => check([], [2, 3], 2.5));
  it('second array empty, even total', () => check([1, 2, 3, 4], [], 2.5));
  it('all zeros', () => check([0, 0], [0, 0], 0));
  it('disjoint: all of A before all of B', () => check([1, 2, 3], [10, 11, 12], 6.5));
  it('disjoint: all of B before all of A', () => check([10, 11, 12], [1, 2, 3], 6.5));
  it('disjoint with odd total', () => check([1, 2], [3, 4, 5], 3));
  it('interleaved values', () => check([1, 3, 5, 7], [2, 4, 6, 8], 4.5));
  it('very different lengths', () => check([5], [1, 2, 3, 4, 6, 7, 8, 9], 5));
  it('duplicates across arrays', () => check([2, 2, 2], [2, 2], 2));
  it('negative values', () => check([-5, -3, -1], [-4, -2], -3));
  it('mixed signs, whole-number average', () => check([-2, -1], [3, 4], 1));
  it('single elements', () => check([1], [2], 1.5));
  it('boundary values', () => check([-1_000_000], [1_000_000], 0));

  it('random small cases agree with a sort-and-pick oracle', () => {
    const rng = makeRng(4);
    for (let t = 0; t < 500; t++) {
      const m = rng.int(0, 12);
      const n = rng.int(m === 0 ? 1 : 0, 12);
      const a = randomArray(rng, m, -20, 20).sort((x, y) => x - y);
      const b = randomArray(rng, n, -20, 20).sort((x, y) => x - y);
      check(a, b, oracle(a, b));
    }
  });

  it('large: two arrays of 10^6 elements (must be logarithmic)', { timeout: 2000 }, () => {
    const n = 1_000_000;
    const evens = Array.from({ length: n }, (_, i) => i * 2);
    const odds = Array.from({ length: n }, (_, i) => i * 2 + 1);
    const low = Array.from({ length: n }, (_, i) => i);
    const high = Array.from({ length: n }, (_, i) => n + i);
    // evens + odds together are 0..2n-1 -> median (2n-1)/2
    closeTo(findMedianSortedArrays(evens, odds), (2 * n - 1) / 2, 1e-5, 'evens vs odds');
    closeTo(findMedianSortedArrays(odds, evens), (2 * n - 1) / 2, 1e-5, 'odds vs evens');
    // low + high are also 0..2n-1
    closeTo(findMedianSortedArrays(low, high), (2 * n - 1) / 2, 1e-5, 'low vs high');
    closeTo(findMedianSortedArrays(high, low), (2 * n - 1) / 2, 1e-5, 'high vs low');
  });
});
