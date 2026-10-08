import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { hasCycle } from './linked-list-cycle.js';
import { buildCyclicList } from '../../lib/ds.js';
import { fmt } from '../../lib/testutil.js';

/** Build the list, call hasCycle, and verify the list was not modified. */
function check(arr, pos, expected) {
  const head = buildCyclicList(arr, pos);
  // Remember the node chain so we can verify the structure afterwards (never walks unbounded).
  const nodes = [];
  for (let cur = head, i = 0; cur && i < arr.length; cur = cur.next, i++) nodes.push(cur);
  const actual = hasCycle(head);
  assert.equal(actual, expected, `hasCycle(list ${fmt(arr)}, pos=${pos}): expected ${expected}, got ${fmt(actual)}`);
  nodes.forEach((n, i) => {
    const want = i + 1 < nodes.length ? nodes[i + 1] : pos >= 0 ? nodes[pos] : null;
    assert.ok(n.next === want, `hasCycle must not modify the list (node ${i} had its next pointer changed)`);
    assert.equal(n.val, arr[i], 'hasCycle must not modify node values');
  });
}

describe('Linked List Cycle (#141)', () => {
  it('example 1: tail links back to index 1', () => check([3, 2, 0, -4], 1, true));
  it('example 2: two nodes, tail links to head', () => check([1, 2], 0, true));
  it('example 3: single node, no cycle', () => check([1], -1, false));
  it('empty list', () => assert.equal(hasCycle(null), false, 'hasCycle(null) should be false'));
  it('single node pointing to itself', () => check([1], 0, true));
  it('two nodes, no cycle', () => check([1, 2], -1, false));
  it('two nodes, tail points to itself', () => check([1, 2], 1, true));
  it('long list without a cycle', () => check([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], -1, false));
  it('cycle through the whole list (pos 0)', () => check([1, 2, 3, 4, 5], 0, true));
  it('cycle only at the last node', () => check([1, 2, 3, 4, 5], 4, true));
  it('cycle in the middle', () => check([1, 2, 3, 4, 5, 6, 7], 3, true));
  it('duplicate values without a cycle (compare nodes, not values)', () => check([1, 1, 1, 1], -1, false));
  it('duplicate values with a cycle', () => check([1, 1, 1, 1], 2, true));
  it('every position of lists up to length 8', () => {
    for (let n = 1; n <= 8; n++) {
      const arr = Array.from({ length: n }, (_, i) => i);
      check(arr, -1, false);
      for (let pos = 0; pos < n; pos++) check(arr, pos, true);
    }
  });

  it('large lists: 10^5 nodes with and without a cycle', { timeout: 2000 }, () => {
    const arr = Array.from({ length: 100_000 }, (_, i) => i % 7);
    check(arr, -1, false);
    check(arr, 0, true);
    check(arr, 50_000, true);
    check(arr, 99_999, true);
  });
});
