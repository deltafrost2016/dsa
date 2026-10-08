import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { myPow } from './pow-x-n.js';
import { closeTo, fmt } from '../../lib/testutil.js';

const MIN_INT = -(2 ** 31);
const MAX_INT = 2 ** 31 - 1;

// Absolute check for results of moderate size.
function check(x, n, expected) {
  const actual = myPow(x, n);
  closeTo(actual, expected, 1e-5, `myPow(${fmt(x)}, ${fmt(n)})\n  expected: ${fmt(expected)}\n  actual:   ${fmt(actual)}`);
}

// Relative check, for very large or very small results where an absolute epsilon is meaningless.
function checkRel(x, n, expected, tol = 1e-6) {
  const actual = myPow(x, n);
  const ok = typeof actual === 'number' && Math.abs(actual - expected) <= tol * Math.abs(expected);
  assert.ok(ok, `myPow(${fmt(x)}, ${fmt(n)})\n  expected: ${fmt(expected)} (relative tol ${tol})\n  actual:   ${fmt(actual)}`);
}

describe('Pow(x, n)', () => {
  it('example 1: 2^10', () => {
    check(2, 10, 1024);
  });
  it('example 2: 2.1^3', () => {
    check(2.1, 3, 9.261);
  });
  it('example 3: 2^-2', () => {
    check(2, -2, 0.25);
  });
  it('anything to the power 0 is 1', () => {
    check(2.5, 0, 1);
    check(-7, 0, 1);
    check(0.00001, 0, 1);
  });
  it('power 1 returns x', () => {
    check(3.5, 1, 3.5);
    check(-3.5, 1, -3.5);
  });
  it('negative base with odd and even exponents', () => {
    check(-2, 3, -8);
    check(-2, 4, 16);
    check(-2, -3, -0.125);
    check(-2, -4, 0.0625);
  });
  it('zero base with positive exponent', () => {
    check(0, 5, 0);
    check(0, MAX_INT, 0);
  });
  it('base 1 with huge exponents is fast and exact', () => {
    check(1, MAX_INT, 1);
    check(1, MIN_INT, 1);
  });
  it('base -1 alternates sign, including at the 32-bit boundaries', () => {
    check(-1, MAX_INT, -1);
    check(-1, MIN_INT, 1);
    check(-1, MIN_INT + 1, -1);
  });
  it('n = -2^31 with |x| > 1 underflows to 0 (-n overflows 32-bit ints)', () => {
    check(2, MIN_INT, 0);
    check(-2, MIN_INT, 0);
  });
  it('n = 2^31 - 1 with |x| < 1 underflows to 0', () => {
    check(0.5, MAX_INT, 0);
  });
  it('x slightly above 1 with n = 2^31 - 1', () => {
    checkRel(1.00000001, MAX_INT, Math.pow(1.00000001, MAX_INT), 1e-5);
  });
  it('x slightly below 1 with n = -2^31', () => {
    checkRel(0.99999999, MIN_INT, Math.pow(0.99999999, MIN_INT), 1e-5);
  });
  it('x slightly below 1 with n = 2^31 - 1 gives a small positive number', () => {
    checkRel(0.99999999, MAX_INT, Math.pow(0.99999999, MAX_INT), 1e-5);
  });
  it('fractional base with negative exponent', () => {
    check(0.5, -3, 8);
    check(0.1, -2, 100);
  });
  it('large exact results', () => {
    check(2, 30, 1073741824);
    check(2, 62, 4611686018427387904);
  });
  it('tiny results use a relative comparison', () => {
    checkRel(0.00001, 5, 1e-25, 1e-9);
  });
  it('large exponent finishes fast (O(log n), not O(n))', { timeout: 2000 }, () => {
    checkRel(1.0000001, 2000000000, Math.pow(1.0000001, 2000000000), 1e-5);
    checkRel(1.0000001, -2000000000, Math.pow(1.0000001, -2000000000), 1e-5);
  });
});
