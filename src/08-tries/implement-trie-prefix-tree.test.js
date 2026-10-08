import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { makeRng, runOps } from '../../lib/testutil.js';
import { Trie } from './implement-trie-prefix-tree.js';

describe('Implement Trie (Prefix Tree)', () => {
  it('example: insert apple, search apple/app, startsWith app, insert app, search app', () => {
    runOps(
      () => new Trie(),
      ['Trie', 'insert', 'search', 'search', 'startsWith', 'insert', 'search'],
      [[], ['apple'], ['apple'], ['app'], ['app'], ['app'], ['app']],
      [null, null, true, false, true, null, true],
    );
  });
  it('searching an empty trie is false for search and startsWith', () => {
    const t = new Trie();
    assert.equal(t.search('a'), false);
    assert.equal(t.startsWith('a'), false);
  });
  it('single character words', () => {
    runOps(
      () => new Trie(),
      ['Trie', 'insert', 'search', 'startsWith', 'search', 'startsWith'],
      [[], ['a'], ['a'], ['a'], ['b'], ['b']],
      [null, null, true, true, false, false],
    );
  });
  it('a stored prefix is not a word until it is inserted', () => {
    const t = new Trie();
    t.insert('apple');
    assert.equal(t.search('appl'), false);
    assert.equal(t.startsWith('appl'), true);
    assert.equal(t.search('applee'), false);
    assert.equal(t.startsWith('applee'), false);
  });
  it('a word that is a prefix of another is found independently', () => {
    const t = new Trie();
    t.insert('apple');
    t.insert('app');
    assert.equal(t.search('app'), true);
    assert.equal(t.search('apple'), true);
    assert.equal(t.search('ap'), false);
  });
  it('inserting the same word twice is harmless', () => {
    const t = new Trie();
    t.insert('dup');
    t.insert('dup');
    assert.equal(t.search('dup'), true);
    assert.equal(t.search('du'), false);
  });
  it('words sharing a prefix diverge correctly', () => {
    const t = new Trie();
    for (const w of ['car', 'card', 'care', 'cat']) t.insert(w);
    assert.deepStrictEqual(['car', 'card', 'care', 'cat', 'ca', 'c', 'cab', 'cards'].map((w) => t.search(w)), [
      true, true, true, true, false, false, false, false,
    ]);
    assert.deepStrictEqual(['ca', 'car', 'cat', 'cab', 'd', 'cards'].map((w) => t.startsWith(w)), [true, true, true, false, false, false]);
  });
  it('startsWith on the full word is true; search on a longer string is false', () => {
    const t = new Trie();
    t.insert('hello');
    assert.equal(t.startsWith('hello'), true);
    assert.equal(t.search('hello!'), false);
  });
  it('two Trie instances are independent', () => {
    const a = new Trie();
    const b = new Trie();
    a.insert('onlya');
    assert.equal(a.search('onlya'), true);
    assert.equal(b.search('onlya'), false);
    assert.equal(b.startsWith('o'), false);
  });
  it('words with names like built-in properties (constructor, toString, proto-like)', () => {
    const t = new Trie();
    assert.equal(t.search('constructor'), false);
    assert.equal(t.startsWith('constructor'), false);
    t.insert('constructor');
    t.insert('tostring');
    assert.equal(t.search('constructor'), true);
    assert.equal(t.search('constructo'), false);
    assert.equal(t.startsWith('constructo'), true);
    assert.equal(t.search('tostring'), true);
  });
  it('max-length (2000 chars) words', () => {
    const t = new Trie();
    const w = 'ab'.repeat(1000);
    t.insert(w);
    assert.equal(t.search(w), true);
    assert.equal(t.startsWith(w.slice(0, 1999)), true);
    assert.equal(t.search(w.slice(0, 1999)), false);
    assert.equal(t.search(`${w}a`), false);
  });
  it('random operations match a Set-based oracle (30000 calls)', { timeout: 2000 }, () => {
    const rng = makeRng(208);
    const alpha = 'abc';
    const randWord = (max) => Array.from({ length: rng.int(1, max) }, () => alpha[rng.int(0, 2)]).join('');
    const words = new Set();
    const prefixes = new Set();
    const t = new Trie();
    for (let i = 0; i < 10000; i++) {
      const w = randWord(12);
      t.insert(w);
      words.add(w);
      for (let k = 1; k <= w.length; k++) prefixes.add(w.slice(0, k));
    }
    for (let i = 0; i < 10000; i++) {
      const q = randWord(14);
      assert.equal(t.search(q), words.has(q), `search(${q})`);
      assert.equal(t.startsWith(q), prefixes.has(q), `startsWith(${q})`);
    }
  });
});
