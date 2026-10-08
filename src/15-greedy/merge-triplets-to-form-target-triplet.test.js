import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fmt, clone, makeRng } from '../../lib/testutil.js';
import { mergeTriplets } from './merge-triplets-to-form-target-triplet.js';

const check = (triplets, target, expected) =>
  assert.equal(
    mergeTriplets(clone(triplets), clone(target)),
    expected,
    `mergeTriplets(${fmt(triplets)}, ${fmt(target)}): expected ${expected}`,
  );

// 100000 triplets whose values stay in [1, 10] / [1, 7] / [1, 5]
const filler = () => Array.from({ length: 100000 }, (_, i) => [1 + (i % 10), 1 + (i % 7), 1 + (i % 5)]);

describe('Merge Triplets to Form Target Triplet', () => {
  it('example 1 -> true', () => check([[2, 5, 3], [1, 8, 4], [1, 7, 5]], [2, 7, 5], true));
  it('example 2: target needs a 2 that no usable triplet has -> false', () => check([[3, 4, 5], [4, 5, 6]], [3, 2, 5], false));
  it('example 3 -> true', () => check([[2, 5, 3], [2, 3, 4], [1, 2, 5], [5, 2, 3]], [5, 5, 5], true));
  it('single triplet equal to the target -> true', () => check([[1, 2, 3]], [1, 2, 3], true));
  it('single triplet that differs -> false', () => check([[1, 2, 3]], [1, 2, 4], false));
  it('single triplet smaller than the target -> false', () => check([[1, 1, 1]], [2, 2, 2], false));
  it('each position supplied by a different triplet -> true', () => check([[5, 1, 1], [1, 5, 1], [1, 1, 5]], [5, 5, 5], true));
  it('a triplet that overshoots anywhere is unusable -> false', () => check([[6, 1, 1], [1, 5, 1], [1, 1, 5]], [5, 5, 5], false));
  it('overshooting triplets are ignored but others suffice -> true', () => {
    check([[9, 9, 9], [5, 1, 1], [1, 5, 1], [1, 1, 5]], [5, 5, 5], true);
  });
  it('target of all ones with a [1,1,1] present -> true', () => check([[1, 1, 1], [2, 2, 2]], [1, 1, 1], true));
  it('target of all ones with only larger triplets -> false', () => check([[2, 1, 1], [1, 2, 1]], [1, 1, 1], false));
  it('two positions from one triplet, third from another -> true', () => check([[3, 3, 1], [1, 1, 3]], [3, 3, 3], true));
  it('one position never reaches the target value -> false', () => check([[3, 3, 1], [1, 1, 2]], [3, 3, 3], false));
  it('duplicate triplets -> true', () => check([[2, 2, 2], [2, 2, 2]], [2, 2, 2], true));
  it('10^5 triplets with exactly three useful suppliers -> true', () => {
    const t = filler();
    t[10] = [1000, 1, 1];
    t[50000] = [1, 1000, 1];
    t[99999] = [1, 1, 1000];
    check(t, [1000, 1000, 1000], true);
  }, { timeout: 2000 });
  it('10^5 triplets, supplier for the third slot missing -> false', () => {
    const t = filler();
    t[10] = [1000, 1, 1];
    t[50000] = [1, 1000, 1];
    check(t, [1000, 1000, 1000], false);
  }, { timeout: 2000 });
  it('10^5 triplets where the only exact supplier of slot 1 overshoots slot 2 -> false', () => {
    const t = filler();
    t[3] = [500, 1, 1];
    t[4] = [1, 500, 999];
    t[5] = [1, 1, 500];
    check(t, [500, 500, 500], false);
  }, { timeout: 2000 });
  it('10^5 seeded random triplets, target [1000,1000,1000]', () => {
    const rng = makeRng(1899);
    const t = Array.from({ length: 100000 }, () => [rng.int(1, 1000), rng.int(1, 1000), rng.int(1, 1000)]);
    check(t, [1000, 1000, 1000], true);
  }, { timeout: 2000 });
  it('10^5 seeded random triplets, target [1,1000,1000]', () => {
    const rng = makeRng(1900);
    const t = Array.from({ length: 100000 }, () => [rng.int(1, 1000), rng.int(1, 1000), rng.int(1, 1000)]);
    check(t, [1, 1000, 1000], false);
  }, { timeout: 2000 });
});
