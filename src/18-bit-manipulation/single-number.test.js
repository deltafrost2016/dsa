import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { singleNumber } from './single-number.js';
import { clone, fmt, makeRng } from '../../lib/testutil.js';

function check(nums, expected) {
  const actual = singleNumber(clone(nums));
  assert.equal(actual, expected, `singleNumber(${fmt(nums)})\n  expected: ${expected}\n  actual:   ${fmt(actual)}`);
}

describe('Single Number', () => {
  it('example 1', () => {
    check([2, 2, 1], 1);
  });
  it('example 2', () => {
    check([4, 1, 2, 1, 2], 4);
  });
  it('example 3: single element', () => {
    check([1], 1);
  });
  it('single element zero', () => {
    check([0], 0);
  });
  it('the lone value is zero', () => {
    check([5, 0, 5], 0);
  });
  it('negative values', () => {
    check([-1, -1, -2], -2);
    check([-3, 7, -3], 7);
  });
  it('mix of negative and positive pairs', () => {
    check([-5, 5, -5, 5, -9], -9);
  });
  it('lone value at the end and at the start', () => {
    check([1, 1, 2, 2, 3], 3);
    check([3, 1, 1, 2, 2], 3);
  });
  it('bounds of the value range', () => {
    check([30000, -30000, 30000], -30000);
    check([-30000, 30000, 30000, -30000, 29999], 29999);
  });
  it('large input: 29999 elements, shuffled', { timeout: 2000 }, () => {
    const rng = makeRng(136);
    const nums = [];
    for (let v = -14999; v < 15000; v++) {
      if (v === 4242) continue;
      nums.push(v, v);
    }
    nums.push(4242);
    check(rng.shuffle(nums), 4242);
  });
});
