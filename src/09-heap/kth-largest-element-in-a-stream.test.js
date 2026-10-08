import { describe, it } from 'node:test';
import { runOps, makeRng, randomArray } from '../../lib/testutil.js';
import { KthLargest } from './kth-largest-element-in-a-stream.js';

const make = (...a) => new KthLargest(...a);

/** Brute-force model: keep a sorted array via binary insertion. */
function model(k, nums, adds) {
  const sorted = [...nums].sort((a, b) => a - b);
  return adds.map((v) => {
    let lo = 0;
    let hi = sorted.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (sorted[mid] < v) lo = mid + 1;
      else hi = mid;
    }
    sorted.splice(lo, 0, v);
    return sorted[sorted.length - k];
  });
}

describe('Kth Largest Element in a Stream', () => {
  it('official example: k=3, [4,5,8,2]', () => {
    runOps(
      make,
      ['KthLargest', 'add', 'add', 'add', 'add', 'add'],
      [[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]],
      [null, 4, 5, 5, 8, 8],
    );
  });

  it('duplicates in the initial array: k=4, [7,7,7,7,8,3]', () => {
    runOps(
      make,
      ['KthLargest', 'add', 'add', 'add', 'add', 'add'],
      [[4, [7, 7, 7, 7, 8, 3]], [2], [10], [9], [9], [3]],
      [null, 7, 7, 7, 8, 8],
    );
  });

  it('k=1 tracks the running maximum', () => {
    runOps(
      make,
      ['KthLargest', 'add', 'add', 'add', 'add'],
      [[1, [1]], [0], [5], [3], [5]],
      [null, 1, 5, 5, 5],
    );
  });

  it('starts from an empty initial array', () => {
    runOps(
      make,
      ['KthLargest', 'add', 'add', 'add', 'add', 'add'],
      [[1, []], [-3], [-2], [-4], [0], [4]],
      [null, -3, -2, -2, 0, 4],
    );
  });

  it('empty start with k=2 fills up gradually', () => {
    runOps(
      make,
      ['KthLargest', 'add', 'add', 'add', 'add'],
      [[2, []], [5], [1], [7], [6]],
      [null, null, 1, 5, 6],
    );
  });

  it('duplicates count as separate entries', () => {
    runOps(
      make,
      ['KthLargest', 'add', 'add', 'add'],
      [[2, [9, 9, 3]], [9], [1], [10]],
      [null, 9, 9, 9],
    );
  });

  it('all-equal values', () => {
    runOps(
      make,
      ['KthLargest', 'add', 'add', 'add'],
      [[3, [2, 2, 2]], [2], [2], [2]],
      [null, 2, 2, 2],
    );
  });

  it('negative values and boundary values', () => {
    runOps(
      make,
      ['KthLargest', 'add', 'add', 'add', 'add'],
      [[2, [-10000, 10000]], [-10000], [10000], [0], [-1]],
      [null, -10000, 10000, 10000, 10000],
    );
  });

  it('k equals initial size: new small values never change the answer until beaten', () => {
    runOps(
      make,
      ['KthLargest', 'add', 'add', 'add'],
      [[3, [10, 20, 30]], [5], [15], [100]],
      [null, 10, 15, 20],
    );
  });

  it('20000 random adds match a sorted-array model', { timeout: 2000 }, () => {
    const rng = makeRng(703);
    const k = 500;
    const nums = randomArray(rng, 1000, -10000, 10000);
    const adds = randomArray(rng, 20000, -10000, 10000);
    const exp = model(k, nums, adds);
    runOps(
      make,
      ['KthLargest', ...adds.map(() => 'add')],
      [[k, nums], ...adds.map((v) => [v])],
      [null, ...exp],
    );
  });

  it('large k=1 and tiny k with many equal values', { timeout: 2000 }, () => {
    const rng = makeRng(7031);
    const adds = randomArray(rng, 20000, 0, 5);
    for (const k of [1, 2, 10]) {
      const nums = randomArray(rng, 20, 0, 5);
      const exp = model(k, nums, adds);
      runOps(
        make,
        ['KthLargest', ...adds.map(() => 'add')],
        [[k, nums], ...adds.map((v) => [v])],
        [null, ...exp],
      );
    }
  });
});
