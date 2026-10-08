import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fmt, makeRng } from '../../lib/testutil.js';
import { longestCommonSubsequence } from './longest-common-subsequence.js';

const check = (a, b, expected) =>
  assert.equal(
    longestCommonSubsequence(a, b),
    expected,
    `longestCommonSubsequence(${fmt(a)}, ${fmt(b)}): expected ${expected}`,
  );

describe('Longest Common Subsequence', () => {
  it('example 1: "abcde", "ace" -> 3', () => check('abcde', 'ace', 3));
  it('example 2: identical strings -> length', () => check('abc', 'abc', 3));
  it('example 3: no shared characters -> 0', () => check('abc', 'def', 0));
  it('single equal characters -> 1', () => check('a', 'a', 1));
  it('single different characters -> 0', () => check('a', 'b', 0));
  it('"bl" vs "yby" -> 1', () => check('bl', 'yby', 1));
  it('"ezupkr" vs "ubmrapg" -> 2', () => check('ezupkr', 'ubmrapg', 2));
  it('"abcba" vs "abcbcba" -> 5', () => check('abcba', 'abcbcba', 5));
  it('one string is a subsequence of the other', () => check('axbycz', 'abc', 3));
  it('is symmetric in its arguments', () => {
    check('oxcpqrsvwf', 'shmtulqrypy', 2);
    check('shmtulqrypy', 'oxcpqrsvwf', 2);
  });
  it('repeated characters: "aaaa" vs "aa" -> 2', () => check('aaaa', 'aa', 2));
  it('reversed string shares only a palindromic core: "abcd" vs "dcba" -> 1', () => check('abcd', 'dcba', 1));
  it('1000-char identical strings -> 999 (O(2^n) recursion is far too slow)', () => {
    const s = 'abc'.repeat(333);
    check(s, s, 999);
  }, { timeout: 2000 });
  it('"ab"x500 vs "a"x1000 -> 500', () => check('ab'.repeat(500), 'a'.repeat(1000), 500), { timeout: 2000 });
  it('a^500 b^500 vs b^500 a^500 -> 500', () => {
    check('a'.repeat(500) + 'b'.repeat(500), 'b'.repeat(500) + 'a'.repeat(500), 500);
  }, { timeout: 2000 });
  it('1000 vs 1000 seeded random strings over 4 letters', () => {
    const rng = makeRng(1143);
    const gen = (n) => Array.from({ length: n }, () => 'abcd'[rng.int(0, 3)]).join('');
    check(gen(1000), gen(1000), 652);
  }, { timeout: 2000 });
});
