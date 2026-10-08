import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { makeRng, runOps } from '../../lib/testutil.js';
import { WordDictionary } from './design-add-and-search-words-data-structure.js';

function dictWith(words) {
  const d = new WordDictionary();
  for (const w of words) d.addWord(w);
  return d;
}

function oracleSearch(byLen, pattern) {
  for (const w of byLen.get(pattern.length) ?? []) {
    let ok = true;
    for (let i = 0; i < w.length; i++) {
      if (pattern[i] !== '.' && pattern[i] !== w[i]) {
        ok = false;
        break;
      }
    }
    if (ok) return true;
  }
  return false;
}

describe('Design Add and Search Words Data Structure', () => {
  it('example: bad, dad, mad then pad / bad / .ad / b..', () => {
    runOps(
      () => new WordDictionary(),
      ['WordDictionary', 'addWord', 'addWord', 'addWord', 'search', 'search', 'search', 'search'],
      [[], ['bad'], ['dad'], ['mad'], ['pad'], ['bad'], ['.ad'], ['b..']],
      [null, null, null, null, false, true, true, true],
    );
  });
  it('searching an empty dictionary is always false, even with dots', () => {
    const d = new WordDictionary();
    assert.equal(d.search('a'), false);
    assert.equal(d.search('.'), false);
    assert.equal(d.search('...'), false);
  });
  it('exact match without dots', () => {
    const d = dictWith(['hello']);
    assert.equal(d.search('hello'), true);
    assert.equal(d.search('hell'), false);
    assert.equal(d.search('helloo'), false);
    assert.equal(d.search('jello'), false);
  });
  it('a pure-dot pattern matches only words of the same length', () => {
    const d = dictWith(['a', 'bc', 'def']);
    assert.equal(d.search('.'), true);
    assert.equal(d.search('..'), true);
    assert.equal(d.search('...'), true);
    assert.equal(d.search('....'), false);
  });
  it('dot at the start, middle and end', () => {
    const d = dictWith(['cat']);
    assert.equal(d.search('.at'), true);
    assert.equal(d.search('c.t'), true);
    assert.equal(d.search('ca.'), true);
    assert.equal(d.search('.a.'), true);
    assert.equal(d.search('c.x'), false);
    assert.equal(d.search('x..'), false);
  });
  it('a stored word that is only a prefix of the pattern/word does not match', () => {
    const d = dictWith(['apple']);
    assert.equal(d.search('app'), false);
    assert.equal(d.search('app..'), true);
    assert.equal(d.search('app.'), false);
    assert.equal(d.search('....'), false);
  });
  it('both a word and its extension are stored', () => {
    const d = dictWith(['a', 'ab', 'abc']);
    assert.equal(d.search('a'), true);
    assert.equal(d.search('a.'), true);
    assert.equal(d.search('a..'), true);
    assert.equal(d.search('a...'), false);
    assert.equal(d.search('.b.'), true);
  });
  it('backtracking: first dot branch fails but a later one succeeds', () => {
    const d = dictWith(['abx', 'aby', 'acz']);
    assert.equal(d.search('a.z'), true);
    assert.equal(d.search('.cz'), true);
    assert.equal(d.search('a.w'), false);
  });
  it('duplicate addWord calls are harmless', () => {
    const d = dictWith(['same', 'same']);
    assert.equal(d.search('same'), true);
    assert.equal(d.search('s..e'), true);
    assert.equal(d.search('sam'), false);
  });
  it('two instances are independent', () => {
    const a = dictWith(['x']);
    const b = new WordDictionary();
    assert.equal(a.search('x'), true);
    assert.equal(b.search('x'), false);
  });
  it('25-character words', () => {
    const w = 'abcdefghijklmnopqrstuvwxy';
    const d = dictWith([w]);
    assert.equal(d.search(w), true);
    assert.equal(d.search(`${w.slice(0, 24)}.`), true);
    assert.equal(d.search(`.${w.slice(1)}`), true);
    assert.equal(d.search(`${w.slice(0, 24)}z`), false);
    assert.equal(d.search('.'.repeat(25)), true);
    assert.equal(d.search('.'.repeat(24)), false);
  });
  it('random words and patterns (up to 2 dots) match a brute-force oracle (10000 calls)', { timeout: 2000 }, () => {
    const rng = makeRng(211);
    const alpha = 'abc';
    const byLen = new Map();
    const d = new WordDictionary();
    for (let i = 0; i < 5000; i++) {
      const len = rng.int(1, 25);
      const w = Array.from({ length: len }, () => alpha[rng.int(0, 2)]).join('');
      d.addWord(w);
      if (!byLen.has(len)) byLen.set(len, []);
      byLen.get(len).push(w);
    }
    const lens = [...byLen.keys()];
    let hits = 0;
    for (let i = 0; i < 5000; i++) {
      // half the queries derive from a stored word (so many are real hits), half are random
      let chars;
      if (rng.int(0, 1) === 0) {
        const len = rng.pick(lens);
        chars = byLen.get(len)[rng.int(0, byLen.get(len).length - 1)].split('');
        if (rng.int(0, 2) === 0) chars[rng.int(0, chars.length - 1)] = alpha[rng.int(0, 2)];
      } else {
        chars = Array.from({ length: rng.int(1, 25) }, () => alpha[rng.int(0, 2)]);
      }
      const dots = rng.int(0, 2);
      for (let k = 0; k < dots; k++) chars[rng.int(0, chars.length - 1)] = '.';
      const q = chars.join('');
      const expected = oracleSearch(byLen, q);
      if (expected) hits++;
      assert.equal(d.search(q), expected, `search("${q}")`);
    }
    assert.ok(hits > 100, 'generator should produce plenty of hits');
  });
});
