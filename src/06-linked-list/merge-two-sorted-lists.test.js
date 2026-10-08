import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mergeTwoLists } from './merge-two-sorted-lists.js';
import { buildList, listToArray } from '../../lib/ds.js';
import { fmt, makeRng, randomArray } from '../../lib/testutil.js';

function check(a, b, expected) {
  const actual = listToArray(mergeTwoLists(buildList(a), buildList(b)));
  assert.deepStrictEqual(actual, expected, `mergeTwoLists(${fmt(a)}, ${fmt(b)}): expected ${fmt(expected)}, got ${fmt(actual)}`);
}

const asc = (x, y) => x - y;

describe('Merge Two Sorted Lists (#21)', () => {
  it('example 1', () => check([1, 2, 4], [1, 3, 4], [1, 1, 2, 3, 4, 4]));
  it('example 2: both empty', () => {
    const actual = mergeTwoLists(null, null);
    assert.equal(actual, null, `mergeTwoLists(null, null): expected null, got ${fmt(actual)}`);
  });
  it('example 3: one empty (right)', () => check([], [0], [0]));
  it('one empty (left)', () => check([5, 6], [], [5, 6]));
  it('all of list1 before list2', () => check([1, 2, 3], [4, 5, 6], [1, 2, 3, 4, 5, 6]));
  it('all of list2 before list1', () => check([4, 5, 6], [1, 2, 3], [1, 2, 3, 4, 5, 6]));
  it('interleaved', () => check([1, 3, 5, 7], [2, 4, 6, 8], [1, 2, 3, 4, 5, 6, 7, 8]));
  it('different lengths', () => check([1], [0, 2, 3, 4, 5], [0, 1, 2, 3, 4, 5]));
  it('all equal values', () => check([2, 2, 2], [2, 2], [2, 2, 2, 2, 2]));
  it('negative values', () => check([-100, -50, 0], [-75, -25, 100], [-100, -75, -50, -25, 0, 100]));
  it('single nodes', () => check([2], [1], [1, 2]));
  it('result is properly terminated (no cycle)', () => {
    const merged = mergeTwoLists(buildList([1, 4]), buildList([2, 3]));
    assert.deepStrictEqual(listToArray(merged), [1, 2, 3, 4]);
  });
  it('random small lists agree with sort', () => {
    const rng = makeRng(21);
    for (let t = 0; t < 300; t++) {
      const a = randomArray(rng, rng.int(0, 15), -100, 100).sort(asc);
      const b = randomArray(rng, rng.int(0, 15), -100, 100).sort(asc);
      check(a, b, [...a, ...b].sort(asc));
    }
  });

  it('large lists (2 x 2000 nodes, wide value range)', { timeout: 2000 }, () => {
    const rng = makeRng(2100);
    for (let t = 0; t < 20; t++) {
      const a = randomArray(rng, 2000, -1_000_000, 1_000_000).sort(asc);
      const b = randomArray(rng, 2000, -1_000_000, 1_000_000).sort(asc);
      check(a, b, [...a, ...b].sort(asc));
    }
  });
});
