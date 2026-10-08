import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { maxAreaOfIsland } from './max-area-of-island.js';
import { clone, fmt, makeRng } from '../../lib/testutil.js';

function check(grid, expected) {
  const actual = maxAreaOfIsland(clone(grid));
  assert.equal(actual, expected, `maxAreaOfIsland(${fmt(grid)})\n  expected: ${expected}\n  actual:   ${fmt(actual)}`);
}

describe('Max Area of Island', () => {
  it('example 1: largest island has area 6', () => {
    check(
      [
        [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0],
        [0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
      ],
      6,
    );
  });
  it('example 2: no land', () => check([[0, 0, 0, 0, 0, 0, 0, 0]], 0));
  it('single land cell', () => check([[1]], 1));
  it('single water cell', () => check([[0]], 0));
  it('all land', () => check([[1, 1, 1], [1, 1, 1]], 6));
  it('diagonal neighbours are not connected', () => check([[1, 0], [0, 1]], 1));
  it('picks the bigger of two islands', () => check([[1, 1, 0, 1], [0, 0, 0, 1], [0, 0, 0, 1]], 3));
  it('ties return the shared area', () => check([[1, 0, 1]], 1));
  it('single row island', () => check([[0, 1, 1, 1, 0, 1]], 3));
  it('single column island', () => check([[1], [1], [0], [1], [1], [1]], 3));
  it('U-shaped island is counted fully', () => check([[1, 0, 1], [1, 0, 1], [1, 1, 1]], 7));
  it('repeated calls on copies agree', () => {
    const g = [[1, 1], [0, 1]];
    assert.equal(maxAreaOfIsland(clone(g)), 3);
    assert.equal(maxAreaOfIsland(clone(g)), 3);
  });

  it('large random 300x300 grid matches an independent flood fill', { timeout: 2000 }, () => {
    const rng = makeRng(77);
    const n = 300;
    const grid = Array.from({ length: n }, () => Array.from({ length: n }, () => (rng.next() < 0.55 ? 1 : 0)));
    const seen = grid.map((r) => r.map(() => false));
    let best = 0;
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (grid[r][c] !== 1 || seen[r][c]) continue;
        let area = 0;
        const st = [[r, c]];
        seen[r][c] = true;
        while (st.length) {
          const [y, x] = st.pop();
          area++;
          for (const [a, b] of [[y + 1, x], [y - 1, x], [y, x + 1], [y, x - 1]]) {
            if (a >= 0 && b >= 0 && a < n && b < n && grid[a][b] === 1 && !seen[a][b]) {
              seen[a][b] = true;
              st.push([a, b]);
            }
          }
        }
        if (area > best) best = area;
      }
    }
    const actual = maxAreaOfIsland(clone(grid));
    assert.equal(actual, best, `300x300 random grid (seed 77): expected ${best}, actual ${fmt(actual)}`);
  });

  it('large grid made of many small islands', { timeout: 2000 }, () => {
    const n = 300;
    // 2x2 blocks separated by water, every island has area 4.
    const grid = Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => (r % 3 !== 2 && c % 3 !== 2 ? 1 : 0)));
    assert.equal(maxAreaOfIsland(clone(grid)), 4);
  });
});
