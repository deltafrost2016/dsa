import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { dailyTemperatures } from './daily-temperatures.js';
import { clone, fmt, makeRng, randomArray } from '../../lib/testutil.js';

function check(temps, expected) {
  const actual = dailyTemperatures(clone(temps));
  assert.deepStrictEqual(
    actual,
    expected,
    `dailyTemperatures(${fmt(temps)})\n  expected: ${fmt(expected)}\n  actual:   ${fmt(actual)}`,
  );
}

function brute(temps) {
  return temps.map((t, i) => {
    for (let j = i + 1; j < temps.length; j++) if (temps[j] > t) return j - i;
    return 0;
  });
}

describe('Daily Temperatures', () => {
  it('example 1', () => check([73, 74, 75, 71, 69, 72, 76, 73], [1, 1, 4, 2, 1, 1, 0, 0]));
  it('example 2: strictly increasing', () => check([30, 40, 50, 60], [1, 1, 1, 0]));
  it('example 3', () => check([30, 60, 90], [1, 1, 0]));
  it('single day -> [0]', () => check([50], [0]));
  it('two days warmer', () => check([50, 51], [1, 0]));
  it('two days colder', () => check([51, 50], [0, 0]));
  it('all equal: equal is not warmer', () => check([60, 60, 60, 60], [0, 0, 0, 0]));
  it('strictly decreasing -> all zeros', () => check([90, 80, 70, 60], [0, 0, 0, 0]));
  it('warm day far in the future', () => check([50, 40, 40, 40, 40, 51], [5, 4, 3, 2, 1, 0]));
  it('equal temperature before a warmer one', () => check([60, 60, 61], [2, 1, 0]));
  it('valley then peak', () => check([80, 60, 40, 60, 80, 90], [5, 3, 1, 1, 1, 0]));
  it('boundary values 30 and 100', () => check([30, 100, 30, 100], [1, 0, 1, 0]));

  it('matches brute force on random small inputs', () => {
    const rng = makeRng(739);
    for (let t = 0; t < 300; t++) {
      const temps = randomArray(rng, rng.int(1, 15), 30, 40);
      check(temps, brute(temps));
    }
  });

  it('large input: strictly decreasing sequence (10^5 days) -> all zeros', { timeout: 2000 }, () => {
    const n = 100000;
    const temps = Array.from({ length: n }, (_, i) => 100 - Math.floor((i * 70) / n));
    check(temps, new Array(n).fill(0));
  });

  it('large input: all equal (10^5 days) -> all zeros', { timeout: 2000 }, () => {
    check(new Array(100000).fill(50), new Array(100000).fill(0));
  });

  it('large input: cold for a long time, then one hot day', { timeout: 2000 }, () => {
    const n = 100000;
    const temps = new Array(n).fill(40);
    temps[n - 1] = 99;
    const expected = Array.from({ length: n }, (_, i) => (i === n - 1 ? 0 : n - 1 - i));
    check(temps, expected);
  });

  it('large input: sawtooth pattern', { timeout: 2000 }, () => {
    // 30..100 ramps up then restarts; every day except the last of a ramp waits 1 day,
    // the peak (100) never sees a warmer day.
    const ramp = Array.from({ length: 71 }, (_, i) => 30 + i);
    const reps = 1400;
    const temps = [];
    const expected = [];
    for (let r = 0; r < reps; r++) {
      temps.push(...ramp);
      for (let i = 0; i < ramp.length; i++) expected.push(i === ramp.length - 1 ? 0 : 1);
    }
    check(temps, expected);
  });
});

