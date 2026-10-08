import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { clone, fmt, makeRng } from '../../lib/testutil.js';
import { swimInWater } from './swim-in-rising-water.js';

function check(grid, expected) {
  const actual = swimInWater(clone(grid));
  assert.strictEqual(
    actual,
    expected,
    `swimInWater(${fmt(grid)})\n  expected: ${expected}\n  actual:   ${fmt(actual)}`,
  );
}

describe('Swim in Rising Water', () => {
  it('example 1', () => {
    check([[0, 2], [1, 3]], 3);
  });

  it('example 2 (5x5 spiral)', () => {
    check(
      [
        [0, 1, 2, 3, 4],
        [24, 23, 22, 21, 5],
        [12, 13, 14, 15, 16],
        [11, 17, 18, 19, 20],
        [10, 9, 8, 7, 6],
      ],
      16,
    );
  });

  it('1x1 grid', () => {
    check([[0]], 0);
  });

  it('start cell is the maximum, so time is at least its elevation', () => {
    check([[3, 2], [0, 1]], 3);
  });

  it('end cell is the maximum', () => {
    check([[0, 1], [2, 3]], 3);
  });

  it('chooses the route with the lowest peak, not the shortest', () => {
    check([[0, 1, 2], [7, 8, 3], [6, 5, 4]], 4);
  });

  it('must go around a tall wall in the middle', () => {
    check([[0, 8, 4], [1, 7, 5], [2, 3, 6]], 6);
  });

  it('can move up and down: temporary dips do not matter', () => {
    check([[0, 3, 4], [8, 1, 5], [7, 2, 6]], 6);
  });

  it('large grid with a forced snake path (49 x 49)', { timeout: 2000 }, () => {
    // Even rows are corridors with values rising along the snake path; odd rows
    // are walls with large values except one connector cell. The end of the path
    // has value pathLength-1, and any detour through a wall costs more.
    const n = 49;
    const rng = makeRng(778);
    const grid = Array.from({ length: n }, () => new Array(n).fill(-1));
    let v = 0;
    for (let r = 0; r < n; r += 2) {
      const leftToRight = (r / 2) % 2 === 0;
      for (let i = 0; i < n; i++) grid[r][leftToRight ? i : n - 1 - i] = v++;
      if (r + 1 < n) grid[r + 1][leftToRight ? n - 1 : 0] = v++;
    }
    const last = v - 1;
    const walls = [];
    for (let w = v; w < n * n; w++) walls.push(w);
    const shuffled = rng.shuffle(walls);
    let wi = 0;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (grid[r][c] === -1) grid[r][c] = shuffled[wi++];
    check(grid, last);
  });

  it('large grid with a border path (50 x 50)', { timeout: 2000 }, () => {
    // Top row then right column hold 0..2n-2 in order; everything else is shuffled above that.
    const n = 50;
    const rng = makeRng(7780);
    const grid = Array.from({ length: n }, () => new Array(n).fill(-1));
    let v = 0;
    for (let c = 0; c < n; c++) grid[0][c] = v++;
    for (let r = 1; r < n; r++) grid[r][n - 1] = v++;
    const rest = [];
    for (let w = v; w < n * n; w++) rest.push(w);
    const shuffled = rng.shuffle(rest);
    let wi = 0;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (grid[r][c] === -1) grid[r][c] = shuffled[wi++];
    check(grid, 2 * n - 2);
  });
});
