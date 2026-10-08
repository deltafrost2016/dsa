import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { clone, fmt } from '../../lib/testutil.js';
import { canPartition } from './partition-equal-subset-sum.js';

function check(nums, expected) {
  const actual = canPartition(clone(nums));
  assert.strictEqual(actual, expected, `canPartition(${fmt(nums)})\n  expected: ${expected}\n  actual:   ${fmt(actual)}`);
}

describe('Partition Equal Subset Sum', () => {
  it('example 1: [1,5,5] vs [11]', () => check([1, 5, 11, 5], true));
  it('example 2: no split', () => check([1, 2, 3, 5], false));
  it('two equal numbers', () => check([1, 1], true));
  it('single number can never split', () => check([1], false));
  it('two different numbers', () => check([1, 2], false));
  it('odd total sum', () => check([1, 2, 4], false));
  it('even total but unreachable half', () => check([1, 2, 5], false));
  it('simple true case', () => check([2, 2, 1, 1], true));
  it('uses 4 + 5 = 9', () => check([3, 3, 3, 4, 5], true));
  it('1..7 sums to 28', () => check([1, 2, 3, 4, 5, 6, 7], true));
  it('14 + 4 + 2 = 20', () => check([14, 9, 8, 4, 3, 2], true));
  it('one huge element dominates', () => check([100, 1, 1, 1], false));
  it('large element equals the rest', () => check([50, 25, 15, 10], true));
  it('all equal with an even count', () => check([7, 7, 7, 7], true));
  it('all equal with an odd count', () => check([7, 7, 7], false));
  it('200 elements of 100: exponential subset search is too slow', { timeout: 2000 }, () => {
    check(new Array(200).fill(100), true);
  });
  it('199 hundreds and one 2: even sum, half is unreachable', { timeout: 2000 }, () => {
    // sum = 19902, half = 9951; every subset sum is 100a or 100a + 2.
    check([...new Array(199).fill(100), 2], false);
  });
  it('198 hundreds plus 99 and 101: 99 + 101 + 98 hundreds = 10000', { timeout: 2000 }, () => {
    check([...new Array(198).fill(100), 99, 101], true);
  });
});
