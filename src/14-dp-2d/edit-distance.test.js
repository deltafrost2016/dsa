import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fmt, makeRng } from '../../lib/testutil.js';
import { minDistance } from './edit-distance.js';

const check = (a, b, expected) =>
  assert.equal(minDistance(a, b), expected, `minDistance(${fmt(a)}, ${fmt(b)}): expected ${expected}`);

describe('Edit Distance', () => {
  it('example 1: "horse" -> "ros" = 3', () => check('horse', 'ros', 3));
  it('example 2: "intention" -> "execution" = 5', () => check('intention', 'execution', 5));
  it('both empty -> 0', () => check('', '', 0));
  it('empty to non-empty -> length (inserts only)', () => check('', 'abc', 3));
  it('non-empty to empty -> length (deletes only)', () => check('abc', '', 3));
  it('identical strings -> 0', () => check('algorithm', 'algorithm', 0));
  it('single differing char -> 1', () => check('a', 'b', 1));
  it('"kitten" -> "sitting" = 3', () => check('kitten', 'sitting', 3));
  it('"sunday" -> "saturday" = 3', () => check('sunday', 'saturday', 3));
  it('"ab" -> "ba" = 2', () => check('ab', 'ba', 2));
  it('"abc" -> "yabd" = 2', () => check('abc', 'yabd', 2));
  it('is symmetric', () => {
    check('plasma', 'altruism', 6);
    check('altruism', 'plasma', 6);
  });
  it('prefix: "abc" -> "abcdef" = 3', () => check('abc', 'abcdef', 3));
  it('suffix: "def" -> "abcdef" = 3', () => check('def', 'abcdef', 3));
  it('no common characters, equal length -> length (all replaces)', () => check('aaaa', 'bbbb', 4));
  it('no common characters, different length -> longer length', () => check('aa', 'bbbbb', 5));
  it('500 a vs 500 b -> 500 (exponential recursion cannot finish)', () => {
    check('a'.repeat(500), 'b'.repeat(500), 500);
  }, { timeout: 2000 });
  it('500 a vs 250 a -> 250', () => check('a'.repeat(500), 'a'.repeat(250), 250), { timeout: 2000 });
  it('("ab")x250 vs ("ba")x250 -> 2', () => check('ab'.repeat(250), 'ba'.repeat(250), 2), { timeout: 2000 });
  it('500-char identical strings -> 0', () => {
    const s = 'abcde'.repeat(100);
    check(s, s, 0);
  }, { timeout: 2000 });
  it('seeded random 500 vs 500 over 3 letters', () => {
    const rng = makeRng(72);
    const gen = (n) => Array.from({ length: n }, () => 'abc'[rng.int(0, 2)]).join('');
    check(gen(500), gen(500), 229);
  }, { timeout: 2000 });
});
