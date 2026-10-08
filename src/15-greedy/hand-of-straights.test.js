import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fmt, clone, makeRng } from '../../lib/testutil.js';
import { isNStraightHand } from './hand-of-straights.js';

const check = (hand, groupSize, expected) =>
  assert.equal(
    isNStraightHand(clone(hand), groupSize),
    expected,
    `isNStraightHand(${fmt(hand)}, ${groupSize}): expected ${expected}`,
  );

describe('Hand of Straights', () => {
  it('example 1: [1,2,3,6,2,3,4,7,8], 3 -> true', () => check([1, 2, 3, 6, 2, 3, 4, 7, 8], 3, true));
  it('example 2: [1,2,3,4,5], 4 -> false (length not divisible)', () => check([1, 2, 3, 4, 5], 4, false));
  it('single card, group of 1 -> true', () => check([1], 1, true));
  it('group size 1 always works: [5,1,9], 1', () => check([5, 1, 9], 1, true));
  it('unsorted input: [2,1], 2 -> true', () => check([2, 1], 2, true));
  it('gap between values: [8,10,12], 3 -> false', () => check([8, 10, 12], 3, false));
  it('[5,1], 2 -> false', () => check([5, 1], 2, false));
  it('duplicates form two runs: [1,1,2,2,3,3], 3 -> true', () => check([1, 1, 2, 2, 3, 3], 3, true));
  it('duplicates that cannot be completed: [1,1,2,2,3,4], 3 -> false', () => check([1, 1, 2, 2, 3, 4], 3, false));
  it('[1,2,3,4], 2 -> true ([1,2],[3,4])', () => check([1, 2, 3, 4], 2, true));
  it('[1,2,3,4], 4 -> true (one group)', () => check([1, 2, 3, 4], 4, true));
  it('[1,3,2,4,3,5], 3 -> true', () => check([1, 3, 2, 4, 3, 5], 3, true));
  it('zeros: [0,0], 1 -> true', () => check([0, 0], 1, true));
  it('zeros cannot form a run of 2: [0,0], 2 -> false', () => check([0, 0], 2, false));
  it('values up to 10^9: [1000000000,999999999], 2 -> true', () => check([1000000000, 999999999], 2, true));
  it('values far apart: [1,1000000000], 2 -> false', () => check([1, 1000000000], 2, false));
  it('group size equals hand length but not consecutive -> false', () => check([1, 2, 4], 3, false));
  it('runs overlap in value ranges: [3,2,1,2,3,4,3,4,5,9,10,11], 3 -> true', () => {
    check([3, 2, 1, 2, 3, 4, 3, 4, 5, 9, 10, 11], 3, true);
  });
  it('10^4 shuffled consecutive cards in groups of 100 -> true', () => {
    const rng = makeRng(846);
    check(rng.shuffle(Array.from({ length: 10000 }, (_, i) => i)), 100, true);
  }, { timeout: 2000 });
  it('10^4 shuffled consecutive cards in groups of 4 -> true', () => {
    const rng = makeRng(847);
    check(rng.shuffle(Array.from({ length: 10000 }, (_, i) => i)), 4, true);
  }, { timeout: 2000 });
  it('values 0..4999 each twice, single group size 5000 twice -> true', () => {
    const rng = makeRng(848);
    check(rng.shuffle(Array.from({ length: 10000 }, (_, i) => i % 5000)), 5000, true);
  }, { timeout: 2000 });
  it('10^4 cards with one value replaced by a duplicate, groups of 100 -> false', () => {
    const rng = makeRng(849);
    const hand = Array.from({ length: 10000 }, (_, i) => i);
    hand[5000] = 5001;
    check(rng.shuffle(hand), 100, false);
  }, { timeout: 2000 });
  it('10^4 cards spaced 10^5 apart are never consecutive, group size 2 -> false', () => {
    check(Array.from({ length: 10000 }, (_, i) => i * 100000), 2, false);
  }, { timeout: 2000 });
});
