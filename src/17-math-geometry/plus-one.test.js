import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { plusOne } from './plus-one.js';
import { clone, fmt, makeRng } from '../../lib/testutil.js';

function check(digits, expected) {
  const actual = plusOne(clone(digits));
  assert.deepStrictEqual(
    actual,
    expected,
    `plusOne(${fmt(digits)})\n  expected: ${fmt(expected)}\n  actual:   ${fmt(actual)}`,
  );
}

describe('Plus One', () => {
  it('example 1', () => {
    check([1, 2, 3], [1, 2, 4]);
  });
  it('example 2', () => {
    check([4, 3, 2, 1], [4, 3, 2, 2]);
  });
  it('example 3: single nine grows the array', () => {
    check([9], [1, 0]);
  });
  it('zero', () => {
    check([0], [1]);
  });
  it('carry that stops in the middle', () => {
    check([1, 2, 9, 9], [1, 3, 0, 0]);
  });
  it('carry through every digit', () => {
    check([9, 9, 9], [1, 0, 0, 0]);
  });
  it('trailing eight needs no carry', () => {
    check([9, 9, 8], [9, 9, 9]);
  });
  it('number beyond 2^53 (must not be converted to a Number)', () => {
    check([9, 0, 0, 7, 1, 9, 9, 2, 5, 4, 7, 4, 0, 9, 9, 1], [9, 0, 0, 7, 1, 9, 9, 2, 5, 4, 7, 4, 0, 9, 9, 2]);
  });
  it('100 nines becomes 1 followed by 100 zeros', () => {
    check(new Array(100).fill(9), [1, ...new Array(100).fill(0)]);
  });
  it('99 nines with leading 8 keeps length', () => {
    check([8, ...new Array(99).fill(9)], [9, ...new Array(99).fill(0)]);
  });
  it('random 100-digit numbers match BigInt arithmetic', () => {
    const rng = makeRng(66);
    for (let iter = 0; iter < 50; iter++) {
      const digits = [rng.int(1, 9), ...Array.from({ length: 99 }, () => rng.int(0, 9))];
      const expected = (BigInt(digits.join('')) + 1n).toString().split('').map(Number);
      check(digits, expected);
    }
  });
});
