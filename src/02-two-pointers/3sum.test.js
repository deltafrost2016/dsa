import { describe, it } from 'node:test';
import { threeSum } from './3sum.js';
import { clone, sameMembers, makeRng, randomArray, fmt } from '../../lib/testutil.js';

// Triplets and the numbers inside each triplet may be in any order; duplicates are not allowed.
const check = (nums, expected) => {
  const actual = threeSum(clone(nums));
  sameMembers(actual, expected, { sortInner: true, message: `threeSum(${fmt(nums)})` });
};

// Test-side reference: sort + two pointers, skipping repeated values.
const reference = (nums) => {
  const a = [...nums].sort((x, y) => x - y);
  const out = [];
  for (let i = 0; i < a.length - 2; i++) {
    if (i > 0 && a[i] === a[i - 1]) continue;
    let l = i + 1;
    let r = a.length - 1;
    while (l < r) {
      const s = a[i] + a[l] + a[r];
      if (s < 0) l++;
      else if (s > 0) r--;
      else {
        out.push([a[i], a[l], a[r]]);
        l++;
        r--;
        while (l < r && a[l] === a[l - 1]) l++;
        while (l < r && a[r] === a[r + 1]) r--;
      }
    }
  }
  return out;
};

describe('3Sum', () => {
  it('example 1: [-1,0,1,2,-1,-4]', () => check([-1, 0, 1, 2, -1, -4], [[-1, -1, 2], [-1, 0, 1]]));
  it('example 2: [0,1,1] -> []', () => check([0, 1, 1], []));
  it('example 3: [0,0,0] -> [[0,0,0]]', () => check([0, 0, 0], [[0, 0, 0]]));
  it('exactly three elements, no solution', () => check([1, 2, 3], []));
  it('exactly three elements, solution', () => check([-3, 1, 2], [[-3, 1, 2]]));
  it('all positive -> []', () => check([1, 2, 3, 4, 5], []));
  it('all negative -> []', () => check([-5, -4, -3, -2, -1], []));
  it('many zeros give a single triplet', () => check([0, 0, 0, 0, 0, 0], [[0, 0, 0]]));
  it('zero plus a symmetric pair', () => check([-2, 0, 0, 2, 2], [[-2, 0, 2]]));
  it('duplicates must not produce duplicate triplets', () => check([-2, 0, 0, 2, 2, -2, -2], [[-2, 0, 2]]));
  it('several distinct triplets', () =>
    check(
      [-4, -2, -2, -2, 0, 1, 2, 2, 2, 3, 3, 4, 4, 6, 6],
      [[-4, -2, 6], [-4, 0, 4], [-4, 1, 3], [-4, 2, 2], [-2, -2, 4], [-2, 0, 2]],
    ));
  it('the same value used in two different positions', () => check([-1, -1, 2], [[-1, -1, 2]]));
  it('a value is not reused beyond its count', () => check([-1, 2, 5, 7], []));
  it('boundary values +-10^5', () => check([-100000, 100000, 0, 1], [[-100000, 0, 100000]]));
  it('unsorted input with negatives and positives', () =>
    check([3, -2, 1, 0, -1, 2, -3], [[-3, 0, 3], [-3, 1, 2], [-2, -1, 3], [-2, 0, 2], [-1, 0, 1]]));

  it('large input (3000 zeros) -> [[0,0,0]]', { timeout: 2000 }, () => {
    check(Array(3000).fill(0), [[0, 0, 0]]);
  });

  it('large random input (3000 values in -30000..30000) matches reference', { timeout: 2000 }, () => {
    const rng = makeRng(15);
    const nums = randomArray(rng, 3000, -30000, 30000);
    check(nums, reference(nums));
  });

  it('large random input (3000 values in -10^5..10^5) matches reference', { timeout: 2000 }, () => {
    const rng = makeRng(16);
    const nums = randomArray(rng, 3000, -100000, 100000);
    check(nums, reference(nums));
  });

  it('large input with no solution (3000 positives)', { timeout: 2000 }, () => {
    const rng = makeRng(17);
    check(randomArray(rng, 3000, 1, 100000), []);
  });
});
