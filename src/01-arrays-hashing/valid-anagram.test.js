import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isAnagram } from './valid-anagram.js';
import { makeRng } from '../../lib/testutil.js';

const check = (s, t, expected) => {
  const actual = isAnagram(s, t);
  assert.equal(actual, expected, `isAnagram(${JSON.stringify(s)}, ${JSON.stringify(t)}) expected ${expected}, got ${actual}`);
};

describe('Valid Anagram', () => {
  it('example 1: anagram/nagaram -> true', () => check('anagram', 'nagaram', true));
  it('example 2: rat/car -> false', () => check('rat', 'car', false));
  it('single equal char', () => check('a', 'a', true));
  it('single different char', () => check('a', 'b', false));
  it('different lengths', () => check('ab', 'abc', false));
  it('same letters, different counts', () => check('aacc', 'ccac', false));
  it('same letters, different counts (aab vs abb)', () => check('aab', 'abb', false));
  it('identical strings', () => check('listen', 'listen', true));
  it('listen/silent', () => check('listen', 'silent', true));
  it('all same letter', () => check('aaaa', 'aaaa', true));
  it('same length, one letter off', () => check('abcd', 'abce', false));
  it('reversed string', () => check('abcdefg', 'gfedcba', true));

  it('large shuffled string (50k chars) is an anagram', { timeout: 2000 }, () => {
    const rng = makeRng(242);
    const letters = Array.from({ length: 50000 }, () => String.fromCharCode(97 + rng.int(0, 25)));
    const s = letters.join('');
    const t = rng.shuffle(letters).join('');
    check(s, t, true);
  });

  it('large strings differing by one letter (50k chars)', { timeout: 2000 }, () => {
    const rng = makeRng(243);
    const letters = Array.from({ length: 50000 }, () => String.fromCharCode(97 + rng.int(0, 24)));
    const s = letters.join('');
    const other = rng.shuffle(letters);
    other[0] = 'z'; // 'z' never occurs in letters
    check(s, other.join(''), false);
  });
});
