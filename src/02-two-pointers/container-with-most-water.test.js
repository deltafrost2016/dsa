import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { maxArea } from './container-with-most-water.js';
import { clone, makeRng, randomArray, fmt } from '../../lib/testutil.js';

const check = (height, expected) => {
  const actual = maxArea(clone(height));
  assert.equal(actual, expected, `maxArea(${fmt(height)}) expected ${expected}, got ${fmt(actual)}`);
};

describe('Container With Most Water', () => {
  it('example 1: [1,8,6,2,5,4,8,3,7] -> 49', () => check([1, 8, 6, 2, 5, 4, 8, 3, 7], 49));
  it('example 2: [1,1] -> 1', () => check([1, 1], 1));
  it('two lines, one zero -> 0', () => check([0, 5], 0));
  it('two zero-height lines -> 0', () => check([0, 0], 0));
  it('two lines of different height use the shorter', () => check([3, 9], 3));
  it('all equal heights span the full width', () => check([4, 4, 4, 4, 4], 16));
  it('increasing heights', () => check([1, 2, 3, 4, 5], 6));
  it('decreasing heights', () => check([5, 4, 3, 2, 1], 6));
  it('tall lines at both ends beat a tall middle', () => check([9, 1, 1, 1, 1, 1, 9], 54));
  it('tall lines next to each other lose to a wide pair', () => check([2, 3, 4, 5, 18, 17, 6], 17));
  it('best pair is adjacent', () => check([1, 100, 100, 1], 100));
  it('a zero height in the middle does not matter', () => check([6, 0, 6], 12));
  it('boundary height 10^4 at both ends', () => check([10000, 1, 1, 10000], 30000));

  it('large input (100k): two tall lines at the ends dominate', { timeout: 2000 }, () => {
    const rng = makeRng(11);
    const height = randomArray(rng, 100000, 0, 5000);
    height[0] = 10000;
    height[99999] = 10000;
    check(height, 10000 * 99999);
  });

  it('large input (100k) of all-equal heights', { timeout: 2000 }, () => {
    check(Array(100000).fill(7), 7 * 99999);
  });

  it('large random input (100k) matches a linear two-pointer reference', { timeout: 2000 }, () => {
    const rng = makeRng(12);
    const height = randomArray(rng, 100000, 0, 10000);
    let l = 0;
    let r = height.length - 1;
    let best = 0;
    while (l < r) {
      best = Math.max(best, Math.min(height[l], height[r]) * (r - l));
      if (height[l] < height[r]) l++;
      else r--;
    }
    check(height, best);
  });
});
