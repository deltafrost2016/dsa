import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { clone, fmt, makeRng, randomArray } from '../../lib/testutil.js';
import { lastStoneWeight } from './last-stone-weight.js';

const check = (stones, expected) => {
  const input = clone(stones);
  assert.equal(
    lastStoneWeight(input),
    expected,
    `lastStoneWeight(${fmt(stones)}) expected ${expected}`,
  );
};

/** Independent oracle: sorted array with binary insertion (fine for tens of thousands). */
function oracle(stones) {
  const a = [...stones].sort((x, y) => x - y);
  while (a.length > 1) {
    const y = a.pop();
    const x = a.pop();
    if (x === y) continue;
    const d = y - x;
    let lo = 0;
    let hi = a.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (a[mid] < d) lo = mid + 1;
      else hi = mid;
    }
    a.splice(lo, 0, d);
  }
  return a.length ? a[0] : 0;
}

describe('Last Stone Weight', () => {
  it('official example 1: [2,7,4,1,8,1] -> 1', () => check([2, 7, 4, 1, 8, 1], 1));
  it('official example 2: [1] -> 1', () => check([1], 1));
  it('two equal stones destroy each other', () => check([2, 2], 0));
  it('two unequal stones', () => check([3, 10], 7));
  it('all equal, even count -> 0', () => check([5, 5, 5, 5], 0));
  it('all equal, odd count -> one stone left', () => check([4, 4, 4], 4));
  it('stones that cancel completely: [1,3,2]', () => check([1, 3, 2], 0));
  it('heaviest dominates', () => check([1000, 1, 1, 1], 997));
  it('does not require sorted input', () => check([8, 1, 7, 2, 4, 1], 1));
  it('boundary weights [1000,1000,1]', () => check([1000, 1000, 1], 1));
  it('does not rely on stones being distinct: [9,3,2,10]', () => check([9, 3, 2, 10], 0));

  it('30000 random stones match the oracle', { timeout: 2000 }, () => {
    const rng = makeRng(1046);
    const stones = randomArray(rng, 30000, 1, 1000);
    check(stones, oracle(stones));
  });

  it('several mid-size random arrays match the oracle', { timeout: 2000 }, () => {
    const rng = makeRng(10461);
    for (let t = 0; t < 40; t++) {
      const stones = randomArray(rng, rng.int(1, 30), 1, 1000);
      check(stones, oracle(stones));
    }
  });

  it('30000 equal stones -> 0', { timeout: 2000 }, () => {
    check(new Array(30000).fill(7), 0);
  });
});
