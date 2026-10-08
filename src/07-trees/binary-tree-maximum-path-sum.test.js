import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TreeNode, buildTree } from '../../lib/ds.js';
import { fmt, makeRng } from '../../lib/testutil.js';
import { maxPathSum } from './binary-tree-maximum-path-sum.js';

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

/** Brute-force oracle: for every pair of nodes, sum the unique tree path between them. O(n^2 * depth). */
function bruteMax(root) {
  const parent = new Map([[root, null]]);
  const nodes = [];
  const stack = [root];
  while (stack.length) {
    const n = stack.pop();
    nodes.push(n);
    for (const c of [n.left, n.right]) {
      if (c) {
        parent.set(c, n);
        stack.push(c);
      }
    }
  }
  const chain = (n) => {
    const out = [];
    for (let c = n; c; c = parent.get(c)) out.push(c);
    return out;
  };
  let best = -Infinity;
  for (const u of nodes) {
    const cu = chain(u);
    const setU = new Set(cu);
    for (const v of nodes) {
      const cv = chain(v);
      const lca = cv.find((x) => setU.has(x));
      let sum = 0;
      for (const x of cu) {
        sum += x.val;
        if (x === lca) break;
      }
      for (const x of cv) {
        if (x === lca) break;
        sum += x.val;
      }
      best = Math.max(best, sum);
    }
  }
  return best;
}

/** Fast iterative oracle for big trees (post-order DP). */
function fastMax(root) {
  const down = new Map();
  let best = -Infinity;
  const stack = [[root, false]];
  while (stack.length) {
    const [n, seen] = stack.pop();
    if (!seen) {
      stack.push([n, true]);
      if (n.left) stack.push([n.left, false]);
      if (n.right) stack.push([n.right, false]);
    } else {
      const l = n.left ? Math.max(0, down.get(n.left)) : 0;
      const r = n.right ? Math.max(0, down.get(n.right)) : 0;
      best = Math.max(best, n.val + l + r);
      down.set(n, n.val + Math.max(l, r));
    }
  }
  return best;
}

function check(arr, expected) {
  const actual = maxPathSum(buildTree(arr));
  assert.equal(actual, expected, `input ${fmt(arr)}\n  expected ${expected}\n  actual   ${fmt(actual)}`);
}

describe('Binary Tree Maximum Path Sum', () => {
  it('example 1: [1,2,3] -> 6', () => check([1, 2, 3], 6));
  it('example 2: [-10,9,20,null,null,15,7] -> 42', () => check([-10, 9, 20, null, null, 15, 7], 42));
  it('single negative node -> that value', () => check([-3], -3));
  it('single positive node', () => check([5], 5));
  it('single zero node', () => check([0], 0));
  it('all negative: pick the largest single node', () => check([-2, -1], -1));
  it('all negative bigger tree', () => check([-5, -3, -8, -1, -4], -1));
  it('path should skip a negative root', () => check([-10, 5, 6], 6));
  it('negative child is skipped when it hurts', () => check([2, -1], 2));
  it('best path is a single arm (root + one branch)', () => check([1, 2, null, 3], 6));
  it('best path does not include the root', () => check([-100, 10, 10, 20, 30, null, null], 60));
  it('one deep subtree beats the root path', () => check([1, -2, 3, 4, 5, -6, 2], 9));
  it('zeros in the tree', () => check([0, 0, 0], 0));
  it('boundary magnitudes (+/-1000)', () => check([1000, 1000, 1000], 3000));
  it('random small trees match the all-pairs brute-force oracle', () => {
    const rng = makeRng(124);
    for (let t = 0; t < 60; t++) {
      const root = randomTree(rng, rng.int(1, 40), -1000, 1000);
      assert.equal(maxPathSum(root), bruteMax(root), `random tree #${t}`);
    }
  });
  it('random small all-negative trees match the brute-force oracle', () => {
    const rng = makeRng(1240);
    for (let t = 0; t < 30; t++) {
      const root = randomTree(rng, rng.int(1, 30), -1000, -1);
      assert.equal(maxPathSum(root), bruteMax(root), `random negative tree #${t}`);
    }
  });
  it('2500-deep chain of 1s -> 2500', { timeout: 2000 }, () => {
    let root = null;
    for (let i = 0; i < 2500; i++) root = new TreeNode(1, root, null);
    assert.equal(maxPathSum(root), 2500);
  });
  it('large random tree (30000 nodes) matches the iterative DP oracle', { timeout: 2000 }, () => {
    const root = randomTree(makeRng(12400), 30000, -1000, 1000);
    assert.equal(maxPathSum(root), fastMax(root));
  });
});
