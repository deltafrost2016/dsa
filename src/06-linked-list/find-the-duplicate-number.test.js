import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { findDuplicate } from './find-the-duplicate-number.js';
import { clone, fmt, makeRng } from '../../lib/testutil.js';

/** The solution gets a clone; the clone must come back unmodified (array is read-only). */
function check(nums, expected) {
  const input = clone(nums);
  const actual = findDuplicate(input);
  assert.equal(actual, expected, `findDuplicate(${fmt(nums)}): expected ${expected}, got ${fmt(actual)}`);
  assert.deepStrictEqual(input, nums, 'findDuplicate must not modify the input array (treat it as read-only)');
}

/**
 * Array of n + 1 values in 1..n where `dup` appears `count` times and every other value
 * appears at most once.
 */
function build(rng, n, dup, count) {
  const others = rng.shuffle(Array.from({ length: n }, (_, i) => i + 1).filter((v) => v !== dup));
  const nums = rng.shuffle([...new Array(count).fill(dup), ...others.slice(0, n + 1 - count)]);
  return nums;
}

describe('Find the Duplicate Number (#287)', () => {
  it('example 1', () => check([1, 3, 4, 2, 2], 2));
  it('example 2', () => check([3, 1, 3, 4, 2], 3));
  it('example 3: same value repeated many times', () => check([3, 3, 3, 3, 3], 3));
  it('smallest input', () => check([1, 1], 1));
  it('n = 2 with duplicate 2', () => check([2, 2, 1], 2));
  it('n = 2 with duplicate 1', () => check([1, 2, 1], 1));
  it('duplicate adjacent at the start', () => check([2, 2, 3, 1, 4], 2));
  it('duplicate at both ends', () => check([4, 1, 3, 2, 4], 4));
  it('duplicate is the largest value', () => check([1, 2, 5, 3, 5, 4], 5));
  it('duplicate is repeated more than twice', () => check([2, 5, 9, 6, 9, 3, 8, 9, 7, 1, 4], 9));
  it('does not mutate sorted input (typical sort-based shortcut is not allowed)', () => check([1, 2, 3, 4, 4], 4));
  it('random small arrays', () => {
    const rng = makeRng(287);
    for (let t = 0; t < 300; t++) {
      const n = rng.int(1, 12);
      const dup = rng.int(1, n);
      const count = rng.int(2, Math.min(n + 1, 5));
      check(build(rng, n, dup, count), dup);
    }
  });

  it('large inputs: n = 10^5 (quadratic scan is too slow)', { timeout: 2000 }, () => {
    const rng = makeRng(2870);
    const n = 100_000;
    for (const count of [2, 3, 1000, 50_000]) {
      const dup = rng.int(1, n);
      check(build(rng, n, dup, count), dup);
    }
  });
});
