import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validTree } from './graph-valid-tree.js';
import { clone, fmt, makeRng } from '../../lib/testutil.js';

function check(n, edges, expected) {
  const actual = validTree(n, clone(edges));
  assert.equal(actual, expected, `validTree(${n}, ${fmt(edges)})\n  expected: ${expected}\n  actual:   ${fmt(actual)}`);
}

describe('Graph Valid Tree', () => {
  it('example 1: five nodes forming a tree', () => check(5, [[0, 1], [0, 2], [0, 3], [1, 4]], true));
  it('example 2: cycle among 1, 2, 3', () => check(5, [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]], false));
  it('single node, no edges', () => check(1, [], true));
  it('two nodes, no edges: disconnected', () => check(2, [], false));
  it('two nodes joined', () => check(2, [[0, 1]], true));
  it('two nodes joined, edge reversed', () => check(2, [[1, 0]], true));
  it('triangle is a cycle', () => check(3, [[0, 1], [1, 2], [2, 0]], false));
  it('right edge count but disconnected (cycle + isolated node)', () => {
    check(4, [[0, 1], [1, 2], [2, 0]], false);
  });
  it('too many edges', () => check(3, [[0, 1], [1, 2], [0, 2], [0, 1]], false));
  it('path graph', () => check(6, [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]], true));
  it('star graph', () => check(5, [[0, 1], [0, 2], [0, 3], [0, 4]], true));
  it('two separate trees are not a single tree', () => check(6, [[0, 1], [1, 2], [3, 4], [4, 5]], false));
  it('edges listed in scrambled order', () => check(5, [[3, 4], [1, 2], [2, 3], [0, 1]], true));
  it('self loop is a cycle', () => check(2, [[0, 0]], false));
  it('self loop on single node', () => check(1, [[0, 0]], false));
  it('duplicate edge forms a cycle', () => check(3, [[0, 1], [0, 1]], false));
  it('n-1 edges but a cycle leaves a node out', () => check(5, [[0, 1], [1, 2], [2, 0], [3, 4]], false));

  it('large random tree (100000 nodes) is valid', { timeout: 2000 }, () => {
    const rng = makeRng(261);
    const n = 100000;
    const perm = rng.shuffle(Array.from({ length: n }, (_, i) => i));
    const edges = [];
    for (let i = 1; i < n; i++) edges.push(rng.next() < 0.5 ? [perm[i], perm[rng.int(0, i - 1)]] : [perm[rng.int(0, i - 1)], perm[i]]);
    check(n, rng.shuffle(edges), true);
  });

  it('large path graph (100000 nodes) is valid', { timeout: 2000 }, () => {
    const n = 100000;
    const edges = Array.from({ length: n - 1 }, (_, i) => [i, i + 1]);
    check(n, edges, true);
  });

  it('large tree with one extra edge is not valid', { timeout: 2000 }, () => {
    const n = 100000;
    const edges = Array.from({ length: n - 1 }, (_, i) => [i, i + 1]);
    edges.push([0, n - 1]);
    check(n, edges, false);
  });

  it('large forest with n-1 edges (cycle + gap) is not valid', { timeout: 2000 }, () => {
    const n = 100000;
    // path over the first n-3 nodes, then a triangle-free gap: edges = n-1 but disconnected via a duplicate
    const edges = [];
    for (let i = 0; i < n - 3; i++) edges.push([i, i + 1]);
    edges.push([0, 2]); // makes a cycle in the first part, leaves the last 2 nodes isolated
    edges.push([n - 2, n - 1]);
    check(n, edges, false);
  });
});
