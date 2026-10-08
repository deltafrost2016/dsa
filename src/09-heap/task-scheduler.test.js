import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { clone, fmt, makeRng } from '../../lib/testutil.js';
import { leastInterval } from './task-scheduler.js';

const check = (tasks, n, expected) => {
  const input = clone(tasks);
  assert.equal(
    leastInterval(input, n),
    expected,
    `leastInterval(${fmt(tasks)}, ${n}) expected ${expected}`,
  );
};

/** Closed-form answer: frame the most frequent task(s), or no idle at all. */
function formula(tasks, n) {
  const counts = new Map();
  for (const t of tasks) counts.set(t, (counts.get(t) ?? 0) + 1);
  const maxF = Math.max(...counts.values());
  let numMax = 0;
  for (const c of counts.values()) if (c === maxF) numMax++;
  return Math.max(tasks.length, (maxF - 1) * (n + 1) + numMax);
}

const rep = (ch, times) => new Array(times).fill(ch);

describe('Task Scheduler', () => {
  it('official example 1: AAABBB, n=2 -> 8', () =>
    check(['A', 'A', 'A', 'B', 'B', 'B'], 2, 8));
  it('official example 2: AAABBB, n=0 -> 6', () =>
    check(['A', 'A', 'A', 'B', 'B', 'B'], 0, 6));
  it('official example 3: six As and B..G, n=2 -> 16', () =>
    check(['A', 'A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E', 'F', 'G'], 2, 16));
  it('single task needs no cooldown', () => check(['A'], 100, 1));
  it('single task type repeated: A x5, n=2 -> 13', () => check(rep('A', 5), 2, 13));
  it('single task type repeated, n=0 -> count', () => check(rep('A', 5), 0, 5));
  it('all distinct tasks never idle even with a big n', () =>
    check(['A', 'B', 'C', 'D', 'E'], 50, 5));
  it('tie for most frequent adds to the last frame: AAABBBCC n=2 -> 8', () =>
    check(['A', 'A', 'A', 'B', 'B', 'B', 'C', 'C'], 2, 8));
  it('plenty of filler tasks removes idles: AAABBBCCCDDDEE n=2 -> 14', () =>
    check(['A', 'A', 'A', 'B', 'B', 'B', 'C', 'C', 'C', 'D', 'D', 'D', 'E', 'E'], 2, 14));
  it('two tasks with large cooldown: AABB n=10 -> 13', () =>
    check(['A', 'A', 'B', 'B'], 10, 13));
  it('input order does not matter', () =>
    check(['B', 'A', 'B', 'A', 'B', 'A'], 2, 8));
  it('n=1 alternating exactly fits: AABB -> 4', () => check(['A', 'A', 'B', 'B'], 1, 4));
  it('three types each four times, n=1 -> 12', () =>
    check([...rep('A', 4), ...rep('B', 4), ...rep('C', 4)], 1, 12));

  it('closed form agrees with a greedy simulation on small inputs (sanity of the oracle)', () => {
    const rng = makeRng(621);
    for (let t = 0; t < 50; t++) {
      const m = rng.int(1, 12);
      const tasks = Array.from({ length: m }, () => String.fromCharCode(65 + rng.int(0, 3)));
      const n = rng.int(0, 4);
      // simulation: each step run the available task with the most remaining; idle otherwise
      const remaining = new Map();
      for (const x of tasks) remaining.set(x, (remaining.get(x) ?? 0) + 1);
      const ready = new Map([...remaining.keys()].map((x) => [x, 0]));
      let time = 0;
      let left = m;
      while (left > 0) {
        let best = null;
        for (const [x, c] of remaining) {
          if (c > 0 && ready.get(x) <= time && (best === null || c > remaining.get(best))) best = x;
        }
        if (best !== null) {
          remaining.set(best, remaining.get(best) - 1);
          ready.set(best, time + n + 1);
          left--;
        }
        time++;
      }
      check(tasks, n, time);
      assert.equal(formula(tasks, n), time, `oracle sanity for ${fmt(tasks)}, n=${n}`);
    }
  });

  it('10000 random tasks over 26 letters with several n', { timeout: 2000 }, () => {
    const rng = makeRng(6211);
    const tasks = Array.from({ length: 10000 }, () => String.fromCharCode(65 + rng.int(0, 25)));
    for (const n of [0, 1, 5, 25, 100]) check(tasks, n, formula(tasks, n));
  });

  it('10000 tasks skewed to two letters with n=100', { timeout: 2000 }, () => {
    const rng = makeRng(6212);
    const tasks = Array.from({ length: 10000 }, () => (rng.next() < 0.9 ? 'A' : 'B'));
    for (const n of [0, 10, 100]) check(tasks, n, formula(tasks, n));
  });
});
