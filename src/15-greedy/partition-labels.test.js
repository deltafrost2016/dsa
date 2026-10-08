import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fmt, makeRng } from '../../lib/testutil.js';
import { partitionLabels } from './partition-labels.js';

const check = (s, expected) =>
  assert.deepStrictEqual(partitionLabels(s), expected, `partitionLabels(${fmt(s)}): expected ${fmt(expected)}`);

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

describe('Partition Labels', () => {
  it('example 1 -> [9,7,8]', () => check('ababcbacadefegdehijhklij', [9, 7, 8]));
  it('example 2 -> [10]', () => check('eccbbbbdec', [10]));
  it('single character -> [1]', () => check('a', [1]));
  it('all distinct -> all ones', () => check('abc', [1, 1, 1]));
  it('one repeated letter -> one part', () => check('aaa', [3]));
  it('"abab" -> [4]', () => check('abab', [4]));
  it('"abcabc" -> [6]', () => check('abcabc', [6]));
  it('"ababcc" -> [4,2]', () => check('ababcc', [4, 2]));
  it('"caedbdedda" -> [1,9]', () => check('caedbdedda', [1, 9]));
  it('"qiejxqfnqceocmy" -> [13,1,1]', () => check('qiejxqfnqceocmy', [13, 1, 1]));
  it('"abcadz" -> [4,1,1]', () => check('abcadz', [4, 1, 1]));
  it('part sizes sum to the string length', () => {
    const s = 'ababcbacadefegdehijhklij';
    const parts = partitionLabels(s);
    assert.equal(parts.reduce((a, b) => a + b, 0), s.length, fmt(parts));
  });
  it('"a" x 500 -> [500]', () => check('a'.repeat(500), [500]));
  it('"a" x 250 then "b" x 250 -> [250,250]', () => check('a'.repeat(250) + 'b'.repeat(250), [250, 250]));
  it('alphabet repeated 19 times (494 chars) -> a single part', () => check(ALPHABET.repeat(19), [494]));
  it('each letter in its own run of 19 -> 26 parts of 19', () => {
    const s = [...ALPHABET].map((c) => c.repeat(19)).join('');
    check(s, Array(26).fill(19));
  });
  it('first letter reappears at the very end -> one part', () => {
    const s = 'a' + 'bcdefghijklmnopqrstuvwxyz'.repeat(19) + 'a';
    check(s, [s.length]);
  });
  it('seeded random 500 chars over 3 letters -> one part', () => {
    const rng = makeRng(763);
    const s = Array.from({ length: 500 }, () => 'abc'[rng.int(0, 2)]).join('');
    check(s, [500]);
  });
});
