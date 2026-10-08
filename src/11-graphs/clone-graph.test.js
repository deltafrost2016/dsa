import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { cloneGraph } from './clone-graph.js';
import { GraphNode, buildGraph, graphToAdjList } from '../../lib/ds.js';
import { fmt, makeRng } from '../../lib/testutil.js';

/** Collect every node reachable from `start` (iterative, so deep graphs are safe). */
function collect(start) {
  const seen = new Set();
  if (!start) return seen;
  seen.add(start);
  const stack = [start];
  while (stack.length) {
    const cur = stack.pop();
    for (const nb of cur.neighbors) {
      if (!seen.has(nb)) {
        seen.add(nb);
        stack.push(nb);
      }
    }
  }
  return seen;
}

function check(adj) {
  const original = buildGraph(adj);
  const copy = cloneGraph(original);
  const label = `cloneGraph(adjList ${fmt(adj)})`;
  if (adj.length === 0) {
    assert.equal(copy, null, `${label}: expected null, actual ${fmt(copy)}`);
    return;
  }
  assert.ok(copy instanceof GraphNode, `${label}: expected a GraphNode, actual ${fmt(copy)}`);
  assert.deepStrictEqual(graphToAdjList(copy), adj, `${label}: structure differs`);
  const originals = collect(original);
  const copies = collect(copy);
  assert.equal(copies.size, originals.size, `${label}: copy has ${copies.size} nodes, expected ${originals.size}`);
  for (const node of copies) {
    assert.ok(!originals.has(node), `${label}: copy shares node with val ${node.val} with the original`);
  }
  assert.notEqual(copy, original, `${label}: returned the original node`);
  // every neighbor list must be a fresh array too
  const originalLists = new Set([...originals].map((n) => n.neighbors));
  for (const node of copies) {
    assert.ok(!originalLists.has(node.neighbors), `${label}: neighbor array of ${node.val} is shared with the original`);
  }
  // original must be intact
  assert.deepStrictEqual(graphToAdjList(original), adj, `${label}: original graph was modified`);
}

describe('Clone Graph', () => {
  it('example 1: 4-cycle', () => check([[2, 4], [1, 3], [2, 4], [1, 3]]));
  it('example 2: single node without neighbors', () => check([[]]));
  it('example 3: empty graph returns null', () => check([]));
  it('two connected nodes', () => check([[2], [1]]));
  it('path of five nodes', () => check([[2], [1, 3], [2, 4], [3, 5], [4]]));
  it('star graph', () => check([[2, 3, 4, 5], [1], [1], [1], [1]]));
  it('complete graph K5', () => check([[2, 3, 4, 5], [1, 3, 4, 5], [1, 2, 4, 5], [1, 2, 3, 5], [1, 2, 3, 4]]));
  it('neighbor order is preserved', () => check([[4, 2, 3], [3, 1], [2, 4, 1], [3, 1]]));
  it('triangle with a tail', () => check([[2, 3], [1, 3], [1, 2, 4], [3]]));
  it('copy neighbors point to copy nodes (cycle closes inside the copy)', () => {
    const original = buildGraph([[2], [1]]);
    const copy = cloneGraph(original);
    assert.equal(copy.neighbors[0].neighbors[0], copy, 'copy.neighbors[0].neighbors[0] should be copy itself');
  });

  it('large random connected graph (3000 nodes)', { timeout: 2000 }, () => {
    const rng = makeRng(133);
    const n = 3000;
    const sets = Array.from({ length: n }, () => new Set());
    const link = (a, b) => {
      if (a !== b) {
        sets[a].add(b + 1);
        sets[b].add(a + 1);
      }
    };
    for (let i = 1; i < n; i++) link(i, rng.int(0, i - 1)); // random spanning tree keeps it connected
    for (let i = 0; i < n * 2; i++) link(rng.int(0, n - 1), rng.int(0, n - 1));
    const adj = sets.map((s) => rng.shuffle([...s]));
    check(adj);
  });

  it('long path graph of 5000 nodes (deep recursion hazard)', { timeout: 2000 }, () => {
    const n = 5000;
    const adj = Array.from({ length: n }, (_, i) => {
      const ns = [];
      if (i > 0) ns.push(i);
      if (i < n - 1) ns.push(i + 2);
      return ns;
    });
    check(adj);
  });
});
