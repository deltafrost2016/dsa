import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { clone, fmt, makeRng } from '../../lib/testutil.js';
import { networkDelayTime } from './network-delay-time.js';

function check(times, n, k, expected) {
  const actual = networkDelayTime(clone(times), n, k);
  assert.strictEqual(
    actual,
    expected,
    `networkDelayTime(${fmt(times)}, ${n}, ${k})\n  expected: ${expected}\n  actual:   ${fmt(actual)}`,
  );
}

describe('Network Delay Time', () => {
  it('example 1: chain from node 2 reaches everyone in 2', () => {
    check([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2, 2);
  });

  it('example 2: single edge from the source', () => {
    check([[1, 2, 1]], 2, 1, 1);
  });

  it('example 3: source cannot reach node 1', () => {
    check([[1, 2, 1]], 2, 2, -1);
  });

  it('single node needs no time', () => {
    check([], 1, 1, 0);
  });

  it('no edges with several nodes is unreachable', () => {
    check([], 3, 1, -1);
  });

  it('edges are directed: reverse direction does not help', () => {
    check([[1, 2, 5], [3, 2, 1]], 3, 1, -1);
  });

  it('prefers the cheaper indirect route over the expensive direct edge', () => {
    check([[1, 2, 10], [1, 3, 1], [3, 2, 1]], 3, 1, 2);
  });

  it('answer is the farthest node, not the sum', () => {
    check([[1, 2, 3], [1, 3, 4], [1, 4, 9]], 4, 1, 9);
  });

  it('zero-weight edges are allowed', () => {
    check([[1, 2, 0], [2, 3, 0]], 3, 1, 0);
  });

  it('parallel edges: the cheaper one wins', () => {
    check([[1, 2, 7], [1, 2, 2]], 2, 1, 2);
  });

  it('cycles do not break the search', () => {
    check([[1, 2, 1], [2, 3, 1], [3, 1, 1], [3, 4, 5]], 4, 1, 7);
  });

  it('one unreachable node among many makes the answer -1', () => {
    check([[1, 2, 1], [2, 3, 1], [3, 4, 1]], 5, 1, -1);
  });

  it('large sparse graph with a known answer (10000 nodes, 50000 edges)', { timeout: 2000 }, () => {
    // Chain 1->2->...->n with weight 1. Every extra forward edge u->v costs at least
    // v-u, so it never beats the chain; backward edges never help either.
    // Therefore dist(j) = j-1 and the answer is n-1.
    const rng = makeRng(743);
    const n = 10000;
    const times = [];
    for (let i = 1; i < n; i++) times.push([i, i + 1, 1]);
    for (let e = 0; e < 40000; e++) {
      const u = rng.int(1, n - 1);
      const v = rng.int(u + 1, n);
      times.push([u, v, v - u + rng.int(0, 5)]);
      if (e % 4 === 0) times.push([v, u, rng.int(0, 100)]);
    }
    check(rng.shuffle(times), n, 1, n - 1);
  });
});
