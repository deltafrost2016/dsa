import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { clone, fmt, makeRng } from '../../lib/testutil.js';
import { exist } from './word-search.js';

const grid = (...rows) => rows.map((r) => r.split(''));

const check = (board, word, expected) => {
  const input = clone(board);
  const actual = exist(input, word);
  assert.equal(
    actual,
    expected,
    `exist(${fmt(board)}, "${word}") expected ${expected}`,
  );
  assert.deepStrictEqual(input, board, 'exist must leave the board unchanged');
};

const STANDARD = grid('ABCE', 'SFCS', 'ADEE');

/** Build a word by a random self-avoiding walk on the board (so it is guaranteed to exist). */
function walkWord(board, rng, length) {
  const R = board.length;
  const C = board[0].length;
  for (let attempt = 0; attempt < 1000; attempt++) {
    let r = rng.int(0, R - 1);
    let c = rng.int(0, C - 1);
    const used = new Set([`${r},${c}`]);
    let word = board[r][c];
    while (word.length < length) {
      const moves = [[1, 0], [-1, 0], [0, 1], [0, -1]]
        .map(([dr, dc]) => [r + dr, c + dc])
        .filter(([nr, nc]) => nr >= 0 && nr < R && nc >= 0 && nc < C && !used.has(`${nr},${nc}`));
      if (!moves.length) break;
      [r, c] = rng.pick(moves);
      used.add(`${r},${c}`);
      word += board[r][c];
    }
    if (word.length === length) return word;
  }
  throw new Error('test generator failed to build a walk');
}

describe('Word Search', () => {
  it('official example 1: ABCCED -> true', () => check(STANDARD, 'ABCCED', true));
  it('official example 2: SEE -> true', () => check(STANDARD, 'SEE', true));
  it('official example 3: ABCB -> false (cell reuse)', () => check(STANDARD, 'ABCB', false));
  it('1x1 board, matching letter', () => check(grid('A'), 'A', true));
  it('1x1 board, different letter', () => check(grid('A'), 'B', false));
  it('1x1 board, word longer than the board', () => check(grid('A'), 'AA', false));
  it('cannot reuse a cell: AA board, word AAA', () => check(grid('AA'), 'AAA', false));
  it('single row, forward', () => check(grid('ABCDE'), 'BCD', true));
  it('single row, backward', () => check(grid('ABCDE'), 'DCB', true));
  it('single column', () => check(grid('A', 'B', 'C', 'D'), 'CBA', true));
  it('word longer than number of cells', () => check(grid('AB', 'CD'), 'ABCDA', false));
  it('whole board used by a snake path', () => check(grid('ABC', 'FED'), 'ABCDEF', true));
  it('diagonal neighbours do not count', () => check(grid('AB', 'CD'), 'AD', false));
  it('wrapping around edges is not allowed', () => check(grid('ABC'), 'CA', false));
  it('first letter appears several times; only a later start works', () =>
    check(grid('AAB', 'ACA', 'BAA'), 'ACAB', true));
  it('path must visit every cell of a 3x4 board and end on the B', () =>
    check(grid('AAAA', 'AAAA', 'AAAB'), 'AAAAAAAAAAAB', true));
  it('LeetCode extra case: path winds through the E cells', () =>
    check(grid('ABCE', 'SFES', 'ADEE'), 'ABCESEEEFS', true));
  it('same letters but one cell short: the path would need to reuse a cell', () =>
    check(grid('AAAA', 'AAAA', 'AAAB'), 'AAAAAAAAAAAAB', false));
  it('same board can be queried repeatedly (no leftover marks)', () => {
    const board = clone(STANDARD);
    for (let i = 0; i < 3; i++) {
      assert.equal(exist(board, 'ABCCED'), true, `call #${i + 1} for ABCCED`);
      assert.equal(exist(board, 'SEE'), true, `call #${i + 1} for SEE`);
      assert.equal(exist(board, 'ABCB'), false, `call #${i + 1} for ABCB`);
    }
    assert.deepStrictEqual(board, STANDARD, 'board must be restored after searching');
  });

  it('6x6 board of A with a trailing B is not found (needs pruning)', { timeout: 2000 }, () => {
    const board = grid('AAAAAA', 'AAAAAA', 'AAAAAA', 'AAAAAA', 'AAAAAA', 'AAAAAA');
    check(board, 'AAAAAAAAAAAB', false);
  });

  it('6x6 board of A with a trailing B placed far away', { timeout: 2000 }, () => {
    const board = grid('AAAAAA', 'AAAAAA', 'AAAAAA', 'AAAAAA', 'AAAAAA', 'AAAAAB');
    check(board, 'AAAAAAAAAAAAAAB', true);
  });

  it('random 6x6 boards: words built from a random self-avoiding walk exist', { timeout: 2000 }, () => {
    const rng = makeRng(79);
    for (let t = 0; t < 30; t++) {
      const board = Array.from({ length: 6 }, () =>
        Array.from({ length: 6 }, () => String.fromCharCode(65 + rng.int(0, 2))),
      );
      const word = walkWord(board, rng, rng.int(8, 15));
      check(board, word, true);
    }
  });

  it('random 6x6 boards: a word containing a letter not on the board is absent', { timeout: 2000 }, () => {
    const rng = makeRng(791);
    for (let t = 0; t < 10; t++) {
      const board = Array.from({ length: 6 }, () =>
        Array.from({ length: 6 }, () => String.fromCharCode(65 + rng.int(0, 1))),
      );
      check(board, 'ABABABABABZ', false);
    }
  });
});
