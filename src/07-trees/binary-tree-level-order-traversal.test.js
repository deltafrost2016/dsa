import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TreeNode, buildTree } from '../../lib/ds.js';
import { fmt, makeRng } from '../../lib/testutil.js';
import { levelOrder } from './binary-tree-level-order-traversal.js';

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

/** Oracle: iterative DFS (left before right) bucketing values by depth. */
function oracle(root) {
  const out = [];
  const stack = root ? [[root, 0]] : [];
  while (stack.length) {
    const [n, d] = stack.pop();
    (out[d] ??= []).push(n.val);
    // push right first so left is processed first
    if (n.right) stack.push([n.right, d + 1]);
    if (n.left) stack.push([n.left, d + 1]);
  }
  return out;
}

function check(arr, expected) {
  const actual = levelOrder(buildTree(arr));
  assert.deepStrictEqual(actual, expected, `input ${fmt(arr)}\n  expected ${fmt(expected)}\n  actual   ${fmt(actual)}`);
}

describe('Binary Tree Level Order Traversal', () => {
  it('example 1: [3,9,20,null,null,15,7] -> [[3],[9,20],[15,7]]', () => check([3, 9, 20, null, null, 15, 7], [[3], [9, 20], [15, 7]]));
  it('example 2: [1] -> [[1]]', () => check([1], [[1]]));
  it('example 3: empty tree -> []', () => assert.deepStrictEqual(levelOrder(null), []));
  it('left chain gives one value per level', () => check([1, 2, null, 3, null, 4], [[1], [2], [3], [4]]));
  it('right chain gives one value per level', () => check([1, null, 2, null, 3], [[1], [2], [3]]));
  it('left-to-right order across a level with gaps', () => check([1, 2, 3, null, 4, 5], [[1], [2, 3], [4, 5]]));
  it('negative and zero values, duplicates', () => check([0, -1, -1, -2, null, null, -2], [[0], [-1, -1], [-2, -2]]));
  it('perfect tree of 15 nodes', () =>
    check(Array.from({ length: 15 }, (_, i) => i + 1), [[1], [2, 3], [4, 5, 6, 7], [8, 9, 10, 11, 12, 13, 14, 15]]));
  it('returns fresh arrays (levels are not shared)', () => {
    const r = levelOrder(buildTree([1, 2, 3]));
    assert.notStrictEqual(r[0], r[1]);
    assert.ok(r.every((lvl) => Array.isArray(lvl)));
  });
  it('random trees match a depth-bucket oracle', () => {
    const rng = makeRng(102);
    for (let t = 0; t < 40; t++) {
      const root = randomTree(rng, rng.int(1, 120), -1000, 1000);
      assert.deepStrictEqual(levelOrder(root), oracle(root), `random tree #${t}`);
    }
  });
  it('1500-deep skewed tree', { timeout: 2000 }, () => {
    let root = null;
    for (let i = 1500; i >= 1; i--) root = new TreeNode(i, root, null);
    const r = levelOrder(root);
    assert.equal(r.length, 1500);
    assert.deepStrictEqual(r[0], [1]);
    assert.deepStrictEqual(r[1499], [1500]);
  });
  it('large random tree (20000 nodes)', { timeout: 2000 }, () => {
    const root = randomTree(makeRng(1020), 20000, -1000, 1000);
    assert.deepStrictEqual(levelOrder(root), oracle(root));
  });
});
