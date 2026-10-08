import { describe, it } from 'node:test';
import { runOps, makeRng, randomArray } from '../../lib/testutil.js';
import { MedianFinder } from './find-median-from-data-stream.js';

const make = (...a) => new MedianFinder(...a);

/** Build ops/args/expected that add each value then read the median. */
function script(values) {
  const ops = ['MedianFinder'];
  const args = [[]];
  const exp = [null];
  const sorted = [];
  for (const v of values) {
    let lo = 0;
    let hi = sorted.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (sorted[mid] < v) lo = mid + 1;
      else hi = mid;
    }
    sorted.splice(lo, 0, v);
    const n = sorted.length;
    const med = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    ops.push('addNum', 'findMedian');
    args.push([v], []);
    exp.push(null, med === 0 ? 0 : med); // normalise -0 to 0
  }
  return { ops, args, exp };
}

const run = (values) => {
  const { ops, args, exp } = script(values);
  runOps(make, ops, args, exp);
};

describe('Find Median from Data Stream', () => {
  it('official example', () => {
    runOps(
      make,
      ['MedianFinder', 'addNum', 'addNum', 'findMedian', 'addNum', 'findMedian'],
      [[], [1], [2], [], [3], []],
      [null, null, null, 1.5, null, 2.0],
    );
  });

  it('single number', () => run([42]));
  it('two numbers average', () => run([1, 4]));
  it('ascending inserts', () => run([1, 2, 3, 4, 5, 6, 7]));
  it('descending inserts', () => run([7, 6, 5, 4, 3, 2, 1]));
  it('alternating small and large', () => run([1, 100, 2, 99, 3, 98]));
  it('duplicates', () => run([5, 5, 5, 5, 5]));
  it('duplicates mixed with others', () => run([2, 2, 3, 3, 1, 1, 2]));
  it('negative numbers', () => run([-1, -2, -3, -4]));
  it('negatives and positives cancel to zero', () => run([-1, 1, -5, 5]));
  it('zero values', () => run([0, 0, 0, 0]));
  it('boundary values', () => run([100000, -100000, 0, 100000, -100000]));
  it('median stays correct when new value lands in the middle', () => run([10, 20, 30, 40, 25, 26]));
  it('repeated findMedian calls without adding return the same value', () => {
    runOps(
      make,
      ['MedianFinder', 'addNum', 'addNum', 'addNum', 'findMedian', 'findMedian', 'findMedian'],
      [[], [3], [1], [2], [], [], []],
      [null, null, null, null, 2, 2, 2],
    );
  });
  it('even-count medians that land on half-integers', () =>
    run([1, 2, 4, 7, 8, 9, 10, 11]));

  it('20000 random numbers, median read after every add', { timeout: 2000 }, () => {
    const rng = makeRng(295);
    run(randomArray(rng, 20000, -100000, 100000));
  });

  it('20000 numbers drawn from a tiny range (lots of ties)', { timeout: 2000 }, () => {
    const rng = makeRng(2951);
    run(randomArray(rng, 20000, -3, 3));
  });

  it('20000 sorted inserts', { timeout: 2000 }, () => {
    run(Array.from({ length: 20000 }, (_, i) => i - 10000));
  });

  it('20000 adds then reads only at the end', { timeout: 2000 }, () => {
    const rng = makeRng(2952);
    const values = randomArray(rng, 20001, -100000, 100000);
    const sorted = [...values].sort((a, b) => a - b);
    runOps(
      make,
      ['MedianFinder', ...values.map(() => 'addNum'), 'findMedian'],
      [[], ...values.map((v) => [v]), []],
      [null, ...values.map(() => null), sorted[10000] === 0 ? 0 : sorted[10000]],
    );
  });
});
