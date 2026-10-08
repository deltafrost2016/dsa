import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { countBits } from './counting-bits.js';
import { fmt } from '../../lib/testutil.js';

function check(n, expected) {
  const actual = countBits(n);
  assert.deepStrictEqual(actual, expected, `countBits(${n})\n  expected: ${fmt(expected)}\n  actual:   ${fmt(actual)}`);
}

// Oracle: count '1' characters in the binary string of every i (slow, O(n log n), for building expectations).
const expectedFor = (n) => Array.from({ length: n + 1 }, (_, i) => i.toString(2).split('1').length - 1);

describe('Counting Bits', () => {
  it('example 1: n = 2', () => {
    check(2, [0, 1, 1]);
  });
  it('example 2: n = 5', () => {
    check(5, [0, 1, 1, 2, 1, 2]);
  });
  it('n = 0 gives just [0]', () => {
    check(0, [0]);
  });
  it('n = 1', () => {
    check(1, [0, 1]);
  });
  it('n = 8 (just past a power of two)', () => {
    check(8, [0, 1, 1, 2, 1, 2, 2, 3, 1]);
  });
  it('n = 15 (all 4-bit values)', () => {
    check(15, [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4]);
  });
  it('length is always n + 1', () => {
    for (const n of [0, 1, 7, 16, 100]) {
      assert.equal(countBits(n).length, n + 1, `countBits(${n}) should have length ${n + 1}`);
    }
  });
  it('every n from 0 to 300 matches a string-based count', () => {
    for (let n = 0; n <= 300; n++) check(n, expectedFor(n));
  });
  it('large input: n = 100000', { timeout: 2000 }, () => {
    check(100000, expectedFor(100000));
  });
});
