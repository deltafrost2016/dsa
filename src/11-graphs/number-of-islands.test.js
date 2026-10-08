import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { numIslands } from './number-of-islands.js';
import { clone, fmt, makeRng } from '../../lib/testutil.js';

const toGrid = (rows) => rows.map((r) => r.split(''));

function check(grid, expected) {
  const input = clone(grid);
  const actual = numIslands(input);
  assert.equal(actual, expected, `numIslands(${fmt(grid)})\n  expected: ${expected}\n  actual:   ${fmt(actual)}`);
}

describe('Number of Islands', () => {
  it('example 1: one big island', () => {
    check(toGrid(['11110', '11010', '11000', '00000']), 1);
  });
  it('example 2: three islands', () => {
    check(toGrid(['11000', '11000', '00100', '00011']), 3);
  });
  it('single land cell', () => check([['1']], 1));
  it('single water cell', () => check([['0']], 0));
  it('all water', () => check(toGrid(['000', '000']), 0));
  it('all land is one island', () => check(toGrid(['111', '111', '111']), 1));
  it('diagonal cells are not connected', () => check(toGrid(['10', '01']), 2));
  it('checkerboard has one island per land cell', () => check(toGrid(['1010', '0101', '1010']), 6));
  it('single row with gaps', () => check(toGrid(['1101011']), 3));
  it('single column with gaps', () => check([['1'], ['1'], ['0'], ['1']], 2));
  it('ring around water is one island', () => check(toGrid(['111', '101', '111']), 1));
  it('island inside a lake inside an island counts separately', () => {
    check(toGrid(['11111', '10001', '10101', '10001', '11111']), 2);
  });
  it('snake shaped island is one', () => check(toGrid(['11111', '00001', '11111', '10000', '11111']), 1));
  it('repeated calls on copies agree', () => {
    const g = toGrid(['11000', '00100']);
    assert.equal(numIslands(clone(g)), 2);
    assert.equal(numIslands(clone(g)), 2);
  });

  it('large random 300x300 grid matches a union-find count', { timeout: 2000 }, () => {
    const rng = makeRng(2024);
    const n = 300;
    const grid = Array.from({ length: n }, () => Array.from({ length: n }, () => (rng.next() < 0.45 ? '1' : '0')));
    // independent count via union-find
    const p = Array.from({ length: n * n }, (_, i) => i);
    const find = (x) => {
      while (p[x] !== x) {
        p[x] = p[p[x]];
        x = p[x];
      }
      return x;
    };
    let comps = 0;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (grid[r][c] === '1') comps++;
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (grid[r][c] !== '1') continue;
        for (const [a, b] of [[r + 1, c], [r, c + 1]]) {
          if (a < n && b < n && grid[a][b] === '1') {
            const x = find(r * n + c);
            const y = find(a * n + b);
            if (x !== y) {
              p[x] = y;
              comps--;
            }
          }
        }
      }
    }
    const actual = numIslands(clone(grid));
    assert.equal(actual, comps, `300x300 random grid (seed 2024): expected ${comps}, actual ${fmt(actual)}`);
  });

  it('large sparse grid of isolated cells (every other cell in a lattice)', { timeout: 2000 }, () => {
    const n = 299;
    const grid = Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => (r % 2 === 0 && c % 2 === 0 ? '1' : '0')));
    const expected = 150 * 150;
    assert.equal(numIslands(clone(grid)), expected, `expected ${expected} isolated islands`);
  });
});
