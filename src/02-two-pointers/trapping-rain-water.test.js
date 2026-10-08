import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { trap } from './trapping-rain-water.js';
import { clone, makeRng, randomArray, fmt } from '../../lib/testutil.js';

const check = (height, expected) => {
  const actual = trap(clone(height));
  assert.equal(actual, expected, `trap(${fmt(height)}) expected ${expected}, got ${fmt(actual)}`);
};

describe('Trapping Rain Water', () => {
  it('example 1: [0,1,0,2,1,0,1,3,2,1,2,1] -> 6', () => check([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1], 6));
  it('example 2: [4,2,0,3,2,5] -> 9', () => check([4, 2, 0, 3, 2, 5], 9));
  it('single bar -> 0', () => check([5], 0));
  it('single zero -> 0', () => check([0], 0));
  it('two bars -> 0', () => check([3, 7], 0));
  it('all zeros -> 0', () => check([0, 0, 0, 0], 0));
  it('flat surface -> 0', () => check([3, 3, 3, 3], 0));
  it('strictly increasing -> 0', () => check([1, 2, 3, 4, 5], 0));
  it('strictly decreasing -> 0', () => check([5, 4, 3, 2, 1], 0));
  it('single valley', () => check([3, 0, 3], 3));
  it('wide valley', () => check([2, 0, 0, 0, 2], 6));
  it('asymmetric valley uses the lower wall', () => check([5, 0, 0, 2], 4));
  it('asymmetric valley with a lower right wall', () => check([5, 0, 0, 2, 0, 2], 6));
  it('two valleys separated by a peak', () => check([3, 0, 3, 0, 3], 6));
  it('staircase down then up', () => check([4, 3, 2, 1, 2, 3, 4], 9));
  it('bump inside a valley', () => check([5, 1, 3, 1, 5], 10));
  it('zeros at the edges do not hold water', () => check([0, 2, 0, 2, 0], 2));
  it('boundary height 10^5', () => check([100000, 0, 100000], 100000));

  it('large input (20k) of a deep pit', { timeout: 2000 }, () => {
    const height = Array(20000).fill(0);
    height[0] = 100000;
    height[19999] = 100000;
    check(height, 100000 * 19998);
  });

  it('large random input (20k) matches a prefix/suffix reference', { timeout: 2000 }, () => {
    const rng = makeRng(42);
    const height = randomArray(rng, 20000, 0, 100000);
    const n = height.length;
    const left = new Array(n);
    const right = new Array(n);
    left[0] = height[0];
    for (let i = 1; i < n; i++) left[i] = Math.max(left[i - 1], height[i]);
    right[n - 1] = height[n - 1];
    for (let i = n - 2; i >= 0; i--) right[i] = Math.max(right[i + 1], height[i]);
    let expected = 0;
    for (let i = 0; i < n; i++) expected += Math.min(left[i], right[i]) - height[i];
    check(height, expected);
  });

  it('large zigzag input (20k)', { timeout: 2000 }, () => {
    // [2,0] repeated 10000 times then a closing 2: every 0 sits in a pit of depth 2.
    const height = [];
    for (let i = 0; i < 10000; i++) height.push(2, 0);
    height.push(2);
    check(height, 2 * 10000);
  });
});
