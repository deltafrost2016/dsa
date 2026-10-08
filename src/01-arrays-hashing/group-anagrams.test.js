import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { groupAnagrams } from './group-anagrams.js';
import { clone, sameMembers, makeRng, fmt } from '../../lib/testutil.js';

// Groups, and words inside each group, may come back in any order.
const check = (strs, expected) => {
  const actual = groupAnagrams(clone(strs));
  sameMembers(actual, expected, { sortInner: true, message: `groupAnagrams(${fmt(strs)})` });
};

describe('Group Anagrams', () => {
  it('example 1', () =>
    check(['eat', 'tea', 'tan', 'ate', 'nat', 'bat'], [['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']]));
  it('example 2: single empty string', () => check([''], [['']]));
  it('example 3: single letter', () => check(['a'], [['a']]));
  it('several empty strings group together', () => check(['', '', ''], [['', '', '']]));
  it('empty string alongside words', () => check(['', 'b', ''], [['', ''], ['b']]));
  it('no anagrams at all', () => check(['abc', 'def', 'ghi'], [['abc'], ['def'], ['ghi']]));
  it('all words are anagrams of each other', () => check(['abc', 'bca', 'cab', 'cba'], [['abc', 'bca', 'cab', 'cba']]));
  it('duplicate words are kept', () => check(['ab', 'ba', 'ab'], [['ab', 'ab', 'ba']]));
  it('same letters but different counts are not grouped', () => check(['aab', 'abb', 'baa'], [['aab', 'baa'], ['abb']]));
  it('different lengths are never grouped', () => check(['a', 'aa', 'aaa'], [['a'], ['aa'], ['aaa']]));
  it('repeated letters', () => check(['aaaa', 'aaaa', 'aaab', 'baaa'], [['aaaa', 'aaaa'], ['aaab', 'baaa']]));

  it('large input (10k words, 100 chars max) - groups match a reference grouping', { timeout: 2000 }, () => {
    const rng = makeRng(49);
    const strs = [];
    for (let i = 0; i < 10000; i++) {
      const len = rng.int(0, 100);
      const base = Array.from({ length: len }, () => String.fromCharCode(97 + rng.int(0, 25)));
      // 1 in 3 words is a shuffled copy of an earlier word, so real groups exist.
      if (strs.length && rng.int(0, 2) === 0) strs.push(rng.shuffle([...rng.pick(strs)]).join(''));
      else strs.push(base.join(''));
    }
    const ref = new Map();
    for (const w of strs) {
      const k = [...w].sort().join('');
      if (!ref.has(k)) ref.set(k, []);
      ref.get(k).push(w);
    }
    const actual = groupAnagrams(clone(strs));
    assert.equal(actual.length, ref.size, `expected ${ref.size} groups, got ${actual.length}`);
    sameMembers(actual, [...ref.values()], { sortInner: true, message: 'large groupAnagrams' });
  });
});
