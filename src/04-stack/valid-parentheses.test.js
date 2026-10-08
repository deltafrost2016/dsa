import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isValid } from './valid-parentheses.js';
import { fmt, makeRng } from '../../lib/testutil.js';

function check(s, expected) {
  const actual = isValid(s);
  assert.equal(
    actual,
    expected,
    `isValid(${fmt(s)})\n  expected: ${fmt(expected)}\n  actual:   ${fmt(actual)}`,
  );
}

// Independent oracle: repeatedly delete adjacent matched pairs until nothing changes.
function brute(s) {
  let prev;
  do {
    prev = s;
    s = s.replace('()', '').replace('[]', '').replace('{}', '');
  } while (s !== prev);
  return s === '';
}

describe('Valid Parentheses', () => {
  it('example 1: "()" -> true', () => check('()', true));
  it('example 2: "()[]{}" -> true', () => check('()[]{}', true));
  it('example 3: "(]" -> false', () => check('(]', false));
  it('example 4: "([])" -> true', () => check('([])', true));
  it('example 5: "([)]" -> false (interleaved)', () => check('([)]', false));
  it('single opening bracket -> false', () => check('(', false));
  it('single closing bracket -> false', () => check(')', false));
  it('closing bracket first -> false', () => check(')(', false));
  it('unclosed opening brackets left over', () => check('((()', false));
  it('extra closing brackets', () => check('())', false));
  it('deeply nested mixed types', () => check('{[()()]}', true));
  it('nested but wrong closer', () => check('{[(])}', false));
  it('same type, different kinds do not cancel', () => check('(}', false));
  it('sequence of valid groups followed by a stray closer', () => check('()[]{}}', false));
  it('all three kinds interleaved and balanced', () => check('([{}])([{}])', true));
  it('odd length -> false', () => check('([]', false));

  it('matches the pair-removal oracle on random strings', () => {
    const rng = makeRng(20);
    const chars = [...'()[]{}'];
    for (let t = 0; t < 500; t++) {
      const len = rng.int(1, 10);
      let s = '';
      for (let i = 0; i < len; i++) s += rng.pick(chars);
      check(s, brute(s));
    }
  });

  it('large input: 10^5 deeply nested valid brackets (stress beyond the 10^4 constraint)', { timeout: 2000 }, () => {
    const n = 50000;
    check('('.repeat(n) + ')'.repeat(n), true);
  });

  it('large input: long valid mixed sequence', { timeout: 2000 }, () => {
    check('([{}])'.repeat(20000), true);
  });

  it('large input: one mismatch at the very end', { timeout: 2000 }, () => {
    check('('.repeat(49999) + ']' + ')'.repeat(49999) + ')', false);
  });

  it('large input: all opening brackets -> false', { timeout: 2000 }, () => {
    check('['.repeat(100000), false);
  });
});
