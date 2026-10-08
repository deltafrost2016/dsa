import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { insert } from './insert-interval.js';
import { clone, fmt } from '../../lib/testutil.js';

function check(intervals, newInterval, expected) {
  const actual = insert(clone(intervals), clone(newInterval));
  assert.deepStrictEqual(
    actual,
    expected,
    `insert(${fmt(intervals)}, ${fmt(newInterval)})\n  expected: ${fmt(expected)}\n  actual:   ${fmt(actual)}`,
  );
}

describe('Insert Interval', () => {
  it('example 1: merges with one interval', () => {
    check([[1, 3], [6, 9]], [2, 5], [[1, 5], [6, 9]]);
  });
  it('example 2: merges with several intervals', () => {
    check([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8], [[1, 2], [3, 10], [12, 16]]);
  });
  it('empty list returns just the new interval', () => {
    check([], [5, 7], [[5, 7]]);
  });
  it('new interval goes before everything', () => {
    check([[3, 5], [8, 9]], [0, 1], [[0, 1], [3, 5], [8, 9]]);
  });
  it('new interval goes after everything', () => {
    check([[1, 2], [3, 5]], [7, 8], [[1, 2], [3, 5], [7, 8]]);
  });
  it('new interval fits in a gap in the middle', () => {
    check([[1, 2], [8, 9]], [4, 5], [[1, 2], [4, 5], [8, 9]]);
  });
  it('new interval touching the end of an interval merges', () => {
    check([[1, 3], [6, 9]], [3, 4], [[1, 4], [6, 9]]);
  });
  it('new interval touching the start of an interval merges', () => {
    check([[1, 3], [6, 9]], [5, 6], [[1, 3], [5, 9]]);
  });
  it('new interval touching both neighbours bridges them', () => {
    check([[1, 3], [6, 9]], [3, 6], [[1, 9]]);
  });
  it('new interval covers every interval', () => {
    check([[2, 3], [4, 5], [6, 7]], [0, 10], [[0, 10]]);
  });
  it('new interval lies strictly inside an existing one', () => {
    check([[1, 10]], [3, 4], [[1, 10]]);
  });
  it('new interval equal to an existing one', () => {
    check([[1, 2], [3, 4]], [3, 4], [[1, 2], [3, 4]]);
  });
  it('single interval, overlapping from the left', () => {
    check([[5, 8]], [1, 6], [[1, 8]]);
  });
  it('single interval, overlapping from the right', () => {
    check([[5, 8]], [7, 12], [[5, 12]]);
  });
  it('zero-length intervals', () => {
    check([[1, 1], [3, 3]], [2, 2], [[1, 1], [2, 2], [3, 3]]);
    check([[1, 1], [3, 3]], [1, 3], [[1, 3]]);
  });
  it('large input: 200000 intervals, insert in the middle spanning many', { timeout: 2000 }, () => {
    const n = 200000;
    const intervals = Array.from({ length: n }, (_, i) => [3 * i, 3 * i + 1]);
    // new interval [3a+1, 3b] touches interval a (end 3a+1) and interval b (start 3b)
    const a = 50000;
    const b = 150000;
    const expected = [...intervals.slice(0, a), [3 * a, 3 * b + 1], ...intervals.slice(b + 1)];
    const actual = insert(clone(intervals), [3 * a + 1, 3 * b]);
    assert.equal(actual.length, expected.length, `expected ${expected.length} intervals, got ${actual.length}`);
    assert.deepStrictEqual(actual, expected, 'large insert result differs from expected');
  });
});
