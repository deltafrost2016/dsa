import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { clone, fmt, makeRng } from '../../lib/testutil.js';
import { minCostConnectPoints } from './min-cost-to-connect-all-points.js';

function check(points, expected) {
  const actual = minCostConnectPoints(clone(points));
  assert.strictEqual(
    actual,
    expected,
    `minCostConnectPoints(${fmt(points)})\n  expected: ${expected}\n  actual:   ${fmt(actual)}`,
  );
}

describe('Min Cost to Connect All Points', () => {
  it('example 1', () => {
    check([[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]], 20);
  });

  it('example 2 (negative coordinates)', () => {
    check([[3, 12], [-2, 5], [-4, 1]], 18);
  });

  it('single point costs nothing', () => {
    check([[0, 0]], 0);
  });

  it('two points: just their Manhattan distance', () => {
    check([[1, 1], [4, 5]], 7);
  });

  it('unit square needs three unit edges', () => {
    check([[0, 0], [0, 1], [1, 0], [1, 1]], 3);
  });

  it('LeetCode extra case', () => {
    check([[0, 0], [1, 1], [1, 0], [-1, 1]], 4);
  });

  it('collinear points: cost is the span, regardless of order', () => {
    check([[10, 0], [0, 0], [4, 0], [7, 0]], 10);
  });

  it('extreme coordinates', () => {
    check([[-1000000, -1000000], [1000000, 1000000]], 4000000);
  });

  it('chooses a hub instead of a long chain', () => {
    // star around the origin: each spoke costs 1, total 4
    check([[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]], 4);
  });

  it('large collinear input (1000 points, shuffled)', { timeout: 2000 }, () => {
    // Points on a line with distinct x: the MST is the chain of neighbours, cost = max - min.
    const rng = makeRng(1584);
    const xs = new Set();
    while (xs.size < 1000) xs.add(rng.int(-1000000, 1000000));
    const sorted = [...xs].sort((a, b) => a - b);
    const points = rng.shuffle(sorted).map((x) => [x, 7]);
    check(points, sorted[sorted.length - 1] - sorted[0]);
  });

  it('large grid (30 x 30 lattice, shuffled): every point joins with a unit edge', { timeout: 2000 }, () => {
    const rng = makeRng(15);
    const points = [];
    for (let x = 0; x < 30; x++) for (let y = 0; y < 30; y++) points.push([x * 2, y * 2]);
    // spacing 2 => every MST edge costs 2, 899 edges
    check(rng.shuffle(points), 899 * 2);
  });
});
