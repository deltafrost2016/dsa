import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { checkInclusion } from './permutation-in-string.js';
import { fmt, makeRng } from '../../lib/testutil.js';

function check(s1, s2, expected) {
  const actual = checkInclusion(s1, s2);
  assert.equal(
    actual,
    expected,
    `checkInclusion(${fmt(s1)}, ${fmt(s2)})\n  expected: ${fmt(expected)}\n  actual:   ${fmt(actual)}`,
  );
}

const sorted = (str) => [...str].sort().join('');

function brute(s1, s2) {
  const target = sorted(s1);
  for (let i = 0; i + s1.length <= s2.length; i++) {
    if (sorted(s2.slice(i, i + s1.length)) === target) return true;
  }
  return false;
}

describe('Permutation in String', () => {
  it('example 1: "ab" in "eidbaooo" -> true', () => check('ab', 'eidbaooo', true));
  it('example 2: "ab" in "eidboaoo" -> false', () => check('ab', 'eidboaoo', false));
  it('single char present', () => check('a', 'bca', true));
  it('single char absent', () => check('a', 'bcd', false));
  it('s1 equals s2', () => check('abc', 'abc', true));
  it('s1 is a rearrangement of s2', () => check('abc', 'cab', true));
  it('s1 longer than s2 -> false', () => check('abcd', 'abc', false));
  it('match at the very start', () => check('abc', 'bcaxxx', true));
  it('match at the very end', () => check('abc', 'xxxcba', true));
  it('same letters but different counts -> false', () => check('aab', 'abbabb', false));
  it('duplicates: needs two a-s adjacent to a b', () => check('aab', 'xbaaxx', true));
  it('letters present but never contiguous -> false', () => check('abc', 'adbdc', false));
  it('window is found after a near miss', () => check('ab', 'acbcab', true));
  it('all same letter', () => check('aaa', 'aabaaa', true));
  it('all same letter but too few contiguous', () => check('aaa', 'aabaab', false));

  it('matches brute force on random small inputs', () => {
    const rng = makeRng(567);
    const letters = [...'abc'];
    const word = (n) => Array.from({ length: n }, () => rng.pick(letters)).join('');
    for (let t = 0; t < 300; t++) {
      const s1 = word(rng.int(1, 5));
      const s2 = word(rng.int(1, 14));
      check(s1, s2, brute(s1, s2));
    }
  });

  it('large input: permutation hidden in the middle -> true', { timeout: 2000 }, () => {
    const rng = makeRng(99);
    const s1 = rng.shuffle([...'abcdefghijklmnopqrstuvwxy'.repeat(200)]).join('');
    const hidden = rng.shuffle([...s1]).join('');
    const s2 = 'z'.repeat(2500) + hidden + 'z'.repeat(2500);
    check(s1, s2, true);
  });

  it('large input: one character off -> false', { timeout: 2000 }, () => {
    const rng = makeRng(99);
    const s1 = rng.shuffle([...'abcdefghijklmnopqrstuvwxy'.repeat(200)]).join('');
    const hiddenChars = rng.shuffle([...s1]);
    hiddenChars[2500] = 'z';
    const s2 = 'z'.repeat(2500) + hiddenChars.join('') + 'z'.repeat(2500);
    check(s1, s2, false);
  });
});
