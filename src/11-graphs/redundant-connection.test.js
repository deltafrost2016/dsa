import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { findRedundantConnection } from './redundant-connection.js';
import { clone, fmt, makeRng } from '../../lib/testutil.js';

function check(edges, expected) {
  const actual = findRedundantConnection(clone(edges));
  assert.deepStrictEqual(actual, expected, `findRedundantConnection(${fmt(edges)})\n  expected: ${fmt(expected)}\n  actual:   ${fmt(actual)}`);
}

describe('Redundant Connection', () => {
  it('example 1: triangle', () => check([[1, 2], [1, 3], [2, 3]], [2, 3]));
  it('example 2: cycle of four plus a pendant', () => check([[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]], [1, 4]));
  it('triangle where the closing edge is first in order of nodes but last in input', () => {
    check([[2, 3], [1, 3], [1, 2]], [1, 2]);
  });
  it('last edge closes a long path into a cycle', () => check([[1, 2], [2, 3], [3, 4], [4, 5], [1, 5]], [1, 5]));
  it('answer is the last cycle edge in input order, not the first', () => {
    check([[1, 4], [3, 4], [1, 3], [1, 2], [4, 5]], [1, 3]);
  });
  it('cycle edges first, tree edges after', () => check([[1, 2], [2, 3], [1, 3], [3, 4], [4, 5]], [1, 3]));
  it('pendant edge sits between the cycle edges', () => check([[2, 3], [1, 3], [4, 5], [3, 4], [1, 2]], [1, 2]));
  it('cycle of four with a pendant listed in the middle', () => check([[1, 2], [3, 4], [2, 3], [4, 5], [1, 4]], [1, 4]));
  it('smallest case: 3 nodes', () => check([[1, 2], [2, 3], [1, 3]], [1, 3]));
  it('star with the extra edge between two leaves', () => check([[1, 2], [1, 3], [1, 4], [1, 5], [2, 5]], [2, 5]));

  it('large path with the closing edge last (100000 nodes)', { timeout: 2000 }, () => {
    const n = 100000;
    const edges = Array.from({ length: n - 1 }, (_, i) => [i + 1, i + 2]);
    edges.push([1, n]);
    check(edges, [1, n]);
  });

  it('large random tree with a random extra edge appended', { timeout: 2000 }, () => {
    const rng = makeRng(684);
    const n = 100000;
    // random labelled tree via random attachment, then relabel through a permutation
    const perm = rng.shuffle(Array.from({ length: n }, (_, i) => i + 1));
    const edges = [];
    for (let i = 1; i < n; i++) edges.push([perm[i], perm[rng.int(0, i - 1)]]);
    // pick two non-adjacent nodes for the extra edge by checking against tree edges
    const tree = new Set(edges.map(([a, b]) => `${Math.min(a, b)},${Math.max(a, b)}`));
    let extra;
    for (;;) {
      const a = rng.int(1, n);
      const b = rng.int(1, n);
      if (a === b) continue;
      const key = `${Math.min(a, b)},${Math.max(a, b)}`;
      if (!tree.has(key)) {
        extra = [a, b];
        break;
      }
    }
    const all = edges.concat([extra]);
    check(all, extra);
  });
});
