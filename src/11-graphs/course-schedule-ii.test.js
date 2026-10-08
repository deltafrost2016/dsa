import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { findOrder } from './course-schedule-ii.js';
import { clone, fmt, makeRng } from '../../lib/testutil.js';

/** Validate that `order` is a legal course order, otherwise fail with a descriptive message. */
function assertValidOrder(n, prereqs, order) {
  const ctx = `findOrder(${n}, ${fmt(prereqs)})\n  actual: ${fmt(order)}`;
  assert.ok(Array.isArray(order), `${ctx}\n  expected an array`);
  assert.equal(order.length, n, `${ctx}\n  expected ${n} courses in the order, got ${order.length}`);
  const pos = new Array(n).fill(-1);
  for (let i = 0; i < order.length; i++) {
    const c = order[i];
    assert.ok(Number.isInteger(c) && c >= 0 && c < n, `${ctx}\n  invalid course ${fmt(c)} at index ${i}`);
    assert.equal(pos[c], -1, `${ctx}\n  course ${c} appears more than once`);
    pos[c] = i;
  }
  for (const [a, b] of prereqs) {
    assert.ok(pos[b] < pos[a], `${ctx}\n  course ${b} must come before ${a}`);
  }
}

function checkValid(n, prereqs) {
  const order = findOrder(n, clone(prereqs));
  assertValidOrder(n, prereqs, order);
}

function checkImpossible(n, prereqs) {
  const actual = findOrder(n, clone(prereqs));
  assert.deepStrictEqual(actual, [], `findOrder(${n}, ${fmt(prereqs)})\n  expected: []\n  actual:   ${fmt(actual)}`);
}

describe('Course Schedule II', () => {
  it('example 1: [1,0] -> [0,1]', () => {
    const order = findOrder(2, [[1, 0]]);
    assert.deepStrictEqual(order, [0, 1], `expected [0,1], actual ${fmt(order)}`);
  });
  it('example 2: diamond has a valid order', () => checkValid(4, [[1, 0], [2, 0], [3, 1], [3, 2]]));
  it('example 3: single course', () => {
    const order = findOrder(1, []);
    assert.deepStrictEqual(order, [0], `expected [0], actual ${fmt(order)}`);
  });
  it('no prerequisites returns all courses', () => checkValid(5, []));
  it('two-course cycle is impossible', () => checkImpossible(2, [[1, 0], [0, 1]]));
  it('self prerequisite is impossible', () => checkImpossible(1, [[0, 0]]));
  it('chain must be in exact order', () => {
    const order = findOrder(4, [[1, 0], [2, 1], [3, 2]]);
    assert.deepStrictEqual(order, [0, 1, 2, 3], `expected [0,1,2,3], actual ${fmt(order)}`);
  });
  it('reverse chain', () => {
    const order = findOrder(4, [[0, 1], [1, 2], [2, 3]]);
    assert.deepStrictEqual(order, [3, 2, 1, 0], `expected [3,2,1,0], actual ${fmt(order)}`);
  });
  it('many roots to one course', () => checkValid(5, [[4, 0], [4, 1], [4, 2], [4, 3]]));
  it('one root to many courses', () => checkValid(5, [[1, 0], [2, 0], [3, 0], [4, 0]]));
  it('disconnected components', () => checkValid(6, [[1, 0], [2, 1], [4, 3], [5, 4]]));
  it('cycle in one component makes the whole schedule impossible', () => {
    checkImpossible(6, [[1, 0], [2, 1], [4, 3], [5, 4], [3, 5]]);
  });
  it('longer cycle with a tail', () => checkImpossible(5, [[1, 0], [2, 1], [3, 2], [1, 3], [4, 3]]));
  it('returns a permutation: no course missing or duplicated', () => {
    const n = 8;
    const prereqs = [[1, 0], [2, 0], [3, 1], [3, 2], [5, 4], [7, 6], [6, 5]];
    checkValid(n, prereqs);
  });
  it('random small DAGs always yield valid orders', () => {
    const rng = makeRng(210);
    for (let t = 0; t < 100; t++) {
      const n = rng.int(1, 9);
      const perm = rng.shuffle(Array.from({ length: n }, (_, i) => i));
      const pre = [];
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) if (rng.next() < 0.3) pre.push([perm[j], perm[i]]);
      }
      checkValid(n, pre);
    }
  });
  it('random small graphs with a forced cycle are impossible', () => {
    const rng = makeRng(2100);
    for (let t = 0; t < 50; t++) {
      const n = rng.int(2, 9);
      const pre = [];
      for (let i = 0; i + 1 < n; i++) pre.push([i + 1, i]);
      pre.push([0, n - 1]);
      checkImpossible(n, rng.shuffle(pre));
    }
  });

  it('long chain of 100000 courses (deep recursion hazard)', { timeout: 2000 }, () => {
    const n = 100000;
    const pre = Array.from({ length: n - 1 }, (_, i) => [i + 1, i]);
    const order = findOrder(n, clone(pre));
    assert.equal(order.length, n, `expected ${n} courses, got ${order.length}`);
    for (let i = 0; i < n; i++) {
      if (order[i] !== i) assert.fail(`chain order must be 0..n-1; index ${i} has ${order[i]}`);
    }
  });

  it('large random DAG (50000 courses, 150000 edges)', { timeout: 2000 }, () => {
    const rng = makeRng(2101);
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
      pre.push([perm[j], perm[i]]);
    }
    const order = findOrder(n, clone(pre));
    assertValidOrder(n, pre, order);
  });

  it('large graph with a cycle at the very end is impossible', { timeout: 2000 }, () => {
    const n = 100000;
    const pre = Array.from({ length: n - 1 }, (_, i) => [i + 1, i]);
    pre.push([0, n - 1]);
    checkImpossible(n, pre);
  });
});
