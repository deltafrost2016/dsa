import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isValidSudoku } from './valid-sudoku.js';
import { clone, fmt } from '../../lib/testutil.js';

/** Build a 9x9 board of single-char strings from 9 row strings of length 9. */
const board = (rows) => rows.map((r) => r.split(''));
const show = (b) => b.map((r) => r.join('')).join('/');

const check = (b, expected) => {
  const actual = isValidSudoku(clone(b));
  assert.equal(actual, expected, `isValidSudoku(${show(b)}) expected ${expected}, got ${fmt(actual)}`);
};

const EMPTY = Array(9).fill('.........');
const withCells = (cells) => {
  const b = board(EMPTY);
  for (const [r, c, v] of cells) b[r][c] = v;
  return b;
};

describe('Valid Sudoku', () => {
  it('example 1: valid partially filled board', () =>
    check(
      board([
        '53..7....',
        '6..195...',
        '.98....6.',
        '8...6...3',
        '4..8.3..1',
        '7...2...6',
        '.6....28.',
        '...419..5',
        '....8..79',
      ]),
      true,
    ));

  it('example 2: duplicate 8 in the top-left box and first column', () =>
    check(
      board([
        '83..7....',
        '6..195...',
        '.98....6.',
        '8...6...3',
        '4..8.3..1',
        '7...2...6',
        '.6....28.',
        '...419..5',
        '....8..79',
      ]),
      false,
    ));

  it('completely empty board is valid', () => check(board(EMPTY), true));

  it('fully solved board is valid', () =>
    check(
      board([
        '534678912',
        '672195348',
        '198342567',
        '859761423',
        '426853791',
        '713924856',
        '961537284',
        '287419635',
        '345286179',
      ]),
      true,
    ));

  it('duplicate in a row', () => check(withCells([[4, 0, '5'], [4, 8, '5']]), false));
  it('duplicate in a column', () => check(withCells([[0, 3, '7'], [8, 3, '7']]), false));
  it('duplicate in a 3x3 box only (different row and column)', () => check(withCells([[0, 0, '2'], [2, 2, '2']]), false));
  it('duplicate in the bottom-right box only', () => check(withCells([[6, 6, '9'], [8, 7, '9']]), false));
  it('duplicate in the centre box only', () => check(withCells([[3, 3, '4'], [5, 5, '4']]), false));
  it('same digit in different rows, columns and boxes is fine', () =>
    check(withCells([[0, 0, '1'], [1, 3, '1'], [2, 6, '1'], [3, 1, '1'], [4, 4, '1'], [5, 7, '1'], [6, 2, '1'], [7, 5, '1'], [8, 8, '1']]), true));
  it('same digit in different boxes of one box-row, different columns', () => check(withCells([[0, 0, '3'], [1, 4, '3']]), true));
  it('a single filled cell is valid', () => check(withCells([[4, 4, '9']]), true));
  it('dots are not treated as duplicates', () => check(board(['.........', '.........', '.........', '.........', '.........', '.........', '.........', '.........', '1........']), true));
  it('invalid board even though it looks solvable (conflict only across a box edge)', () =>
    check(withCells([[2, 2, '6'], [2, 3, '6']]), false));
  it('does not mutate the board', () => {
    const b = withCells([[0, 0, '5'], [8, 8, '4']]);
    const copy = clone(b);
    isValidSudoku(b);
    assert.deepStrictEqual(b, copy, 'isValidSudoku mutated its input');
  });
});
