import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { canAttendMeetings } from './meeting-rooms.js';
import { clone, fmt, makeRng } from '../../lib/testutil.js';

function check(intervals, expected) {
  const actual = canAttendMeetings(clone(intervals));
  assert.equal(actual, expected, `canAttendMeetings(${fmt(intervals)})\n  expected: ${expected}\n  actual:   ${fmt(actual)}`);
}

describe('Meeting Rooms', () => {
  it('example 1: overlapping meetings', () => {
    check([[0, 30], [5, 10], [15, 20]], false);
  });
  it('example 2: disjoint meetings', () => {
    check([[7, 10], [2, 4]], true);
  });
  it('empty schedule', () => {
    check([], true);
  });
  it('single meeting', () => {
    check([[1, 2]], true);
  });
  it('back-to-back meetings are fine', () => {
    check([[1, 2], [2, 3], [3, 4]], true);
  });
  it('back-to-back given out of order', () => {
    check([[3, 4], [1, 2], [2, 3]], true);
  });
  it('identical meetings conflict', () => {
    check([[1, 5], [1, 5]], false);
  });
  it('one meeting nested in another', () => {
    check([[1, 10], [3, 4]], false);
  });
  it('overlap hidden in an unsorted list', () => {
    check([[10, 12], [1, 3], [5, 7], [2, 4]], false);
  });
  it('large input: 100000 touching meetings in shuffled order, then one overlap', { timeout: 2000 }, () => {
    const rng = makeRng(5);
    const meetings = [];
    let t = 0;
    for (let i = 0; i < 100000; i++) {
      const len = rng.int(1, 9);
      meetings.push([t, t + len]);
      t += len;
    }
    check(rng.shuffle(meetings), true);
    const broken = clone(meetings);
    broken[50000][1] += 1; // now overlaps the next meeting by 1
    check(rng.shuffle(broken), false);
  });
});
