import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { pacificAtlantic } from './pacific-atlantic-water-flow.js';
import { clone, fmt, makeRng, sameMembers } from '../../lib/testutil.js';

function check(heights, expected) {
  const actual = pacificAtlantic(clone(heights));
  assert.ok(Array.isArray(actual), `pacificAtlantic(${fmt(heights)}): expected an array, got ${fmt(actual)}`);
  sameMembers(actual, expected, { message: `pacificAtlantic(${fmt(heights)})` });
}

/** Brute-force expectation: DFS from every cell (small grids only). */
function brute(h) {
  const R = h.length;
  const C = h[0].length;
  const out = [];
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      let p = false;
      let a = false;
      const seen = new Set([r * C + c]);
      const st = [[r, c]];
      while (st.length) {
        const [y, x] = st.pop();
        if (y === 0 || x === 0) p = true;
        if (y === R - 1 || x === C - 1) a = true;
        for (const [ny, nx] of [[y + 1, x], [y - 1, x], [y, x + 1], [y, x - 1]]) {
          if (ny >= 0 && nx >= 0 && ny < R && nx < C && h[ny][nx] <= h[y][x] && !seen.has(ny * C + nx)) {
            seen.add(ny * C + nx);
            st.push([ny, nx]);
          }
        }
      }
      if (p && a) out.push([r, c]);
    }
  }
  return out;
}

describe('Pacific Atlantic Water Flow', () => {
  it('example 1', () => {
    check(
      [
        [1, 2, 2, 3, 5],
        [3, 2, 3, 4, 4],
        [2, 4, 5, 3, 1],
        [6, 7, 1, 4, 5],
        [5, 1, 1, 2, 4],
      ],
      [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]],
    );
  });
  it('example 2: single cell', () => check([[1]], [[0, 0]]));
  it('example 3: 2x1 column', () => check([[1], [1]], [[0, 0], [1, 0]]));
  it('single row: every cell reaches both oceans', () => check([[3, 1, 2, 5]], [[0, 0], [0, 1], [0, 2], [0, 3]]));
  it('single column: every cell reaches both oceans', () => check([[4], [2], [7]], [[0, 0], [1, 0], [2, 0]]));
  it('flat grid: every cell qualifies', () => {
    check([[5, 5, 5], [5, 5, 5]], [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2]]);
  });
  it('2x2 with a peak in a corner', () => {
    check([[9, 1], [1, 1]], brute([[9, 1], [1, 1]]));
  });
  it('strict valley in the middle cannot reach either ocean', () => {
    check(
      [
        [9, 9, 9],
        [9, 1, 9],
        [9, 9, 9],
      ],
      [[0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]],
    );
  });
  it('increasing diagonal slope', () => {
    const g = [
      [1, 2, 3],
      [2, 3, 4],
      [3, 4, 5],
    ];
    check(g, brute(g));
  });
  it('zeros and large heights', () => {
    const g = [
      [0, 100000, 0],
      [100000, 0, 100000],
      [0, 100000, 0],
    ];
    check(g, brute(g));
  });
  it('result cells are [row, col] pairs with no duplicates', () => {
    const g = [
      [1, 2, 2, 3, 5],
      [3, 2, 3, 4, 4],
      [2, 4, 5, 3, 1],
      [6, 7, 1, 4, 5],
      [5, 1, 1, 2, 4],
    ];
    const actual = pacificAtlantic(clone(g));
    const keys = actual.map((p) => p.join(','));
    assert.equal(new Set(keys).size, keys.length, `duplicate cells in ${fmt(actual)}`);
    for (const p of actual) assert.ok(Array.isArray(p) && p.length === 2, `bad pair ${fmt(p)}`);
  });
  it('small random grids agree with brute force', () => {
    const rng = makeRng(417);
    for (let t = 0; t < 100; t++) {
      const R = rng.int(1, 6);
      const C = rng.int(1, 6);
      const g = Array.from({ length: R }, () => Array.from({ length: C }, () => rng.int(0, 5)));
      check(g, brute(g));
    }
  });

  it('large random 200x200 grid matches two-ocean flood fill', { timeout: 2000 }, () => {
    const rng = makeRng(4170);
    const n = 200;
    const g = Array.from({ length: n }, () => Array.from({ length: n }, () => rng.int(0, 100000)));
    const fill = (starts) => {
      const seen = g.map((r) => r.map(() => false));
      const st = [];
      for (const [r, c] of starts) {
        seen[r][c] = true;
        st.push([r, c]);
      }
      while (st.length) {
        const [y, x] = st.pop();
        for (const [a, b] of [[y + 1, x], [y - 1, x], [y, x + 1], [y, x - 1]]) {
          if (a >= 0 && b >= 0 && a < n && b < n && !seen[a][b] && g[a][b] >= g[y][x]) {
            seen[a][b] = true;
            st.push([a, b]);
          }
        }
      }
      return seen;
    };
    const pac = [];
    const atl = [];
    for (let i = 0; i < n; i++) {
      pac.push([i, 0], [0, i]);
      atl.push([i, n - 1], [n - 1, i]);
    }
    const P = fill(pac);
    const A = fill(atl);
    const expected = [];
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (P[r][c] && A[r][c]) expected.push([r, c]);
    check(g, expected);
  });

  it('large grid where all cells have equal height', { timeout: 2000 }, () => {
    const n = 200;
    const g = Array.from({ length: n }, () => new Array(n).fill(7));
    const expected = [];
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) expected.push([r, c]);
    check(g, expected);
  });
});
