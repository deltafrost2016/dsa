import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { setZeroes } from './set-matrix-zeroes.js';
import { clone, fmt, makeRng } from '../../lib/testutil.js';

function check(matrix, expected) {
  const input = clone(matrix);
  const ret = setZeroes(input);
  assert.equal(ret, undefined, 'setZeroes must work in place and return nothing');
  assert.deepStrictEqual(
    input,
    expected,
    `setZeroes(${fmt(matrix)}) mutated matrix\n  expected: ${fmt(expected)}\n  actual:   ${fmt(input)}`,
  );
}

// Expected result by the definition, using O(m + n) bookkeeping (the stub should beat this on space).
function zeroed(m) {
  const rows = new Set();
  const cols = new Set();
  m.forEach((row, i) => row.forEach((v, j) => {
    if (v === 0) {
      rows.add(i);
      cols.add(j);
    }
  }));
  return m.map((row, i) => row.map((v, j) => (rows.has(i) || cols.has(j) ? 0 : v)));
}

describe('Set Matrix Zeroes', () => {
  it('example 1: single zero in the middle', () => {
    check([[1, 1, 1], [1, 0, 1], [1, 1, 1]], [[1, 0, 1], [0, 0, 0], [1, 0, 1]]);
  });
  it('example 2: zeros in the first row', () => {
    check([[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]], [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]);
  });
  it('no zeros leaves the matrix unchanged', () => {
    check([[1, 2], [3, 4]], [[1, 2], [3, 4]]);
  });
  it('1x1 zero', () => {
    check([[0]], [[0]]);
  });
  it('1x1 non-zero', () => {
    check([[9]], [[9]]);
  });
  it('single row with a zero becomes all zero', () => {
    check([[1, 0, 3]], [[0, 0, 0]]);
  });
  it('single column with a zero becomes all zero', () => {
    check([[1], [0], [3]], [[0], [0], [0]]);
  });
  it('zero in the top-left corner', () => {
    check([[0, 1, 1], [1, 1, 1], [1, 1, 1]], [[0, 0, 0], [0, 1, 1], [0, 1, 1]]);
  });
  it('zero in the first column only', () => {
    check([[1, 2, 3], [0, 5, 6], [7, 8, 9]], [[0, 2, 3], [0, 0, 0], [0, 8, 9]]);
  });
  it('newly created zeros do not spread further', () => {
    check([[1, 1, 1, 1], [1, 0, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1]], [[1, 0, 1, 1], [0, 0, 0, 0], [1, 0, 1, 1], [1, 0, 1, 1]]);
  });
  it('all zeros', () => {
    check([[0, 0], [0, 0]], [[0, 0], [0, 0]]);
  });
  it('extreme 32-bit values and negatives survive when untouched', () => {
    check(
      [[-2147483648, 2147483647, 5], [1, 0, -1], [-2147483648, 7, 2147483647]],
      [[-2147483648, 0, 5], [0, 0, 0], [-2147483648, 0, 2147483647]],
    );
  });
  it('random matrices match the definition', () => {
    const rng = makeRng(73);
    for (let iter = 0; iter < 100; iter++) {
      const m = rng.int(1, 8);
      const n = rng.int(1, 8);
      const mat = Array.from({ length: m }, () => Array.from({ length: n }, () => (rng.int(0, 5) === 0 ? 0 : rng.int(-9, 9) || 1)));
      check(mat, zeroed(mat));
    }
  });
  it('large input: 400x400 with sparse zeros', { timeout: 2000 }, () => {
    const rng = makeRng(400);
    const n = 400;
    const mat = Array.from({ length: n }, () => Array.from({ length: n }, () => rng.int(1, 100)));
    for (let k = 0; k < 20; k++) mat[rng.int(0, n - 1)][rng.int(0, n - 1)] = 0;
    check(mat, zeroed(mat));
  });
});
