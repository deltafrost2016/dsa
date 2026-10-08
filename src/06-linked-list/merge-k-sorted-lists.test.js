import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mergeKLists } from './merge-k-sorted-lists.js';
import { buildList, listToArray } from '../../lib/ds.js';
import { fmt, makeRng, randomArray } from '../../lib/testutil.js';

const asc = (x, y) => x - y;

function check(arrays) {
  const expected = arrays.flat().sort(asc);
  const actual = listToArray(mergeKLists(arrays.map((a) => buildList(a))));
  assert.deepStrictEqual(actual, expected, `mergeKLists(${fmt(arrays)}): expected ${fmt(expected)}, got ${fmt(actual)}`);
}

describe('Merge k Sorted Lists (#23)', () => {
  it('example 1', () => check([[1, 4, 5], [1, 3, 4], [2, 6]]));
  it('example 2: no lists', () => {
    const actual = mergeKLists([]);
    assert.equal(actual, null, `mergeKLists([]): expected null, got ${fmt(actual)}`);
  });
  it('example 3: one empty list', () => {
    const actual = mergeKLists([null]);
    assert.equal(actual, null, `mergeKLists([null]): expected null, got ${fmt(actual)}`);
  });
  it('single list', () => check([[1, 2, 3]]));
  it('all lists empty', () => {
    const actual = mergeKLists([null, null, null]);
    assert.equal(actual, null, `mergeKLists([null, null, null]): expected null, got ${fmt(actual)}`);
  });
  it('empty lists mixed with non-empty ones', () => check([[], [2, 5], [], [1], []]));
  it('two lists', () => check([[1, 3, 5], [2, 4, 6]]));
  it('lists that do not overlap', () => check([[7, 8, 9], [1, 2, 3], [4, 5, 6]]));
  it('all equal values', () => check([[3, 3], [3], [3, 3, 3]]));
  it('negative values', () => check([[-10000, -5, 0], [-9999, 10000], [-6, -5]]));
  it('lists of single nodes', () => check([[5], [1], [4], [2], [3]]));
  it('one long list and several short ones', () => check([[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [0], [11]]));
  it('odd and even number of lists', () => {
    check([[1], [2], [3]]);
    check([[1], [2], [3], [4]]);
    check([[2], [1], [4], [3], [0]]);
  });
  it('random small inputs agree with sort', () => {
    const rng = makeRng(23);
    for (let t = 0; t < 200; t++) {
      const k = rng.int(0, 8);
      const arrays = Array.from({ length: k }, () => randomArray(rng, rng.int(0, 6), -20, 20).sort(asc));
      check(arrays);
    }
  });

  it('large input: 10^4 lists x 10 nodes (merging one-by-one is too slow)', { timeout: 2000 }, () => {
    const rng = makeRng(230);
    const arrays = Array.from({ length: 10_000 }, () => randomArray(rng, 10, -10_000, 10_000).sort(asc));
    check(arrays);
  });

  it('large input: 100 lists x 1000 nodes', { timeout: 2000 }, () => {
    const rng = makeRng(2300);
    const arrays = Array.from({ length: 100 }, () => randomArray(rng, 1000, -10_000, 10_000).sort(asc));
    check(arrays);
  });
});
