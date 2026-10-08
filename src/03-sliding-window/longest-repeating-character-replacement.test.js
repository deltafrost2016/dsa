import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { characterReplacement } from './longest-repeating-character-replacement.js';
import { fmt, makeRng } from '../../lib/testutil.js';

function check(s, k, expected) {
  const actual = characterReplacement(s, k);
  assert.equal(
    actual,
    expected,
    `characterReplacement(${fmt(s)}, ${k})\n  expected: ${fmt(expected)}\n  actual:   ${fmt(actual)}`,
  );
}

// Independent brute force: for each substring, length - (count of most frequent letter) <= k.
function brute(s, k) {
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    const counts = new Map();
    let maxCount = 0;
    for (let j = i; j < s.length; j++) {
      const c = (counts.get(s[j]) ?? 0) + 1;
      counts.set(s[j], c);
      maxCount = Math.max(maxCount, c);
      if (j - i + 1 - maxCount <= k) best = Math.max(best, j - i + 1);
    }
  }
  return best;
}

describe('Longest Repeating Character Replacement', () => {
  it('example 1: "ABAB", k=2 -> 4', () => check('ABAB', 2, 4));
  it('example 2: "AABABBA", k=1 -> 4', () => check('AABABBA', 1, 4));
  it('single character, k=0', () => check('A', 0, 1));
  it('single character, k=1', () => check('A', 1, 1));
  it('k=0 returns the longest existing run', () => check('AABBBCC', 0, 3));
  it('all the same letter', () => check('AAAA', 2, 4));
  it('k equals the length: whole string', () => check('ABCDE', 5, 5));
  it('k larger than needed still caps at the length', () => check('ABC', 3, 3));
  it('all distinct letters with k=1 -> 2', () => check('ABCDEFG', 1, 2));
  it('all distinct letters with k=0 -> 1', () => check('ABCDEFG', 0, 1));
  it('the best window is not at the start', () => check('ABCDDDDE', 1, 5));
  it('majority letter changes between windows', () => check('AAABBBBBAA', 2, 7));
  it('"ABBB" with k=2 -> 4', () => check('ABBB', 2, 4));
  it('"BAAAB" with k=2 -> 5', () => check('BAAAB', 2, 5));

  it('matches brute force on random small inputs', () => {
    const rng = makeRng(424);
    const letters = [...'ABCD'];
    for (let t = 0; t < 300; t++) {
      const len = rng.int(1, 14);
      let s = '';
      for (let i = 0; i < len; i++) s += rng.pick(letters);
      const k = rng.int(0, len);
      check(s, k, brute(s, k));
    }
  });

  it('large input: 10^5 identical letters', { timeout: 2000 }, () => {
    check('Q'.repeat(100000), 7, 100000);
  });

  it('large input: "AB" repeated with k=10000 -> 2k+1', { timeout: 2000 }, () => {
    const s = 'AB'.repeat(50000);
    check(s, 10000, 20001);
  });

  it('large input: "AB" repeated with k=50000 -> whole string', { timeout: 2000 }, () => {
    const s = 'AB'.repeat(50000);
    check(s, 50000, 100000);
  });
});
