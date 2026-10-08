import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spiralOrder } from './spiral-matrix.js';
import { clone, fmt } from '../../lib/testutil.js';

function check(matrix, expected) {
  const actual = spiralOrder(clone(matrix));
  assert.deepStrictEqual(
    actual,
    expected,
    `spiralOrder(${fmt(matrix)})\n  expected: ${fmt(expected)}\n  actual:   ${fmt(actual)}`,
  );
}

// Matrix of size m x n where each cell holds its own row-major index.
const grid = (m, n) => Array.from({ length: m }, (_, r) => Array.from({ length: n }, (_, c) => r * n + c));

// Validates a spiral without computing one: every cell exactly once, starting at the
// top-left heading right, and at each step keep going straight when the next cell in
// that direction is free, otherwise turn clockwise.
function assertIsSpiral(m, n, actual) {
  assert.equal(actual.length, m * n, `expected ${m * n} elements for a ${m}x${n} matrix, got ${actual.length}`);
  const seen = new Uint8Array(m * n);
  const dr = [0, 1, 0, -1];
  const dc = [1, 0, -1, 0];
  let r = 0;
  let c = 0;
  let d = 0;
  for (let k = 0; k < m * n; k++) {
    assert.equal(actual[k], r * n + c, `${m}x${n}: element #${k} should be the cell at row ${r}, col ${c} (value ${r * n + c}) but got ${actual[k]}`);
    seen[r * n + c] = 1;
    const free = (rr, cc) => rr >= 0 && rr < m && cc >= 0 && cc < n && !seen[rr * n + cc];
    if (!free(r + dr[d], c + dc[d])) d = (d + 1) % 4;
    r += dr[d];
    c += dc[d];
  }
}

describe('Spiral Matrix', () => {
  it('example 1: 3x3', () => {
    check([[1, 2, 3], [4, 5, 6], [7, 8, 9]], [1, 2, 3, 6, 9, 8, 7, 4, 5]);
  });
  it('example 2: 3x4', () => {
    check([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]], [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]);
  });
  it('1x1', () => {
    check([[5]], [5]);
  });
  it('single row', () => {
    check([[1, 2, 3, 4]], [1, 2, 3, 4]);
  });
  it('single column', () => {
    check([[1], [2], [3], [4]], [1, 2, 3, 4]);
  });
  it('2x2', () => {
    check([[1, 2], [3, 4]], [1, 2, 4, 3]);
  });
  it('4x3 (taller than wide)', () => {
    check([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]], [1, 2, 3, 6, 9, 12, 11, 10, 7, 4, 5, 8]);
  });
  it('2x5 (ends mid-row without repeating cells)', () => {
    check([[1, 2, 3, 4, 5], [6, 7, 8, 9, 10]], [1, 2, 3, 4, 5, 10, 9, 8, 7, 6]);
  });
  it('5x2 (ends mid-column without repeating cells)', () => {
    check([[1, 2], [3, 4], [5, 6], [7, 8], [9, 10]], [1, 2, 4, 6, 8, 10, 9, 7, 5, 3]);
  });
  it('negative and zero values', () => {
    check([[-1, 0], [-100, 100]], [-1, 0, 100, -100]);
  });
  it('every shape from 1x1 to 10x10 follows the spiral rule', () => {
    for (let m = 1; m <= 10; m++) {
      for (let n = 1; n <= 10; n++) {
        assertIsSpiral(m, n, spiralOrder(grid(m, n)));
      }
    }
  });
  it('large input: 700x500 matrix', { timeout: 2000 }, () => {
    assertIsSpiral(700, 500, spiralOrder(grid(700, 500)));
  });
});
