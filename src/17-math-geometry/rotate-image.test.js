import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { rotate } from './rotate-image.js';
import { clone, fmt, makeRng } from '../../lib/testutil.js';

function check(matrix, expected) {
  const input = clone(matrix);
  const ret = rotate(input);
  assert.equal(ret, undefined, 'rotate must work in place and return nothing');
  assert.deepStrictEqual(
    input,
    expected,
    `rotate(${fmt(matrix)}) mutated matrix\n  expected: ${fmt(expected)}\n  actual:   ${fmt(input)}`,
  );
}

// Expected result by the definition: cell (i, j) moves to (j, n - 1 - i).
function rotated(m) {
  const n = m.length;
  const out = Array.from({ length: n }, () => new Array(n));
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) out[j][n - 1 - i] = m[i][j];
  return out;
}

describe('Rotate Image', () => {
  it('example 1: 3x3', () => {
    check([[1, 2, 3], [4, 5, 6], [7, 8, 9]], [[7, 4, 1], [8, 5, 2], [9, 6, 3]]);
  });
  it('example 2: 4x4', () => {
    check(
      [[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]],
      [[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]],
    );
  });
  it('1x1 matrix is unchanged', () => {
    check([[42]], [[42]]);
  });
  it('2x2 matrix', () => {
    check([[1, 2], [3, 4]], [[3, 1], [4, 2]]);
  });
  it('negative values and zero', () => {
    check([[-1, 0], [-1000, 1000]], [[-1000, -1], [1000, 0]]);
  });
  it('all-equal matrix', () => {
    check([[7, 7, 7], [7, 7, 7], [7, 7, 7]], [[7, 7, 7], [7, 7, 7], [7, 7, 7]]);
  });
  it('5x5 (odd size with a fixed centre)', () => {
    const m = Array.from({ length: 5 }, (_, i) => Array.from({ length: 5 }, (_, j) => i * 5 + j));
    check(m, rotated(m));
  });
  it('four rotations return the original', () => {
    const m = Array.from({ length: 6 }, (_, i) => Array.from({ length: 6 }, (_, j) => i * 6 + j));
    const input = clone(m);
    for (let k = 0; k < 4; k++) rotate(input);
    assert.deepStrictEqual(input, m, 'rotating four times should give back the original matrix');
  });
  it('keeps the same row arrays (truly in place)', () => {
    const input = [[1, 2], [3, 4]];
    const rows = [...input];
    rotate(input);
    assert.ok(input.length === 2 && input[0] === rows[0] && input[1] === rows[1], 'row arrays should be reused, not replaced');
  });
  it('random matrices of sizes 1..20', () => {
    const rng = makeRng(48);
    for (let n = 1; n <= 20; n++) {
      const m = Array.from({ length: n }, () => Array.from({ length: n }, () => rng.int(-1000, 1000)));
      check(m, rotated(m));
    }
  });
  it('large input: 600x600 matrix', { timeout: 2000 }, () => {
    const n = 600;
    const rng = makeRng(600);
    const m = Array.from({ length: n }, () => Array.from({ length: n }, () => rng.int(-1000, 1000)));
    check(m, rotated(m));
  });
});
