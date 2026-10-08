import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isPalindrome } from './valid-palindrome.js';
import { makeRng } from '../../lib/testutil.js';

const check = (s, expected) => {
  const actual = isPalindrome(s);
  const shown = s.length > 80 ? `${JSON.stringify(s.slice(0, 80))}...(${s.length} chars)` : JSON.stringify(s);
  assert.equal(actual, expected, `isPalindrome(${shown}) expected ${expected}, got ${actual}`);
};

describe('Valid Palindrome', () => {
  it('example 1: "A man, a plan, a canal: Panama" -> true', () => check('A man, a plan, a canal: Panama', true));
  it('example 2: "race a car" -> false', () => check('race a car', false));
  it('example 3: " " -> true', () => check(' ', true));
  it('only punctuation -> true', () => check('.,!?', true));
  it('single character', () => check('a', true));
  it('"0P" is not a palindrome (digits and letters differ)', () => check('0P', false));
  it('digits palindrome', () => check('12321', true));
  it('digits not a palindrome', () => check('12345', false));
  it('mixed case is ignored', () => check('AbBa', true));
  it('underscore is skipped: "ab_a" cleans to "aba"', () => check('ab_a', true));
  it('underscore is skipped: "a_b" cleans to "ab"', () => check('a_b', false));
  it('two different letters', () => check('ab', false));
  it('two equal letters with symbols between', () => check('a, ,a', true));
  it('leading and trailing junk is ignored', () => check('###abba***', true));
  it('letter vs digit lookalikes', () => check('0O', false));
  it('even-length palindrome', () => check('abccba', true));
  it('odd-length near-palindrome', () => check('abcdba', false));

  it('large palindrome (200k chars) with noise', { timeout: 2000 }, () => {
    const rng = makeRng(125);
    const half = Array.from({ length: 50000 }, () => String.fromCharCode(97 + rng.int(0, 25)));
    const mirrored = [...half, ...half.slice().reverse()];
    const noisy = mirrored.map((c, i) => (i % 2 ? c.toUpperCase() : c) + (rng.int(0, 1) ? ' ' : ',')).join('');
    check(noisy, true);
  });

  it('large almost-palindrome (200k chars) differing only in the middle', { timeout: 2000 }, () => {
    const half = 'ab'.repeat(50000);
    const s = half + 'c' + half.split('').reverse().join('');
    const broken = `${s.slice(0, 99999)}z${s.slice(100000)}`; // replace one char left of centre
    check(s, true);
    check(broken, false);
  });
});
