import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TreeNode, buildTree as buildTreeFromLevelOrder, treeToArray } from '../../lib/ds.js';
import { fmt, makeRng } from '../../lib/testutil.js';
import { buildTree } from './construct-binary-tree-from-preorder-and-inorder-traversal.js';

/** Random tree with n unique values. */
function randomUniqueTree(rng, n) {
  const vals = rng.shuffle(Array.from({ length: n }, (_, i) => i - Math.floor(n / 2)));
  const root = new TreeNode(vals[0]);
  const slots = [[root, 'left'], [root, 'right']];
  for (let i = 1; i < n; i++) {
    const j = rng.int(0, slots.length - 1);
    const [parent, side] = slots[j];
    slots[j] = slots[slots.length - 1];
    slots.pop();
    const node = new TreeNode(vals[i]);
    parent[side] = node;
    slots.push([node, 'left'], [node, 'right']);
  }
  return root;
}

/** Iterative traversals used to generate inputs. */
function preorder(root) {
  const out = [];
  const stack = [root];
  while (stack.length) {
    const n = stack.pop();
    if (!n) continue;
    out.push(n.val);
    stack.push(n.right, n.left);
  }
  return out;
}
function inorder(root) {
  const out = [];
  const stack = [];
  let cur = root;
  while (cur || stack.length) {
    while (cur) {
      stack.push(cur);
      cur = cur.left;
    }
    cur = stack.pop();
    out.push(cur.val);
    cur = cur.right;
  }
  return out;
}

function check(pre, ino, expectedLevel) {
  const actual = treeToArray(buildTree([...pre], [...ino]));
  assert.deepStrictEqual(
    actual,
    expectedLevel,
    `preorder ${fmt(pre)}, inorder ${fmt(ino)}\n  expected ${fmt(expectedLevel)}\n  actual   ${fmt(actual)}`,
  );
}

describe('Construct Binary Tree from Preorder and Inorder Traversal', () => {
  it('example 1: -> [3,9,20,null,null,15,7]', () => check([3, 9, 20, 15, 7], [9, 3, 15, 20, 7], [3, 9, 20, null, null, 15, 7]));
  it('example 2: [-1] -> [-1]', () => check([-1], [-1], [-1]));
  it('returns TreeNode instances with val/left/right', () => {
    const root = buildTree([1, 2], [2, 1]);
    assert.ok(root instanceof TreeNode || (root && 'val' in root && 'left' in root && 'right' in root), 'expected a tree node');
    assert.equal(root.val, 1);
    assert.equal(root.left.val, 2);
    assert.equal(root.right, null);
  });
  it('only left children (left chain)', () => check([1, 2, 3], [3, 2, 1], [1, 2, null, 3]));
  it('only right children (right chain)', () => check([1, 2, 3], [1, 2, 3], [1, null, 2, null, 3]));
  it('zig-zag', () => check([1, 2, 3, 4], [2, 4, 3, 1], [1, 2, null, null, 3, 4]));
  it('perfect tree of 7 nodes', () => check([1, 2, 4, 5, 3, 6, 7], [4, 2, 5, 1, 6, 3, 7], [1, 2, 3, 4, 5, 6, 7]));
  it('negative and zero values', () => check([0, -5, -9, 7], [-9, -5, 0, 7], [0, -5, 7, -9]));
  it('does not require inputs to stay untouched but result must match even for fresh copies', () => {
    const pre = [3, 9, 20, 15, 7];
    const ino = [9, 3, 15, 20, 7];
    const a = treeToArray(buildTree([...pre], [...ino]));
    const b = treeToArray(buildTree([...pre], [...ino]));
    assert.deepStrictEqual(a, b);
  });
  it('random unique trees round trip through their own traversals', () => {
    const rng = makeRng(105);
    for (let t = 0; t < 40; t++) {
      const tree = randomUniqueTree(rng, rng.int(1, 60));
      const expected = treeToArray(tree);
      check(preorder(tree), inorder(tree), expected);
    }
  });
  it('3000-node random tree', { timeout: 2000 }, () => {
    const tree = randomUniqueTree(makeRng(1050), 3000);
    check(preorder(tree), inorder(tree), treeToArray(tree));
  });
  it('3000-deep left-skewed and right-skewed trees', { timeout: 2000 }, () => {
    const n = 3000;
    const pre = Array.from({ length: n }, (_, i) => i);
    const leftSkewIn = [...pre].reverse();
    const left = buildTree([...pre], leftSkewIn);
    let cur = left;
    for (let i = 0; i < n; i++) {
      assert.ok(cur, `left-skewed: node at depth ${i} missing`);
      assert.equal(cur.val, i);
      assert.equal(cur.right, null);
      cur = cur.left;
    }
    assert.equal(cur, null);
    const right = buildTree([...pre], [...pre]);
    cur = right;
    for (let i = 0; i < n; i++) {
      assert.ok(cur, `right-skewed: node at depth ${i} missing`);
      assert.equal(cur.val, i);
      assert.equal(cur.left, null);
      cur = cur.right;
    }
    assert.equal(cur, null);
  });
  it('cross-check with level-order builder on a known tree', () => {
    const level = [8, 3, 10, 1, 6, null, 14, null, null, 4, 7, 13];
    const root = buildTreeFromLevelOrder(level);
    check(preorder(root), inorder(root), level);
  });
});
