import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TreeNode, buildTree, treeToArray } from '../../lib/ds.js';
import { fmt, makeRng } from '../../lib/testutil.js';
import { kthSmallest } from './kth-smallest-element-in-a-bst.js';

function bstFrom(values) {
  let root = null;
  for (const v of values) {
    const node = new TreeNode(v);
    if (!root) {
      root = node;
      continue;
    }
    let cur = root;
    for (;;) {
      const side = v < cur.val ? 'left' : 'right';
      if (!cur[side]) {
        cur[side] = node;
        break;
      }
      cur = cur[side];
    }
  }
  return root;
}

function check(arr, k, expected) {
  const actual = kthSmallest(buildTree(arr), k);
  assert.equal(actual, expected, `tree ${fmt(arr)}, k=${k}\n  expected ${expected}\n  actual   ${fmt(actual)}`);
}

describe('Kth Smallest Element in a BST', () => {
  it('example 1: [3,1,4,null,2], k=1 -> 1', () => check([3, 1, 4, null, 2], 1, 1));
  it('example 2: [5,3,6,2,4,null,null,1], k=3 -> 3', () => check([5, 3, 6, 2, 4, null, null, 1], 3, 3));
  it('single node, k=1', () => check([0], 1, 0));
  it('k = n returns the maximum', () => check([5, 3, 6, 2, 4, null, null, 1], 6, 6));
  it('k = 1 returns the minimum deep on the left', () => check([5, 3, 6, 2, 4, null, null, 1], 1, 1));
  it('k lands exactly on the root', () => check([5, 3, 6, 2, 4, null, null, 1], 5, 5));
  it('right-skewed chain', () => check([1, null, 2, null, 3, null, 4], 3, 3));
  it('left-skewed chain', () => check([4, 3, null, 2, null, 1], 2, 2));
  it('tree does not need to be rebuilt between calls (no mutation)', () => {
    const arr = [5, 3, 6, 2, 4, null, null, 1];
    const root = buildTree(arr);
    for (let k = 1; k <= 6; k++) kthSmallest(root, k);
    assert.deepStrictEqual(treeToArray(root), arr);
  });
  it('every k on a random BST matches the sorted order', () => {
    const rng = makeRng(230);
    const vals = rng.shuffle(Array.from({ length: 80 }, (_, i) => i * 7));
    const root = bstFrom(vals);
    const sorted = [...vals].sort((a, b) => a - b);
    for (let k = 1; k <= sorted.length; k++) {
      assert.equal(kthSmallest(root, k), sorted[k - 1], `k=${k}`);
    }
  });
  it('large BST (10000 nodes), many k', { timeout: 2000 }, () => {
    const rng = makeRng(2300);
    const vals = rng.shuffle(Array.from({ length: 10000 }, (_, i) => i));
    const root = bstFrom(vals);
    for (let t = 0; t < 200; t++) {
      const k = rng.int(1, 10000);
      assert.equal(kthSmallest(root, k), k - 1, `k=${k}`);
    }
  });
  it('4000-deep right-skewed BST', { timeout: 2000 }, () => {
    let root = null;
    for (let i = 3999; i >= 0; i--) root = new TreeNode(i, null, root);
    assert.equal(kthSmallest(root, 4000), 3999);
    assert.equal(kthSmallest(root, 1), 0);
  });
});
