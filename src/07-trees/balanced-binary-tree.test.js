import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TreeNode, buildTree } from '../../lib/ds.js';
import { fmt, makeRng } from '../../lib/testutil.js';
import { isBalanced } from './balanced-binary-tree.js';

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

/** Oracle: the naive O(n^2) definition (recompute heights at every node). */
function height(n) {
  return n ? 1 + Math.max(height(n.left), height(n.right)) : 0;
}
function naiveBalanced(n) {
  if (!n) return true;
  return Math.abs(height(n.left) - height(n.right)) <= 1 && naiveBalanced(n.left) && naiveBalanced(n.right);
}

function check(arr, expected) {
  const actual = isBalanced(buildTree(arr));
  assert.equal(actual, expected, `input ${fmt(arr)}\n  expected ${expected}\n  actual   ${fmt(actual)}`);
}

describe('Balanced Binary Tree', () => {
  it('example 1: [3,9,20,null,null,15,7] -> true', () => check([3, 9, 20, null, null, 15, 7], true));
  it('example 2: [1,2,2,3,3,null,null,4,4] -> false', () => check([1, 2, 2, 3, 3, null, null, 4, 4], false));
  it('example 3: empty tree -> true', () => assert.equal(isBalanced(null), true));
  it('single node -> true', () => check([1], true));
  it('root with one child -> true (heights 1 vs 0)', () => check([1, 2], true));
  it('chain of 3 -> false', () => check([1, 2, null, 3], false));
  it('imbalance deep inside while the root heights match', () => {
    // left = 2 -> 3 -> 4 (node 2 is unbalanced), right = a full 3-level subtree: root sees heights 3 and 3.
    check([1, 2, 5, 3, null, 6, 7, 4], false);
  });
  it('perfect tree -> true', () => check(Array.from({ length: 31 }, (_, i) => i), true));
  it('random trees match the naive oracle', () => {
    const rng = makeRng(110);
    let trues = 0;
    for (let t = 0; t < 60; t++) {
      const root = randomTree(rng, rng.int(1, 12), -5, 5);
      const expected = naiveBalanced(root);
      if (expected) trues++;
      assert.equal(isBalanced(root), expected, `random tree #${t} expected ${expected}`);
    }
    assert.ok(trues > 0, 'test generator should produce some balanced trees');
  });
  it('1000-deep skewed tree -> false', { timeout: 2000 }, () => {
    let root = null;
    for (let i = 0; i < 1000; i++) root = new TreeNode(1, root, null);
    assert.equal(isBalanced(root), false);
  });
  it('large perfect tree (2^14 - 1 nodes) is balanced; one extra deep node unbalances it', { timeout: 2000 }, () => {
    const build = (d) => (d === 0 ? null : new TreeNode(d, build(d - 1), build(d - 1)));
    assert.equal(isBalanced(build(14)), true);
    const root = build(14);
    let leaf = root;
    while (leaf.left) leaf = leaf.left;
    leaf.left = new TreeNode(0, new TreeNode(0), null);
    assert.equal(isBalanced(root), false);
  });
});
