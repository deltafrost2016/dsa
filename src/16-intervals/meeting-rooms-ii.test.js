import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { minMeetingRooms } from './meeting-rooms-ii.js';
import { clone, fmt, makeRng } from '../../lib/testutil.js';

function check(intervals, expected) {
  const actual = minMeetingRooms(clone(intervals));
  assert.equal(actual, expected, `minMeetingRooms(${fmt(intervals)})\n  expected: ${expected}\n  actual:   ${fmt(actual)}`);
}

// Tiny brute-force oracle for small random cases only: max overlap at any meeting start.
function oracle(intervals) {
  let best = 0;
  for (const [s] of intervals) {
    let c = 0;
    for (const [a, b] of intervals) if (a <= s && s < b) c++;
    best = Math.max(best, c);
  }
  return best;
}

describe('Meeting Rooms II', () => {
  it('example 1', () => {
    check([[0, 30], [5, 10], [15, 20]], 2);
  });
  it('example 2', () => {
    check([[7, 10], [2, 4]], 1);
  });
  it('no meetings need no rooms', () => {
    check([], 0);
  });
  it('single meeting', () => {
    check([[4, 9]], 1);
  });
  it('back-to-back meetings share one room', () => {
    check([[1, 2], [2, 3], [3, 4]], 1);
  });
  it('all identical meetings', () => {
    check([[1, 5], [1, 5], [1, 5], [1, 5]], 4);
  });
  it('nested meetings', () => {
    check([[1, 10], [2, 9], [3, 8], [4, 7]], 4);
  });
  it('a room is reused after it frees up', () => {
    check([[0, 5], [1, 3], [3, 8], [5, 9]], 2);
  });
  it('unsorted input', () => {
    check([[15, 20], [0, 30], [5, 10]], 2);
  });
  it('many meetings ending exactly when others start', () => {
    check([[1, 4], [4, 7], [7, 10], [1, 4], [4, 7], [7, 10]], 2);
  });
  it('random small inputs match a brute-force count', () => {
    const rng = makeRng(31337);
    for (let iter = 0; iter < 200; iter++) {
      const n = rng.int(1, 12);
      const intervals = Array.from({ length: n }, () => {
        const s = rng.int(0, 20);
        return [s, s + rng.int(1, 8)];
      });
      check(intervals, oracle(intervals));
    }
  });
  it('large input: 100000 meetings, 50 rooms fully booked', { timeout: 2000 }, () => {
    const rng = makeRng(99);
    const rooms = 50;
    const perRoom = 2000;
    const T = 1000000;
    const meetings = [];
    for (let r = 0; r < rooms; r++) {
      const cuts = new Set();
      while (cuts.size < perRoom - 1) cuts.add(rng.int(1, T - 1));
      const points = [0, ...[...cuts].sort((a, b) => a - b), T];
      for (let i = 0; i + 1 < points.length; i++) meetings.push([points[i], points[i + 1]]);
    }
    check(rng.shuffle(meetings), rooms);
  });
});
