import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  ListNode, buildList, listToArray, buildCyclicList,
  TreeNode, buildTree, treeToArray, findNode,
  RandomListNode, buildRandomList, randomListToArray,
  GraphNode, buildGraph, graphToAdjList,
} from './ds.js';

describe('linked list', () => {
  it('ListNode defaults', () => {
    const n = new ListNode();
    assert.deepEqual([n.val, n.next], [0, null]);
  });
  it('buildList / listToArray round trip', () => {
    assert.deepEqual(listToArray(buildList([1, 2, 3])), [1, 2, 3]);
    assert.ok(buildList([1]) instanceof ListNode);
  });
  it('empty list is null', () => {
    assert.equal(buildList([]), null);
    assert.deepEqual(listToArray(null), []);
  });
  it('buildCyclicList with pos -1 has no cycle', () => {
    assert.deepEqual(listToArray(buildCyclicList([1, 2, 3], -1)), [1, 2, 3]);
  });
  it('buildCyclicList links tail to pos', () => {
    const head = buildCyclicList([3, 2, 0, -4], 1);
    assert.equal(head.next.next.next.next, head.next);
  });
  it('listToArray never hangs on a cycle', () => {
    const head = buildCyclicList([1, 2], 0);
    const out = listToArray(head);
    assert.equal(out.length, 100000);
    assert.deepEqual(out.slice(0, 4), [1, 2, 1, 2]);
  });
  it('single node cycling to itself', () => {
    const head = buildCyclicList([7], 0);
    assert.equal(head.next, head);
  });
  it('out of range pos throws', () => {
    assert.throws(() => buildCyclicList([1], 3), RangeError);
  });
  it('empty array with a pos returns null', () => {
    assert.equal(buildCyclicList([], 0), null);
  });
});

describe('random list', () => {
  const pairs = [[7, null], [13, 0], [11, 4], [10, 2], [1, 0]];
  it('round trips LeetCode example', () => {
    assert.deepEqual(randomListToArray(buildRandomList(pairs)), pairs);
  });
  it('wires pointers', () => {
    const head = buildRandomList(pairs);
    assert.ok(head instanceof RandomListNode);
    assert.equal(head.random, null);
    assert.equal(head.next.random, head);
  });
  it('empty', () => {
    assert.equal(buildRandomList([]), null);
    assert.deepEqual(randomListToArray(null), []);
  });
  it('random pointer outside the list maps to -1', () => {
    const head = buildRandomList([[1, null]]);
    head.random = new RandomListNode(9);
    assert.deepEqual(randomListToArray(head), [[1, -1]]);
  });
  it('does not hang on a next-cycle', () => {
    const head = buildRandomList([[1, null], [2, null]]);
    head.next.next = head;
    assert.deepEqual(randomListToArray(head), [[1, null], [2, null]]);
  });
});

describe('binary tree', () => {
  it('builds LeetCode example', () => {
    const root = buildTree([3, 9, 20, null, null, 15, 7]);
    assert.ok(root instanceof TreeNode);
    assert.equal(root.left.val, 9);
    assert.equal(root.right.left.val, 15);
    assert.equal(root.left.left, null);
  });
  it('round trips', () => {
    for (const arr of [
      [1], [1, 2, 3], [3, 9, 20, null, null, 15, 7], [1, null, 2, null, 3], [1, 2, null, 3, null, 4],
      [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1],
    ]) {
      assert.deepEqual(treeToArray(buildTree(arr)), arr);
    }
  });
  it('trims trailing nulls', () => {
    assert.deepEqual(treeToArray(buildTree([1, 2, null, null, null])), [1, 2]);
    const root = new TreeNode(1, new TreeNode(2), null);
    assert.deepEqual(treeToArray(root), [1, 2]);
  });
  it('empty tree', () => {
    assert.equal(buildTree([]), null);
    assert.equal(buildTree([null]), null);
    assert.deepEqual(treeToArray(null), []);
  });
  it('negative and zero values are kept', () => {
    assert.deepEqual(treeToArray(buildTree([0, -1, null, -2])), [0, -1, null, -2]);
  });
  it('findNode finds by value, null when missing', () => {
    const root = buildTree([3, 9, 20, null, null, 15, 7]);
    assert.equal(findNode(root, 15), root.right.left);
    assert.equal(findNode(root, 3), root);
    assert.equal(findNode(root, 99), null);
    assert.equal(findNode(null, 1), null);
  });
  it('handles a deep skewed tree without recursion limits', () => {
    const arr = [];
    for (let i = 0; i < 20000; i++) arr.push(i, null);
    arr.pop();
    const root = buildTree(arr);
    assert.equal(treeToArray(root).length, arr.length);
    assert.equal(findNode(root, 19999).val, 19999);
  });
});

describe('graph', () => {
  it('round trips LeetCode example', () => {
    const adj = [[2, 4], [1, 3], [2, 4], [1, 3]];
    const g = buildGraph(adj);
    assert.ok(g instanceof GraphNode);
    assert.equal(g.val, 1);
    assert.equal(g.neighbors[0].neighbors[0], g);
    assert.deepEqual(graphToAdjList(g), adj);
  });
  it('single node with no neighbors', () => {
    assert.deepEqual(graphToAdjList(buildGraph([[]])), [[]]);
  });
  it('empty graph is null / []', () => {
    assert.equal(buildGraph([]), null);
    assert.deepEqual(graphToAdjList(null), []);
  });
  it('only walks the component reachable from the node', () => {
    const g = buildGraph([[2], [1], [4], [3]]);
    assert.deepEqual(graphToAdjList(g), [[2], [1]]);
  });
});
