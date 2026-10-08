import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fmt, clone } from '../../lib/testutil.js';
import { canCompleteCircuit } from './gas-station.js';

const check = (gas, cost, expected) =>
  assert.equal(
    canCompleteCircuit(clone(gas), clone(cost)),
    expected,
    `canCompleteCircuit(${fmt(gas)}, ${fmt(cost)}): expected ${expected}`,
  );

describe('Gas Station', () => {
  it('example 1: start at station 3', () => check([1, 2, 3, 4, 5], [3, 4, 5, 1, 2], 3));
  it('example 2: impossible -> -1', () => check([2, 3, 4], [3, 4, 3], -1));
  it('single station with surplus -> 0', () => check([5], [4], 0));
  it('single station with exact fuel -> 0', () => check([2], [2], 0));
  it('single station short of fuel -> -1', () => check([4], [5], -1));
  it('[3,1,1] / [1,2,2] -> 0', () => check([3, 1, 1], [1, 2, 2], 0));
  it('[5,1,2,3,4] / [4,4,1,5,1] -> 4', () => check([5, 1, 2, 3, 4], [4, 4, 1, 5, 1], 4));
  it('[6,1,4,3,5] / [3,8,2,4,2] -> 2 (total gas equals total cost)', () => check([6, 1, 4, 3, 5], [3, 8, 2, 4, 2], 2));
  it('answer is the last station: [1,2,3,4,5] / [2,3,4,5,1] -> 4', () => check([1, 2, 3, 4, 5], [2, 3, 4, 5, 1], 4));
  it('answer is station 0: [4,0,0] / [1,2,1] -> 0', () => check([4, 0, 0], [1, 2, 1], 0));
  it('answer is the middle station: [0,3,0] / [2,1,0] -> 1', () => check([0, 3, 0], [2, 1, 0], 1));
  it('one rich station cannot cover the whole loop -> -1', () => check([10, 0, 0], [1, 6, 6], -1));
  it('two stations: [1,2] / [2,1] -> 1', () => check([1, 2], [2, 1], 1));
  it('n=10^5 two-phase circuit rotated by 12345 -> 12345 (trying every start is O(n^2))', () => {
    const n = 100000;
    const h = n / 2;
    const k = 12345;
    const gas = Array(n);
    const cost = Array(n);
    for (let i = 0; i < n; i++) {
      const idx = (i + k) % n;
      gas[idx] = i < h ? 2 : 0;
      cost[idx] = 1;
    }
    check(gas, cost, k);
  }, { timeout: 2000 });
  it('n=10^5 total gas one short of total cost -> -1', () => {
    const n = 100000;
    const gas = Array(n).fill(1);
    const cost = Array(n).fill(1);
    gas[777] = 0;
    check(gas, cost, -1);
  }, { timeout: 2000 });
  it('n=10^5 with one big deposit at station 0 -> 0', () => {
    const n = 100000;
    const gas = Array(n).fill(0);
    const cost = Array(n).fill(0);
    gas[0] = 10000;
    cost[n - 1] = 10000;
    check(gas, cost, 0);
  }, { timeout: 2000 });
});
