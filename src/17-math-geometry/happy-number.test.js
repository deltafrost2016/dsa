import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isHappy } from './happy-number.js';

function check(n, expected) {
  const actual = isHappy(n);
  assert.equal(actual, expected, `isHappy(${n})\n  expected: ${expected}\n  actual:   ${actual}`);
}

// The happy numbers from 1 to 100 (well-known list, OEIS A007770).
const HAPPY_UP_TO_100 = [1, 7, 10, 13, 19, 23, 28, 31, 32, 44, 49, 68, 70, 79, 82, 86, 91, 94, 97, 100];

describe('Happy Number', () => {
  it('example 1: 19 is happy', () => {
    check(19, true);
  });
  it('example 2: 2 is not happy', () => {
    check(2, false);
  });
  it('1 is happy', () => {
    check(1, true);
  });
  it('7 is happy', () => {
    check(7, true);
  });
  it('4 is on the unhappy cycle', () => {
    check(4, false);
  });
  it('powers of ten are happy', () => {
    check(10, true);
    check(1000, true);
    check(1000000000, true);
  });
  it('every number from 1 to 100 is classified correctly', () => {
    const happy = new Set(HAPPY_UP_TO_100);
    for (let n = 1; n <= 100; n++) check(n, happy.has(n));
  });
  it('largest 32-bit integer', () => {
    check(2147483647, false);
  });
  it('a larger happy number', () => {
    check(1111111, true);
  });
  it('large input: exactly 1442 happy numbers up to 10000', { timeout: 2000 }, () => {
    let count = 0;
    for (let n = 1; n <= 10000; n++) if (isHappy(n)) count++;
    assert.equal(count, 1442, `expected 1442 happy numbers in [1, 10000], got ${count}`);
  });
});
