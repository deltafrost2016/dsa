import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { hammingWeight } from './number-of-1-bits.js';
import { makeRng } from '../../lib/testutil.js';

function check(n, expected) {
  const actual = hammingWeight(n);
  assert.equal(actual, expected, `hammingWeight(${n}) [binary ${n.toString(2)}]\n  expected: ${expected}\n  actual:   ${actual}`);
}

// Oracle: count '1' characters in the binary string.
const popcount = (n) => n.toString(2).split('1').length - 1;

describe('Number of 1 Bits', () => {
  it('example 1: 11 = 1011', () => {
    check(11, 3);
  });
  it('example 2: 128 = 10000000', () => {
    check(128, 1);
  });
  it('example 3: 2147483645 has 30 set bits', () => {
    check(2147483645, 30);
  });
  it('zero has no set bits', () => {
    check(0, 0);
  });
  it('one', () => {
    check(1, 1);
  });
  it('powers of two have exactly one bit', () => {
    for (let k = 0; k < 32; k++) check(2 ** k, 1);
  });
  it('2^k - 1 has k bits', () => {
    for (let k = 1; k <= 32; k++) check(2 ** k - 1, k);
  });
  it('largest signed 32-bit value', () => {
    check(2147483647, 31);
  });
  it('values above 2^31 (sign bit set) must be counted as unsigned', () => {
    check(2147483648, 1);
    check(2147483649, 2);
    check(4294967295, 32);
    check(4294967294, 31);
  });
  it('alternating bit patterns', () => {
    check(0x55555555, 16);
    check(0xaaaaaaaa, 16);
  });
  it('random values match a string-based count', () => {
    const rng = makeRng(191);
    for (let i = 0; i < 2000; i++) {
      const n = rng.int(0, 2 ** 32 - 1);
      check(n, popcount(n));
    }
  });
  it('large input: 200000 values', { timeout: 2000 }, () => {
    const rng = makeRng(1910);
    let expectedTotal = 0;
    let actualTotal = 0;
    for (let i = 0; i < 200000; i++) {
      const n = rng.int(0, 2 ** 32 - 1);
      expectedTotal += popcount(n);
      actualTotal += hammingWeight(n);
    }
    assert.equal(actualTotal, expectedTotal, `sum of Hamming weights: expected ${expectedTotal}, got ${actualTotal}`);
  });
});
