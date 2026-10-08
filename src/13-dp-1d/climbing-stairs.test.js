import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fmt } from '../../lib/testutil.js';
import { climbStairs } from './climbing-stairs.js';

function check(n, expected) {
  const actual = climbStairs(n);
  assert.strictEqual(actual, expected, `climbStairs(${n})\n  expected: ${expected}\n  actual:   ${fmt(actual)}`);
}

describe('Climbing Stairs', () => {
  it('example 1: n = 2', () => check(2, 2));
  it('example 2: n = 3', () => check(3, 3));
  it('n = 1 has a single way', () => check(1, 1));
  it('n = 4', () => check(4, 5));
  it('n = 5', () => check(5, 8));
  it('n = 10', () => check(10, 89));
  it('n = 20', () => check(20, 10946));
  it('n = 30', () => check(30, 1346269));
  it('n = 44', () => check(44, 1134903170));
  it('n = 45 (maximum; exponential recursion is too slow)', { timeout: 2000 }, () => check(45, 1836311903));
});
