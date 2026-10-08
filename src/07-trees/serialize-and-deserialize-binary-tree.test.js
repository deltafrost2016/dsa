import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TreeNode, buildTree, treeToArray } from '../../lib/ds.js';
import { fmt, makeRng } from '../../lib/testutil.js';
import { serialize, deserialize } from './serialize-and-deserialize-binary-tree.js';

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

function nodeSet(root) {
  const set = new Set();
  const stack = root ? [root] : [];
  while (stack.length) {
    const n = stack.pop();
    set.add(n);
    if (n.left) stack.push(n.left);
    if (n.right) stack.push(n.right);
  }
  return set;
}

function roundTrip(root) {
  const data = serialize(root);
  assert.equal(typeof data, 'string', `serialize must return a string, got ${typeof data}`);
  return deserialize(data);
}

function check(arr) {
  const root = buildTree(arr);
  const out = roundTrip(root);
  assert.deepStrictEqual(treeToArray(out), arr, `round trip of ${fmt(arr)}\n  actual ${fmt(treeToArray(out))}`);
}

describe('Serialize and Deserialize Binary Tree', () => {
  it('example 1: [1,2,3,null,null,4,5]', () => check([1, 2, 3, null, null, 4, 5]));
  it('example 2: empty tree round-trips to null', () => {
    const out = roundTrip(null);
    assert.equal(out, null);
  });
  it('serialize of an empty tree is still a string', () => {
    assert.equal(typeof serialize(null), 'string');
  });
  it('single node', () => check([42]));
  it('single node with zero', () => check([0]));
  it('negative values', () => check([-1, -2, -3, -4, null, null, -5]));
  it('32-bit-ish and 3-digit values (multi-character tokens)', () => check([1000, -1000, 999, 100, -100, 10, -10]));
  it('values that look like each other (1, 11, 111)', () => check([1, 11, 111, 1, 11, 1, 1]));
  it('left-only chain', () => check([1, 2, null, 3, null, 4, null, 5]));
  it('right-only chain', () => check([1, null, 2, null, 3, null, 4, null, 5]));
  it('null-heavy shape (zig-zag)', () => check([1, 2, null, null, 3, 4, null, null, 5]));
  it('null-heavy shape with deep gaps', () => check([1, null, 2, 3, null, null, 4, 5]));
  it('duplicate values everywhere', () => check([7, 7, 7, 7, 7, 7, 7]));
  it('perfect tree of 31 nodes', () => check(Array.from({ length: 31 }, (_, i) => i - 15)));
  it('result is a fresh tree: no node of the result is an input node', () => {
    const root = buildTree([1, 2, 3, 4, 5]);
    const original = nodeSet(root);
    const out = roundTrip(root);
    for (const n of nodeSet(out)) assert.ok(!original.has(n), 'deserialized tree must not reuse input nodes');
  });
  it('serialize does not mutate the tree', () => {
    const arr = [1, 2, 3, null, 4, 5];
    const root = buildTree(arr);
    serialize(root);
    assert.deepStrictEqual(treeToArray(root), arr);
  });
  it('deserialize depends only on the string (serialize other trees in between)', () => {
    const dataA = serialize(buildTree([1, 2, 3]));
    serialize(buildTree([9, 8, 7, 6]));
    serialize(null);
    assert.deepStrictEqual(treeToArray(deserialize(dataA)), [1, 2, 3]);
  });
  it('deserialize can be called twice on the same string with equal results', () => {
    const data = serialize(buildTree([5, 4, 6, null, null, 3, 7]));
    assert.deepStrictEqual(treeToArray(deserialize(data)), treeToArray(deserialize(data)));
  });
  it('random trees round trip', () => {
    const rng = makeRng(297);
    for (let t = 0; t < 40; t++) {
      const root = randomTree(rng, rng.int(1, 80), -1000, 1000);
      const arr = treeToArray(root);
      assert.deepStrictEqual(treeToArray(roundTrip(root)), arr, `random tree #${t}`);
    }
  });
  it('1000-deep left-skewed and right-skewed trees', { timeout: 2000 }, () => {
    let left = null;
    let right = null;
    for (let i = 1000; i >= 1; i--) {
      left = new TreeNode(i, left, null);
      right = new TreeNode(i, null, right);
    }
    assert.deepStrictEqual(treeToArray(roundTrip(left)), treeToArray(left));
    assert.deepStrictEqual(treeToArray(roundTrip(right)), treeToArray(right));
  });
  it('large random tree (10000 nodes)', { timeout: 2000 }, () => {
    const root = randomTree(makeRng(2970), 10000, -1000, 1000);
    assert.deepStrictEqual(treeToArray(roundTrip(root)), treeToArray(root));
  });
});
