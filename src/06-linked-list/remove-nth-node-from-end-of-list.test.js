import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { removeNthFromEnd } from './remove-nth-node-from-end-of-list.js';
import { buildList, listToArray } from '../../lib/ds.js';
import { fmt, makeRng, randomArray } from '../../lib/testutil.js';

function check(arr, n, expected) {
  const actual = listToArray(removeNthFromEnd(buildList(arr), n));
  assert.deepStrictEqual(actual, expected, `removeNthFromEnd(${fmt(arr)}, ${n}): expected ${fmt(expected)}, got ${fmt(actual)}`);
}

describe('Remove Nth Node From End of List (#19)', () => {
  it('example 1', () => check([1, 2, 3, 4, 5], 2, [1, 2, 3, 5]));
  it('example 2: single node removed -> empty list', () => {
    const actual = removeNthFromEnd(buildList([1]), 1);
    assert.equal(actual, null, `removeNthFromEnd([1], 1): expected null, got ${fmt(actual)}`);
  });
  it('example 3: remove the last of two', () => check([1, 2], 1, [1]));
  it('remove the head of two', () => check([1, 2], 2, [2]));
  it('remove the head of a longer list (n = length)', () => check([1, 2, 3, 4, 5], 5, [2, 3, 4, 5]));
  it('remove the tail of a longer list (n = 1)', () => check([1, 2, 3, 4, 5], 1, [1, 2, 3, 4]));
  it('remove the middle node', () => check([1, 2, 3], 2, [1, 3]));
  it('duplicate values: removes by position, not by value', () => check([7, 7, 7, 7], 3, [7, 7, 7]));
  it('values 0', () => check([0, 0, 1, 0], 2, [0, 0, 0]));
  it('every n of every length 1..12', () => {
    for (let len = 1; len <= 12; len++) {
      const arr = Array.from({ length: len }, (_, i) => i + 1);
      for (let n = 1; n <= len; n++) {
        const expected = arr.filter((_, i) => i !== len - n);
        const actual = removeNthFromEnd(buildList(arr), n);
        assert.deepStrictEqual(listToArray(actual), expected, `removeNthFromEnd(${fmt(arr)}, ${n}): expected ${fmt(expected)}`);
      }
    }
  });

  it('large list (5000 nodes) with many positions', { timeout: 2000 }, () => {
    const rng = makeRng(19);
    const arr = randomArray(rng, 5000, 0, 100);
    for (const n of [1, 2, 2500, 4999, 5000, rng.int(1, 5000), rng.int(1, 5000)]) {
      const expected = arr.filter((_, i) => i !== arr.length - n);
      check(arr, n, expected);
    }
  });
});
