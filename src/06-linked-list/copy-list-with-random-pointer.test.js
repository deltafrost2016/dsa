import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { copyRandomList } from './copy-list-with-random-pointer.js';
import { buildRandomList, randomListToArray } from '../../lib/ds.js';
import { fmt, makeRng } from '../../lib/testutil.js';

/**
 * Copy the list built from `pairs` and verify: same structure, no shared nodes with the
 * original, and the original is unchanged.
 */
function check(pairs) {
  const head = buildRandomList(pairs);
  const originals = new Set();
  for (let cur = head; cur && originals.size <= pairs.length; cur = cur.next) originals.add(cur);

  const copy = copyRandomList(head);

  if (pairs.length === 0) {
    assert.equal(copy, null, `copyRandomList([]): expected null, got ${fmt(copy)}`);
    return;
  }
  assert.ok(copy, `copyRandomList(${fmt(pairs)}): expected a list, got ${fmt(copy)}`);
  const actual = randomListToArray(copy);
  assert.deepStrictEqual(actual, pairs, `copyRandomList(${fmt(pairs)}): structure differs, got ${fmt(actual)}`);

  // Deep copy: no node of the copy (nor any random target) may be an original node.
  let count = 0;
  for (let cur = copy; cur && count <= pairs.length; cur = cur.next, count++) {
    assert.ok(!originals.has(cur), `copy node #${count} is an original node (must be a new node)`);
    assert.ok(!cur.random || !originals.has(cur.random), `copy node #${count}'s random pointer points into the original list`);
  }
  // The original must be untouched.
  assert.deepStrictEqual(randomListToArray(head), pairs, 'the original list was modified');
}

describe('Copy List with Random Pointer (#138)', () => {
  it('example 1', () => check([[7, null], [13, 0], [11, 4], [10, 2], [1, 0]]));
  it('example 2', () => check([[1, 1], [2, 1]]));
  it('example 3: duplicate values', () => check([[3, null], [3, 0], [3, null]]));
  it('empty list returns null', () => check([]));
  it('single node, random null', () => check([[5, null]]));
  it('single node, random points to itself', () => check([[5, 0]]));
  it('every random pointer is null', () => check([[1, null], [2, null], [3, null]]));
  it('every random pointer points to the head', () => check([[1, 0], [2, 0], [3, 0], [4, 0]]));
  it('every random pointer points to itself', () => check([[1, 0], [2, 1], [3, 2]]));
  it('random points backwards and forwards', () => check([[1, 2], [2, 0], [3, 3], [4, 1]]));
  it('negative and zero values', () => check([[-10000, 1], [0, null], [10000, 0]]));
  it('two nodes pointing at each other', () => check([[1, 1], [2, 0]]));
  it('random structures of lengths 1..25', () => {
    const rng = makeRng(138);
    for (let n = 1; n <= 25; n++) {
      const pairs = Array.from({ length: n }, (_, i) => [rng.int(-100, 100), rng.int(-1, n - 1) === -1 ? null : rng.int(0, n - 1)]);
      check(pairs);
    }
  });

  it('large list (10^4 nodes) with random pointers', { timeout: 2000 }, () => {
    const rng = makeRng(1380);
    const n = 10_000;
    const pairs = Array.from({ length: n }, () => [rng.int(-10000, 10000), rng.int(0, 9) === 0 ? null : rng.int(0, n - 1)]);
    check(pairs);
  });
});
