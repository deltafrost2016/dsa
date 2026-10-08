import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TreeNode, buildTree, findNode } from '../../lib/ds.js';
import { fmt, makeRng } from '../../lib/testutil.js';
import { lowestCommonAncestor } from './lowest-common-ancestor-of-a-binary-search-tree.js';

/** Insert values into a BST iteratively; returns the root. */
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
      if (v < cur.val) {
        if (!cur.left) {
          cur.left = node;
          break;
        }
        cur = cur.left;
      } else {
        if (!cur.right) {
          cur.right = node;
          break;
        }
        cur = cur.right;
      }
    }
  }
  return root;
}

/** Root-to-node path by walking the BST property (independent of the solution). */
function pathTo(root, val) {
  const path = [];
  let cur = root;
  while (cur) {
    path.push(cur);
    if (val === cur.val) return path;
    cur = val < cur.val ? cur.left : cur.right;
  }
  throw new Error(`value ${val} not in tree`);
}
function oracleLca(root, pv, qv) {
  const a = pathTo(root, pv);
  const b = pathTo(root, qv);
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return a[i - 1];
}

function check(arr, pv, qv, expectedVal) {
  const root = buildTree(arr);
  const p = findNode(root, pv);
  const q = findNode(root, qv);
  const result = lowestCommonAncestor(root, p, q);
  assert.ok(result, `tree ${fmt(arr)}, p=${pv}, q=${qv}: got null, expected node ${expectedVal}`);
  assert.equal(result.val, expectedVal, `tree ${fmt(arr)}, p=${pv}, q=${qv}\n  expected ${expectedVal}\n  actual   ${fmt(result.val)}`);
  assert.strictEqual(result, findNode(root, expectedVal), 'must return the tree\'s own node, not a copy');
}

describe('Lowest Common Ancestor of a Binary Search Tree', () => {
  const sample = [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5];
  it('example 1: p=2, q=8 -> 6', () => check(sample, 2, 8, 6));
  it('example 2: p=2, q=4 -> 2 (a node is its own descendant)', () => check(sample, 2, 4, 2));
  it('example 3: [2,1], p=2, q=1 -> 2', () => check([2, 1], 2, 1, 2));
  it('argument order does not matter (p > q)', () => check(sample, 8, 2, 6));
  it('both nodes in the left subtree', () => check(sample, 0, 5, 2));
  it('both nodes in the right subtree', () => check(sample, 7, 9, 8));
  it('deep nodes on different sides of an inner node', () => check(sample, 3, 5, 4));
  it('p is the root', () => check(sample, 6, 3, 6));
  it('q is the root', () => check(sample, 9, 6, 6));
  it('two leaves under the root', () => check(sample, 0, 9, 6));
  it('negative values and zero', () => check([0, -10, 10, -20, -5, 5, 20], -20, -5, -10));
  it('negative / positive straddle the root', () => check([0, -10, 10, -20, -5, 5, 20], -5, 5, 0));
  it('large 32-bit-ish values', () => check([0, -1000000000, 1000000000], -1000000000, 1000000000, 0));
  it('random BSTs match a root-path oracle', () => {
    const rng = makeRng(235);
    for (let t = 0; t < 40; t++) {
      const vals = rng.shuffle(Array.from({ length: rng.int(2, 60) }, (_, i) => i * 3 - 50));
      const root = bstFrom(vals);
      for (let k = 0; k < 10; k++) {
        const pv = rng.pick(vals);
        let qv = rng.pick(vals);
        if (qv === pv) qv = vals.find((v) => v !== pv);
        const expected = oracleLca(root, pv, qv);
        const actual = lowestCommonAncestor(root, findNode(root, pv), findNode(root, qv));
        assert.strictEqual(actual, expected, `random #${t}: p=${pv}, q=${qv}, expected node ${expected.val} got ${fmt(actual?.val)}`);
      }
    }
  });
  it('left-skewed BST 5000 deep (descending inserts)', { timeout: 2000 }, () => {
    const vals = Array.from({ length: 5000 }, (_, i) => 5000 - i);
    const root = bstFrom(vals);
    assert.equal(lowestCommonAncestor(root, findNode(root, 1), findNode(root, 2500)).val, 2500);
    assert.equal(lowestCommonAncestor(root, findNode(root, 4000), findNode(root, 3)).val, 4000);
  });
  it('large random BST (20000 nodes), 300 queries', { timeout: 2000 }, () => {
    const rng = makeRng(2350);
    const vals = rng.shuffle(Array.from({ length: 20000 }, (_, i) => i - 10000));
    const root = bstFrom(vals);
    for (let k = 0; k < 300; k++) {
      const pv = rng.pick(vals);
      let qv = rng.pick(vals);
      if (qv === pv) qv = pv === vals[0] ? vals[1] : vals[0];
      const expected = oracleLca(root, pv, qv);
      const actual = lowestCommonAncestor(root, findNode(root, pv), findNode(root, qv));
      assert.strictEqual(actual, expected, `p=${pv}, q=${qv}: expected node ${expected.val} got ${fmt(actual?.val)}`);
    }
  });
});
