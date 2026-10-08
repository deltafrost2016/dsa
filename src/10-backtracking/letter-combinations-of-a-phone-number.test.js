import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fmt, sameMembers } from '../../lib/testutil.js';
import { letterCombinations } from './letter-combinations-of-a-phone-number.js';

const check = (digits, expected) => {
  const actual = letterCombinations(digits);
  sameMembers(actual, expected, {
    sortInner: true,
    message: `letterCombinations("${digits}") expected ${fmt(expected)}`,
  });
};

const KEYS = { 2: 'abc', 3: 'def', 4: 'ghi', 5: 'jkl', 6: 'mno', 7: 'pqrs', 8: 'tuv', 9: 'wxyz' };

/** Independent oracle: iterative cartesian product. */
const oracle = (digits) => {
  if (!digits) return [];
  let acc = [''];
  for (const d of digits) acc = acc.flatMap((p) => [...KEYS[d]].map((ch) => p + ch));
  return acc;
};

describe('Letter Combinations of a Phone Number', () => {
  it('official example 1: "23"', () =>
    check('23', ['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf']));
  it('official example 2: "" -> []', () => check('', []));
  it('official example 3: "2"', () => check('2', ['a', 'b', 'c']));
  it('digit with four letters: "7"', () => check('7', ['p', 'q', 'r', 's']));
  it('digit with four letters: "9"', () => check('9', ['w', 'x', 'y', 'z']));
  it('"79" -> 16 strings', () => check('79', oracle('79')));
  it('repeated digit: "22"', () =>
    check('22', ['aa', 'ab', 'ac', 'ba', 'bb', 'bc', 'ca', 'cb', 'cc']));
  it('"89" starts with t/u/v then w/x/y/z', () => {
    const actual = letterCombinations('89');
    assert.equal(actual.length, 12);
    assert.ok(actual.every((s) => s.length === 2 && 'tuv'.includes(s[0]) && 'wxyz'.includes(s[1])), fmt(actual));
  });
  it('letter order follows digit order ("34" never yields "g?" first)', () => {
    const actual = letterCombinations('34');
    assert.ok(actual.every((s) => 'def'.includes(s[0]) && 'ghi'.includes(s[1])), fmt(actual));
  });
  it('no empty-string element for a non-empty input', () => {
    assert.ok(!letterCombinations('5').includes(''));
  });
  it('4 digits all with 4 letters: "7979" -> 256', () => {
    const actual = letterCombinations('7979');
    assert.equal(actual.length, 256);
    check('7979', oracle('7979'));
  });
  it('"2345" -> 81 strings', () => check('2345', oracle('2345')));

  it('7 digits of 4-letter keys -> 16384 strings', { timeout: 2000 }, () => {
    check('7979797', oracle('7979797'));
  });

  it('7 mixed digits', { timeout: 2000 }, () => {
    check('2789345', oracle('2789345'));
  });
});
