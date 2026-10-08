import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { LRUCache } from './lru-cache.js';
import { runOps, makeRng, fmt } from '../../lib/testutil.js';

const make = (...a) => new LRUCache(...a);

/** Slow-but-obviously-correct oracle: entries ordered from least to most recently used. */
class NaiveLRU {
  constructor(capacity) {
    this.capacity = capacity;
    this.entries = [];
  }

  get(key) {
    const i = this.entries.findIndex(([k]) => k === key);
    if (i === -1) return -1;
    const [entry] = this.entries.splice(i, 1);
    this.entries.push(entry);
    return entry[1];
  }

  put(key, value) {
    const i = this.entries.findIndex(([k]) => k === key);
    if (i !== -1) this.entries.splice(i, 1);
    this.entries.push([key, value]);
    if (this.entries.length > this.capacity) this.entries.shift();
  }
}

describe('LRU Cache (#146)', () => {
  it('example 1', () => {
    runOps(
      make,
      ['LRUCache', 'put', 'put', 'get', 'put', 'get', 'put', 'get', 'get', 'get'],
      [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]],
      [null, null, null, 1, null, -1, null, -1, 3, 4],
    );
  });

  it('get on an empty cache returns -1', () => {
    runOps(make, ['LRUCache', 'get'], [[1], [5]], [null, -1]);
  });

  it('capacity 1 evicts on every new key', () => {
    runOps(
      make,
      ['LRUCache', 'put', 'get', 'put', 'get', 'get'],
      [[1], [1, 10], [1], [2, 20], [1], [2]],
      [null, null, 10, null, -1, 20],
    );
  });

  it('put on an existing key updates the value and does not evict', () => {
    runOps(
      make,
      ['LRUCache', 'put', 'put', 'put', 'get', 'get'],
      [[2], [1, 1], [2, 2], [2, 22], [1], [2]],
      [null, null, null, null, 1, 22],
    );
  });

  it('put on an existing key refreshes its recency', () => {
    runOps(
      make,
      ['LRUCache', 'put', 'put', 'put', 'put', 'get', 'get', 'get'],
      [[2], [1, 1], [2, 2], [1, 11], [3, 3], [1], [2], [3]],
      [null, null, null, null, null, 11, -1, 3],
    );
  });

  it('get refreshes recency (the read key survives eviction)', () => {
    runOps(
      make,
      ['LRUCache', 'put', 'put', 'put', 'get', 'put', 'get', 'get', 'get'],
      [[3], [1, 1], [2, 2], [3, 3], [1], [4, 4], [1], [2], [3]],
      [null, null, null, null, 1, null, 1, -1, 3],
    );
  });

  it('a missed get does not change recency or insert anything', () => {
    runOps(
      make,
      ['LRUCache', 'put', 'put', 'get', 'put', 'get', 'get', 'get'],
      [[2], [1, 1], [2, 2], [99], [3, 3], [1], [2], [3]],
      [null, null, null, -1, null, -1, 2, 3],
    );
  });

  it('value 0 is a real value, not a miss', () => {
    runOps(make, ['LRUCache', 'put', 'get', 'get'], [[1], [0, 0], [0], [5]], [null, null, 0, -1]);
  });

  it('keys can be re-inserted after eviction', () => {
    runOps(
      make,
      ['LRUCache', 'put', 'put', 'put', 'get', 'put', 'get', 'get'],
      [[2], [1, 1], [2, 2], [3, 3], [1], [1, 100], [1], [3]],
      [null, null, null, null, -1, null, 100, 3],
    );
  });

  it('eviction order follows last use across many operations', () => {
    runOps(
      make,
      ['LRUCache', 'put', 'put', 'put', 'put', 'get', 'get', 'put', 'put', 'get', 'get', 'get', 'get', 'get'],
      [[4], [1, 1], [2, 2], [3, 3], [4, 4], [2], [1], [5, 5], [6, 6], [3], [4], [2], [1], [6]],
      [null, null, null, null, null, 2, 1, null, null, -1, -1, 2, 1, 6],
    );
  });

  it('random operation sequences agree with a naive oracle', () => {
    const rng = makeRng(146);
    for (let t = 0; t < 40; t++) {
      const capacity = rng.int(1, 5);
      const cache = new LRUCache(capacity);
      const oracle = new NaiveLRU(capacity);
      const log = [];
      for (let step = 0; step < 300; step++) {
        const key = rng.int(0, 8);
        if (rng.int(0, 1) === 0) {
          const value = rng.int(0, 100);
          log.push(`put(${key},${value})`);
          oracle.put(key, value);
          cache.put(key, value);
        } else {
          log.push(`get(${key})`);
          const expected = oracle.get(key);
          const actual = cache.get(key);
          if (actual !== expected) {
            assert.fail(`capacity ${capacity}, after ${log.slice(-12).join(' ')}: expected ${fmt(expected)}, got ${fmt(actual)}`);
          }
        }
      }
    }
  });

  it('large cache (capacity 2 * 10^4): O(1) get/put required', { timeout: 2000 }, () => {
    const rng = makeRng(1460);
    const cap = 20_000;
    const cache = new LRUCache(cap);
    for (let k = 0; k < cap; k++) cache.put(k, k * 2);
    // Touch every key once in a random order; this fixes the recency order to `order`.
    const order = rng.shuffle(Array.from({ length: cap }, (_, k) => k));
    for (const k of order) {
      const v = cache.get(k);
      if (v !== k * 2) assert.fail(`get(${k}) expected ${k * 2}, got ${fmt(v)}`);
    }
    // Insert cap/2 new keys: exactly the first cap/2 keys of `order` (least recently used) are evicted.
    const half = cap / 2;
    for (let j = 0; j < half; j++) cache.put(cap + j, -j - 1 + 1000000);
    for (let i = 0; i < cap; i++) {
      const k = order[i];
      const v = cache.get(k);
      const expected = i < half ? -1 : k * 2;
      if (v !== expected) assert.fail(`after evicting the oldest ${half}: get(${k}) expected ${expected}, got ${fmt(v)}`);
    }
    for (let j = 0; j < half; j++) {
      const v = cache.get(cap + j);
      if (v !== -j - 1 + 1000000) assert.fail(`new key ${cap + j} expected ${-j - 1 + 1000000}, got ${fmt(v)}`);
    }
  });
});
