import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { MinStack } from './min-stack.js';
import { makeRng, randomArray, runOps } from '../../lib/testutil.js';

const make = (...a) => new MinStack(...a);

describe('Min Stack', () => {
  it('example 1: push -2, 0, -3; getMin; pop; top; getMin', () => {
    runOps(
      make,
      ['MinStack', 'push', 'push', 'push', 'getMin', 'pop', 'top', 'getMin'],
      [[], [-2], [0], [-3], [], [], [], []],
      [null, null, null, null, -3, null, 0, -2],
    );
  });

  it('single element is both top and min', () => {
    runOps(make, ['MinStack', 'push', 'top', 'getMin'], [[], [7], [], []], [null, null, 7, 7]);
  });

  it('increasing pushes keep the first value as min', () => {
    runOps(
      make,
      ['MinStack', 'push', 'push', 'push', 'getMin', 'top'],
      [[], [1], [2], [3], [], []],
      [null, null, null, null, 1, 3],
    );
  });

  it('decreasing pushes: min follows the top and walks back on pop', () => {
    runOps(
      make,
      ['MinStack', 'push', 'push', 'push', 'getMin', 'pop', 'getMin', 'pop', 'getMin'],
      [[], [3], [2], [1], [], [], [], [], []],
      [null, null, null, null, 1, null, 2, null, 3],
    );
  });

  it('duplicate minimums: popping one copy keeps the min', () => {
    runOps(
      make,
      ['MinStack', 'push', 'push', 'push', 'getMin', 'pop', 'getMin', 'pop', 'getMin'],
      [[], [2], [1], [1], [], [], [], [], []],
      [null, null, null, null, 1, null, 1, null, 2],
    );
  });

  it('min is not affected when a non-min value is popped', () => {
    runOps(
      make,
      ['MinStack', 'push', 'push', 'push', 'pop', 'getMin', 'top'],
      [[], [1], [5], [9], [], [], []],
      [null, null, null, null, null, 1, 5],
    );
  });

  it('works with 32-bit extremes', () => {
    runOps(
      make,
      ['MinStack', 'push', 'push', 'getMin', 'pop', 'getMin', 'top'],
      [[], [2147483647], [-2147483648], [], [], [], []],
      [null, null, null, -2147483648, null, 2147483647, 2147483647],
    );
  });

  it('negative and zero values', () => {
    runOps(
      make,
      ['MinStack', 'push', 'push', 'push', 'push', 'getMin', 'pop', 'getMin', 'pop', 'getMin', 'pop', 'getMin'],
      [[], [0], [-1], [0], [-1], [], [], [], [], [], [], []],
      [null, null, null, null, null, -1, null, -1, null, -1, null, 0],
    );
  });

  it('push after pop re-establishes the min correctly', () => {
    runOps(
      make,
      ['MinStack', 'push', 'push', 'pop', 'push', 'getMin', 'top'],
      [[], [5], [1], [], [3], [], []],
      [null, null, null, null, null, 3, 3],
    );
  });

  it('separate instances do not share state', () => {
    const a = new MinStack();
    const b = new MinStack();
    a.push(1);
    b.push(9);
    assert.equal(a.getMin(), 1, 'a.getMin() should be 1');
    assert.equal(b.getMin(), 9, 'b.getMin() should be 9');
    assert.equal(a.top(), 1);
    assert.equal(b.top(), 9);
  });

  it('matches a recomputed min over random push/pop sequences', () => {
    const rng = makeRng(155);
    for (let round = 0; round < 50; round++) {
      const s = new MinStack();
      const mirror = [];
      for (let step = 0; step < 60; step++) {
        if (mirror.length === 0 || rng.next() < 0.6) {
          const v = rng.int(-10, 10);
          s.push(v);
          mirror.push(v);
        } else {
          s.pop();
          mirror.pop();
        }
        if (mirror.length) {
          const where = `round ${round}, step ${step}, stack ${JSON.stringify(mirror)}`;
          assert.equal(s.top(), mirror[mirror.length - 1], `top() wrong: ${where}`);
          assert.equal(s.getMin(), Math.min(...mirror), `getMin() wrong: ${where}`);
        }
      }
    }
  });

  it('large input: 10^5 pushes then pops, getMin stays O(1)', { timeout: 2000 }, () => {
    const rng = makeRng(7);
    const n = 100000;
    const values = randomArray(rng, n, -1000000, 1000000);
    const prefixMin = [];
    let m = Infinity;
    for (const v of values) {
      m = Math.min(m, v);
      prefixMin.push(m);
    }
    const s = new MinStack();
    for (let i = 0; i < n; i++) {
      s.push(values[i]);
      if (s.getMin() !== prefixMin[i]) assert.fail(`after push #${i}: getMin() = ${s.getMin()}, expected ${prefixMin[i]}`);
    }
    for (let i = n - 1; i >= 0; i--) {
      if (s.getMin() !== prefixMin[i]) assert.fail(`before pop #${i}: getMin() = ${s.getMin()}, expected ${prefixMin[i]}`);
      if (s.top() !== values[i]) assert.fail(`before pop #${i}: top() = ${s.top()}, expected ${values[i]}`);
      s.pop();
    }
  });
});
