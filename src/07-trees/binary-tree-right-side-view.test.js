import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TreeNode, buildTree } from '../../lib/ds.js';
import { fmt, makeRng } from '../../lib/testutil.js';
import { rightSideView } from './binary-tree-right-side-view.js';

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

/** Oracle: iterative DFS visiting left subtree before right, last value written per depth wins. */
function oracle(root) {
  const out = [];
  const stack = root ? [[root, 0]] : [];
  while (stack.length) {
    const [n, d] = stack.pop();
    out[d] = n.val;
    if (n.right) stack.push([n.right, d + 1]);
    if (n.left) stack.push([n.left, d + 1]);
  }
  return out;
}

function check(arr, expected) {
  const actual = rightSideView(buildTree(arr));
  assert.deepStrictEqual(actual, expected, `input ${fmt(arr)}\n  expected ${fmt(expected)}\n  actual   ${fmt(actual)}`);
}

describe('Binary Tree Right Side View', () => {
  it('example 1: [1,2,3,null,5,null,4] -> [1,3,4]', () => check([1, 2, 3, null, 5, null, 4], [1, 3, 4]));
  it('example 2: [1,2,3,4,null,null,null,5] -> [1,3,4,5]', () => check([1, 2, 3, 4, null, null, null, 5], [1, 3, 4, 5]));
  it('example 3: [1,null,3] -> [1,3]', () => check([1, null, 3], [1, 3]));
  it('example 4: empty tree -> []', () => assert.deepStrictEqual(rightSideView(null), []));
  it('single node', () => check([9], [9]));
  it('left-only chain: left nodes are visible', () => check([1, 2, null, 3, null, 4], [1, 2, 3, 4]));
  it('deeper left branch shows below the right branch end', () => check([1, 2, 3, 4, 5, null, null, 6, null, 7], [1, 3, 5, 7]));
  it('right child hides left sibling at the same level', () => check([1, 2, 3, 4, 5, 6, 7], [1, 3, 7]));
  it('negative and duplicate values', () => check([-1, -1, -2, -3, -3], [-1, -2, -3]));
  it('random trees match a DFS oracle', () => {
    const rng = makeRng(199);
    for (let t = 0; t < 40; t++) {
      const root = randomTree(rng, rng.int(1, 120), -100, 100);
      assert.deepStrictEqual(rightSideView(root), oracle(root), `random tree #${t}`);
    }
  });
  it('1500-deep left-skewed tree', { timeout: 2000 }, () => {
    let root = null;
    for (let i = 1500; i >= 1; i--) root = new TreeNode(i, root, null);
    const r = rightSideView(root);
    assert.equal(r.length, 1500);
    assert.equal(r[1499], 1500);
  });
  it('large random tree (20000 nodes)', { timeout: 2000 }, () => {
    const root = randomTree(makeRng(1990), 20000, -100, 100);
    assert.deepStrictEqual(rightSideView(root), oracle(root));
  });
});
