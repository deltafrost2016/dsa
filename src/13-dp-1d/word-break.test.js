import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { clone, fmt } from '../../lib/testutil.js';
import { wordBreak } from './word-break.js';

function check(s, wordDict, expected) {
  const actual = wordBreak(s, clone(wordDict));
  assert.strictEqual(
    actual,
    expected,
    `wordBreak(${fmt(s)}, ${fmt(wordDict)})\n  expected: ${expected}\n  actual:   ${fmt(actual)}`,
  );
}

describe('Word Break', () => {
  it('example 1: "leetcode"', () => check('leetcode', ['leet', 'code'], true));
  it('example 2: words can be reused', () => check('applepenapple', ['apple', 'pen'], true));
  it('example 3: no valid split', () => check('catsandog', ['cats', 'dog', 'sand', 'and', 'cat'], false));
  it('single letter word', () => check('a', ['a'], true));
  it('single letter not in dictionary', () => check('a', ['b'], false));
  it('only a prefix can be formed', () => check('ab', ['a'], false));
  it('dictionary word longer than the string', () => check('a', ['aa'], false));
  it('7 = 4 + 3 using repeated words', () => check('aaaaaaa', ['aaaa', 'aaa'], true));
  it('overlapping choices need backtracking', () => check('cars', ['car', 'ca', 'rs'], true));
  it('greedy longest-match fails', () => check('abcd', ['a', 'abc', 'b', 'cd'], true));
  it('greedy shortest-match fails', () => check('aaab', ['a', 'aa', 'aaab'], true));
  it('the whole string is one word', () => check('hello', ['hello'], true));
  it('a gap in the middle cannot be covered', () => check('abxcd', ['ab', 'cd'], false));
  it('letters never seen in the dictionary', () => check('zzz', ['a', 'b'], false));
  it('adversarial false case: 299 a\'s then b (exponential without memoization)', { timeout: 2000 }, () => {
    const dict = Array.from({ length: 10 }, (_, i) => 'a'.repeat(i + 1));
    check('a'.repeat(299) + 'b', dict, false);
  });
  it('adversarial false case: reachable prefix of 299 a\'s but a trailing c', { timeout: 2000 }, () => {
    check('a'.repeat(299) + 'c', ['aa', 'aaaaa', 'aaaaaaa'], false);
  });
  it('long true case: 300 a\'s from mixed lengths', { timeout: 2000 }, () => {
    check('a'.repeat(300), ['a'.repeat(7), 'a'.repeat(11), 'a'.repeat(13)], true);
  });
});
