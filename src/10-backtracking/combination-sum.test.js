import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { clone, fmt, sameMembers, makeRng } from '../../lib/testutil.js';
import { combinationSum } from './combination-sum.js';

const check = (candidates, target, expected) => {
  const input = clone(candidates);
  const actual = combinationSum(input, target);
  sameMembers(actual, expected, {
    sortInner: true,
    message: `combinationSum(${fmt(candidates)}, ${target}) expected ${fmt(expected)}`,
  });
};

/** Number of multisets of candidates (unlimited reuse) summing to target, via coin-change DP. */
const countWays = (candidates, target) => {
  const ways = new Array(target + 1).fill(0);
  ways[0] = 1;
  for (const c of candidates) for (let s = c; s <= target; s++) ways[s] += ways[s - c];
  return ways[target];
};

/** Validate structure without needing the exact list: sums, members, uniqueness, count. */
const checkProperties = (candidates, target) => {
  const actual = combinationSum(clone(candidates), target);
  const allowed = new Set(candidates);
  const seen = new Set();
  for (const combo of actual) {
    assert.ok(Array.isArray(combo) && combo.length > 0, `bad combination ${fmt(combo)}`);
    assert.ok(combo.every((x) => allowed.has(x)), `uses a non-candidate: ${fmt(combo)}`);
    assert.equal(
      combo.reduce((a, b) => a + b, 0),
      target,
      `combination ${fmt(combo)} does not sum to ${target}`,
    );
    const key = JSON.stringify([...combo].sort((a, b) => a - b));
    assert.ok(!seen.has(key), `duplicate combination ${key}`);
    seen.add(key);
  }
  assert.equal(
    actual.length,
    countWays(candidates, target),
    `combinationSum(${fmt(candidates)}, ${target}): wrong number of combinations`,
  );
};

describe('Combination Sum', () => {
  it('official example 1: [2,3,6,7], 7', () => check([2, 3, 6, 7], 7, [[2, 2, 3], [7]]));
  it('official example 2: [2,3,5], 8', () =>
    check([2, 3, 5], 8, [[2, 2, 2, 2], [2, 3, 3], [3, 5]]));
  it('official example 3: [2], 1 -> none', () => check([2], 1, []));
  it('single candidate that divides the target', () => check([3], 9, [[3, 3, 3]]));
  it('single candidate equal to target', () => check([7], 7, [[7]]));
  it('candidate larger than target is ignored', () => check([8, 3], 6, [[3, 3]]));
  it('all candidates larger than target -> none', () => check([5, 6, 7], 4, []));
  it('candidate 1 allows a long combination', () =>
    check([1], 10, [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]));
  it('candidates in descending order', () => check([7, 6, 3, 2], 7, [[2, 2, 3], [7]]));
  it('target reachable only by mixing three values', () =>
    check([4, 6, 9], 19, [[4, 6, 9]]));
  it('1 and 2 produce the integer partitions of 4 into {1,2}', () =>
    check([1, 2], 4, [[1, 1, 1, 1], [1, 1, 2], [2, 2]]));

  it('uses a candidate more than once in at least one answer', () => {
    const actual = combinationSum([2, 3, 5], 8);
    assert.ok(
      actual.some((c) => c.filter((x) => x === 2).length > 1),
      `expected a combination that repeats 2, got ${fmt(actual)}`,
    );
  });

  it('many candidates, target 40: all combos valid, unique and counted', { timeout: 2000 }, () => {
    checkProperties([2, 3, 5, 7, 11, 13], 40);
  });

  it('candidate 1 with a spread of values, target 35', { timeout: 2000 }, () => {
    checkProperties([1, 2, 5, 10, 20], 35);
  });

  it('random distinct candidate sets', { timeout: 2000 }, () => {
    const rng = makeRng(39);
    for (let t = 0; t < 12; t++) {
      const candidates = rng.shuffle(Array.from({ length: 38 }, (_, i) => i + 2)).slice(0, rng.int(1, 8));
      checkProperties(candidates, rng.int(1, 40));
    }
  });
});
