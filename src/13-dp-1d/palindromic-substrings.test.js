import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fmt, makeRng } from '../../lib/testutil.js';
import { countSubstrings } from './palindromic-substrings.js';

function check(s, expected) {
  const actual = countSubstrings(s);
  assert.strictEqual(actual, expected, `countSubstrings(${fmt(s)})\n  expected: ${expected}\n  actual:   ${fmt(actual)}`);
}

describe('Palindromic Substrings', () => {
  it('example 1: "abc"', () => check('abc', 3));
  it('example 2: "aaa"', () => check('aaa', 6));
  it('single character', () => check('a', 1));
  it('two equal characters', () => check('aa', 3));
  it('two different characters', () => check('ab', 2));
  it('even palindrome "abba"', () => check('abba', 6));
  it('"racecar"', () => check('racecar', 10));
  it('"aaaa" (n(n+1)/2)', () => check('aaaa', 10));
  it('"abab"', () => check('abab', 6));
  it('"aabaa"', () => check('aabaa', 9));
  it('all distinct letters count only singles', () => check('abcdefg', 7));
  it('1000 identical characters: n(n+1)/2', { timeout: 2000 }, () => check('a'.repeat(1000), 500500));
  it('alternating "ab" x 500: every odd-length substring is a palindrome', { timeout: 2000 }, () => {
    check('ab'.repeat(500), 250500);
  });
  it('1000 random characters over {a,b}', { timeout: 2000 }, () => {
    const rng = makeRng(5);
    let s = '';
    for (let i = 0; i < 1000; i++) s += rng.pick(['a', 'b']);
    check(s, 2989);
  });
  it('1000 random characters over {a,b,c}', { timeout: 2000 }, () => {
    const rng = makeRng(6);
    let s = '';
    for (let i = 0; i < 1000; i++) s += rng.pick(['a', 'b', 'c']);
    check(s, 1981);
  });
});
