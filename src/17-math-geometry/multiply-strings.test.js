import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { multiply } from './multiply-strings.js';
import { fmt, makeRng } from '../../lib/testutil.js';

function check(a, b, expected) {
  const actual = multiply(a, b);
  assert.equal(
    actual,
    expected,
    `multiply(${fmt(a)}, ${fmt(b)})\n  expected: ${fmt(expected)}\n  actual:   ${fmt(actual)}`,
  );
}

// Random digit string without leading zeros.
function randomDigits(rng, len) {
  let s = String(rng.int(1, 9));
  for (let i = 1; i < len; i++) s += rng.int(0, 9);
  return s;
}

describe('Multiply Strings', () => {
  it('example 1', () => {
    check('2', '3', '6');
  });
  it('example 2', () => {
    check('123', '456', '56088');
  });
  it('zero times anything is "0" (not "000")', () => {
    check('0', '0', '0');
    check('0', '987654321', '0');
    check('987654321', '0', '0');
  });
  it('multiplying by one', () => {
    check('1', '1', '1');
    check('1', '98765432109876543210', '98765432109876543210');
  });
  it('carries through every position', () => {
    check('999', '999', '998001');
    check('99', '99', '9801');
  });
  it('powers of ten append zeros', () => {
    check('1000', '10', '10000');
    check('100000000000', '100000000000', '10000000000000000000000');
  });
  it('different lengths, both orders', () => {
    check('12', '12345678', '148148136');
    check('12345678', '12', '148148136');
  });
  it('product beyond 2^53 (Number arithmetic would lose digits)', () => {
    check('9007199254740993', '9007199254740993', '81129638414606699710187514626049');
  });
  it('20-digit nines', () => {
    check('99999999999999999999', '99999999999999999999', '9999999999999999999800000000000000000001');
  });
  it('the product keeps no leading zeros', () => {
    check('5', '2', '10');
    check('50', '2', '100');
  });
  it('random numbers up to 60 digits match BigInt arithmetic', () => {
    const rng = makeRng(43);
    for (let iter = 0; iter < 100; iter++) {
      const a = randomDigits(rng, rng.int(1, 60));
      const b = randomDigits(rng, rng.int(1, 60));
      check(a, b, (BigInt(a) * BigInt(b)).toString());
    }
  });
  it('large input: two 200-digit numbers', { timeout: 2000 }, () => {
    const rng = makeRng(200);
    for (let iter = 0; iter < 20; iter++) {
      const a = randomDigits(rng, 200);
      const b = randomDigits(rng, 200);
      check(a, b, (BigInt(a) * BigInt(b)).toString());
    }
    const nines = '9'.repeat(200);
    check(nines, nines, (BigInt(nines) * BigInt(nines)).toString());
  });
});
