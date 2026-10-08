import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TreeNode, buildTree } from '../../lib/ds.js';
import { fmt, makeRng } from '../../lib/testutil.js';
import { diameterOfBinaryTree } from './diameter-of-binary-tree.js';

function randomTree(rng, n, lo, hi) {
  const root = new TreeNode(rng.int(lo, hi));
  const slots = [[root, 'left'], [root, 'right']];
  for (let i = 1; i < n; i++) {
    const j = rng.int(0, slots.length - 1);
    const [parent, side] = slots[j];
    slots[j] = slots[slots.length - 1];
    slots.pop();
    const node = new TreeNode(rng.int(lo, hi));
    parent[side] = node;
    slots.push([node, 'left'], [node, 'right']);
  }
  return root;
}

/** Brute-force oracle: treat the tree as an undirected graph and BFS from every node (O(n^2)). */
function bruteDiameter(root) {
  const adj = new Map();
  const nodes = [];
  const stack = [root];
  adj.set(root, []);
  while (stack.length) {
    const n = stack.pop();
    nodes.push(n);
    for (const c of [n.left, n.right]) {
      if (!c) continue;
      adj.set(c, [n]);
      adj.get(n).push(c);
      stack.push(c);
    }
  }
  let best = 0;
  for (const s of nodes) {
    const dist = new Map([[s, 0]]);
    const q = [s];
    for (let h = 0; h < q.length; h++) {
      for (const nb of adj.get(q[h])) {
        if (!dist.has(nb)) {
          dist.set(nb, dist.get(q[h]) + 1);
          q.push(nb);
        }
      }
    }
    for (const d of dist.values()) best = Math.max(best, d);
  }
  return best;
}

function check(arr, expected) {
  const actual = diameterOfBinaryTree(buildTree(arr));
  assert.equal(actual, expected, `input ${fmt(arr)}\n  expected ${expected}\n  actual   ${fmt(actual)}`);
}

describe('Diameter of Binary Tree', () => {
  it('example 1: [1,2,3,4,5] -> 3', () => check([1, 2, 3, 4, 5], 3));
  it('example 2: [1,2] -> 1', () => check([1, 2], 1));
  it('single node -> 0', () => check([1], 0));
  it('root with two leaves -> 2', () => check([1, 2, 3], 2));
  it('left chain of 4 nodes -> 3', () => check([1, 2, null, 3, null, 4], 3));
  it('longest path does not pass through the root', () => {
    // Right subtree rooted at 3 has two arms of 3 edges each: 8-6-4-3-5-7-9 is 6 edges.
    check([1, 2, 3, null, null, 4, 5, 6, null, null, 7, 8, null, null, 9], 6);
  });
  it('path through the root combines both depths', () => check([1, 2, 3, 4, null, null, 5, 6, null, null, 7], 6));
  it('negative and duplicate values do not matter', () => check([-1, -1, -1, -1, -1], 3));
  it('random trees match an all-pairs BFS oracle', () => {
    const rng = makeRng(543);
    for (let t = 0; t < 25; t++) {
      const root = randomTree(rng, rng.int(1, 150), -100, 100);
      const expected = bruteDiameter(root);
      const actual = diameterOfBinaryTree(root);
      assert.equal(actual, expected, `random tree #${t} (seeded) expected ${expected} got ${fmt(actual)}`);
    }
  });
  it('1500-deep skewed tree -> 1499', { timeout: 2000 }, () => {
    let root = null;
    for (let i = 0; i < 1500; i++) root = new TreeNode(0, root, null);
    assert.equal(diameterOfBinaryTree(root), 1499);
  });
  it('V shape with two arms of 2000 nodes -> 4000', { timeout: 2000 }, () => {
    let left = null;
    let right = null;
    for (let i = 0; i < 2000; i++) {
      left = new TreeNode(1, left, null);
      right = new TreeNode(1, null, right);
    }
    assert.equal(diameterOfBinaryTree(new TreeNode(1, left, right)), 4000);
  });
  it('large random tree (10000 nodes) finishes quickly with a sane answer', { timeout: 2000 }, () => {
    const root = randomTree(makeRng(5430), 10000, -100, 100);
    const d = diameterOfBinaryTree(root);
    assert.ok(Number.isInteger(d) && d >= 0 && d <= 9999, `diameter ${fmt(d)} out of range`);
  });
});
