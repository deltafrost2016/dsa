import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getSum } from './sum-of-two-integers.js';
import { makeRng } from '../../lib/testutil.js';

function check(a, b, expected) {
  const actual = getSum(a, b);
  assert.equal(actual, expected, `getSum(${a}, ${b})\n  expected: ${expected}\n  actual:   ${actual}`);
}

describe('Sum of Two Integers', () => {
  it('example 1: 1 + 2', () => {
    check(1, 2, 3);
  });
  it('example 2: 2 + 3', () => {
    check(2, 3, 5);
  });
  it('zeros', () => {
    check(0, 0, 0);
    check(0, 7, 7);
    check(-7, 0, -7);
  });
  it('carry propagates through several bits', () => {
    check(7, 1, 8);
    check(255, 1, 256);
    check(1023, 1, 1024);
  });
  it('negative plus positive', () => {
    check(-1, 1, 0);
    check(-5, 3, -2);
    check(5, -3, 2);
    check(-12, 20, 8);
  });
  it('both negative', () => {
    check(-1, -1, -2);
    check(-100, -200, -300);
  });
  it('a number plus its negation is zero', () => {
    for (const x of [1, 2, 17, 255, 1000]) {
      check(x, -x, 0);
      check(-x, x, 0);
    }
  });
  it('bounds of the allowed range', () => {
    check(1000, 1000, 2000);
    check(-1000, -1000, -2000);
    check(-1000, 1000, 0);
  });
  it('is correct for every pair in [-60, 60]', () => {
    for (let a = -60; a <= 60; a++) {
      for (let b = -60; b <= 60; b++) {
        check(a, b, a + b);
      }
    }
  });
  it('large input: 200000 random pairs in [-1000, 1000]', { timeout: 2000 }, () => {
    const rng = makeRng(371);
    for (let i = 0; i < 200000; i++) {
      const a = rng.int(-1000, 1000);
      const b = rng.int(-1000, 1000);
      const actual = getSum(a, b);
      if (actual !== a + b) assert.fail(`getSum(${a}, ${b})\n  expected: ${a + b}\n  actual:   ${actual}`);
    }
  });
});
