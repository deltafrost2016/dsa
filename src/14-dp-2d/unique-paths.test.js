import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fmt } from '../../lib/testutil.js';
import { uniquePaths } from './unique-paths.js';

const check = (m, n, expected) =>
  assert.equal(uniquePaths(m, n), expected, `uniquePaths(${m}, ${n}): expected ${expected}, got different`);

describe('Unique Paths', () => {
  it('example 1: 3 x 7 -> 28', () => check(3, 7, 28));
  it('example 2: 3 x 2 -> 3', () => check(3, 2, 3));
  it('1 x 1 grid has exactly one path', () => check(1, 1, 1));
  it('single row -> 1', () => check(1, 10, 1));
  it('single column -> 1', () => check(10, 1, 1));
  it('2 x 2 -> 2', () => check(2, 2, 2));
  it('is symmetric: 7 x 3 -> 28', () => check(7, 3, 28));
  it('3 x 3 -> 6', () => check(3, 3, 6));
  it('4 x 4 -> 20', () => check(4, 4, 20));
  it('2 x 100 -> 100', () => check(2, 100, 100));
  it('100 x 2 -> 100', () => check(100, 2, 100));
  it('1 x 100 and 100 x 1 -> 1', () => {
    check(1, 100, 1);
    check(100, 1, 1);
  });
  it('23 x 12 -> 193536720 (LeetCode max-ish case)', () => check(23, 12, 193536720), { timeout: 2000 });
  it('17 x 17 -> 601080390 (brute force recursion is far too slow)', () => check(17, 17, 601080390), { timeout: 2000 });
  it('19 x 13 -> 86493225', () => check(19, 13, 86493225), { timeout: 2000 });
  it('returns a number', () => assert.equal(typeof uniquePaths(2, 3), 'number', fmt(uniquePaths(2, 3))));
});
