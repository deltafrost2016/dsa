import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { canFinish } from './course-schedule.js';
import { clone, fmt, makeRng } from '../../lib/testutil.js';

function check(n, prereqs, expected) {
  const actual = canFinish(n, clone(prereqs));
  assert.equal(
    actual,
    expected,
    `canFinish(${n}, ${fmt(prereqs)})\n  expected: ${expected}\n  actual:   ${fmt(actual)}`,
  );
}

describe('Course Schedule', () => {
  it('example 1: one prerequisite', () => check(2, [[1, 0]], true));
  it('example 2: two-course cycle', () => check(2, [[1, 0], [0, 1]], false));
  it('no prerequisites', () => check(5, [], true));
  it('single course', () => check(1, [], true));
  it('self prerequisite is a cycle', () => check(1, [[0, 0]], false));
  it('chain of courses', () => check(5, [[1, 0], [2, 1], [3, 2], [4, 3]], true));
  it('long cycle', () => check(4, [[1, 0], [2, 1], [3, 2], [0, 3]], false));
  it('diamond dependency is fine', () => check(4, [[1, 0], [2, 0], [3, 1], [3, 2]], true));
  it('cycle hidden in a disconnected component', () => check(6, [[1, 0], [2, 1], [4, 3], [5, 4], [3, 5]], false));
  it('cycle reachable only from the middle of the graph', () => {
    check(5, [[1, 0], [2, 1], [3, 2], [2, 3], [4, 2]], false);
  });
  it('multiple roots merge into a shared course', () => check(5, [[4, 0], [4, 1], [4, 2], [4, 3]], true));
  it('two disjoint valid components', () => check(6, [[1, 0], [2, 1], [4, 3], [5, 4]], true));
  it('prerequisite listed in reverse index order', () => check(3, [[0, 1], [1, 2]], true));
  it('3-cycle plus separate acyclic course', () => check(4, [[0, 1], [1, 2], [2, 0]], false));

  it('long chain of 100000 courses (deep recursion hazard)', { timeout: 2000 }, () => {
    const n = 100000;
    const pre = Array.from({ length: n - 1 }, (_, i) => [i + 1, i]);
    check(n, pre, true);
  });

  it('long chain of 100000 courses closed into a cycle', { timeout: 2000 }, () => {
    const n = 100000;
    const pre = Array.from({ length: n - 1 }, (_, i) => [i + 1, i]);
    pre.push([0, n - 1]);
    check(n, pre, false);
  });

  it('large random DAG (50000 courses, 150000 edges)', { timeout: 2000 }, () => {
    const rng = makeRng(207);
    const n = 50000;
    const perm = rng.shuffle(Array.from({ length: n }, (_, i) => i));
    const seen = new Set();
    const pre = [];
    while (pre.length < 150000) {
      const i = rng.int(0, n - 2);
      const j = rng.int(i + 1, Math.min(n - 1, i + 500));
      const k = `${i},${j}`;
      if (seen.has(k)) continue;
      seen.add(k);
      pre.push([perm[j], perm[i]]); // perm[i] must come before perm[j]
    }
    check(n, pre, true);
  });

  it('large random DAG plus a guaranteed back edge is impossible', { timeout: 2000 }, () => {
    const rng = makeRng(2070);
    const n = 50000;
    const perm = rng.shuffle(Array.from({ length: n }, (_, i) => i));
    const pre = [];
    for (let i = 0; i + 1 < n; i++) pre.push([perm[i + 1], perm[i]]); // full chain perm[0] -> ... -> perm[n-1]
    for (let k = 0; k < 50000; k++) {
      const i = rng.int(0, n - 2);
      const j = rng.int(i + 1, n - 1);
      pre.push([perm[j], perm[i]]);
    }
    pre.push([perm[0], perm[n - 1]]); // closes the cycle
    check(n, rng.shuffle(pre), false);
  });
});
