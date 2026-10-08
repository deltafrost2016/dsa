import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { countComponents } from './number-of-connected-components-in-an-undirected-graph.js';
import { clone, fmt, makeRng } from '../../lib/testutil.js';

function check(n, edges, expected) {
  const actual = countComponents(n, clone(edges));
  assert.equal(actual, expected, `countComponents(${n}, ${fmt(edges)})\n  expected: ${expected}\n  actual:   ${fmt(actual)}`);
}

describe('Number of Connected Components in an Undirected Graph', () => {
  it('example 1: two components', () => check(5, [[0, 1], [1, 2], [3, 4]], 2));
  it('example 2: one component', () => check(5, [[0, 1], [1, 2], [2, 3], [3, 4]], 1));
  it('single node', () => check(1, [], 1));
  it('no edges: every node is its own component', () => check(6, [], 6));
  it('two nodes joined', () => check(2, [[0, 1]], 1));
  it('isolated node plus a connected pair', () => check(3, [[1, 2]], 2));
  it('edge reversed gives the same answer', () => check(3, [[2, 1]], 2));
  it('triangle is one component', () => check(3, [[0, 1], [1, 2], [2, 0]], 1));
  it('self loop does not merge anything', () => check(3, [[0, 0], [1, 1]], 3));
  it('duplicate edges do not change the count', () => check(4, [[0, 1], [0, 1], [2, 3]], 2));
  it('star plus isolated nodes', () => check(7, [[0, 1], [0, 2], [0, 3], [0, 4]], 3));
  it('edges that merge components later in the list', () => check(6, [[0, 1], [2, 3], [4, 5], [1, 2], [3, 4]], 1));
  it('complete graph on 5 nodes', () => {
    const edges = [];
    for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) edges.push([i, j]);
    check(5, edges, 1);
  });
  it('several cliques', () => check(9, [[0, 1], [1, 2], [0, 2], [3, 4], [4, 5], [6, 7]], 4));

  it('large path (100000 nodes) is one component', { timeout: 2000 }, () => {
    const n = 100000;
    check(n, Array.from({ length: n - 1 }, (_, i) => [i, i + 1]), 1);
  });

  it('large graph of 50000 disjoint pairs', { timeout: 2000 }, () => {
    const n = 100000;
    const edges = [];
    for (let i = 0; i < n; i += 2) edges.push([i + 1, i]);
    check(n, edges, n / 2);
  });

  it('large random sparse graph matches an independent union-find count', { timeout: 2000 }, () => {
    const rng = makeRng(323);
    const n = 100000;
    const edges = Array.from({ length: 60000 }, () => [rng.int(0, n - 1), rng.int(0, n - 1)]);
    const p = Array.from({ length: n }, (_, i) => i);
    const find = (x) => {
      while (p[x] !== x) {
        p[x] = p[p[x]];
        x = p[x];
      }
      return x;
    };
    let comps = n;
    for (const [a, b] of edges) {
      const x = find(a);
      const y = find(b);
      if (x !== y) {
        p[x] = y;
        comps--;
      }
    }
    check(n, edges, comps);
  });
});
