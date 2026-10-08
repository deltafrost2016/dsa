import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TreeNode, buildTree, treeToArray } from '../../lib/ds.js';
import { fmt, makeRng } from '../../lib/testutil.js';
import { maxDepth } from './maximum-depth-of-binary-tree.js';

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

/** Independent oracle: BFS level count. */
function bfsDepth(root) {
  let level = root ? [root] : [];
  let d = 0;
  while (level.length) {
    d++;
    level = level.flatMap((n) => [n.left, n.right].filter(Boolean));
  }
  return d;
}

function check(arr, expected) {
  const actual = maxDepth(buildTree(arr));
  assert.equal(actual, expected, `input ${fmt(arr)}\n  expected ${expected}\n  actual   ${fmt(actual)}`);
}

describe('Maximum Depth of Binary Tree', () => {
  it('example 1: [3,9,20,null,null,15,7] -> 3', () => check([3, 9, 20, null, null, 15, 7], 3));
  it('example 2: [1,null,2] -> 2', () => check([1, null, 2], 2));
  it('empty tree -> 0', () => assert.equal(maxDepth(null), 0));
  it('single node -> 1', () => check([0], 1));
  it('left-only chain', () => check([1, 2, null, 3, null, 4], 4));
  it('deepest leaf is on the left while right side is shallow', () => check([1, 2, 3, 4, null, null, null, 5], 4));
  it('negative values do not matter', () => check([-1, -2, -3, -4], 3));
  it('perfect tree of depth 6 (63 nodes)', () => check(Array.from({ length: 63 }, (_, i) => i), 6));
  it('random trees match a BFS oracle', () => {
    const rng = makeRng(104);
    for (let t = 0; t < 30; t++) {
      const root = randomTree(rng, rng.int(1, 200), -100, 100);
      const arr = treeToArray(root);
      check(arr, bfsDepth(root));
    }
  });
  it('1000-deep skewed tree -> 1000', { timeout: 2000 }, () => {
    let root = null;
    for (let i = 0; i < 1000; i++) root = new TreeNode(1, null, root);
    assert.equal(maxDepth(root), 1000);
  });
  it('large random tree (20000 nodes)', { timeout: 2000 }, () => {
    const root = randomTree(makeRng(1040), 20000, -100, 100);
    assert.equal(maxDepth(root), bfsDepth(root));
  });
});
