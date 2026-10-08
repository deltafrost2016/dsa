import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { carFleet } from './car-fleet.js';
import { clone, fmt, makeRng } from '../../lib/testutil.js';

function check(target, position, speed, expected) {
  const actual = carFleet(target, clone(position), clone(speed));
  assert.equal(
    actual,
    expected,
    `carFleet(${target}, ${fmt(position)}, ${fmt(speed)})\n  expected: ${fmt(expected)}\n  actual:   ${fmt(actual)}`,
  );
}

// Independent O(n^2) oracle: a car heads a fleet iff every car ahead of it reaches the target strictly sooner
// (a car ahead that is slower or equal in arrival time would hold it back).
function brute(target, position, speed) {
  const n = position.length;
  const time = position.map((p, i) => (target - p) / speed[i]);
  let fleets = 0;
  for (let i = 0; i < n; i++) {
    let blocked = false;
    for (let j = 0; j < n; j++) {
      if (position[j] > position[i] && time[j] >= time[i]) {
        blocked = true;
        break;
      }
    }
    if (!blocked) fleets++;
  }
  return fleets;
}

describe('Car Fleet', () => {
  it('example 1: target 12 -> 3 fleets', () => check(12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3], 3));
  it('example 2: single car -> 1', () => check(10, [3], [3], 1));
  it('example 3: target 100, all merge -> 1', () => check(100, [0, 2, 4], [4, 2, 1], 1));
  it('cars given unsorted by position', () => check(10, [6, 0, 4], [1, 1, 2], 2));
  it('faster car behind catches up before target -> merges', () => check(10, [5, 0], [1, 3], 1));
  it('faster car behind catches up exactly at the target -> still one fleet', () => check(10, [5, 0], [1, 2], 1));
  it('faster car behind never catches up -> separate fleets', () => check(10, [5, 0], [2, 1], 2));
  it('same arrival time from different spots merge', () => check(10, [8, 6], [1, 2], 1));
  it('equal speeds never merge', () => check(100, [0, 10, 20, 30], [5, 5, 5, 5], 4));
  it('a slow lead car swallows everyone behind it', () => check(100, [90, 50, 10, 0], [1, 50, 60, 70], 1));
  it('a fleet formed ahead does not absorb a car that arrives later', () => check(20, [10, 0, 5], [1, 1, 3], 2));
  it('car at position 0 with speed enough to arrive first of the chain still needs the lead car', () =>
    check(10, [9, 0], [1, 100], 1));
  it('two cars, rear one slower', () => check(10, [4, 0], [2, 1], 2));
  it('chain: each car blocked by the next', () => check(12, [0, 4, 2], [2, 1, 3], 1));
  it('fractional arrival times are compared correctly', () => check(7, [4, 1, 0], [3, 2, 1], 3));
  it('large target and speeds', () => check(1000000, [999999, 0], [1, 1000000], 1));

  it('matches the pairwise oracle on random small inputs', () => {
    const rng = makeRng(853);
    for (let t = 0; t < 400; t++) {
      const n = rng.int(1, 8);
      const target = rng.int(n, 30);
      const position = rng.shuffle(Array.from({ length: target }, (_, i) => i)).slice(0, n);
      const speed = Array.from({ length: n }, () => rng.int(1, 6));
      check(target, position, speed, brute(target, position, speed));
    }
  });

  it('large input: 10^5 equal-speed cars -> every car its own fleet', { timeout: 2000 }, () => {
    const rng = makeRng(5);
    const n = 100000;
    const position = rng.shuffle(Array.from({ length: n }, (_, i) => i));
    const speed = new Array(n).fill(1);
    check(n, position, speed, n);
  });

  it('large input: 10^5 cars all arriving at the same moment -> 1 fleet', { timeout: 2000 }, () => {
    const rng = makeRng(6);
    const n = 100000;
    const target = 1000000;
    // position p with speed (target - p) => everyone needs exactly 1 time unit
    const position = rng.shuffle(Array.from({ length: n }, (_, i) => i * 9));
    const speed = position.map((p) => target - p);
    check(target, position, speed, 1);
  });

  it('large input: rear cars are always slower and arrive later -> n fleets', { timeout: 2000 }, () => {
    // each rear car is slower than the car ahead of it, so nobody ever catches up
    const n = 100000;
    const target = 1000000;
    const position = Array.from({ length: n }, (_, i) => n - 1 - i);
    const speed = Array.from({ length: n }, (_, i) => n - i); // rear cars (large i) get smaller speed
    check(target, position, speed, n);
  });
});
