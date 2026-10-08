import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TreeNode, buildTree } from '../../lib/ds.js';
import { fmt } from '../../lib/testutil.js';
import { isSameTree } from './same-tree.js';

function check(a, b, expected) {
  const actual = isSameTree(buildTree(a), buildTree(b));
  assert.equal(actual, expected, `p ${fmt(a)}, q ${fmt(b)}\n  expected ${expected}\n  actual   ${fmt(actual)}`);
}

describe('Same Tree', () => {
  it('example 1: [1,2,3] vs [1,2,3] -> true', () => check([1, 2, 3], [1, 2, 3], true));
  it('example 2: [1,2] vs [1,null,2] -> false (different structure)', () => check([1, 2], [1, null, 2], false));
  it('example 3: [1,2,1] vs [1,1,2] -> false (different values)', () => check([1, 2, 1], [1, 1, 2], false));
  it('both empty -> true', () => assert.equal(isSameTree(null, null), true));
  it('empty vs non-empty -> false (both orders)', () => {
    assert.equal(isSameTree(null, buildTree([0])), false);
    assert.equal(isSameTree(buildTree([0]), null), false);
  });
  it('single equal nodes -> true', () => check([0], [0], true));
  it('single different nodes -> false', () => check([0], [1], false));
  it('negative values', () => check([-1, -2, -3], [-1, -2, -3], true));
  it('differ only in a deep leaf', () => check([1, 2, 3, 4, 5, 6, 7], [1, 2, 3, 4, 5, 6, 8], false));
  it('same prefix, one tree has an extra deep node', () => check([1, 2, 3, 4], [1, 2, 3, 4, null, null, null, 5], false));
  it('same values but mirrored structure -> false', () => check([1, 2, null, 3], [1, null, 2, null, 3], false));
  it('a tree compared with itself -> true', () => {
    const t = buildTree([1, 2, 3, null, 4]);
    assert.equal(isSameTree(t, t), true);
  });
  it('does not mutate its inputs', () => {
    const a = [1, 2, 3];
    const p = buildTree(a);
    const q = buildTree(a);
    isSameTree(p, q);
    assert.deepStrictEqual([p.val, p.left.val, p.right.val], a);
  });
  it('1500-deep identical skewed trees -> true, differing at the bottom -> false', { timeout: 2000 }, () => {
    const chain = (bottom) => {
      let root = new TreeNode(bottom);
      for (let i = 0; i < 1500; i++) root = new TreeNode(i, root, null);
      return root;
    };
    assert.equal(isSameTree(chain(7), chain(7)), true);
    assert.equal(isSameTree(chain(7), chain(8)), false);
  });
  it('large perfect trees (2^14 - 1 nodes)', { timeout: 2000 }, () => {
    const build = (d, v) => (d === 0 ? null : new TreeNode(v, build(d - 1, v), build(d - 1, v)));
    assert.equal(isSameTree(build(14, 3), build(14, 3)), true);
    assert.equal(isSameTree(build(14, 3), build(14, 4)), false);
  });
});
