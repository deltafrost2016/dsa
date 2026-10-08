import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { lengthOfLongestSubstring } from './longest-substring-without-repeating-characters.js';
import { fmt, makeRng } from '../../lib/testutil.js';

function check(s, expected) {
  const actual = lengthOfLongestSubstring(s);
  assert.equal(
    actual,
    expected,
    `lengthOfLongestSubstring(${fmt(s)})\n  expected: ${fmt(expected)}\n  actual:   ${fmt(actual)}`,
  );
}

function brute(s) {
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    const seen = new Set();
    for (let j = i; j < s.length && !seen.has(s[j]); j++) {
      seen.add(s[j]);
      best = Math.max(best, j - i + 1);
    }
  }
  return best;
}

describe('Longest Substring Without Repeating Characters', () => {
  it('example 1: "abcabcbb" -> 3', () => check('abcabcbb', 3));
  it('example 2: "bbbbb" -> 1', () => check('bbbbb', 1));
  it('example 3: "pwwkew" -> 3', () => check('pwwkew', 3));
  it('empty string -> 0', () => check('', 0));
  it('single character', () => check('a', 1));
  it('single space', () => check(' ', 1));
  it('all unique characters', () => check('abcdef', 6));
  it('two characters alternating', () => check('abababab', 2));
  it('"dvdf" needs the window to jump forward but not reset', () => check('dvdf', 3));
  it('"abba" must not move the left edge backwards', () => check('abba', 2));
  it('"tmmzuxt" (stale index of an earlier duplicate)', () => check('tmmzuxt', 5));
  it('repeat at the very end', () => check('abcdea', 5));
  it('mixed case, digits and symbols are distinct characters', () => check('aA1!aA1!', 4));
  it('spaces count as characters', () => check('a b a', 3));

  it('matches brute force on random small strings', () => {
    const rng = makeRng(3);
    const alphabet = 'abcde';
    for (let t = 0; t < 300; t++) {
      const len = rng.int(0, 14);
      let s = '';
      for (let i = 0; i < len; i++) s += rng.pick([...alphabet]);
      check(s, brute(s));
    }
  });

  it('large input: 50000 chars cycling through 90 distinct characters -> 90', { timeout: 2000 }, () => {
    const cycle = Array.from({ length: 90 }, (_, i) => String.fromCharCode(33 + i)).join('');
    const s = cycle.repeat(Math.ceil(50000 / 90)).slice(0, 50000);
    check(s, 90);
  });

  it('large input: all the same character -> 1', { timeout: 2000 }, () => {
    check('z'.repeat(50000), 1);
  });

  it('large input: one long unique block hidden between repeats', { timeout: 2000 }, () => {
    // 70 distinct non-a/b characters, flanked by "...abab" on the left and "abab..." on the right.
    // The best window is the preceding "b" + block + the following "a" = 72.
    const block = Array.from({ length: 70 }, (_, i) => String.fromCharCode(0x100 + i)).join('');
    const s = 'ab'.repeat(12000) + block + 'ab'.repeat(12000);
    check(s, 72);
  });
});
