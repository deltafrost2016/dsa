import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ladderLength } from './word-ladder.js';
import { clone, fmt, makeRng } from '../../lib/testutil.js';

function check(begin, end, list, expected) {
  const actual = ladderLength(begin, end, clone(list));
  assert.equal(
    actual,
    expected,
    `ladderLength(${fmt(begin)}, ${fmt(end)}, ${fmt(list)})\n  expected: ${expected}\n  actual:   ${fmt(actual)}`,
  );
}

describe('Word Ladder', () => {
  it('example 1: hit -> cog takes 5 words', () => {
    check('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog'], 5);
  });
  it('example 2: endWord missing from the list', () => {
    check('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log'], 0);
  });
  it('one step away', () => check('a', 'c', ['a', 'b', 'c'], 2));
  it('begin word may be absent from the list', () => check('hot', 'dot', ['dot'], 2));
  it('begin word present in the list does not change the answer', () => {
    check('hit', 'hot', ['hit', 'hot'], 2);
  });
  it('unreachable end word', () => check('abc', 'xyz', ['abd', 'xyz'], 0));
  it('empty word list', () => check('abc', 'abd', [], 0));
  it('shortest path chosen over a longer one', () => {
    check('hit', 'cog', ['hot', 'cot', 'cog', 'dot', 'dog', 'lot', 'log'], 4);
  });
  it('two-letter words', () => {
    check('aa', 'cc', ['ab', 'bb', 'bc', 'cc', 'ac'], 3);
  });
  it('single letter words, direct hop', () => check('a', 'b', ['b'], 2));
  it('words that differ in two letters are not neighbours', () => check('ab', 'cd', ['cd'], 0));
  it('path requires going through a branching hub', () => {
    check('red', 'tax', ['ted', 'tex', 'red', 'tax', 'tad', 'den', 'rex', 'pee'], 4);
  });
  it('dead-end branches do not break the search', () => {
    check('lost', 'cost', ['most', 'fist', 'lost', 'cost', 'fish'], 2);
  });
  it('longer chain', () => {
    check('qa', 'sq', ['si', 'go', 'se', 'cm', 'so', 'ph', 'mt', 'db', 'mb', 'sb', 'kr', 'ln', 'tm', 'le', 'av', 'sm', 'ar', 'ci', 'ca', 'br', 'ti', 'ba', 'to', 'ra', 'fa', 'yo', 'ow', 'sn', 'ya', 'cr', 'po', 'fe', 'ho', 'ma', 're', 'or', 'rn', 'au', 'ur', 'rh', 'sr', 'tc', 'lt', 'lo', 'as', 'fr', 'nb', 'yb', 'if', 'pb', 'ge', 'th', 'pm', 'rb', 'sh', 'co', 'ga', 'li', 'ha', 'hz', 'no', 'bi', 'di', 'hi', 'qa', 'pi', 'os', 'uh', 'wm', 'an', 'me', 'mo', 'na', 'la', 'st', 'er', 'sc', 'ne', 'mn', 'mi', 'am', 'ex', 'pt', 'io', 'be', 'fm', 'ta', 'tb', 'ni', 'mr', 'pa', 'he', 'lr', 'sq', 'ye'], 5);
  });

  it('complete 2-letter lattice over a..j: two hops', { timeout: 2000 }, () => {
    const letters = 'abcdefghij'.split('');
    const list = [];
    for (const x of letters) for (const y of letters) list.push(x + y);
    check('aa', 'jj', list, 3);
  });

  it('large generated word list with a known shortest chain', { timeout: 2000 }, () => {
    const rng = makeRng(127);
    const L = 8;
    const alpha = 'abcdefghijklmnopqrstuvwxyz';
    // Chain: change position i from 'a' to 'b' one at a time -> aaaaaaaa, baaaaaaa, bbaaaaaa, ... bbbbbbbb
    const chain = [];
    let cur = 'a'.repeat(L);
    chain.push(cur);
    for (let i = 0; i < L; i++) {
      cur = cur.slice(0, i) + 'b' + cur.slice(i + 1);
      chain.push(cur);
    }
    // Noise: words with many random letters from 'm'..'z' (never adjacent to chain words except by luck, filtered)
    const words = new Set(chain.slice(1));
    const chainSet = new Set(chain);
    while (words.size < 4000) {
      let w = '';
      for (let i = 0; i < L; i++) w += alpha[rng.int(12, 25)]; // 'm'..'z'
      if (!chainSet.has(w)) words.add(w);
    }
    const list = rng.shuffle([...words]);
    check(chain[0], chain[L], list, L + 1);
  });

  it('large dense list: all words over {a,b,c} of length 7 (2187 words)', { timeout: 2000 }, () => {
    const L = 7;
    const list = [];
    const total = 3 ** L;
    for (let k = 0; k < total; k++) {
      let w = '';
      let x = k;
      for (let i = 0; i < L; i++) {
        w += 'abc'[x % 3];
        x = Math.floor(x / 3);
      }
      list.push(w);
    }
    // aaaaaaa -> ccccccc: each position changes once => 7 hops => 8 words
    check('aaaaaaa', 'ccccccc', list, 8);
  });

  it('large unreachable case: end word isolated among thousands of words', { timeout: 2000 }, () => {
    const rng = makeRng(1270);
    const L = 6;
    const words = new Set();
    while (words.size < 4000) {
      let w = '';
      for (let i = 0; i < L; i++) w += 'abcdefghijklm'[rng.int(0, 12)];
      words.add(w);
    }
    const list = [...words, 'zzzzzz'];
    check('aaaaaa', 'zzzzzz', list, 0);
  });
});
