import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TreeNode, buildTree, treeToArray } from '../../lib/ds.js';
import { fmt, makeRng } from '../../lib/testutil.js';
import { invertTree } from './invert-binary-tree.js';

/** Random binary tree with n nodes (attaches each new node to a random free slot). */
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

/** Independent oracle: mirror a copy iteratively. */
function mirrorArray(arr) {
  const root = buildTree(arr);
  const stack = root ? [root] : [];
  while (stack.length) {
    const n = stack.pop();
    [n.left, n.right] = [n.right, n.left];
    if (n.left) stack.push(n.left);
    if (n.right) stack.push(n.right);
  }
  return treeToArray(root);
}

function check(arr, expected) {
  const result = invertTree(buildTree(arr));
  assert.deepStrictEqual(
    treeToArray(result),
    expected,
    `input ${fmt(arr)}\n  expected ${fmt(expected)}\n  actual   ${fmt(treeToArray(result))}`,
  );
}

describe('Invert Binary Tree', () => {
  it('example 1: [4,2,7,1,3,6,9] -> [4,7,2,9,6,3,1]', () => check([4, 2, 7, 1, 3, 6, 9], [4, 7, 2, 9, 6, 3, 1]));
  it('example 2: [2,1,3] -> [2,3,1]', () => check([2, 1, 3], [2, 3, 1]));
  it('example 3: empty tree returns null', () => {
    assert.equal(invertTree(null), null);
  });
  it('single node is unchanged', () => check([7], [7]));
  it('left-only child moves to the right', () => check([1, 2], [1, null, 2]));
  it('right-only child moves to the left', () => check([1, null, 2], [1, 2]));
  it('left skewed chain becomes right skewed chain', () => check([1, 2, null, 3, null, 4], [1, null, 2, null, 3, null, 4]));
  it('uneven tree with null gaps', () => check([1, 2, 3, null, 4, 5], [1, 3, 2, null, 5, 4]));
  it('negatives, zero and duplicate values', () => check([0, -1, -2, 5, -5, -6, 6], [0, -2, -1, 6, -6, -5, 5]));
  it('inverting twice restores the original tree', () => {
    const arr = [5, 3, 8, 1, 4, null, 9, null, 2];
    const twice = invertTree(invertTree(buildTree(arr)));
    assert.deepStrictEqual(treeToArray(twice), arr);
  });
  it('random trees match an iterative mirror oracle', () => {
    const rng = makeRng(226);
    for (let t = 0; t < 30; t++) {
      const arr = treeToArray(randomTree(rng, rng.int(1, 100), -100, 100));
      check(arr, mirrorArray(arr));
    }
  });
  it('large tree (20000 nodes) finishes quickly', { timeout: 2000 }, () => {
    const arr = treeToArray(randomTree(makeRng(2260), 20000, -100, 100));
    check(arr, mirrorArray(arr));
  });
  it('1000-deep skewed tree', { timeout: 2000 }, () => {
    let root = null;
    for (let i = 1000; i >= 1; i--) root = new TreeNode(i, root, null);
    let cur = invertTree(root);
    for (let i = 1; i <= 1000; i++) {
      assert.ok(cur, `node ${i} missing`);
      assert.equal(cur.val, i);
      assert.equal(cur.left, null, `left child of depth ${i} should be null`);
      cur = cur.right;
    }
    assert.equal(cur, null);
  });
});
