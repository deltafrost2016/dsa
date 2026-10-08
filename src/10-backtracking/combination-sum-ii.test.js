import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { clone, fmt, sameMembers, makeRng } from '../../lib/testutil.js';
import { combinationSum2 } from './combination-sum-ii.js';

const check = (candidates, target, expected) => {
  const input = clone(candidates);
  const actual = combinationSum2(input, target);
  sameMembers(actual, expected, {
    sortInner: true,
    message: `combinationSum2(${fmt(candidates)}, ${target}) expected ${fmt(expected)}`,
  });
};

/** Number of distinct multisets (each value used at most its multiplicity) summing to target. */
const countWays = (candidates, target) => {
  const counts = new Map();
  for (const c of candidates) counts.set(c, (counts.get(c) ?? 0) + 1);
  let ways = new Array(target + 1).fill(0);
  ways[0] = 1;
  for (const [value, cnt] of counts) {
    const next = new Array(target + 1).fill(0);
    for (let s = 0; s <= target; s++) {
      if (!ways[s]) continue;
      for (let c = 0; c <= cnt && s + c * value <= target; c++) next[s + c * value] += ways[s];
    }
    ways = next;
  }
  return ways[target];
};

const checkProperties = (candidates, target) => {
  const actual = combinationSum2(clone(candidates), target);
  const avail = new Map();
  for (const c of candidates) avail.set(c, (avail.get(c) ?? 0) + 1);
  const seen = new Set();
  for (const combo of actual) {
    assert.ok(Array.isArray(combo) && combo.length > 0, `bad combination ${fmt(combo)}`);
    const used = new Map();
    for (const x of combo) used.set(x, (used.get(x) ?? 0) + 1);
    for (const [x, n] of used) {
      assert.ok((avail.get(x) ?? 0) >= n, `combination ${fmt(combo)} uses ${x} too many times`);
    }
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
    `combinationSum2(${fmt(candidates)}, ${target}): wrong number of combinations`,
  );
};

describe('Combination Sum II', () => {
  it('official example 1: [10,1,2,7,6,1,5], 8', () =>
    check([10, 1, 2, 7, 6, 1, 5], 8, [[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]]));
  it('official example 2: [2,5,2,1,2], 5', () =>
    check([2, 5, 2, 1, 2], 5, [[1, 2, 2], [5]]));
  it('no combination reaches the target', () => check([2, 4, 6], 5, []));
  it('single element equal to target', () => check([5], 5, [[5]]));
  it('single element different from target', () => check([5], 3, []));
  it('all equal values: [1,1,1,1], 2 -> one combination', () => check([1, 1, 1, 1], 2, [[1, 1]]));
  it('each element only once: [3,3], 6', () => check([3, 3], 6, [[3, 3]]));
  it('cannot reuse: [3], 6 -> none', () => check([3], 6, []));
  it('duplicates do not produce duplicate answers: [1,1,2,5,6,7,10], 8', () =>
    check([1, 1, 2, 5, 6, 7, 10], 8, [[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]]));
  it('unsorted input with duplicates', () =>
    check([4, 1, 4, 2, 1, 3], 5, [[1, 4], [2, 3], [1, 1, 3]]));
  it('candidates larger than target are skipped', () => check([50, 1, 49, 1], 2, [[1, 1]]));
  it('target needs every element', () => check([1, 2, 3, 4], 10, [[1, 2, 3, 4]]));

  it('30 small numbers, target 30: valid, unique, counted', { timeout: 2000 }, () => {
    const rng = makeRng(40);
    const candidates = Array.from({ length: 30 }, () => rng.int(1, 8));
    checkProperties(candidates, 30);
  });

  it('many duplicates of few values', { timeout: 2000 }, () => {
    const candidates = [];
    for (const v of [1, 2, 3, 4, 5]) for (let i = 0; i < 6; i++) candidates.push(v);
    checkProperties(candidates, 25);
  });

  it('all identical values, 30 copies of 1, target 15 -> exactly one answer', { timeout: 2000 }, () => {
    const candidates = new Array(30).fill(1);
    const actual = combinationSum2(candidates, 15);
    assert.equal(actual.length, 1, `expected exactly one combination, got ${actual.length}`);
    assert.equal(actual[0].length, 15);
  });

  it('random candidate lists', { timeout: 2000 }, () => {
    const rng = makeRng(401);
    for (let t = 0; t < 10; t++) {
      const n = rng.int(5, 28);
      const candidates = Array.from({ length: n }, () => rng.int(1, 12));
      checkProperties(candidates, rng.int(5, 30));
    }
  });
});
