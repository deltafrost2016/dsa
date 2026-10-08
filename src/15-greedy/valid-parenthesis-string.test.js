import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fmt } from '../../lib/testutil.js';
import { checkValidString } from './valid-parenthesis-string.js';

const check = (s, expected) =>
  assert.equal(checkValidString(s), expected, `checkValidString(${fmt(s)}): expected ${expected}`);

describe('Valid Parenthesis String', () => {
  it('example 1: "()" -> true', () => check('()', true));
  it('example 2: "(*)" -> true', () => check('(*)', true));
  it('example 3: "(*))" -> true', () => check('(*))', true));
  it('single "(" -> false', () => check('(', false));
  it('single ")" -> false', () => check(')', false));
  it('single "*" -> true (empty)', () => check('*', true));
  it('"**" -> true', () => check('**', true));
  it('"(*" -> true (star as empty or ")")', () => check('(*', true));
  it('")*" -> false (star cannot fix a leading close)', () => check(')*', false));
  it('"*)" -> true (star as "(")', () => check('*)', true));
  it('"*(" -> false', () => check('*(', false));
  it('")(" -> false (wrong order)', () => check(')(', false));
  it('"(()" -> false', () => check('(()', false));
  it('"((*)" -> true', () => check('((*)', true));
  it('"(*()" -> true', () => check('(*()', true));
  it('"*(()" -> false', () => check('*(()', false));
  it('"((**" -> true', () => check('((**', true));
  it('"(((*" -> false (one star cannot close three)', () => check('(((*', false));
  it('"***)))" -> true', () => check('***)))', true));
  it('"***))))" -> false', () => check('***))))', false));
  it('")*(" -> false', () => check(')*(', false));
  it('"()()" -> true', () => check('()()', true));
  it('"(*)(*)" -> true', () => check('(*)(*)', true));
  it('"*)*)" -> true (first star opens)', () => check('*)*)', true));
  it('"(*(" -> false', () => check('(*(', false));
  it('"(*)*(" -> false (trailing open can never close)', () => check('(*)*(', false));
  it('"((*)*)))" -> true (both stars open)', () => check('((*)*)))', true));
  it('50000 "(" then 50000 "*" -> true', () => check('('.repeat(50000) + '*'.repeat(50000), true), { timeout: 2000 });
  it('50001 "(" then 50000 "*" -> false', () => check('('.repeat(50001) + '*'.repeat(50000), false), { timeout: 2000 });
  it('50000 "*" then 50000 ")" -> true', () => check('*'.repeat(50000) + ')'.repeat(50000), true), { timeout: 2000 });
  it('50000 "*" then 50001 ")" -> false', () => check('*'.repeat(50000) + ')'.repeat(50001), false), { timeout: 2000 });
  it('30 stars then "(" -> false (3^n backtracking cannot finish)', () => check('*'.repeat(30) + '(', false), { timeout: 2000 });
  it('40 stars then ")(" -> false', () => check('*'.repeat(40) + ')(', false), { timeout: 2000 });
  it('"(*)" x 20000 -> true', () => check('(*)'.repeat(20000), true), { timeout: 2000 });
});
