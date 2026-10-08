import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { clone, fmt, makeRng } from '../../lib/testutil.js';
import { alienOrder } from './alien-dictionary.js';

/** Assert `order` uses exactly the letters of `words` once each and respects every adjacent-word rule. */
function assertValidOrder(words, order) {
  const ctx = `alienOrder(${fmt(words)}) returned ${fmt(order)}`;
  assert.strictEqual(typeof order, 'string', `${ctx}: expected a string`);
  const letters = new Set(words.join(''));
  assert.strictEqual(order.length, letters.size, `${ctx}: expected exactly ${letters.size} letters (each distinct letter once)`);
  assert.strictEqual(new Set(order).size, order.length, `${ctx}: repeated letters`);
  for (const ch of order) assert.ok(letters.has(ch), `${ctx}: "${ch}" does not appear in the words`);
  const rank = new Map([...order].map((ch, i) => [ch, i]));
  for (let i = 0; i + 1 < words.length; i++) {
    const a = words[i];
    const b = words[i + 1];
    let j = 0;
    while (j < a.length && j < b.length && a[j] === b[j]) j++;
    if (j < a.length && j < b.length) {
      assert.ok(
        rank.get(a[j]) < rank.get(b[j]),
        `${ctx}: "${a}" must come before "${b}" so "${a[j]}" must precede "${b[j]}"`,
      );
    }
  }
}

function checkValid(words) {
  assertValidOrder(words, alienOrder(clone(words)));
}

function checkImpossible(words) {
  const actual = alienOrder(clone(words));
  assert.strictEqual(actual, '', `alienOrder(${fmt(words)}) has no valid order; expected "" but got ${fmt(actual)}`);
}

describe('Alien Dictionary', () => {
  it('example 1', () => {
    checkValid(['wrt', 'wrf', 'er', 'ett', 'rftt']);
  });

  it('example 1 has exactly the known answer "wertf"', () => {
    assert.strictEqual(alienOrder(['wrt', 'wrf', 'er', 'ett', 'rftt']), 'wertf');
  });

  it('example 2: two letters', () => {
    assert.strictEqual(alienOrder(['z', 'x']), 'zx');
  });

  it('example 3: contradiction (cycle) returns ""', () => {
    checkImpossible(['z', 'x', 'z']);
  });

  it('prefix listed after the longer word is invalid', () => {
    checkImpossible(['abc', 'ab']);
  });

  it('prefix listed before the longer word is fine', () => {
    checkValid(['ab', 'abc']);
  });

  it('single word: its letters in any order', () => {
    checkValid(['abc']);
  });

  it('single word with repeated letters', () => {
    checkValid(['zzyx']);
  });

  it('single one-letter word', () => {
    assert.strictEqual(alienOrder(['z']), 'z');
  });

  it('identical words add no constraints', () => {
    assert.strictEqual(alienOrder(['z', 'z']), 'z');
  });

  it('letters that only appear unconstrained must still be included', () => {
    checkValid(['ab', 'cd']);
  });

  it('longer cycle across several pairs returns ""', () => {
    checkImpossible(['a', 'b', 'c', 'a']);
  });

  it('two-letter direct contradiction', () => {
    checkImpossible(['ab', 'ba', 'ab']);
  });

  it('chain of constraints from first differing letters only', () => {
    checkValid(['baa', 'abcd', 'abca', 'cab', 'cad']);
  });

  it('invalid prefix hidden later in the list', () => {
    checkImpossible(['x', 'xy', 'xyz', 'xy']);
  });

  it('large dictionary sorted by a random 26-letter alphabet (3000 words)', { timeout: 2000 }, () => {
    const rng = makeRng(269);
    const alphabet = rng.shuffle('abcdefghijklmnopqrstuvwxyz'.split(''));
    const rank = new Map(alphabet.map((ch, i) => [ch, i]));
    const cmp = (a, b) => {
      let i = 0;
      while (i < a.length && i < b.length && a[i] === b[i]) i++;
      if (i === a.length || i === b.length) return a.length - b.length;
      return rank.get(a[i]) - rank.get(b[i]);
    };
    const set = new Set();
    while (set.size < 3000) {
      const len = rng.int(1, 6);
      let w = '';
      for (let i = 0; i < len; i++) w += rng.pick(alphabet);
      set.add(w);
    }
    const words = [...set].sort(cmp);
    checkValid(words);
  });
});
