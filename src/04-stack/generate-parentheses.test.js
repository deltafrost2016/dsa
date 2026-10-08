import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateParenthesis } from './generate-parentheses.js';
import { fmt, sameMembers } from '../../lib/testutil.js';

const CATALAN = [1, 1, 2, 5, 14, 42, 132, 429, 1430, 4862, 16796, 58786, 208012];

function isWellFormed(str, n) {
  if (str.length !== 2 * n) return false;
  let depth = 0;
  for (const c of str) {
    if (c === '(') depth++;
    else if (c === ')') depth--;
    else return false;
    if (depth < 0) return false;
  }
  return depth === 0;
}

// Validates count, uniqueness and well-formedness (enough to prove the full set, since Catalan(n) is exact).
function checkAll(n) {
  const actual = generateParenthesis(n);
  assert.ok(Array.isArray(actual), `generateParenthesis(${n}) should return an array, got ${fmt(actual)}`);
  assert.equal(actual.length, CATALAN[n], `generateParenthesis(${n}) should return ${CATALAN[n]} strings, got ${actual.length}`);
  assert.equal(new Set(actual).size, actual.length, `generateParenthesis(${n}) returned duplicates`);
  for (const str of actual) {
    if (!isWellFormed(str, n)) assert.fail(`generateParenthesis(${n}) returned invalid string ${fmt(str)}`);
  }
}

describe('Generate Parentheses', () => {
  it('example 1: n=3', () => {
    sameMembers(generateParenthesis(3), ['((()))', '(()())', '(())()', '()(())', '()()()'], {
      message: 'generateParenthesis(3)',
    });
  });

  it('example 2: n=1', () => {
    sameMembers(generateParenthesis(1), ['()'], { message: 'generateParenthesis(1)' });
  });

  it('n=2', () => {
    sameMembers(generateParenthesis(2), ['(())', '()()'], { message: 'generateParenthesis(2)' });
  });

  it('n=4 matches the 14 known answers', () => {
    sameMembers(
      generateParenthesis(4),
      [
        '(((())))', '((()()))', '((())())', '((()))()', '(()(()))', '(()()())', '(()())()',
        '(())(())', '(())()()', '()((()))', '()(()())', '()(())()', '()()(())', '()()()()',
      ],
      { message: 'generateParenthesis(4)' },
    );
  });

  for (const n of [5, 6, 7, 8]) {
    it(`n=${n}: ${CATALAN[n]} unique, well-formed strings`, () => checkAll(n));
  }

  it('every string has exactly n opening and n closing brackets and starts with "(" and ends with ")"', () => {
    for (const str of generateParenthesis(5)) {
      assert.ok(str.startsWith('(') && str.endsWith(')'), `bad boundary in ${fmt(str)}`);
    }
  });

  it('large input: n=12 -> 208012 strings', { timeout: 2000 }, () => checkAll(12));
});
