import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { reverseKGroup } from './reverse-nodes-in-k-group.js';
import { buildList, listToArray } from '../../lib/ds.js';
import { fmt, makeRng, randomArray } from '../../lib/testutil.js';

/** Oracle: reverse each full block of k, leave the tail block alone. */
function expectedFor(arr, k) {
  const out = [];
  for (let i = 0; i < arr.length; i += k) {
    const block = arr.slice(i, i + k);
    out.push(...(block.length === k ? block.reverse() : block));
  }
  return out;
}

function check(arr, k, expected = expectedFor(arr, k)) {
  const head = buildList(arr);
  const before = [];
  for (let cur = head; cur; cur = cur.next) before.push(cur);
  const result = reverseKGroup(head, k);
  const actual = listToArray(result);
  assert.deepStrictEqual(actual, expected, `reverseKGroup(${fmt(arr)}, ${k}): expected ${fmt(expected)}, got ${fmt(actual)}`);
  // Same nodes, re-linked (no value copying into fresh nodes), no cycle.
  const seen = new Set();
  for (let cur = result, i = 0; cur && i <= arr.length; cur = cur.next, i++) seen.add(cur);
  assert.equal(seen.size, arr.length, 'every original node must appear exactly once and the list must end');
  for (const n of before) assert.ok(seen.has(n), 'nodes must be re-linked, not replaced by new ones');
}

describe('Reverse Nodes in k-Group (#25)', () => {
  it('example 1: k = 2', () => check([1, 2, 3, 4, 5], 2, [2, 1, 4, 3, 5]));
  it('example 2: k = 3', () => check([1, 2, 3, 4, 5], 3, [3, 2, 1, 4, 5]));
  it('k = 1 leaves the list unchanged', () => check([1, 2, 3, 4], 1, [1, 2, 3, 4]));
  it('k = list length reverses everything', () => check([1, 2, 3, 4], 4, [4, 3, 2, 1]));
  it('k larger than the list leaves it unchanged', () => check([1, 2, 3], 5, [1, 2, 3]));
  it('single node, k = 1', () => check([9], 1, [9]));
  it('length is an exact multiple of k', () => check([1, 2, 3, 4, 5, 6], 3, [3, 2, 1, 6, 5, 4]));
  it('remainder group of size k - 1 stays in order', () => check([1, 2, 3, 4, 5, 6, 7], 4, [4, 3, 2, 1, 5, 6, 7]));
  it('remainder group of size 1', () => check([1, 2, 3, 4, 5, 6, 7], 3, [3, 2, 1, 6, 5, 4, 7]));
  it('duplicate values', () => check([1, 1, 2, 2, 3, 3], 2, [1, 1, 2, 2, 3, 3]));
  it('values at the bounds', () => check([0, 1000, 500, 0], 2, [1000, 0, 0, 500]));
  it('every k of every length 1..14 agrees with the oracle', () => {
    for (let n = 1; n <= 14; n++) {
      const arr = Array.from({ length: n }, (_, i) => i + 1);
      for (let k = 1; k <= n + 1; k++) check(arr, k);
    }
  });

  it('large list (5000 nodes) with several k', { timeout: 2000 }, () => {
    const rng = makeRng(25);
    const arr = randomArray(rng, 5000, 0, 1000);
    for (const k of [1, 2, 3, 7, 64, 1000, 2500, 4999, 5000]) check(arr, k);
  });
});
