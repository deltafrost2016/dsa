import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { reverse } from './reverse-integer.js';
import { fmt, makeRng } from '../../lib/testutil.js';

const MIN_INT = -(2 ** 31);
const MAX_INT = 2 ** 31 - 1;

// assert.equal in strict mode uses Object.is, so a returned -0 is reported as a failure.
function check(x, expected) {
  const actual = reverse(x);
  assert.equal(actual, expected, `reverse(${fmt(x)})\n  expected: ${fmt(expected)}\n  actual:   ${fmt(actual)}`);
}

// Oracle by string reversal, then range check.
function expectedFor(x) {
  const sign = x < 0 ? -1 : 1;
  const r = sign * Number(String(Math.abs(x)).split('').reverse().join(''));
  return r < MIN_INT || r > MAX_INT ? 0 : r;
}

describe('Reverse Integer', () => {
  it('example 1: 123', () => {
    check(123, 321);
  });
  it('example 2: -123', () => {
    check(-123, -321);
  });
  it('example 3: trailing zero is dropped (120)', () => {
    check(120, 21);
  });
  it('zero', () => {
    check(0, 0);
  });
  it('single digit', () => {
    check(7, 7);
    check(-7, -7);
  });
  it('many trailing zeros', () => {
    check(1000, 1);
    check(-1000, -1);
    check(1000000000, 1);
  });
  it('overflow: 1534236469 reverses to 9646324351 so returns 0', () => {
    check(1534236469, 0);
  });
  it('overflow: -1534236469 returns 0', () => {
    check(-1534236469, 0);
  });
  it('overflow: MAX_INT 2147483647 reverses to 7463847412 so returns 0', () => {
    check(MAX_INT, 0);
  });
  it('overflow: MIN_INT -2147483648 returns 0 (not -0)', () => {
    check(MIN_INT, 0);
  });
  it('largest valid result: 1463847412 -> 2147483641', () => {
    check(1463847412, 2147483641);
    check(-1463847412, -2147483641);
  });
  it('just past MAX_INT: 1563847412 -> 2147483651 returns 0', () => {
    check(1563847412, 0);
    check(-1563847412, 0);
  });
  it('exactly at the boundary digits: 1147483647 -> 7463847411 overflows', () => {
    check(1147483647, 0);
  });
  it('palindrome near the upper bound is unchanged', () => {
    check(2147447412, 2147447412);
  });
  it('negative number that reverses within range near MIN_INT', () => {
    check(-2143847412, -2147483412);
  });
  it('palindromes are unchanged', () => {
    check(12321, 12321);
    check(-9009, -9009);
  });
  it('random 32-bit inputs match a string-based oracle', () => {
    const rng = makeRng(7);
    for (let i = 0; i < 5000; i++) {
      const x = rng.int(MIN_INT, MAX_INT);
      check(x, expectedFor(x));
    }
  });
  it('large input: 200000 random inputs', { timeout: 2000 }, () => {
    const rng = makeRng(70);
    let bad = null;
    for (let i = 0; i < 200000 && bad === null; i++) {
      const x = rng.int(MIN_INT, MAX_INT);
      const actual = reverse(x);
      if (!Object.is(actual, expectedFor(x))) bad = { x, actual, expected: expectedFor(x) };
    }
    assert.equal(bad, null, `mismatch: ${fmt(bad)}`);
  });
});
