import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { clone, fmt, sameMembers, makeRng } from '../../lib/testutil.js';
import { subsets } from './subsets.js';

const check = (nums, expected) => {
  const input = clone(nums);
  const actual = subsets(input);
  sameMembers(actual, expected, {
    sortInner: true,
    message: `subsets(${fmt(nums)}) expected ${fmt(expected)}`,
  });
};

/** Independent oracle: enumerate every bitmask. */
const oracle = (nums) => {
  const out = [];
  for (let mask = 0; mask < 1 << nums.length; mask++) {
    out.push(nums.filter((_, i) => mask & (1 << i)));
  }
  return out;
};

describe('Subsets', () => {
  it('official example 1: [1,2,3]', () =>
    check([1, 2, 3], [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]));
  it('official example 2: [0]', () => check([0], [[], [0]]));
  it('single non-zero element', () => check([7], [[], [7]]));
  it('two elements', () => check([4, 5], [[], [4], [5], [4, 5]]));
  it('negative numbers', () =>
    check([-1, -2, 3], [[], [-1], [-2], [3], [-1, -2], [-1, 3], [-2, 3], [-1, -2, 3]]));
  it('unsorted input', () => check([3, 1, 2], oracle([3, 1, 2])));
  it('count is 2^n for n = 10', () => {
    const nums = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4];
    const actual = subsets(clone(nums));
    assert.equal(actual.length, 1024, `expected 2^10 subsets, got ${actual.length}`);
    check(nums, oracle(nums));
  });
  it('result includes the empty subset and the full set exactly once', () => {
    const actual = subsets([1, 2, 3, 4]);
    assert.equal(actual.filter((s) => s.length === 0).length, 1, 'empty subset must appear once');
    assert.equal(actual.filter((s) => s.length === 4).length, 1, 'full set must appear once');
  });

  it('12 random distinct elements -> 4096 subsets', { timeout: 2000 }, () => {
    const rng = makeRng(78);
    const nums = rng.shuffle(Array.from({ length: 21 }, (_, i) => i - 10)).slice(0, 12);
    check(nums, oracle(nums));
  });
});
