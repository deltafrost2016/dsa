import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fmt, clone, makeRng } from '../../lib/testutil.js';
import { longestIncreasingPath } from './longest-increasing-path-in-a-matrix.js';

const check = (matrix, expected, label = '') => {
  const input = clone(matrix);
  const actual = longestIncreasingPath(clone(matrix));
  assert.equal(actual, expected, `longestIncreasingPath(${fmt(input)})${label}: expected ${expected}, got ${actual}`);
};

describe('Longest Increasing Path in a Matrix', () => {
  it('example 1 -> 4', () => check([[9, 9, 4], [6, 6, 8], [2, 1, 1]], 4));
  it('example 2 -> 4 (no diagonal moves)', () => check([[3, 4, 5], [3, 2, 6], [2, 2, 1]], 4));
  it('example 3: single cell -> 1', () => check([[1]], 1));
  it('single row, increasing -> length', () => check([[1, 2, 3, 4]], 4));
  it('single row, decreasing -> length (walk it backwards)', () => check([[4, 3, 2, 1]], 4));
  it('single column, increasing -> length', () => check([[1], [2], [3]], 3));
  it('single column, zigzag -> 2', () => check([[1], [3], [2], [4]], 2));
  it('all equal values -> 1 (strictly increasing required)', () => check([[5, 5], [5, 5]], 1));
  it('zeros -> 1', () => check([[0, 0, 0], [0, 0, 0]], 1));
  it('max 32-bit values: [[2147483647, 0]] -> 2', () => check([[2147483647, 0]], 2));
  it('2x2 spiral: [[1,2],[4,3]] -> 4', () => check([[1, 2], [4, 3]], 4));
  it('2x2 with a dead end: [[1,2],[2,1]] -> 2', () => check([[1, 2], [2, 1]], 2));
  it('[[1,5,1],[1,4,1],[1,3,1]] -> 4 (1,3,4,5 up the middle column)', () => {
    check([[1, 5, 1], [1, 4, 1], [1, 3, 1]], 4);
  });
  it('2x5 rectangle snake -> 10', () => {
    check([[1, 2, 3, 4, 5], [10, 9, 8, 7, 6]], 10);
  });
  it('row-major increasing 200x200 -> 399 (plain DFS without memo is exponential)', () => {
    const n = 200;
    const m = Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => r * n + c));
    check(m, 399);
  }, { timeout: 2000 });
  it('60x60 boustrophedon snake -> 3600 (deep path; memoised or iterative)', () => {
    const n = 60;
    const m = Array.from({ length: n }, (_, r) =>
      Array.from({ length: n }, (_, c) => (r % 2 === 0 ? r * n + c : r * n + (n - 1 - c))),
    );
    check(m, n * n);
  }, { timeout: 2000 });
  it('200x200 all equal -> 1', () => {
    check(Array.from({ length: 200 }, () => Array(200).fill(7)), 1);
  }, { timeout: 2000 });
  it('200x200 seeded random values 0..1000', () => {
    const rng = makeRng(329);
    const m = Array.from({ length: 200 }, () => Array.from({ length: 200 }, () => rng.int(0, 1000)));
    check(m, 12);
  }, { timeout: 2000 });
  it('200x200 checkerboard 0/1 -> 2', () => {
    check(Array.from({ length: 200 }, (_, r) => Array.from({ length: 200 }, (_, c) => (r + c) % 2)), 2);
  }, { timeout: 2000 });
});
