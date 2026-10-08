import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { reverseList } from './reverse-linked-list.js';
import { buildList, listToArray } from '../../lib/ds.js';
import { fmt, makeRng, randomArray } from '../../lib/testutil.js';

function check(arr) {
  const expected = [...arr].reverse();
  const actual = listToArray(reverseList(buildList(arr)));
  assert.deepStrictEqual(actual, expected, `reverseList(${fmt(arr)}): expected ${fmt(expected)}, got ${fmt(actual)}`);
}

describe('Reverse Linked List (#206)', () => {
  it('example 1: five nodes', () => check([1, 2, 3, 4, 5]));
  it('example 2: two nodes', () => check([1, 2]));
  it('example 3: empty list', () => {
    const actual = reverseList(null);
    assert.equal(actual, null, `reverseList(null): expected null, got ${fmt(actual)}`);
  });
  it('single node', () => check([42]));
  it('three nodes', () => check([1, 2, 3]));
  it('duplicate values', () => check([7, 7, 1, 7, 7]));
  it('negative values and boundaries', () => check([-5000, 0, 5000, -1]));
  it('result tail ends with null (no accidental cycle) and head is the old tail', () => {
    const head = buildList([1, 2, 3, 4]);
    let tail = head;
    while (tail.next) tail = tail.next;
    const result = reverseList(head);
    assert.equal(result, tail, 'new head must be the old tail node');
    assert.equal(head.next, null, 'old head must now be the last node (next === null)');
  });
  it('all lengths 0..20', () => {
    for (let n = 0; n <= 20; n++) check(Array.from({ length: n }, (_, i) => i + 1));
  });

  it('large list (5000 nodes, LeetCode maximum)', { timeout: 2000 }, () => {
    const rng = makeRng(206);
    for (let t = 0; t < 20; t++) check(randomArray(rng, 5000, -5000, 5000));
  });
});
