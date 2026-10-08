import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fmt } from '../../lib/testutil.js';
import { isInterleave } from './interleaving-string.js';

const check = (s1, s2, s3, expected) =>
  assert.equal(isInterleave(s1, s2, s3), expected, `isInterleave(${fmt(s1)}, ${fmt(s2)}, ${fmt(s3)}): expected ${expected}`);

describe('Interleaving String', () => {
  it('example 1: true', () => check('aabcc', 'dbbca', 'aadbbcbcac', true));
  it('example 2: false', () => check('aabcc', 'dbbca', 'aadbbbaccc', false));
  it('example 3: all empty -> true', () => check('', '', '', true));
  it('empty s1 and s2, non-empty s3 -> false', () => check('', '', 'a', false));
  it('s2 empty, s1 equals s3 -> true', () => check('a', '', 'a', true));
  it('s1 empty, s2 equals s3 -> true', () => check('', 'b', 'b', true));
  it('s2 empty, s1 differs from s3 -> false', () => check('ab', '', 'ac', false));
  it('length mismatch (s3 too short) -> false', () => check('a', 'b', 'a', false));
  it('length mismatch (s3 too long) -> false', () => check('a', 'b', 'abc', false));
  it('"a", "b" -> "ab" true', () => check('a', 'b', 'ab', true));
  it('"a", "b" -> "ba" true', () => check('a', 'b', 'ba', true));
  it('right length but wrong characters -> false', () => check('a', 'b', 'cc', false));
  it('same letters, order within s1 broken -> false', () => check('ab', 'c', 'bac', false));
  it('"abc","abc" -> "aabbcc" true', () => check('abc', 'abc', 'aabbcc', true));
  it('"abc","abc" -> "abcabc" true', () => check('abc', 'abc', 'abcabc', true));
  it('"abc","abc" -> "acbabc" false', () => check('abc', 'abc', 'acbabc', false));
  it('same characters throughout, ambiguous splits: "aa","ab" -> "aaba" true', () => check('aa', 'ab', 'aaba', true));
  it('"aa","ab" -> "abaa" true', () => check('aa', 'ab', 'abaa', true));
  it('"aa","ab" -> "baaa" false', () => check('aa', 'ab', 'baaa', false));
  it('500 a + 500 a, s3 = 999 a + b -> false (exponential recursion cannot finish)', () => {
    check('a'.repeat(500), 'a'.repeat(500), 'a'.repeat(999) + 'b', false);
  }, { timeout: 2000 });
  it('500 a + (499 a, b), s3 = 999 a + b -> true', () => {
    check('a'.repeat(500), 'a'.repeat(499) + 'b', 'a'.repeat(999) + 'b', true);
  }, { timeout: 2000 });
  it('("ab")x250 twice interleaves to ("ab")x500 -> true', () => {
    check('ab'.repeat(250), 'ab'.repeat(250), 'ab'.repeat(500), true);
  }, { timeout: 2000 });
  it('("ab")x250 twice cannot make ("ab")x499 + "ba" -> false', () => {
    check('ab'.repeat(250), 'ab'.repeat(250), 'ab'.repeat(499) + 'ba', false);
  }, { timeout: 2000 });
  it('1000-char strings of a/b needing real backtracking -> true', () => {
    const s1 = 'a'.repeat(400) + 'b'.repeat(100);
    const s2 = 'a'.repeat(100) + 'b'.repeat(400);
    // all of s1 followed by all of s2 is a valid interleaving, and so is the reverse
    check(s1, s2, s1 + s2, true);
    check(s1, s2, s2 + s1, true);
  }, { timeout: 2000 });
});
