import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { searchMatrix } from './search-a-2d-matrix.js';
import { clone, fmt, makeRng } from '../../lib/testutil.js';

function check(matrix, target, expected) {
  const actual = searchMatrix(clone(matrix), target);
  assert.equal(actual, expected, `searchMatrix(${fmt(matrix)}, ${target}): expected ${expected}, got ${fmt(actual)}`);
}

const M = [
  [1, 3, 5, 7],
  [10, 11, 16, 20],
  [23, 30, 34, 60],
];

describe('Search a 2D Matrix (#74)', () => {
  it('example 1: target present', () => check(M, 3, true));
  it('example 2: target absent', () => check(M, 13, false));
  it('first cell', () => check(M, 1, true));
  it('last cell', () => check(M, 60, true));
  it('first value of a middle row', () => check(M, 10, true));
  it('last value of a middle row', () => check(M, 20, true));
  it('smaller than everything', () => check(M, 0, false));
  it('larger than everything', () => check(M, 61, false));
  it('falls in the gap between the end of one row and start of the next', () => {
    check(M, 8, false);
    check(M, 21, false);
  });
  it('1x1 matrix, found', () => check([[7]], 7, true));
  it('1x1 matrix, not found', () => check([[7]], 8, false));
  it('single row', () => {
    check([[1, 3, 5, 7, 9]], 7, true);
    check([[1, 3, 5, 7, 9]], 4, false);
  });
  it('single column', () => {
    check([[1], [3], [5], [7]], 5, true);
    check([[1], [3], [5], [7]], 6, false);
  });
  it('negative values', () => {
    check([[-20, -15], [-10, -5], [0, 4]], -10, true);
    check([[-20, -15], [-10, -5], [0, 4]], -12, false);
  });
  it('every value in a small matrix is found, every gap is not', () => {
    const m = [[2, 4, 6], [8, 10, 12], [14, 16, 18], [20, 22, 24]];
    for (let t = 0; t <= 26; t++) check(m, t, t >= 2 && t <= 24 && t % 2 === 0);
  });

  it('large 1000x1000 matrix with many queries (must be logarithmic)', { timeout: 2000 }, () => {
    const rng = makeRng(74);
    const rows = 1000;
    const cols = 1000;
    const matrix = Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, c) => (r * cols + c) * 2));
    for (let q = 0; q < 20000; q++) {
      const target = rng.int(-5, rows * cols * 2 + 5);
      const expected = target >= 0 && target % 2 === 0 && target / 2 < rows * cols;
      if (searchMatrix(matrix, target) !== expected) assert.fail(`large matrix: target ${target} expected ${expected}`);
    }
  });
});
