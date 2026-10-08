import { describe, it } from 'node:test';
import { topKFrequent } from './top-k-frequent-elements.js';
import { clone, sameMembers, makeRng, fmt } from '../../lib/testutil.js';

// The answer is unique but may be returned in any order.
const check = (nums, k, expected) => {
  const actual = topKFrequent(clone(nums), k);
  sameMembers(actual, expected, { message: `topKFrequent(${fmt(nums)}, ${k})` });
};

describe('Top K Frequent Elements', () => {
  it('example 1: [1,1,1,2,2,3], k=2 -> [1,2]', () => check([1, 1, 1, 2, 2, 3], 2, [1, 2]));
  it('example 2: [1], k=1 -> [1]', () => check([1], 1, [1]));
  it('example 3: [1,2,1,2,1,2,3,1,3,2], k=2 -> [1,2]', () => check([1, 2, 1, 2, 1, 2, 3, 1, 3, 2], 2, [1, 2]));
  it('k = 1 picks the single most frequent value', () => check([4, 4, 4, 5, 5, 6], 1, [4]));
  it('k equals the number of distinct values', () => check([1, 2, 2, 3, 3, 3], 3, [1, 2, 3]));
  it('negative numbers', () => check([-1, -1, -2, -2, -2, 3], 2, [-1, -2]));
  it('zero counts as a value', () => check([0, 0, 0, 1, 1, 2], 2, [0, 1]));
  it('all elements equal', () => check([9, 9, 9, 9], 1, [9]));
  it('frequent value not at the front', () => check([1, 2, 3, 3, 3, 2, 3, 2], 1, [3]));
  it('boundary values -10^4 and 10^4', () => check([10000, 10000, -10000, -10000, -10000, 5], 2, [10000, -10000]));
  it('two values tied for the top spot when k=2 and a third is rarer', () => check([7, 7, 8, 8, 9], 2, [7, 8]));

  it('large input (~80k) with distinct frequencies', { timeout: 2000 }, () => {
    const rng = makeRng(347);
    // value v (in -200..200 range) appears (index + 1) times: all counts distinct.
    const values = rng.shuffle(Array.from({ length: 400 }, (_, i) => i - 200));
    const nums = [];
    values.forEach((v, i) => {
      for (let c = 0; c <= i; c++) nums.push(v);
    });
    const shuffled = rng.shuffle(nums);
    const k = 25;
    const expected = values.slice(-k); // the 25 values with the highest counts
    check(shuffled, k, expected);
  });

  it('large input (100k) k=1 across 10k distinct values', { timeout: 2000 }, () => {
    const rng = makeRng(348);
    const nums = Array.from({ length: 99000 }, () => rng.int(-5000, 5000));
    for (let i = 0; i < 1000; i++) nums.push(1234); // far above any other count (~10)
    check(rng.shuffle(nums), 1, [1234]);
  });
});
