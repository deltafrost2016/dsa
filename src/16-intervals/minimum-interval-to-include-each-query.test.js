import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { minInterval } from './minimum-interval-to-include-each-query.js';
import { clone, fmt, makeRng } from '../../lib/testutil.js';

function check(intervals, queries, expected) {
  const actual = minInterval(clone(intervals), clone(queries));
  assert.deepStrictEqual(
    actual,
    expected,
    `minInterval(${fmt(intervals)}, ${fmt(queries)})\n  expected: ${fmt(expected)}\n  actual:   ${fmt(actual)}`,
  );
}

// Tiny brute-force oracle for small random cases only.
function oracle(intervals, queries) {
  return queries.map((q) => {
    let best = -1;
    for (const [l, r] of intervals) {
      if (l <= q && q <= r && (best === -1 || r - l + 1 < best)) best = r - l + 1;
    }
    return best;
  });
}

describe('Minimum Interval to Include Each Query', () => {
  it('example 1', () => {
    check([[1, 4], [2, 4], [3, 6], [4, 4]], [2, 3, 4, 5], [3, 3, 1, 4]);
  });
  it('example 2', () => {
    check([[2, 3], [2, 5], [1, 8], [20, 25]], [2, 19, 5, 22], [2, -1, 4, 6]);
  });
  it('single interval, query inside', () => {
    check([[3, 7]], [5], [5]);
  });
  it('queries on both interval endpoints', () => {
    check([[3, 7]], [3, 7], [5, 5]);
  });
  it('queries outside every interval', () => {
    check([[3, 7]], [1, 2, 8, 100], [-1, -1, -1, -1]);
  });
  it('answers keep the original query order (unsorted queries)', () => {
    check([[1, 2], [1, 10]], [10, 1, 5, 2], [10, 2, 10, 2]);
  });
  it('duplicate queries', () => {
    check([[1, 5], [2, 3]], [3, 3, 3], [2, 2, 2]);
  });
  it('duplicate intervals', () => {
    check([[1, 5], [1, 5]], [1, 5], [5, 5]);
  });
  it('size-1 interval inside a bigger one', () => {
    check([[4, 4], [1, 10]], [4, 5], [1, 10]);
  });
  it('a smaller interval that ended before the query must not be used', () => {
    check([[1, 2], [1, 10]], [5], [10]);
  });
  it('random small inputs match a brute-force scan', () => {
    const rng = makeRng(424242);
    for (let iter = 0; iter < 200; iter++) {
      const n = rng.int(1, 8);
      const intervals = Array.from({ length: n }, () => {
        const l = rng.int(1, 20);
        return [l, l + rng.int(0, 10)];
      });
      const queries = Array.from({ length: rng.int(1, 8) }, () => rng.int(1, 32));
      check(intervals, queries, oracle(intervals, queries));
    }
  });
  it('large input: 100000 nested intervals and 100000 queries', { timeout: 2000 }, () => {
    const rng = makeRng(8);
    const n = 100000;
    // interval k = [k+1, 2n-k]; the tightest interval containing q is k = min(q-1, 2n-q)
    const intervals = rng.shuffle(Array.from({ length: n }, (_, k) => [k + 1, 2 * n - k]));
    const queries = Array.from({ length: 100000 }, () => rng.int(1, 2 * n + 5));
    const expected = queries.map((q) => {
      if (q > 2 * n) return -1;
      const k = Math.min(q - 1, 2 * n - q);
      return 2 * n - k - (k + 1) + 1;
    });
    check(intervals, queries, expected);
  });
});
