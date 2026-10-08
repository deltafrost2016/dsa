import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { merge } from './merge-intervals.js';
import { clone, fmt, makeRng } from '../../lib/testutil.js';

function check(intervals, expected) {
  const actual = merge(clone(intervals));
  assert.deepStrictEqual(
    actual,
    expected,
    `merge(${fmt(intervals)})\n  expected: ${fmt(expected)}\n  actual:   ${fmt(actual)}`,
  );
}

describe('Merge Intervals', () => {
  it('example 1', () => {
    check([[1, 3], [2, 6], [8, 10], [15, 18]], [[1, 6], [8, 10], [15, 18]]);
  });
  it('example 2: touching intervals merge', () => {
    check([[1, 4], [4, 5]], [[1, 5]]);
  });
  it('single interval', () => {
    check([[4, 7]], [[4, 7]]);
  });
  it('unsorted input', () => {
    check([[8, 10], [1, 3], [15, 18], [2, 6]], [[1, 6], [8, 10], [15, 18]]);
  });
  it('no overlaps stays as is', () => {
    check([[1, 2], [3, 4], [5, 6]], [[1, 2], [3, 4], [5, 6]]);
  });
  it('all identical intervals collapse to one', () => {
    check([[2, 5], [2, 5], [2, 5]], [[2, 5]]);
  });
  it('one interval swallows the rest', () => {
    check([[1, 10], [2, 3], [4, 5], [6, 7]], [[1, 10]]);
  });
  it('contained interval with smaller end does not shrink the merge', () => {
    check([[1, 10], [2, 3], [9, 12]], [[1, 12]]);
  });
  it('chain of touching intervals', () => {
    check([[1, 2], [2, 3], [3, 4], [4, 5]], [[1, 5]]);
  });
  it('zero-length intervals', () => {
    check([[0, 0], [0, 0], [1, 1]], [[0, 0], [1, 1]]);
  });
  it('reverse sorted input', () => {
    check([[9, 10], [7, 8], [5, 6], [1, 5]], [[1, 6], [7, 8], [9, 10]]);
  });
  it('large input: 100000 pieces reassembling into known blocks', { timeout: 2000 }, () => {
    const rng = makeRng(2024);
    const blocks = [];
    const pieces = [];
    let cursor = 0;
    for (let b = 0; b < 2000; b++) {
      const start = cursor;
      let x = start;
      for (let p = 0; p < 50; p++) {
        const nx = x + rng.int(1, 5);
        pieces.push([x, nx]); // consecutive pieces touch, so each block merges into one
        x = nx;
      }
      blocks.push([start, x]);
      cursor = x + rng.int(1, 5); // gap of at least 1 so blocks never touch
    }
    const actual = merge(clone(rng.shuffle(pieces)));
    assert.deepStrictEqual(
      actual,
      blocks,
      `large merge mismatch (expected first blocks ${fmt(blocks.slice(0, 3))}, got ${fmt(actual.slice(0, 3))})`,
    );
  });
});
