import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { clone, fmt } from '../../lib/testutil.js';
import { minCostClimbingStairs } from './min-cost-climbing-stairs.js';

function check(cost, expected) {
  const actual = minCostClimbingStairs(clone(cost));
  assert.strictEqual(actual, expected, `minCostClimbingStairs(${fmt(cost)})\n  expected: ${expected}\n  actual:   ${fmt(actual)}`);
}

describe('Min Cost Climbing Stairs', () => {
  it('example 1', () => check([10, 15, 20], 15));
  it('example 2', () => check([1, 100, 1, 1, 1, 100, 1, 1, 100, 1], 6));
  it('two stairs: start on the cheaper one and jump to the top', () => check([10, 15], 10));
  it('two stairs where the second is cheaper', () => check([15, 10], 10));
  it('two free stairs', () => check([0, 0], 0));
  it('all zeros', () => check([0, 0, 0, 0, 0], 0));
  it('three stairs: skip the expensive middle', () => check([5, 100, 5], 10));
  it('three stairs: only the middle is cheap', () => check([100, 1, 100], 1));
  it('last stair is expensive but must be skipped over', () => check([1, 1, 1, 999], 2));
  it('expensive first stair is avoided by starting at index 1', () => check([999, 1, 1, 1], 2));
  it('increasing costs', () => check([1, 2, 3, 4, 5, 6], 9));
  it('all equal costs, length 1000: pay every other stair', { timeout: 2000 }, () => {
    check(new Array(1000).fill(7), 500 * 7);
  });
  it('all equal costs, length 999', { timeout: 2000 }, () => {
    check(new Array(999).fill(3), 499 * 3);
  });
  it('alternating free and expensive stairs, length 1000', { timeout: 2000 }, () => {
    const cost = Array.from({ length: 1000 }, (_, i) => (i % 2 === 0 ? 0 : 999));
    check(cost, 0);
  });
});
