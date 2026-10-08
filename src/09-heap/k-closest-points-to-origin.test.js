import { describe, it } from 'node:test';
import { clone, fmt, sameMembers, makeRng } from '../../lib/testutil.js';
import { kClosest } from './k-closest-points-to-origin.js';

const check = (points, k, expected) => {
  const input = clone(points);
  const actual = kClosest(input, k);
  sameMembers(actual, expected, {
    message: `kClosest(${fmt(points)}, ${k}) expected ${fmt(expected)}`,
  });
};

const d2 = ([x, y]) => x * x + y * y;

describe('K Closest Points to Origin', () => {
  it('official example 1: [[1,3],[-2,2]], k=1', () => check([[1, 3], [-2, 2]], 1, [[-2, 2]]));

  it('official example 2: [[3,3],[5,-1],[-2,4]], k=2', () =>
    check([[3, 3], [5, -1], [-2, 4]], 2, [[3, 3], [-2, 4]]));

  it('single point', () => check([[0, 0]], 1, [[0, 0]]));
  it('k equals number of points returns all', () =>
    check([[3, 4], [-1, -1], [0, 2]], 3, [[3, 4], [-1, -1], [0, 2]]));
  it('points on the axes', () =>
    check([[0, 5], [-4, 0], [0, -1], [2, 0]], 2, [[0, -1], [2, 0]]));
  it('negative coordinates only', () =>
    check([[-5, -5], [-1, -2], [-3, -3], [-10, -1]], 2, [[-1, -2], [-3, -3]]));
  it('origin is among the points', () =>
    check([[0, 0], [1, 1], [2, 2]], 2, [[0, 0], [1, 1]]));
  it('identical points inside the answer', () =>
    check([[1, 1], [1, 1], [5, 5]], 2, [[1, 1], [1, 1]]));
  it('input order does not matter (farthest first)', () =>
    check([[9, 9], [8, 8], [7, 7], [1, 0], [2, 0]], 2, [[1, 0], [2, 0]]));
  it('boundary coordinates', () =>
    check([[10000, 10000], [-10000, -10000], [0, 10000]], 1, [[0, 10000]]));

  it('20000 random points, k=100, unique distances', { timeout: 2000 }, () => {
    const rng = makeRng(973);
    const seen = new Set();
    const points = [];
    while (points.length < 20000) {
      const p = [rng.int(-10000, 10000), rng.int(-10000, 10000)];
      const dist = d2(p);
      if (seen.has(dist)) continue; // unique distances => no ties at the boundary
      seen.add(dist);
      points.push(p);
    }
    const k = 100;
    const expected = [...points].sort((a, b) => d2(a) - d2(b)).slice(0, k);
    check(points, k, expected);
  });

  it('20000 random points, k = n - 1 and k = 1', { timeout: 2000 }, () => {
    const rng = makeRng(9731);
    const seen = new Set();
    const points = [];
    while (points.length < 20000) {
      const p = [rng.int(-10000, 10000), rng.int(-10000, 10000)];
      const dist = d2(p);
      if (seen.has(dist)) continue;
      seen.add(dist);
      points.push(p);
    }
    const sorted = [...points].sort((a, b) => d2(a) - d2(b));
    check(points, 1, sorted.slice(0, 1));
    check(points, points.length - 1, sorted.slice(0, points.length - 1));
  });
});
