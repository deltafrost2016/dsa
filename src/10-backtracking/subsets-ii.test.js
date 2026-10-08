import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { clone, fmt, sameMembers, makeRng, randomArray } from '../../lib/testutil.js';
import { subsetsWithDup } from './subsets-ii.js';

const check = (nums, expected) => {
  const input = clone(nums);
  const actual = subsetsWithDup(input);
  sameMembers(actual, expected, {
    sortInner: true,
    message: `subsetsWithDup(${fmt(nums)}) expected ${fmt(expected)}`,
  });
};

/** Independent oracle: every bitmask, deduplicated by the sorted contents. */
const oracle = (nums) => {
  const seen = new Map();
  for (let mask = 0; mask < 1 << nums.length; mask++) {
    const sub = nums.filter((_, i) => mask & (1 << i)).sort((a, b) => a - b);
    seen.set(JSON.stringify(sub), sub);
  }
  return [...seen.values()];
};

describe('Subsets II', () => {
  it('official example 1: [1,2,2]', () =>
    check([1, 2, 2], [[], [1], [2], [1, 2], [2, 2], [1, 2, 2]]));
  it('official example 2: [0]', () => check([0], [[], [0]]));
  it('all equal: [3,3,3]', () => check([3, 3, 3], [[], [3], [3, 3], [3, 3, 3]]));
  it('no duplicates behaves like Subsets', () =>
    check([1, 2, 3], [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]));
  it('unsorted input with duplicates apart: [2,1,2]', () =>
    check([2, 1, 2], [[], [1], [2], [1, 2], [2, 2], [1, 2, 2]]));
  it('duplicates not adjacent: [4,4,4,1,4]', () => check([4, 4, 4, 1, 4], oracle([4, 4, 4, 1, 4])));
  it('negative duplicates', () => check([-1, -1, 2], [[], [-1], [2], [-1, -1], [-1, 2], [-1, -1, 2]]));
  it('two pairs of duplicates: [1,1,2,2]', () =>
    check([1, 1, 2, 2], [[], [1], [2], [1, 1], [1, 2], [2, 2], [1, 1, 2], [1, 2, 2], [1, 1, 2, 2]]));
  it('count equals product of (multiplicity + 1)', () => {
    const nums = [5, 5, 5, 7, 7, 9];
    assert.equal(subsetsWithDup(clone(nums)).length, 4 * 3 * 2);
  });
  it('no two results are the same multiset', () => {
    const actual = subsetsWithDup([1, 2, 2, 3, 3, 3]);
    const keys = actual.map((s) => JSON.stringify([...s].sort((a, b) => a - b)));
    assert.equal(new Set(keys).size, keys.length, `duplicate subsets in ${fmt(actual)}`);
  });

  it('12 elements with duplicates (values 0..4)', { timeout: 2000 }, () => {
    const rng = makeRng(90);
    const nums = randomArray(rng, 12, 0, 4);
    check(nums, oracle(nums));
  });

  it('12 elements drawn from only 3 values', { timeout: 2000 }, () => {
    const rng = makeRng(901);
    const nums = randomArray(rng, 12, -1, 1);
    check(nums, oracle(nums));
  });

  it('12 elements, almost all distinct', { timeout: 2000 }, () => {
    const nums = [5, 3, 8, -2, 7, 1, 0, -9, 4, 6, 2, 5];
    check(nums, oracle(nums));
  });
});
