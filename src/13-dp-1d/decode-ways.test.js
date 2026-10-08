import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fmt } from '../../lib/testutil.js';
import { numDecodings } from './decode-ways.js';

function check(s, expected) {
  const actual = numDecodings(s);
  assert.strictEqual(actual, expected, `numDecodings(${fmt(s)})\n  expected: ${expected}\n  actual:   ${fmt(actual)}`);
}

describe('Decode Ways', () => {
  it('example 1: "12" -> AB, L', () => check('12', 2));
  it('example 2: "226" -> BZ, VF, BBF', () => check('226', 3));
  it('example 3: "06" has a leading zero', () => check('06', 0));
  it('single digit', () => check('1', 1));
  it('single zero', () => check('0', 0));
  it('"10" can only be J', () => check('10', 1));
  it('"20" can only be T', () => check('20', 1));
  it('"27" can only be 2 and 7', () => check('27', 1));
  it('"30" is impossible', () => check('30', 0));
  it('"100" is impossible', () => check('100', 0));
  it('"101" -> JA', () => check('101', 1));
  it('"230" is impossible', () => check('230', 0));
  it('"2101" -> BJA', () => check('2101', 1));
  it('"11106" -> AAJF, KJF', () => check('11106', 2));
  it('"1123"', () => check('1123', 5));
  it('"12120"', () => check('12120', 3));
  it('"2611055971756562"', () => check('2611055971756562', 4));
  it('"10" repeated 20 times has exactly one decoding', () => check('10'.repeat(20), 1));
  it('"1" x 40 follows Fibonacci', { timeout: 2000 }, () => check('1'.repeat(40), 165580141));
  it('"1" x 45 (maximum answer; exponential recursion is too slow)', { timeout: 2000 }, () => {
    check('1'.repeat(45), 1836311903);
  });
  it('100 digits that never combine', { timeout: 2000 }, () => check('7'.repeat(100), 1));
});
