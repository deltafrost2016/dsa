import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { wallsAndGates } from './walls-and-gates.js';
import { clone, fmt, makeRng } from '../../lib/testutil.js';

const INF = 2147483647;

function check(rooms, expected) {
  const input = clone(rooms);
  const ret = wallsAndGates(input);
  assert.equal(ret, undefined, `wallsAndGates should mutate in place and return undefined, got ${fmt(ret)}`);
  assert.deepStrictEqual(input, expected, `wallsAndGates(${fmt(rooms)}) mutated grid\n  expected: ${fmt(expected)}\n  actual:   ${fmt(input)}`);
}

/** Straightforward multi-source BFS used to compute expectations for large cases. */
function expectedFor(rooms) {
  const R = rooms.length;
  const C = rooms[0].length;
  const out = rooms.map((r) => r.slice());
  const q = [];
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (out[r][c] === 0) q.push(r * C + c);
  for (let h = 0; h < q.length; h++) {
    const r = Math.floor(q[h] / C);
    const c = q[h] % C;
    for (const [a, b] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {
      if (a >= 0 && b >= 0 && a < R && b < C && out[a][b] === INF) {
        out[a][b] = out[r][c] + 1;
        q.push(a * C + b);
      }
    }
  }
  return out;
}

describe('Walls and Gates', () => {
  it('example 1', () => {
    check(
      [
        [INF, -1, 0, INF],
        [INF, INF, INF, -1],
        [INF, -1, INF, -1],
        [0, -1, INF, INF],
      ],
      [
        [3, -1, 0, 1],
        [2, 2, 1, -1],
        [1, -1, 2, -1],
        [0, -1, 3, 4],
      ],
    );
  });
  it('example 2: only a wall', () => check([[-1]], [[-1]]));
  it('a lone gate stays 0', () => check([[0]], [[0]]));
  it('a lone empty room stays INF', () => check([[INF]], [[INF]]));
  it('rooms cut off by a wall stay INF', () => {
    check([[0, -1, INF, INF]], [[0, -1, INF, INF]]);
  });
  it('single row with a gate in the middle', () => {
    check([[INF, INF, 0, INF, INF]], [[2, 1, 0, 1, 2]]);
  });
  it('single column with gates at both ends', () => {
    check([[0], [INF], [INF], [INF], [0]], [[0], [1], [2], [1], [0]]);
  });
  it('two gates: each room takes the nearer one', () => {
    check([[0, INF, INF, INF, 0]], [[0, 1, 2, 1, 0]]);
  });
  it('no gates leaves everything INF', () => {
    check([[INF, INF], [INF, -1]], [[INF, INF], [INF, -1]]);
  });
  it('walls force a detour', () => {
    check(
      [
        [0, -1, INF],
        [INF, -1, INF],
        [INF, INF, INF],
      ],
      [
        [0, -1, 6],
        [1, -1, 5],
        [2, 3, 4],
      ],
    );
  });
  it('gates and walls next to INF cells', () => {
    check([[INF, 0, -1, INF]], [[1, 0, -1, INF]]);
  });

  it('large random 300x300 grid matches multi-source BFS', { timeout: 2000 }, () => {
    const rng = makeRng(286);
    const n = 300;
    const grid = Array.from({ length: n }, () =>
      Array.from({ length: n }, () => {
        const x = rng.next();
        return x < 0.2 ? -1 : x < 0.205 ? 0 : INF;
      }),
    );
    check(grid, expectedFor(grid));
  });

  it('large open grid with a single gate in a corner', { timeout: 2000 }, () => {
    const n = 300;
    const grid = Array.from({ length: n }, () => new Array(n).fill(INF));
    grid[0][0] = 0;
    const expected = Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => r + c));
    check(grid, expected);
  });
});
