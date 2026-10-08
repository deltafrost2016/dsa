import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TreeNode, buildTree } from '../../lib/ds.js';
import { fmt, makeRng } from '../../lib/testutil.js';
import { goodNodes } from './count-good-nodes-in-binary-tree.js';

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

/** Oracle: iterative DFS carrying the max seen on the path. */
function oracle(root) {
  let count = 0;
  const stack = root ? [[root, -Infinity]] : [];
  while (stack.length) {
    const [n, mx] = stack.pop();
    if (n.val >= mx) count++;
    const m = Math.max(mx, n.val);
    if (n.left) stack.push([n.left, m]);
    if (n.right) stack.push([n.right, m]);
  }
  return count;
}

function check(arr, expected) {
  const actual = goodNodes(buildTree(arr));
  assert.equal(actual, expected, `input ${fmt(arr)}\n  expected ${expected}\n  actual   ${fmt(actual)}`);
}

describe('Count Good Nodes in Binary Tree', () => {
  it('example 1: [3,1,4,3,null,1,5] -> 4', () => check([3, 1, 4, 3, null, 1, 5], 4));
  it('example 2: [3,3,null,4,2] -> 3', () => check([3, 3, null, 4, 2], 3));
  it('example 3: [1] -> 1', () => check([1], 1));
  it('root is always good, even when negative', () => check([-10], 1));
  it('all equal values are all good', () => check([2, 2, 2, 2, 2, 2, 2], 7));
  it('strictly decreasing downwards: only the root is good', () => check([9, 8, 7, 6, 5, 4, 3], 1));
  it('strictly increasing downwards: all are good', () => check([1, 2, 3, null, 4, 5, 6], 6));
  it('negative values', () => check([-1, -2, -3, -4, -1, null, null, null, -5], 2));
  it('a smaller node blocks nothing: later bigger nodes are still good', () => check([5, 1, 6, 7, null, null, 3], 3));
  it('random trees match an iterative oracle', () => {
    const rng = makeRng(1448);
    for (let t = 0; t < 40; t++) {
      const root = randomTree(rng, rng.int(1, 150), -50, 50);
      assert.equal(goodNodes(root), oracle(root), `random tree #${t}`);
    }
  });
  it('1000-deep ascending chain -> 1000; descending chain -> 1', { timeout: 2000 }, () => {
    let up = null;
    let down = null;
    for (let i = 1000; i >= 1; i--) up = new TreeNode(i, up, null);
    for (let i = 1; i <= 1000; i++) down = new TreeNode(i, null, down);
    assert.equal(goodNodes(up), 1000);
    assert.equal(goodNodes(down), 1);
  });
  it('large random tree (30000 nodes)', { timeout: 2000 }, () => {
    const root = randomTree(makeRng(14480), 30000, -10000, 10000);
    assert.equal(goodNodes(root), oracle(root));
  });
});
