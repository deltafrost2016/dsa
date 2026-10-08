import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { clone, fmt } from '../../lib/testutil.js';
import { findCheapestPrice } from './cheapest-flights-within-k-stops.js';

function check(n, flights, src, dst, k, expected) {
  const actual = findCheapestPrice(n, clone(flights), src, dst, k);
  assert.strictEqual(
    actual,
    expected,
    `findCheapestPrice(${n}, ${fmt(flights)}, ${src}, ${dst}, ${k})\n  expected: ${expected}\n  actual:   ${fmt(actual)}`,
  );
}

describe('Cheapest Flights Within K Stops', () => {
  const F4 = [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]];
  const F3 = [[0, 1, 100], [1, 2, 100], [0, 2, 500]];

  it('example 1: 0 -> 1 -> 3 with one stop costs 700', () => {
    check(4, F4, 0, 3, 1, 700);
  });

  it('example 2: one stop allows the cheap two-leg route', () => {
    check(3, F3, 0, 2, 1, 200);
  });

  it('example 3: zero stops forces the direct flight', () => {
    check(3, F3, 0, 2, 0, 500);
  });

  it('more stops allowed than needed still gives the cheapest', () => {
    check(4, F4, 0, 3, 3, 400);
  });

  it('unreachable destination returns -1', () => {
    check(3, [[0, 1, 10]], 0, 2, 2, -1);
  });

  it('stop limit makes an existing route unusable', () => {
    check(4, [[0, 1, 1], [1, 2, 1], [2, 3, 1]], 0, 3, 1, -1);
  });

  it('exactly enough stops', () => {
    check(4, [[0, 1, 1], [1, 2, 1], [2, 3, 1]], 0, 3, 2, 3);
  });

  it('flights are one-way', () => {
    check(2, [[1, 0, 5]], 0, 1, 1, -1);
  });

  it('cheapest route in price is not the fewest stops', () => {
    check(4, [[0, 3, 1000], [0, 1, 1], [1, 2, 1], [2, 3, 1]], 0, 3, 2, 3);
  });

  it('cycles do not trap the search', () => {
    check(3, [[0, 1, 1], [1, 0, 1], [1, 2, 5]], 0, 2, 5, 6);
  });

  it('a cheaper path with too many stops is not allowed', () => {
    check(5, [[0, 1, 1], [1, 2, 1], [2, 3, 1], [3, 4, 1], [0, 4, 100]], 0, 4, 2, 100);
  });

  it('no flights at all', () => {
    check(2, [], 0, 1, 1, -1);
  });

  it('complete forward graph: quadratic price makes extra stops cheaper (n = 100)', { timeout: 2000 }, () => {
    // Flight i->j (i<j) costs (j-i)^2. Covering distance 99 with m flights costs at best
    // 99^2/m when m divides 99, e.g. 9 flights of 11 => 9 * 121 = 1089.
    const n = 100;
    const flights = [];
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) flights.push([i, j, (j - i) * (j - i)]);
    check(n, flights, 0, 99, 8, 1089);
    check(n, flights, 0, 99, 0, 9801);
    check(n, flights, 0, 99, 98, 99);
    check(n, flights, 0, 99, 2, 3267); // 3 flights of 33 => 3 * 1089
  });
});
