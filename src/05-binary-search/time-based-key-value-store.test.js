import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TimeMap } from './time-based-key-value-store.js';
import { runOps, makeRng, fmt } from '../../lib/testutil.js';

const make = (...a) => new TimeMap(...a);

describe('Time Based Key-Value Store (#981)', () => {
  it('example 1', () => {
    runOps(
      make,
      ['TimeMap', 'set', 'get', 'get', 'set', 'get', 'get'],
      [[], ['foo', 'bar', 1], ['foo', 1], ['foo', 3], ['foo', 'bar2', 4], ['foo', 4], ['foo', 5]],
      [null, null, 'bar', 'bar', null, 'bar2', 'bar2'],
    );
  });

  it('unknown key returns empty string', () => {
    const tm = new TimeMap();
    assert.equal(tm.get('missing', 10), '');
    tm.set('a', '1', 5);
    assert.equal(tm.get('b', 10), '', 'a different key must not leak values');
  });

  it('query before the earliest timestamp returns empty string', () => {
    runOps(make, ['TimeMap', 'set', 'get', 'get'], [[], ['k', 'v', 10], ['k', 9], ['k', 1]], [null, null, '', '']);
  });

  it('exact timestamp, between timestamps, and after the last one', () => {
    runOps(
      make,
      ['TimeMap', 'set', 'set', 'set', 'get', 'get', 'get', 'get', 'get', 'get'],
      [[], ['k', 'a', 2], ['k', 'b', 5], ['k', 'c', 9], ['k', 2], ['k', 4], ['k', 5], ['k', 8], ['k', 9], ['k', 1000]],
      [null, null, null, null, 'a', 'a', 'b', 'b', 'c', 'c'],
    );
  });

  it('keys are independent and interleaved', () => {
    runOps(
      make,
      ['TimeMap', 'set', 'set', 'set', 'set', 'get', 'get', 'get', 'get'],
      [[], ['x', 'x1', 1], ['y', 'y1', 2], ['x', 'x2', 3], ['y', 'y2', 4], ['x', 3], ['y', 3], ['x', 2], ['y', 4]],
      [null, null, null, null, null, 'x2', 'y1', 'x1', 'y2'],
    );
  });

  it('same value stored at different timestamps', () => {
    runOps(make, ['TimeMap', 'set', 'set', 'get', 'get'], [[], ['k', 'same', 1], ['k', 'same', 2], ['k', 1], ['k', 2]], [null, null, null, 'same', 'same']);
  });

  it('values are returned as-is (including strings that look numeric)', () => {
    runOps(make, ['TimeMap', 'set', 'get'], [[], ['k', '007', 1], ['k', 1]], [null, null, '007']);
  });

  it('large: 10^5 sets on one key then 10^5 gets (must be logarithmic)', { timeout: 2000 }, () => {
    const rng = makeRng(981);
    const n = 100_000;
    const tm = new TimeMap();
    for (let i = 0; i < n; i++) tm.set('key', `v${i}`, i * 2 + 1);
    for (let q = 0; q < n; q++) {
      const ts = rng.int(0, n * 2 + 5);
      const expected = ts < 1 ? '' : `v${Math.min(n - 1, Math.floor((ts - 1) / 2))}`;
      const actual = tm.get('key', ts);
      if (actual !== expected) assert.fail(`get('key', ${ts}): expected ${fmt(expected)}, got ${fmt(actual)}`);
    }
  });
});
