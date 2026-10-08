import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { minEatingSpeed } from './koko-eating-bananas.js';
import { clone, fmt, makeRng, randomArray } from '../../lib/testutil.js';

function check(piles, h, expected) {
  const actual = minEatingSpeed(clone(piles), h);
  assert.equal(actual, expected, `minEatingSpeed(${fmt(piles)}, ${h}): expected ${expected}, got ${fmt(actual)}`);
}

/** Hours needed at speed k (test oracle for property checks). */
const hoursAt = (piles, k) => piles.reduce((s, p) => s + Math.ceil(p / k), 0);

/** Assert k is feasible and k-1 is not (i.e. k is the minimum). */
function checkMinimal(piles, h) {
  const k = minEatingSpeed(clone(piles), h);
  const ctx = `minEatingSpeed(${fmt(piles)}, ${h}) returned ${fmt(k)}`;
  assert.ok(Number.isInteger(k) && k >= 1, `${ctx}: must be a positive integer`);
  assert.ok(hoursAt(piles, k) <= h, `${ctx}: speed too slow, needs ${hoursAt(piles, k)}h > ${h}h`);
  if (k > 1) assert.ok(hoursAt(piles, k - 1) > h, `${ctx}: not minimal, speed ${k - 1} also fits in ${h}h`);
}

describe('Koko Eating Bananas (#875)', () => {
  it('example 1', () => check([3, 6, 7, 11], 8, 4));
  it('example 2', () => check([30, 11, 23, 4, 20], 5, 30));
  it('example 3', () => check([30, 11, 23, 4, 20], 6, 23));
  it('single pile, one hour', () => check([1], 1, 1));
  it('single pile with plenty of hours', () => check([10], 10, 1));
  it('single pile, two hours', () => check([9], 2, 5));
  it('h equals number of piles -> speed is the largest pile', () => check([4, 9, 2, 7], 4, 9));
  it('all piles equal', () => check([5, 5, 5, 5], 8, 3));
  it('leftover bananas in an hour are wasted', () => check([4, 4], 3, 4));
  it('huge pile with huge h', () => check([1_000_000_000], 1_000_000_000, 1));
  it('huge pile with few hours', () => check([1_000_000_000], 2, 500_000_000));
  it('several huge piles at h = n', () => check([1_000_000_000, 999_999_999, 1], 3, 1_000_000_000));
  it('many tiny piles with h = n', () => check([1, 1, 1, 1, 1, 1], 6, 1));
  it('speed 1 is enough when h is the total', () => check([3, 2, 5], 10, 1));

  it('random small cases are minimal and feasible', () => {
    const rng = makeRng(875);
    for (let t = 0; t < 300; t++) {
      const n = rng.int(1, 8);
      const piles = randomArray(rng, n, 1, 50);
      const h = rng.int(n, n + 40);
      checkMinimal(piles, h);
    }
  });

  it('large input: 10^4 piles up to 10^9 (must not iterate speeds linearly)', { timeout: 2000 }, () => {
    const rng = makeRng(8750);
    const n = 10_000;
    const piles = randomArray(rng, n, 1, 1_000_000_000);
    for (const h of [n, n + 1, 3 * n, 50 * n, 1_000_000_000]) checkMinimal(piles, h);
  });
});
