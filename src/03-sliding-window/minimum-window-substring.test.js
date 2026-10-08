import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { minWindow } from './minimum-window-substring.js';
import { fmt, makeRng } from '../../lib/testutil.js';

function check(s, t, expected) {
  const actual = minWindow(s, t);
  assert.equal(
    actual,
    expected,
    `minWindow(${fmt(s)}, ${fmt(t)})\n  expected: ${fmt(expected)}\n  actual:   ${fmt(actual)}`,
  );
}

function covers(window, t) {
  const need = new Map();
  for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);
  for (const c of window) if (need.has(c)) need.set(c, need.get(c) - 1);
  return [...need.values()].every((v) => v <= 0);
}

function bruteLength(s, t) {
  let best = Infinity;
  for (let i = 0; i < s.length; i++) {
    for (let j = i + t.length; j <= s.length; j++) {
      if (j - i < best && covers(s.slice(i, j), t)) best = j - i;
    }
  }
  return best === Infinity ? 0 : best;
}

describe('Minimum Window Substring', () => {
  it('example 1: "ADOBECODEBANC", "ABC" -> "BANC"', () => check('ADOBECODEBANC', 'ABC', 'BANC'));
  it('example 2: "a", "a" -> "a"', () => check('a', 'a', 'a'));
  it('example 3: "a", "aa" -> "" (not enough a-s)', () => check('a', 'aa', ''));
  it('t has a character that s lacks -> ""', () => check('abcdef', 'z', ''));
  it('t longer than s -> ""', () => check('ab', 'abc', ''));
  it('s equals t', () => check('abc', 'abc', 'abc'));
  it('whole string is the only window', () => check('abc', 'cba', 'abc'));
  it('duplicate requirement is respected', () => check('aaflslflsldkalskaaa', 'aaa', 'aaa'));
  it('duplicates in t force a longer window', () => check('abcxab', 'aabb', 'abcxab'));
  it('window at the start', () => check('abcxxxxx', 'abc', 'abc'));
  it('window at the end', () => check('xxxxxabc', 'abc', 'abc'));
  it('case-sensitive: "A" does not match "a"', () => check('aaaa', 'A', ''));
  it('case-sensitive mix', () => check('aAbBcC', 'ABC', 'AbBcC'));
  it('shrinks from the left past useless characters', () => check('xxaxxbxxc', 'abc', 'axxbxxc'));
  it('single-character t found once', () => check('abcdef', 'e', 'e'));

  it('random inputs: result is a covering substring of minimal length', () => {
    const rng = makeRng(76);
    const letters = [...'abcd'];
    const word = (n) => Array.from({ length: n }, () => rng.pick(letters)).join('');
    for (let tc = 0; tc < 300; tc++) {
      const s = word(rng.int(1, 14));
      const t = word(rng.int(1, 4));
      const actual = minWindow(s, t);
      const want = bruteLength(s, t);
      const ctx = `minWindow(${fmt(s)}, ${fmt(t)}) -> ${fmt(actual)}`;
      assert.equal(actual.length, want, `${ctx}: expected a window of length ${want}`);
      if (want > 0) {
        assert.ok(s.includes(actual), `${ctx}: result is not a substring of s`);
        assert.ok(covers(actual, t), `${ctx}: result does not cover t`);
      }
    }
  });

  it('large input: needle characters at both ends of a huge haystack', { timeout: 2000 }, () => {
    const n = 100000;
    const chars = Array.from({ length: n }, () => 'x');
    chars[10] = 'A';
    chars[n - 11] = 'B';
    const s = chars.join('');
    check(s, 'AB', s.slice(10, n - 10));
  });

  it('large input: unique tight window deep in the string', { timeout: 2000 }, () => {
    const n = 100000;
    const chars = Array.from({ length: n }, () => 'x');
    chars[50000] = 'A';
    chars[50001] = 'B';
    chars[50002] = 'C';
    chars[3] = 'A';
    chars[n - 3] = 'C';
    check(chars.join(''), 'ABC', 'ABC');
  });

  it('large input: many repeated requirements', { timeout: 2000 }, () => {
    const s = 'ab'.repeat(50000);
    const t = 'a'.repeat(20000) + 'b'.repeat(20000);
    // 20000 a-s and 20000 b-s alternate: shortest cover is 40000 characters
    const actual = minWindow(s, t);
    assert.equal(actual.length, 40000, `expected a window of length 40000 but got ${actual.length}`);
    assert.ok(covers(actual, t), 'result does not cover t');
  });
});
