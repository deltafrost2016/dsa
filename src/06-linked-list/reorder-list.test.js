import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { reorderList } from './reorder-list.js';
import { buildList, listToArray } from '../../lib/ds.js';
import { fmt, makeRng, randomArray } from '../../lib/testutil.js';

/** Expected order: first, last, second, second-last, ... */
function reordered(arr) {
  const out = [];
  let i = 0;
  let j = arr.length - 1;
  while (i <= j) {
    out.push(arr[i++]);
    if (i <= j) out.push(arr[j--]);
  }
  return out;
}

function check(arr) {
  const expected = reordered(arr);
  const head = buildList(arr);
  const before = [];
  for (let cur = head; cur; cur = cur.next) before.push(cur);
  const returned = reorderList(head);
  assert.equal(returned, undefined, 'reorderList must not return anything (modify in place)');
  const actual = listToArray(head);
  assert.deepStrictEqual(actual, expected, `reorderList(${fmt(arr)}): expected ${fmt(expected)}, got ${fmt(actual)}`);
  // Same nodes, re-linked (values are not copied around) and properly terminated.
  assert.equal(actual.length, arr.length, 'list must have the same length and no cycle');
  const seen = new Set();
  for (let cur = head, i = 0; cur && i <= arr.length; cur = cur.next, i++) seen.add(cur);
  assert.equal(seen.size, arr.length, 'every original node must still be in the list exactly once');
  for (const n of before) assert.ok(seen.has(n), 'nodes must be re-linked, not replaced by new ones');
  assert.equal(head, before[0], 'the head node must remain the first node');
}

describe('Reorder List (#143)', () => {
  it('example 1: even length', () => check([1, 2, 3, 4]));
  it('example 2: odd length', () => check([1, 2, 3, 4, 5]));
  it('single node', () => check([1]));
  it('two nodes', () => check([1, 2]));
  it('three nodes', () => check([1, 2, 3]));
  it('duplicate values', () => check([5, 5, 5, 5, 5]));
  it('values at the bounds', () => check([1, 1000, 1, 1000, 500]));
  it('all lengths 1..30', () => {
    for (let n = 1; n <= 30; n++) check(Array.from({ length: n }, (_, i) => i + 1));
  });

  it('large list (5 * 10^4 nodes, LeetCode maximum)', { timeout: 2000 }, () => {
    const rng = makeRng(143);
    check(randomArray(rng, 50_000, 1, 1000));
    check(randomArray(rng, 49_999, 1, 1000));
  });
});
