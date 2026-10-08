import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { evalRPN } from './evaluate-reverse-polish-notation.js';
import { clone, fmt, makeRng } from '../../lib/testutil.js';

// `+ 0` turns -0 into 0 so a correct truncation like 0 / -3 is not rejected by strict equality.
function check(tokens, expected) {
  const actual = evalRPN(clone(tokens));
  assert.equal(
    typeof actual === 'number' ? actual + 0 : actual,
    expected + 0,
    `evalRPN(${fmt(tokens)})\n  expected: ${fmt(expected)}\n  actual:   ${fmt(actual)}`,
  );
}

describe('Evaluate Reverse Polish Notation', () => {
  it('example 1: ["2","1","+","3","*"] -> 9', () => check(['2', '1', '+', '3', '*'], 9));
  it('example 2: ["4","13","5","/","+"] -> 6', () => check(['4', '13', '5', '/', '+'], 6));
  it('example 3: the long one -> 22', () =>
    check(['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+'], 22));
  it('single number', () => check(['42'], 42));
  it('single negative number', () => check(['-7'], -7));
  it('subtraction order: a b - means a - b', () => check(['5', '3', '-'], 2));
  it('subtraction can go negative', () => check(['3', '5', '-'], -2));
  it('division order: a b / means a / b', () => check(['8', '2', '/'], 4));
  it('division truncates toward zero (positive)', () => check(['7', '2', '/'], 3));
  it('division truncates toward zero (negative numerator)', () => check(['-7', '2', '/'], -3));
  it('division truncates toward zero (negative denominator)', () => check(['7', '-2', '/'], -3));
  it('division truncates toward zero (both negative)', () => check(['-7', '-2', '/'], 3));
  it('division with |a| < |b| is 0', () => check(['1', '2', '/'], 0));
  it('0 divided by a negative is 0', () => check(['0', '-3', '/'], 0));
  it('multiplication by zero', () => check(['0', '5', '*'], 0));
  it('negative operands with multiplication', () => check(['-3', '-4', '*'], 12));
  it('operator right after two numbers, nested on the left', () => check(['2', '3', '+', '4', '5', '+', '*'], 45));
  it('chain of subtractions is left-associative in RPN form', () => check(['10', '2', '-', '3', '-'], 5));
  it('large intermediate results within 32 bits', () => check(['46340', '46340', '*'], 2147395600));
  it('result at the 32-bit boundary', () => check(['-2147483647', '1', '-'], -2147483648));

  it('matches a recursive-descent oracle on random expressions', () => {
    const rng = makeRng(150);
    const gen = (depth) => {
      if (depth === 0 || rng.next() < 0.25) return { tokens: [String(rng.int(-9, 9))], value: null };
      const left = gen(depth - 1);
      const right = gen(depth - 1);
      return { left, right, op: rng.pick(['+', '-', '*', '/']) };
    };
    const evalTree = (node) => {
      if (!node.op) return Number(node.tokens[0]);
      const a = evalTree(node.left);
      const b = evalTree(node.right);
      switch (node.op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        default: return b === 0 ? null : Math.trunc(a / b);
      }
    };
    const flatten = (node) => (node.op ? [...flatten(node.left), ...flatten(node.right), node.op] : node.tokens);
    let used = 0;
    for (let t = 0; t < 400 && used < 150; t++) {
      const tree = gen(3);
      // skip trees that divide by zero anywhere (the check below re-evaluates with null propagation)
      const hasZeroDiv = (n) => {
        if (!n.op) return false;
        if (hasZeroDiv(n.left) || hasZeroDiv(n.right)) return true;
        return n.op === '/' && evalTree(n.right) === 0;
      };
      if (hasZeroDiv(tree)) continue;
      used++;
      check(flatten(tree), evalTree(tree));
    }
    assert.ok(used >= 50, 'oracle generated too few valid expressions');
  });

  it('large input: 10^4 tokens of alternating additions', { timeout: 2000 }, () => {
    const tokens = ['1'];
    for (let i = 0; i < 4999; i++) tokens.push('1', '+');
    check(tokens, 5000);
  });

  it('large input: all numbers first, then all operators (deep stack)', { timeout: 2000 }, () => {
    const n = 5000;
    const tokens = [...Array.from({ length: n }, () => '2'), ...Array.from({ length: n - 1 }, () => '+')];
    check(tokens, 2 * n);
  });
});
