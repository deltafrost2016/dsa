import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TreeNode, buildTree } from '../../lib/ds.js';
import { fmt, makeRng } from '../../lib/testutil.js';
import { isValidBST } from './validate-binary-search-tree.js';

const MAX = 2147483647;
const MIN = -2147483648;

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

/** Oracle: in-order traversal must be strictly increasing. */
function oracle(root) {
  const stack = [];
  let cur = root;
  let prev = -Infinity;
  while (cur || stack.length) {
    while (cur) {
      stack.push(cur);
      cur = cur.left;
    }
    cur = stack.pop();
    if (cur.val <= prev) return false;
    prev = cur.val;
    cur = cur.right;
  }
  return true;
}

function check(arr, expected) {
  const actual = isValidBST(buildTree(arr));
  assert.equal(actual, expected, `input ${fmt(arr)}\n  expected ${expected}\n  actual   ${fmt(actual)}`);
}

describe('Validate Binary Search Tree', () => {
  it('example 1: [2,1,3] -> true', () => check([2, 1, 3], true));
  it('example 2: [5,1,4,null,null,3,6] -> false', () => check([5, 1, 4, null, null, 3, 6], false));
  it('single node -> true', () => check([0], true));
  it('equal left child is invalid: [1,1] -> false', () => check([1, 1], false));
  it('equal right child is invalid: [1,null,1] -> false', () => check([1, null, 1], false));
  it('all-equal tree [2,2,2] -> false', () => check([2, 2, 2], false));
  it('grandchild violates an ancestor, not its parent: [5,4,6,null,null,3,7] -> false', () => check([5, 4, 6, null, null, 3, 7], false));
  it('left grandchild larger than ancestor: [10,5,15,null,null,6,20] -> false', () => check([10, 5, 15, null, null, 6, 20], false));
  it('valid deeper tree', () => check([8, 3, 10, 1, 6, null, 14, null, null, 4, 7, 13], true));
  it('negative values', () => check([0, -3, 3, -4, -1, 1, 4], true));
  it('32-bit max alone is valid', () => check([MAX], true));
  it('32-bit min alone is valid', () => check([MIN], true));
  it('32-bit min as left child of max is valid', () => check([MAX, MIN], true));
  it('32-bit max as right child of min is valid', () => check([MIN, null, MAX], true));
  it('duplicate of 32-bit max on the right is invalid', () => check([MAX, null, MAX], false));
  it('duplicate of 32-bit min on the left is invalid', () => check([MIN, MIN], false));
  it('random BSTs (unique values) are valid; a random swap is checked against the in-order oracle', () => {
    const rng = makeRng(98);
    for (let t = 0; t < 40; t++) {
      const vals = rng.shuffle(Array.from({ length: rng.int(1, 60) }, (_, i) => i * 2 - 40));
      const root = bstFrom(vals);
      assert.equal(isValidBST(root), true, `random BST #${t} should be valid`);
    }
    let invalid = 0;
    for (let t = 0; t < 80; t++) {
      const root = randomTree(rng, rng.int(1, 12), 0, 6);
      const expected = oracle(root);
      if (!expected) invalid++;
      assert.equal(isValidBST(root), expected, `random tree #${t}`);
    }
    assert.ok(invalid > 10, 'generator should produce plenty of invalid trees');
  });
  it('large valid BST (20000 nodes) is true; swapping two values makes it false', { timeout: 2000 }, () => {
    const rng = makeRng(980);
    const vals = rng.shuffle(Array.from({ length: 20000 }, (_, i) => i - 10000));
    const root = bstFrom(vals);
    assert.equal(isValidBST(root), true);
    root.val = root.left ? root.left.val : root.right.val; // collide with a child
    assert.equal(isValidBST(root), false);
  });
  it('2500-deep ascending chain is valid; breaking the bottom makes it invalid', { timeout: 2000 }, () => {
    const build = (bottom) => {
      let r = new TreeNode(bottom);
      for (let i = 2499; i >= 1; i--) r = new TreeNode(i, null, r);
      return r;
    };
    assert.equal(isValidBST(build(2500)), true);
    assert.equal(isValidBST(build(0)), false);
  });
});
