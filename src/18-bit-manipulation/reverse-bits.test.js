import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { reverseBits } from './reverse-bits.js';
import { makeRng } from '../../lib/testutil.js';

function check(n, expected) {
  const actual = reverseBits(n);
  assert.equal(
    actual,
    expected,
    `reverseBits(${n}) [${n.toString(2).padStart(32, '0')}]\n  expected: ${expected} [${expected.toString(2).padStart(32, '0')}]\n  actual:   ${actual}` +
      (typeof actual === 'number' && actual < 0 ? ' (negative: result must be returned as unsigned 32-bit)' : ''),
  );
}

// Oracle: reverse the 32-character binary string.
const reversedByString = (n) => parseInt(n.toString(2).padStart(32, '0').split('').reverse().join(''), 2);

describe('Reverse Bits', () => {
  it('example 1: 43261596', () => {
    check(43261596, 964176192);
  });
  it('example 2: 4294967293', () => {
    check(4294967293, 3221225471);
  });
  it('zero stays zero', () => {
    check(0, 0);
  });
  it('1 becomes 2^31 (above the signed 32-bit range)', () => {
    check(1, 2147483648);
  });
  it('2^31 becomes 1', () => {
    check(2147483648, 1);
  });
  it('all ones stays all ones (4294967295)', () => {
    check(4294967295, 4294967295);
  });
  it('2 becomes 2^30', () => {
    check(2, 1073741824);
  });
  it('largest signed value 2147483647 becomes 4294967294', () => {
    check(2147483647, 4294967294);
  });
  it('alternating patterns swap', () => {
    check(0x55555555, 0xaaaaaaaa);
    check(0xaaaaaaaa, 0x55555555);
  });
  it('palindromic bit pattern is unchanged', () => {
    check(0x80000001, 0x80000001);
  });
  it('reversing twice returns the original', () => {
    const rng = makeRng(190);
    for (let i = 0; i < 500; i++) {
      const n = rng.int(0, 2 ** 32 - 1);
      assert.equal(reverseBits(reverseBits(n)), n, `reverseBits(reverseBits(${n})) should be ${n}`);
    }
  });
  it('random values match a string-based reversal', () => {
    const rng = makeRng(1900);
    for (let i = 0; i < 2000; i++) {
      const n = rng.int(0, 2 ** 32 - 1);
      check(n, reversedByString(n));
    }
  });
  it('large input: 200000 values', { timeout: 2000 }, () => {
    const rng = makeRng(19000);
    let mismatches = 0;
    let firstBad = null;
    for (let i = 0; i < 200000; i++) {
      const n = rng.int(0, 2 ** 32 - 1);
      if (reverseBits(n) !== reversedByString(n)) {
        mismatches++;
        firstBad ??= n;
      }
    }
    assert.equal(mismatches, 0, `${mismatches} mismatches, first at n = ${firstBad}`);
  });
});
