import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fmt, makeRng } from '../../lib/testutil.js';
import { longestPalindrome } from './longest-palindromic-substring.js';

function isPalindrome(str) {
  for (let i = 0, j = str.length - 1; i < j; i++, j--) if (str[i] !== str[j]) return false;
  return true;
}

/** Any longest palindrome is accepted: check it is one, is a substring of s, and has the expected length. */
function check(s, expectedLength) {
  const actual = longestPalindrome(s);
  const ctx = `longestPalindrome(${fmt(s)}) returned ${fmt(actual)}`;
  assert.strictEqual(typeof actual, 'string', `${ctx}: expected a string`);
  assert.ok(s.includes(actual), `${ctx}: result is not a substring of the input`);
  assert.ok(isPalindrome(actual), `${ctx}: result is not a palindrome`);
  assert.strictEqual(actual.length, expectedLength, `${ctx}: expected a palindrome of length ${expectedLength}`);
}

describe('Longest Palindromic Substring', () => {
  it('example 1: "babad" (bab or aba)', () => check('babad', 3));
  it('example 2: "cbbd" -> "bb"', () => {
    assert.strictEqual(longestPalindrome('cbbd'), 'bb');
  });
  it('single character', () => {
    assert.strictEqual(longestPalindrome('a'), 'a');
  });
  it('two different characters: any single one', () => check('ac', 1));
  it('two equal characters', () => {
    assert.strictEqual(longestPalindrome('bb'), 'bb');
  });
  it('whole string is a palindrome (odd length)', () => {
    assert.strictEqual(longestPalindrome('racecar'), 'racecar');
  });
  it('whole string is a palindrome (even length)', () => {
    assert.strictEqual(longestPalindrome('abccba'), 'abccba');
  });
  it('even-length palindrome in the middle', () => {
    assert.strictEqual(longestPalindrome('forgeeksskeegfor'), 'geeksskeeg');
  });
  it('no repeated characters: length 1', () => check('abcdef', 1));
  it('palindrome at the end', () => {
    assert.strictEqual(longestPalindrome('xyzabcba'), 'abcba');
  });
  it('digits', () => {
    assert.strictEqual(longestPalindrome('12321'), '12321');
  });
  it('all identical characters', () => {
    assert.strictEqual(longestPalindrome('aaaa'), 'aaaa');
  });
  it('1000 identical characters', { timeout: 2000 }, () => {
    const s = 'a'.repeat(1000);
    assert.strictEqual(longestPalindrome(s), s);
  });
  it('1000 random characters over {a,b}', { timeout: 2000 }, () => {
    const rng = makeRng(5);
    let s = '';
    for (let i = 0; i < 1000; i++) s += rng.pick(['a', 'b']);
    check(s, 32);
  });
  it('1000 random characters over {a,b,c}', { timeout: 2000 }, () => {
    const rng = makeRng(6);
    let s = '';
    for (let i = 0; i < 1000; i++) s += rng.pick(['a', 'b', 'c']);
    check(s, 14);
  });
  it('planted palindrome of length 801 inside patterned noise', { timeout: 2000 }, () => {
    // The planted block is bordered by "y" and "z" (different), so it cannot be extended,
    // and the noise on both sides only contains short palindromes.
    const half = 'ab'.repeat(200) + 'c';
    const pal = half + [...half.slice(0, -1)].reverse().join('');
    const s = 'dede'.repeat(25) + 'y' + pal + 'z' + 'fgfg'.repeat(24);
    check(s, pal.length);
  });
});
