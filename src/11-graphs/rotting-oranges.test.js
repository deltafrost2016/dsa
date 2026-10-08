import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { orangesRotting } from './rotting-oranges.js';
import { clone, fmt, makeRng } from '../../lib/testutil.js';

function check(grid, expected) {
  const actual = orangesRotting(clone(grid));
  assert.equal(actual, expected, `orangesRotting(${fmt(grid)})\n  expected: ${expected}\n  actual:   ${fmt(actual)}`);
}

/** Reference simulation, minute by minute. */
function simulate(grid) {
  const R = grid.length;
  const C = grid[0].length;
  const g = grid.map((r) => r.slice());
  let minutes = 0;
  for (;;) {
    const flip = [];
    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        if (g[r][c] !== 1) continue;
        for (const [a, b] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {
          if (a >= 0 && b >= 0 && a < R && b < C && g[a][b] === 2) {
            flip.push([r, c]);
            break;
          }
        }
      }
    }
    if (!flip.length) break;
    for (const [r, c] of flip) g[r][c] = 2;
    minutes++;
  }
  return g.some((row) => row.includes(1)) ? -1 : minutes;
}

describe('Rotting Oranges', () => {
  it('example 1: takes 4 minutes', () => check([[2, 1, 1], [1, 1, 0], [0, 1, 1]], 4));
  it('example 2: an isolated fresh orange makes it impossible', () => check([[2, 1, 1], [0, 1, 1], [1, 0, 1]], -1));
  it('example 3: nothing fresh, answer 0', () => check([[0, 2]], 0));
  it('empty cells only', () => check([[0]], 0));
  it('single fresh orange with no rotten one', () => check([[1]], -1));
  it('single rotten orange', () => check([[2]], 0));
  it('fresh oranges only (no rotten source)', () => check([[1, 1], [1, 1]], -1));
  it('only fresh oranges separated from rot by an empty row', () => check([[2, 2], [0, 0], [1, 1]], -1));
  it('single row propagates one step per minute', () => check([[2, 1, 1, 1, 1]], 4));
  it('rotten in the middle of a row', () => check([[1, 1, 2, 1, 1]], 2));
  it('single column', () => check([[2], [1], [1], [1]], 3));
  it('two sources rot in parallel', () => check([[2, 1, 1, 1, 2]], 2));
  it('all rotten already', () => check([[2, 2], [2, 2]], 0));
  it('rot cannot jump over an empty cell', () => check([[2, 0, 1]], -1));
  it('diagonal adjacency does not spread rot', () => check([[2, 0], [0, 1]], -1));
  it('winding path around empties', () => {
    check(
      [
        [2, 1, 1, 1],
        [0, 0, 0, 1],
        [1, 1, 1, 1],
      ],
      8,
    );
  });

  it('large random 300x300 grid matches an independent multi-source BFS', { timeout: 2000 }, () => {
    const rng = makeRng(994);
    const n = 300;
    // Mostly fresh with sparse rot and a few empties; some oranges may be walled off.
    const grid = Array.from({ length: n }, () =>
      Array.from({ length: n }, () => {
        const x = rng.next();
        return x < 0.03 ? 2 : x < 0.1 ? 0 : 1;
      }),
    );
    // expectation via a BFS (the minute-by-minute scan is too slow here)
    const dist = grid.map((r) => r.map(() => -1));
    const q = [];
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (grid[r][c] === 2) { dist[r][c] = 0; q.push([r, c]); }
    let best = 0;
    for (let h = 0; h < q.length; h++) {
      const [r, c] = q[h];
      for (const [a, b] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {
        if (a >= 0 && b >= 0 && a < n && b < n && grid[a][b] === 1 && dist[a][b] === -1) {
          dist[a][b] = dist[r][c] + 1;
          best = Math.max(best, dist[a][b]);
          q.push([a, b]);
        }
      }
    }
    let unreachable = false;
    for (let r = 0; r < n && !unreachable; r++) for (let c = 0; c < n; c++) if (grid[r][c] === 1 && dist[r][c] === -1) { unreachable = true; break; }
    check(grid, unreachable ? -1 : best);
  });

  it('large grid, single rotten orange in a corner, everything reachable', { timeout: 2000 }, () => {
    const n = 300;
    const grid = Array.from({ length: n }, () => new Array(n).fill(1));
    grid[0][0] = 2;
    check(grid, 2 * (n - 1));
  });

  it('small random grids agree with the simulation', () => {
    const rng = makeRng(5);
    for (let t = 0; t < 200; t++) {
      const R = rng.int(1, 6);
      const C = rng.int(1, 6);
      const grid = Array.from({ length: R }, () => Array.from({ length: C }, () => rng.int(0, 2)));
      check(grid, simulate(grid));
    }
  });
});
