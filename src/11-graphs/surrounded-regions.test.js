import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { solve } from './surrounded-regions.js';
import { clone, fmt, makeRng } from '../../lib/testutil.js';

const toGrid = (rows) => rows.map((r) => r.split(''));

function check(board, expected) {
  const input = clone(board);
  const ret = solve(input);
  assert.equal(ret, undefined, `solve should modify the board in place and return undefined, got ${fmt(ret)}`);
  assert.deepStrictEqual(
    input,
    expected,
    `solve(${fmt(board.map((r) => r.join('')))}) mutated board\n  expected: ${fmt(expected.map((r) => r.join('')))}\n  actual:   ${fmt(input.map((r) => r.join('')))}`,
  );
}

/** Independent reference: flood border-connected O's, flip the rest. */
function expectedFor(board) {
  const R = board.length;
  const C = board[0].length;
  const keep = board.map((r) => r.map(() => false));
  const st = [];
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if ((r === 0 || c === 0 || r === R - 1 || c === C - 1) && board[r][c] === 'O') {
        keep[r][c] = true;
        st.push([r, c]);
      }
    }
  }
  while (st.length) {
    const [y, x] = st.pop();
    for (const [a, b] of [[y + 1, x], [y - 1, x], [y, x + 1], [y, x - 1]]) {
      if (a >= 0 && b >= 0 && a < R && b < C && board[a][b] === 'O' && !keep[a][b]) {
        keep[a][b] = true;
        st.push([a, b]);
      }
    }
  }
  return board.map((row, r) => row.map((ch, c) => (ch === 'O' && !keep[r][c] ? 'X' : ch)));
}

describe('Surrounded Regions', () => {
  it('example 1', () => {
    check(toGrid(['XXXX', 'XOOX', 'XXOX', 'XOXX']), toGrid(['XXXX', 'XXXX', 'XXXX', 'XOXX']));
  });
  it('example 2: single X', () => check([['X']], [['X']]));
  it('single O on the border stays', () => check([['O']], [['O']]));
  it('all X unchanged', () => check(toGrid(['XXX', 'XXX']), toGrid(['XXX', 'XXX'])));
  it('all O unchanged (every O touches the border or a border O)', () => {
    check(toGrid(['OOO', 'OOO', 'OOO']), toGrid(['OOO', 'OOO', 'OOO']));
  });
  it('single enclosed O is flipped', () => {
    check(toGrid(['XXX', 'XOX', 'XXX']), toGrid(['XXX', 'XXX', 'XXX']));
  });
  it('2-row and 2-col boards have no interior, nothing flips', () => {
    check(toGrid(['OX', 'XO']), toGrid(['OX', 'XO']));
    check(toGrid(['OXO', 'XOX']), toGrid(['OXO', 'XOX']));
  });
  it('O region connected to the border through a corridor survives', () => {
    check(toGrid(['XXXXX', 'XOOOX', 'XXXOX', 'XXXOX', 'XXXOO']), toGrid(['XXXXX', 'XOOOX', 'XXXOX', 'XXXOX', 'XXXOO']));
  });
  it('diagonal contact with the border does not save an O', () => {
    check(toGrid(['OXX', 'XOX', 'XXX']), toGrid(['OXX', 'XXX', 'XXX']));
  });
  it('mixed: enclosed block flips, border-attached block stays', () => {
    check(
      toGrid(['XXXXXX', 'XOOXOO', 'XOOXOX', 'XXXXOX', 'XXXXXX']),
      toGrid(['XXXXXX', 'XXXXOO', 'XXXXOX', 'XXXXOX', 'XXXXXX']),
    );
  });
  it('nested ring: inner O inside an enclosed ring also flips', () => {
    check(
      toGrid(['XXXXX', 'XOOOX', 'XOXOX', 'XOOOX', 'XXXXX']),
      toGrid(['XXXXX', 'XXXXX', 'XXXXX', 'XXXXX', 'XXXXX']),
    );
  });
  it('single row never flips', () => check(toGrid(['XOXOX']), toGrid(['XOXOX'])));
  it('single column never flips', () => check([['X'], ['O'], ['X']], [['X'], ['O'], ['X']]));
  it('random small boards agree with the reference', () => {
    const rng = makeRng(130);
    for (let t = 0; t < 150; t++) {
      const R = rng.int(1, 7);
      const C = rng.int(1, 7);
      const b = Array.from({ length: R }, () => Array.from({ length: C }, () => (rng.next() < 0.6 ? 'O' : 'X')));
      check(b, expectedFor(b));
    }
  });

  it('large random 200x200 board matches the reference', { timeout: 2000 }, () => {
    const rng = makeRng(1300);
    const n = 200;
    const b = Array.from({ length: n }, () => Array.from({ length: n }, () => (rng.next() < 0.55 ? 'O' : 'X')));
    check(b, expectedFor(b));
  });

  it('large board that is all O except an X frame just inside the border', { timeout: 2000 }, () => {
    const n = 200;
    const b = Array.from({ length: n }, (_, r) =>
      Array.from({ length: n }, (_, c) => (r === 1 || c === 1 || r === n - 2 || c === n - 2 ? 'X' : 'O')),
    );
    check(b, expectedFor(b));
  });
});
