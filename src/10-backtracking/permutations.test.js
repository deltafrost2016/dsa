import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { clone, fmt, sameMembers, makeRng } from '../../lib/testutil.js';
import { permute } from './permutations.js';

// Inner order matters for permutations, so sameMembers is used WITHOUT sortInner.
const check = (nums, expected) => {
  const input = clone(nums);
  const actual = permute(input);
  sameMembers(actual, expected, {
    message: `permute(${fmt(nums)}) expected ${fmt(expected)}`,
  });
};

const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));

/** Every result must be a full-length rearrangement of nums, with no repeats, and n! of them. */
const checkProperties = (nums) => {
  const actual = permute(clone(nums));
  assert.equal(actual.length, factorial(nums.length), `permute of ${nums.length} elements: wrong count`);
  const sortedInput = JSON.stringify([...nums].sort((a, b) => a - b));
  const seen = new Set();
  for (const p of actual) {
    assert.ok(Array.isArray(p) && p.length === nums.length, `bad length: ${fmt(p)}`);
    assert.equal(JSON.stringify([...p].sort((a, b) => a - b)), sortedInput, `not a rearrangement: ${fmt(p)}`);
    const key = JSON.stringify(p);
    assert.ok(!seen.has(key), `duplicate permutation ${key}`);
    seen.add(key);
  }
};

describe('Permutations', () => {
  it('official example 1: [1,2,3]', () =>
    check([1, 2, 3], [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]));
  it('official example 2: [0,1]', () => check([0, 1], [[0, 1], [1, 0]]));
  it('official example 3: [1]', () => check([1], [[1]]));
  it('negative numbers', () => check([-1, 0, 5], [[-1, 0, 5], [-1, 5, 0], [0, -1, 5], [0, 5, -1], [5, -1, 0], [5, 0, -1]]));
  it('order of results is irrelevant but order inside each result matters', () => {
    const actual = permute([1, 2]);
    assert.ok(actual.some((p) => p[0] === 1 && p[1] === 2), `missing [1,2] in ${fmt(actual)}`);
    assert.ok(actual.some((p) => p[0] === 2 && p[1] === 1), `missing [2,1] in ${fmt(actual)}`);
  });
  it('results are independent arrays (mutating one does not change another)', () => {
    const actual = permute([1, 2, 3]);
    actual[0].push(99);
    assert.ok(
      actual.slice(1).every((p) => p.length === 3),
      `results must not share storage: ${fmt(actual)}`,
    );
  });
  it('4 elements -> 24 permutations, all valid', () => checkProperties([4, 2, 9, -3]));
  it('5 elements -> 120 permutations, all valid', () => checkProperties([10, -10, 0, 3, 7]));

  it('7 elements -> 5040 permutations', { timeout: 2000 }, () => {
    checkProperties([1, 2, 3, 4, 5, 6, 7]);
  });

  it('8 elements -> 40320 permutations', { timeout: 2000 }, () => {
    const rng = makeRng(46);
    const nums = rng.shuffle(Array.from({ length: 21 }, (_, i) => i - 10)).slice(0, 8);
    checkProperties(nums);
  });
});
