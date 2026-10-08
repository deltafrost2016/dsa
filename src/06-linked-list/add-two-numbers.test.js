import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { addTwoNumbers } from './add-two-numbers.js';
import { buildList, listToArray } from '../../lib/ds.js';
import { fmt, makeRng, randomArray } from '../../lib/testutil.js';

function check(a, b, expected) {
  const actual = listToArray(addTwoNumbers(buildList(a), buildList(b)));
  assert.deepStrictEqual(actual, expected, `addTwoNumbers(${fmt(a)}, ${fmt(b)}): expected ${fmt(expected)}, got ${fmt(actual)}`);
}

/** Digits little-endian -> BigInt. */
const toBig = (digits) => BigInt([...digits].reverse().join('') || '0');
/** BigInt -> digits little-endian. */
const toDigits = (n) => [...n.toString()].reverse().map(Number);

/** Random number without leading zero, as little-endian digits. */
function randomDigits(rng, len) {
  const d = randomArray(rng, len, 0, 9);
  if (len > 1 && d[len - 1] === 0) d[len - 1] = rng.int(1, 9);
  return d;
}

describe('Add Two Numbers (#2)', () => {
  it('example 1: 342 + 465 = 807', () => check([2, 4, 3], [5, 6, 4], [7, 0, 8]));
  it('example 2: 0 + 0', () => check([0], [0], [0]));
  it('example 3: 9999999 + 9999 with a long carry chain', () =>
    check([9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9], [8, 9, 9, 9, 0, 0, 0, 1]));
  it('carry out of the final digit adds a new node', () => check([5], [5], [0, 1]));
  it('different lengths, first longer', () => check([1, 2, 3, 4], [9], [0, 3, 3, 4]));
  it('different lengths, second longer', () => check([9], [1, 2, 3, 4], [0, 3, 3, 4]));
  it('one operand is zero', () => check([0], [7, 8, 9], [7, 8, 9]));
  it('carry propagates through the longer list only', () => check([1], [9, 9, 9], [0, 0, 0, 1]));
  it('no carries at all', () => check([1, 1, 1], [2, 2, 2], [3, 3, 3]));
  it('single digits, no carry', () => check([3], [4], [7]));
  it('result has no spurious trailing zero node', () => check([1, 0, 1], [2, 0, 2], [3, 0, 3]));
  it('random numbers agree with BigInt arithmetic', () => {
    const rng = makeRng(2);
    for (let t = 0; t < 300; t++) {
      const a = randomDigits(rng, rng.int(1, 30));
      const b = randomDigits(rng, rng.int(1, 30));
      check(a, b, toDigits(toBig(a) + toBig(b)));
    }
  });

  it('thousands of digits (BigInt oracle)', { timeout: 2000 }, () => {
    const rng = makeRng(20);
    const a = randomDigits(rng, 3000);
    const b = randomDigits(rng, 2500);
    check(a, b, toDigits(toBig(a) + toBig(b)));
    const nines = new Array(3000).fill(9);
    check(nines, [1], toDigits(toBig(nines) + 1n));
  });
});
