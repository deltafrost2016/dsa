import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fmt, makeRng } from '../../lib/testutil.js';
import { numDistinct } from './distinct-subsequences.js';

const check = (s, t, expected) =>
  assert.equal(numDistinct(s, t), expected, `numDistinct(${fmt(s)}, ${fmt(t)}): expected ${expected}`);

describe('Distinct Subsequences', () => {
  it('example 1: "rabbbit", "rabbit" -> 3', () => check('rabbbit', 'rabbit', 3));
  it('example 2: "babgbag", "bag" -> 5', () => check('babgbag', 'bag', 5));
  it('single equal characters -> 1', () => check('a', 'a', 1));
  it('single different characters -> 0', () => check('a', 'b', 0));
  it('t longer than s -> 0', () => check('abc', 'abcd', 0));
  it('identical strings -> 1', () => check('abcdef', 'abcdef', 1));
  it('"aaa", "aa" -> 3', () => check('aaa', 'aa', 3));
  it('"ddd", "dd" -> 3', () => check('ddd', 'dd', 3));
  it('"aaaaa", "aaaaa" -> 1', () => check('aaaaa', 'aaaaa', 1));
  it('"aaaaa", "a" -> 5', () => check('aaaaa', 'a', 5));
  it('t not a subsequence (right letters, wrong order) -> 0', () => check('abc', 'cba', 0));
  it('case sensitive: "aA", "a" -> 1 and "aA", "A" -> 1', () => {
    check('aA', 'a', 1);
    check('aA', 'A', 1);
  });
  it('"abcabc", "abc" -> 4', () => check('abcabc', 'abc', 4));
  it('"adbdadeecadeadeccaeaabdabdbcdabddddabcaaadbabaaedeeddeaeebcdeabcaaaeeaeeabcddcebddebeebedaecccbdcbcedbdaeaedcdebeecdaaedaacadbdccabddaddacdddc", "bcddceeeebecbc" -> 700531452', () => {
    check(
      'adbdadeecadeadeccaeaabdabdbcdabddddabcaaadbabaaedeeddeaeebcdeabcaaaeeaeeabcddcebddebeebedaecccbdcbcedbdaeaedcdebeecdaaedaacadbdccabddaddacdddc',
      'bcddceeeebecbc',
      700531452,
    );
  }, { timeout: 2000 });
  it('1000 a vs 1000 a -> 1', () => check('a'.repeat(1000), 'a'.repeat(1000), 1), { timeout: 2000 });
  it('1000 a vs 999 a -> 1000', () => check('a'.repeat(1000), 'a'.repeat(999), 1000), { timeout: 2000 });
  it('1000 a vs 998 a -> C(1000,2) = 499500 (exponential recursion cannot finish)', () => {
    check('a'.repeat(1000), 'a'.repeat(998), 499500);
  }, { timeout: 2000 });
  it('1000 a vs 999 a + b -> 0', () => check('a'.repeat(1000), 'a'.repeat(999) + 'b', 0), { timeout: 2000 });
  it('a^500 b^500 vs "aab" -> C(500,2) * 500 = 62375000', () => {
    check('a'.repeat(500) + 'b'.repeat(500), 'aab', 62375000);
  }, { timeout: 2000 });
  it('("ab")x500 vs ("ab")x500 -> 1', () => check('ab'.repeat(500), 'ab'.repeat(500), 1), { timeout: 2000 });
  it('seeded random: 1000-char s over 2 letters, 3-char t', () => {
    const rng = makeRng(115);
    const s = Array.from({ length: 1000 }, () => 'ab'[rng.int(0, 1)]).join('');
    check(s, 'aba', 20277058);
  }, { timeout: 2000 });
});
