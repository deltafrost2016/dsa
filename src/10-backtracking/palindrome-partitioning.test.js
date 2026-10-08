import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fmt, sameMembers, makeRng } from '../../lib/testutil.js';
import { partition } from './palindrome-partitioning.js';

// Inner order matters (pieces are listed left to right), so no sortInner.
const check = (s, expected) => {
  const actual = partition(s);
  sameMembers(actual, expected, {
    message: `partition("${s}") expected ${fmt(expected)}`,
  });
};

const isPal = (t) => t === [...t].reverse().join('');

/** Independent oracle: try every subset of the n-1 cut positions. */
const oracle = (s) => {
  const out = [];
  const n = s.length;
  for (let mask = 0; mask < 1 << (n - 1); mask++) {
    const pieces = [];
    let start = 0;
    for (let i = 0; i < n - 1; i++) {
      if (mask & (1 << i)) {
        pieces.push(s.slice(start, i + 1));
        start = i + 1;
      }
    }
    pieces.push(s.slice(start));
    if (pieces.every(isPal)) out.push(pieces);
  }
  return out;
};

describe('Palindrome Partitioning', () => {
  it('official example 1: "aab"', () => check('aab', [['a', 'a', 'b'], ['aa', 'b']]));
  it('official example 2: "a"', () => check('a', [['a']]));
  it('two different letters', () => check('ab', [['a', 'b']]));
  it('whole string is a palindrome: "aba"', () => check('aba', [['a', 'b', 'a'], ['aba']]));
  it('"aaa" has 4 partitions', () =>
    check('aaa', [['a', 'a', 'a'], ['a', 'aa'], ['aa', 'a'], ['aaa']]));
  it('no multi-letter palindromes: "abc"', () => check('abc', [['a', 'b', 'c']]));
  it('even-length palindrome: "abba"', () =>
    check('abba', [['a', 'b', 'b', 'a'], ['a', 'bb', 'a'], ['abba']]));
  it('order of pieces is left to right: "aabb"', () =>
    check('aabb', [['a', 'a', 'b', 'b'], ['aa', 'b', 'b'], ['a', 'a', 'bb'], ['aa', 'bb']]));
  it('every partition concatenates back to the input', () => {
    const s = 'racecarannakayak';
    const actual = partition(s.slice(0, 11));
    for (const p of actual) {
      assert.equal(p.join(''), s.slice(0, 11), `pieces ${fmt(p)} do not rebuild the string`);
      assert.ok(p.every(isPal), `non-palindrome piece in ${fmt(p)}`);
    }
  });
  it('"racecar" matches the oracle', () => check('racecar', oracle('racecar')));
  it('"abacaba" matches the oracle', () => check('abacaba', oracle('abacaba')));

  it('16 identical letters -> 2^15 partitions', { timeout: 2000 }, () => {
    const s = 'a'.repeat(16);
    const actual = partition(s);
    assert.equal(actual.length, 32768, `expected 2^15 partitions, got ${actual.length}`);
    check(s, oracle(s));
  });

  it('random strings over {a,b} of length 16 match the oracle', { timeout: 2000 }, () => {
    const rng = makeRng(131);
    for (let t = 0; t < 8; t++) {
      const s = Array.from({ length: 16 }, () => (rng.next() < 0.75 ? 'a' : 'b')).join('');
      check(s, oracle(s));
    }
  });

  it('long random-ish string with few palindromes is quick', { timeout: 2000 }, () => {
    const s = 'abcdefghijklmnop';
    check(s, [s.split('')]);
  });
});
