import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fmt, sameMembers } from '../../lib/testutil.js';
import { solveNQueens } from './n-queens.js';

// Row order inside a board matters, so no sortInner.
const check = (n, expected) => {
  const actual = solveNQueens(n);
  sameMembers(actual, expected, {
    message: `solveNQueens(${n}) expected ${fmt(expected)}`,
  });
};

/** Known solution counts (OEIS A000170). */
const COUNTS = { 1: 1, 2: 0, 3: 0, 4: 2, 5: 10, 6: 4, 7: 40, 8: 92, 9: 352 };

/** Validate board shape and that no two queens attack each other. */
const assertValidBoard = (board, n) => {
  assert.ok(Array.isArray(board) && board.length === n, `board must have ${n} rows: ${fmt(board)}`);
  const cols = new Set();
  const diag = new Set();
  const anti = new Set();
  board.forEach((row, r) => {
    assert.equal(typeof row, 'string');
    assert.equal(row.length, n, `row ${r} must have length ${n}: ${fmt(board)}`);
    assert.match(row, /^\.*Q\.*$/, `row ${r} must contain exactly one Q and only '.' otherwise: ${fmt(board)}`);
    const c = row.indexOf('Q');
    assert.ok(!cols.has(c), `two queens share column ${c}: ${fmt(board)}`);
    assert.ok(!diag.has(r - c), `two queens share a diagonal: ${fmt(board)}`);
    assert.ok(!anti.has(r + c), `two queens share an anti-diagonal: ${fmt(board)}`);
    cols.add(c);
    diag.add(r - c);
    anti.add(r + c);
  });
};

const checkProperties = (n) => {
  const actual = solveNQueens(n);
  assert.equal(actual.length, COUNTS[n], `solveNQueens(${n}): expected ${COUNTS[n]} boards, got ${actual.length}`);
  const seen = new Set();
  for (const board of actual) {
    assertValidBoard(board, n);
    const key = board.join('/');
    assert.ok(!seen.has(key), `duplicate board ${key}`);
    seen.add(key);
  }
};

describe('N-Queens', () => {
  it('official example 1: n=4', () =>
    check(4, [
      ['.Q..', '...Q', 'Q...', '..Q.'],
      ['..Q.', 'Q...', '...Q', '.Q..'],
    ]));
  it('official example 2: n=1', () => check(1, [['Q']]));
  it('n=2 has no solution', () => check(2, []));
  it('n=3 has no solution', () => check(3, []));
  it('n=5 -> 10 valid distinct boards', () => checkProperties(5));
  it('n=6 -> 4 valid distinct boards', () => checkProperties(6));
  it('n=5 contains the known board "Q....", "..Q..", "....Q", ".Q...", "...Q."', () => {
    const actual = solveNQueens(5);
    const target = ['Q....', '..Q..', '....Q', '.Q...', '...Q.'].join('/');
    assert.ok(actual.some((b) => b.join('/') === target), `missing known solution in ${fmt(actual)}`);
  });
  it('n=6 contains the known board ".Q....", "...Q..", ".....Q", "Q.....", "..Q...", "....Q."', () => {
    const actual = solveNQueens(6);
    const target = ['.Q....', '...Q..', '.....Q', 'Q.....', '..Q...', '....Q.'].join('/');
    assert.ok(actual.some((b) => b.join('/') === target), `missing known solution in ${fmt(actual)}`);
  });
  it('n=4 boards are mirror images of each other', () => {
    const actual = solveNQueens(4).map((b) => b.join('/'));
    const mirrored = solveNQueens(4).map((b) => b.map((r) => [...r].reverse().join('')).join('/'));
    assert.deepStrictEqual([...actual].sort(), [...mirrored].sort());
  });
  it('n=7 -> 40 valid distinct boards', () => checkProperties(7));

  it('n=8 -> 92 valid distinct boards', { timeout: 2000 }, () => checkProperties(8));
  it('n=9 -> 352 valid distinct boards', { timeout: 2000 }, () => checkProperties(9));
});
