import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { clone, fmt, makeRng, sameMembers } from '../../lib/testutil.js';
import { findWords } from './word-search-ii.js';

function check(board, words, expected) {
  const b = clone(board);
  const w = clone(words);
  const actual = findWords(b, w);
  sameMembers(actual, expected, { message: `board ${fmt(board)}, words ${fmt(words)}` });
  assert.equal(new Set(actual).size, actual.length, `result contains duplicates: ${fmt(actual)}`);
  assert.deepStrictEqual(b, board, 'board must be restored to its original contents');
}

describe('Word Search II', () => {
  const sample = [
    ['o', 'a', 'a', 'n'],
    ['e', 't', 'a', 'e'],
    ['i', 'h', 'k', 'r'],
    ['i', 'f', 'l', 'v'],
  ];
  it('example 1: oath, pea, eat, rain -> eat, oath', () => check(sample, ['oath', 'pea', 'eat', 'rain'], ['eat', 'oath']));
  it('example 2: abcb on [[a,b],[c,d]] -> []', () =>
    check(
      [
        ['a', 'b'],
        ['c', 'd'],
      ],
      ['abcb'],
      [],
    ));
  it('1x1 board, word present', () => check([['a']], ['a'], ['a']));
  it('1x1 board, word absent', () => check([['a']], ['b'], []));
  it('1x1 board, longer word cannot reuse the cell', () => check([['a']], ['aa'], []));
  it('a cell cannot be reused within a word', () => check([['a', 'a']], ['aaa'], []));
  it('adjacent equal letters can form a two-letter word', () => check([['a', 'a']], ['aa'], ['aa']));
  it('words are traced through horizontal and vertical neighbours only (no diagonals)', () =>
    check(
      [
        ['a', 'b'],
        ['c', 'd'],
      ],
      ['ad', 'bc', 'ab', 'ac', 'bd', 'cd', 'dc'],
      ['ab', 'ac', 'bd', 'cd', 'dc'],
    ));
  it('words that are prefixes of each other are all found', () => check(sample, ['oa', 'oat', 'oath', 'oathx'], ['oa', 'oat', 'oath']));
  it('a word reachable by several paths is returned once', () =>
    check(
      [
        ['a', 'b'],
        ['b', 'a'],
      ],
      ['ab', 'ba'],
      ['ab', 'ba'],
    ));
  it('snake path through the whole board', () =>
    check(
      [
        ['a', 'b', 'c'],
        ['f', 'e', 'd'],
        ['g', 'h', 'i'],
      ],
      ['abcdefghi', 'abcdihgfe', 'abcdefghij', 'aei'],
      ['abcdefghi', 'abcdihgfe'],
    ));
  it('single row and single column boards', () => {
    check([['a', 'b', 'c', 'd']], ['abcd', 'dcba', 'bd', 'bc'], ['abcd', 'dcba', 'bc']);
    check([['a'], ['b'], ['c']], ['abc', 'cba', 'ac'], ['abc', 'cba']);
  });
  it('none of the words are present', () => check(sample, ['xyz', 'oatk', 'zzz'], []));
  it('word using every cell of a uniform board is only possible up to the cell count', () =>
    check(
      [
        ['z', 'z'],
        ['z', 'z'],
      ],
      ['zzzz', 'zzzzz', 'zzz'],
      ['zzzz', 'zzz'],
    ));
  it('does not mutate the words array contents', () => {
    const words = ['oath', 'eat'];
    findWords(clone(sample), words);
    assert.deepStrictEqual(words, ['oath', 'eat']);
  });
  it('large 12x12 board with 3000 words (half real walks, half almost-matches)', { timeout: 2000 }, () => {
    const rng = makeRng(212);
    const N = 12;
    const board = Array.from({ length: N }, () => Array.from({ length: N }, () => 'abcd'[rng.int(0, 3)]));
    const real = new Set();
    // random self-avoiding walks
    for (let attempts = 0; real.size < 1500 && attempts < 20000; attempts++) {
      const len = rng.int(6, 10);
      let r = rng.int(0, N - 1);
      let c = rng.int(0, N - 1);
      const seen = new Set([r * N + c]);
      let s = board[r][c];
      while (s.length < len) {
        const options = [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]].filter(
          ([a, b]) => a >= 0 && a < N && b >= 0 && b < N && !seen.has(a * N + b),
        );
        if (!options.length) break;
        [r, c] = rng.pick(options);
        seen.add(r * N + c);
        s += board[r][c];
      }
      if (s.length === len) real.add(s);
    }
    assert.ok(real.size >= 1000, `test generator produced only ${real.size} real words`);
    // 'z' appears nowhere on the board, so replacing the last letter guarantees a miss.
    const fake = new Set([...real].slice(0, 1500).map((w) => `${w.slice(0, -1)}z`));
    const words = rng.shuffle([...real, ...fake]);
    check(board, words, [...real]);
  });
});
