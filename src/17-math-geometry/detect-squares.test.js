import { describe, it } from 'node:test';
import { DetectSquares } from './detect-squares.js';
import { runOps, makeRng } from '../../lib/testutil.js';

const make = (...a) => new DetectSquares(...a);

describe('Detect Squares', () => {
  it('example 1', () => {
    runOps(
      make,
      ['DetectSquares', 'add', 'add', 'add', 'count', 'count', 'add', 'count'],
      [[], [[3, 10]], [[11, 2]], [[3, 2]], [[11, 10]], [[14, 8]], [[11, 2]], [[11, 10]]],
      [null, null, null, null, 1, 0, null, 2],
    );
  });

  it('no points stored gives zero', () => {
    runOps(make, ['DetectSquares', 'count'], [[], [[5, 5]]], [null, 0]);
  });

  it('a rectangle that is not a square does not count', () => {
    runOps(
      make,
      ['DetectSquares', 'add', 'add', 'add', 'count'],
      [[], [[0, 0]], [[4, 0]], [[0, 2]], [[4, 2]]],
      [null, null, null, null, 0],
    );
  });

  it('square counted from any of its four corners', () => {
    const ops = ['DetectSquares', 'add', 'add', 'add', 'add', 'count', 'count', 'count', 'count'];
    const args = [[], [[1, 1]], [[1, 4]], [[4, 1]], [[4, 4]], [[1, 1]], [[1, 4]], [[4, 1]], [[4, 4]]];
    runOps(make, ops, args, [null, null, null, null, null, 1, 1, 1, 1]);
  });

  it('query point itself need not be stored', () => {
    runOps(
      make,
      ['DetectSquares', 'add', 'add', 'add', 'count'],
      [[], [[0, 0]], [[0, 3]], [[3, 0]], [[3, 3]]],
      [null, null, null, null, 1],
    );
  });

  it('stored copy of the query point alone does not form a zero-area square', () => {
    runOps(
      make,
      ['DetectSquares', 'add', 'add', 'add', 'count'],
      [[], [[2, 2]], [[2, 2]], [[2, 2]], [[2, 2]]],
      [null, null, null, null, 0],
    );
  });

  it('squares of different sizes and directions around one corner', () => {
    // query (5,5); squares: side 1 up-right, side 2 down-left, side 3 up-left
    const ops = ['DetectSquares', 'add', 'add', 'add', 'add', 'add', 'add', 'add', 'add', 'add', 'count'];
    const args = [
      [],
      [[6, 5]], [[5, 6]], [[6, 6]],
      [[3, 5]], [[5, 3]], [[3, 3]],
      [[2, 5]], [[5, 8]], [[2, 8]],
      [[5, 5]],
    ];
    runOps(make, ops, args, [null, null, null, null, null, null, null, null, null, null, 3]);
  });

  it('duplicate points multiply the count', () => {
    const ops = ['DetectSquares', 'add', 'add', 'add', 'add', 'add', 'add', 'count', 'add', 'count'];
    const args = [[], [[0, 0]], [[0, 0]], [[0, 5]], [[5, 0]], [[5, 0]], [[5, 0]], [[5, 5]], [[0, 5]], [[5, 5]]];
    // corners (0,0)x2, (0,5)x1, (5,0)x3 -> 2*1*3 = 6; after another (0,5): 2*2*3 = 12
    runOps(make, ops, args, [null, null, null, null, null, null, null, 6, null, 12]);
  });

  it('counts accumulate as points are added', () => {
    runOps(
      make,
      ['DetectSquares', 'count', 'add', 'count', 'add', 'count', 'add', 'count'],
      [[], [[0, 0]], [[1, 1]], [[0, 0]], [[0, 1]], [[0, 0]], [[1, 0]], [[0, 0]]],
      [null, 0, null, 0, null, 0, null, 1],
    );
  });

  it('points on the same row or column never make a square', () => {
    runOps(
      make,
      ['DetectSquares', 'add', 'add', 'add', 'count', 'count'],
      [[], [[1, 1]], [[2, 1]], [[3, 1]], [[4, 1]], [[1, 4]]],
      [null, null, null, null, 0, 0],
    );
  });

  it('boundary coordinates 0 and 1000', () => {
    runOps(
      make,
      ['DetectSquares', 'add', 'add', 'add', 'count'],
      [[], [[0, 0]], [[0, 1000]], [[1000, 0]], [[1000, 1000]]],
      [null, null, null, null, 1],
    );
  });

  it('large input: full 50x50 lattice, closed-form square counts', { timeout: 2000 }, () => {
    const k = 50;
    const rng = makeRng(2013);
    const ops = ['DetectSquares'];
    const args = [[]];
    const expected = [null];
    for (let x = 0; x < k; x++) {
      for (let y = 0; y < k; y++) {
        ops.push('add');
        args.push([[x, y]]);
        expected.push(null);
      }
    }
    for (let q = 0; q < 500; q++) {
      const x = rng.int(0, k - 1);
      const y = rng.int(0, k - 1);
      // squares with the query as a corner: for each (horizontal, vertical) direction pair, one per side length up to the smaller reach
      const right = k - 1 - x;
      const left = x;
      const up = k - 1 - y;
      const down = y;
      const count = Math.min(right, up) + Math.min(right, down) + Math.min(left, up) + Math.min(left, down);
      ops.push('count');
      args.push([[x, y]]);
      expected.push(count);
    }
    runOps(make, ops, args, expected);
  });
});
