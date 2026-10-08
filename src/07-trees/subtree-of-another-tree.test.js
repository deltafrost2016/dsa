import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TreeNode, buildTree, treeToArray } from '../../lib/ds.js';
import { fmt, makeRng } from '../../lib/testutil.js';
import { isSubtree } from './subtree-of-another-tree.js';

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

/** Preorder string with null markers; '^' prefix guards against "12" matching "2". */
function ser(root) {
  const out = [];
  const stack = [root];
  while (stack.length) {
    const n = stack.pop();
    if (!n) {
      out.push('#');
      continue;
    }
    out.push(`^${n.val}`);
    stack.push(n.right, n.left);
  }
  return out.join(',');
}
/** Independent oracle: subtree <=> its serialization is a substring (comma-aligned). */
function oracle(root, sub) {
  return `,${ser(root)},`.includes(`,${ser(sub)},`);
}

function allNodes(root) {
  const out = [];
  const stack = [root];
  while (stack.length) {
    const n = stack.pop();
    out.push(n);
    if (n.left) stack.push(n.left);
    if (n.right) stack.push(n.right);
  }
  return out;
}

function check(a, b, expected) {
  const actual = isSubtree(buildTree(a), buildTree(b));
  assert.equal(actual, expected, `root ${fmt(a)}, subRoot ${fmt(b)}\n  expected ${expected}\n  actual   ${fmt(actual)}`);
}

describe('Subtree of Another Tree', () => {
  it('example 1: [3,4,5,1,2] contains [4,1,2] -> true', () => check([3, 4, 5, 1, 2], [4, 1, 2], true));
  it('example 2: extra node below makes it not a subtree -> false', () =>
    check([3, 4, 5, 1, 2, null, null, null, null, 0], [4, 1, 2], false));
  it('subRoot equal to root -> true', () => check([1, 2, 3], [1, 2, 3], true));
  it('single node inside tree -> true', () => check([1, 2, 3], [3], true));
  it('single node missing -> false', () => check([1, 2, 3], [4], false));
  it('single-node root vs single-node subRoot', () => {
    check([5], [5], true);
    check([5], [6], false);
  });
  it('subRoot larger than root -> false', () => check([1], [1, 2], false));
  it('same values but different shape -> false', () => check([1, 2, null, 3], [2, null, 3], false));
  it('duplicate values: a deeper repeat of the same value matches', () => check([1, 1], [1], true));
  it('first matching value is a decoy, a later one matches', () => check([1, 1, 2, null, null, 1], [1, 1], false));
  it('matching subtree found only deeper in the tree', () => check([1, 2, 3, null, null, 4, 5, null, null, 6, 7], [5, 6, 7], true));
  it('subtree at the deepest left leaf', () => check([1, 2, 3, 4, null, null, null, 5, 6], [4, 5, 6], true));
  it('negative values', () => check([-1, -2, -3, -4, -5], [-2, -4, -5], true));
  it('random trees match the serialization oracle ', () => {
    const rng = makeRng(572);
    let trues = 0;
    for (let t = 0; t < 120; t++) {
      const root = randomTree(rng, rng.int(1, 40), 1, 3);
      let sub;
      if (rng.int(0, 1) === 0) {
        // genuine node of root, optionally perturbed
        const nodes = allNodes(root);
        const pick = rng.pick(nodes);
        sub = buildTree(treeToArray(pick));
        if (rng.int(0, 2) === 0) {
          const subNodes = allNodes(sub);
          rng.pick(subNodes).val = rng.int(1, 3);
        }
      } else {
        sub = randomTree(rng, rng.int(1, 6), 1, 3);
      }
      const expected = oracle(root, sub);
      if (expected) trues++;
      const rootArr = treeToArray(root);
      const subArr = treeToArray(sub);
      assert.equal(
        isSubtree(buildTree(rootArr), buildTree(subArr)),
        expected,
        `random #${t}: root ${fmt(rootArr)}, subRoot ${fmt(subArr)} expected ${expected}`,
      );
    }
    assert.ok(trues > 10, 'generator should produce plenty of positive cases');
  });
  it('1500-deep chain of 1s with a 700-chain of 1s inside (true) and with a 0 at its end (false)', { timeout: 2000 }, () => {
    const chain = (n, last) => {
      let r = new TreeNode(last);
      for (let i = 1; i < n; i++) r = new TreeNode(1, r, null);
      return r;
    };
    assert.equal(isSubtree(chain(1500, 1), chain(700, 1)), true);
    assert.equal(isSubtree(chain(1500, 1), chain(700, 0)), false);
  });
  it('large root (4000 nodes) with a medium subtree that almost matches everywhere', { timeout: 2000 }, () => {
    const rng = makeRng(5720);
    const root = randomTree(rng, 4000, 1, 1);
    const nodes = allNodes(root);
    const sub = buildTree(treeToArray(nodes[Math.floor(nodes.length / 2)]));
    assert.equal(isSubtree(root, sub), oracle(root, sub));
    // Perturb: all values equal, so add an unmatched extra leaf to the subtree
    let tail = sub;
    while (tail.left || tail.right) tail = tail.left ?? tail.right;
    tail.left = new TreeNode(1, new TreeNode(1, new TreeNode(1, new TreeNode(1, null, new TreeNode(1)))));
    assert.equal(isSubtree(root, sub), oracle(root, sub));
  });
});

