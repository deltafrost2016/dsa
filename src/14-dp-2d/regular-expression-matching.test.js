import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fmt } from '../../lib/testutil.js';
import { isMatch } from './regular-expression-matching.js';

const check = (s, p, expected) =>
  assert.equal(isMatch(s, p), expected, `isMatch(${fmt(s)}, ${fmt(p)}): expected ${expected}`);

describe('Regular Expression Matching', () => {
  it('example 1: "aa" vs "a" -> false (pattern must cover everything)', () => check('aa', 'a', false));
  it('example 2: "aa" vs "a*" -> true', () => check('aa', 'a*', true));
  it('example 3: "ab" vs ".*" -> true', () => check('ab', '.*', true));
  it('"aab" vs "c*a*b" -> true (c* matches zero)', () => check('aab', 'c*a*b', true));
  it('"mississippi" vs "mis*is*p*." -> false', () => check('mississippi', 'mis*is*p*.', false));
  it('"mississippi" vs "mis*is*ip*." -> true', () => check('mississippi', 'mis*is*ip*.', true));
  it('single char vs "." -> true', () => check('a', '.', true));
  it('single char vs different char -> false', () => check('a', 'b', false));
  it('"a" vs "ab*" -> true (b* matches zero)', () => check('a', 'ab*', true));
  it('"a" vs "ab*a" -> false', () => check('a', 'ab*a', false));
  it('"a" vs "a*a" -> true (star gives one back)', () => check('a', 'a*a', true));
  it('"aaa" vs "a*a" -> true', () => check('aaa', 'a*a', true));
  it('"aaa" vs "ab*a*c*a" -> true', () => check('aaa', 'ab*a*c*a', true));
  it('"ab" vs ".*c" -> false', () => check('ab', '.*c', false));
  it('"abcd" vs "d*" -> false', () => check('abcd', 'd*', false));
  it('"bbbba" vs ".*a*a" -> true', () => check('bbbba', '.*a*a', true));
  it('"a" vs ".*..a*" -> false', () => check('a', '.*..a*', false));
  it('"ab" vs ".." -> true', () => check('ab', '..', true));
  it('"abc" vs "..": too short pattern -> false', () => check('abc', '..', false));
  it('"a" vs "..": pattern longer than string -> false', () => check('a', '..', false));
  it('star only applies to the preceding char: "ab" vs "a*b*" -> true', () => check('ab', 'a*b*', true));
  it('"aab" vs "a*b" -> true', () => check('aab', 'a*b', true));
  it('"ba" vs "a*b*" -> false (order)', () => check('ba', 'a*b*', false));
  it('"aaa" vs "aaaa" -> false', () => check('aaa', 'aaaa', false));
  it('"a" vs "a*b*c*" -> true', () => check('a', 'a*b*c*', true));
  it('"abbbcd" vs "ab*cd" -> true', () => check('abbbcd', 'ab*cd', true));
  it('dot-star in the middle: "axyzb" vs "a.*b" -> true', () => check('axyzb', 'a.*b', true));
  it('"a"x30 vs ("a*")x15 + "b" -> false (exponential recursion cannot finish)', () => {
    check('a'.repeat(30), 'a*'.repeat(15) + 'b', false);
  }, { timeout: 2000 });
  it('"a"x1000 vs ("a*")x500 + "b" -> false', () => {
    check('a'.repeat(1000), 'a*'.repeat(500) + 'b', false);
  }, { timeout: 2000 });
  it('"a"x1000 vs ("a*")x500 -> true', () => {
    check('a'.repeat(1000), 'a*'.repeat(500), true);
  }, { timeout: 2000 });
  it('"a"x1000 vs ("a*")x400 + "a"x1000 -> true', () => {
    check('a'.repeat(1000), 'a*'.repeat(400) + 'a'.repeat(1000), true);
  }, { timeout: 2000 });
  it('"a"x1000 vs ("a*")x400 + "a"x1001 -> false', () => {
    check('a'.repeat(1000), 'a*'.repeat(400) + 'a'.repeat(1001), false);
  }, { timeout: 2000 });
  it('("ab")x500 vs ".*" -> true', () => check('ab'.repeat(500), '.*', true), { timeout: 2000 });
  it('("ab")x500 vs ".*b" -> true', () => check('ab'.repeat(500), '.*b', true), { timeout: 2000 });
  it('("ab")x500 vs ".*c" -> false', () => check('ab'.repeat(500), '.*c', false), { timeout: 2000 });
  it('("ab")x500 vs (".*")x300 + "c" -> false', () => {
    check('ab'.repeat(500), '.*'.repeat(300) + 'c', false);
  }, { timeout: 2000 });
});
