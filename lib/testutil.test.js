import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { sameMembers, closeTo, clone, runOps, makeRng, randomArray, fmt } from './testutil.js';

const failsWith = (fn, pattern) => assert.throws(fn, (e) => pattern.test(e.message));

describe('sameMembers', () => {
  it('ignores order of primitives', () => sameMembers([3, 1, 2], [1, 2, 3]));
  it('detects different members', () => failsWith(() => sameMembers([1, 2], [1, 3]), /expected:/));
  it('detects different lengths', () => assert.throws(() => sameMembers([1], [1, 1])));
  it('respects duplicates', () => assert.throws(() => sameMembers([1, 1, 2], [1, 2, 2])));
  it('orders outer arrays of arrays', () => sameMembers([[2, 1], [1, 2]].reverse(), [[1, 2], [2, 1]]));
  it('inner order matters by default', () => assert.throws(() => sameMembers([[2, 1]], [[1, 2]])));
  it('sortInner ignores inner order', () => {
    sameMembers([[3, 1, 2], [5, 4]], [[4, 5], [1, 2, 3]], { sortInner: true });
  });
  it('sortInner still detects real differences', () => {
    assert.throws(() => sameMembers([[1, 2]], [[1, 3]], { sortInner: true }));
  });
  it('works for strings and nested string arrays', () => {
    sameMembers(['b', 'a'], ['a', 'b']);
    sameMembers([['eat', 'tea'], ['bat']], [['bat'], ['eat', 'tea']]);
  });
  it('does not mutate inputs', () => {
    const a = [[2, 1], [0]];
    const b = [[0], [1, 2]];
    sameMembers(a, b, { sortInner: true });
    assert.deepEqual(a, [[2, 1], [0]]);
    assert.deepEqual(b, [[0], [1, 2]]);
  });
  it('empty arrays match', () => sameMembers([], []));
  it('non-array actual fails clearly', () => failsWith(() => sameMembers(undefined, []), /expected an array/));
  it('custom message is included', () => failsWith(() => sameMembers([1], [2], { message: 'input=[9]' }), /input=\[9\]/));
});

describe('closeTo', () => {
  it('passes within default eps', () => closeTo(0.1 + 0.2, 0.3));
  it('fails outside eps with a message', () => failsWith(() => closeTo(1, 1.1), /within 0.00001 of 1.1/));
  it('honors custom eps', () => closeTo(1, 1.4, 0.5));
  it('rejects non-numbers and NaN', () => {
    assert.throws(() => closeTo('1', 1));
    assert.throws(() => closeTo(NaN, 1));
  });
  it('includes extra message', () => failsWith(() => closeTo(5, 1, 1e-5, 'nums=[1]'), /nums=\[1\]/));
});

describe('clone', () => {
  it('deep copies', () => {
    const a = { x: [1, [2]] };
    const b = clone(a);
    b.x[1].push(3);
    assert.deepEqual(a, { x: [1, [2]] });
  });
});

describe('runOps', () => {
  class Counter {
    constructor(start = 0) { this.n = start; }
    inc() { this.n++; }
    get() { return this.n; }
    half() { return this.n / 3; }
    boom() { throw new Error('Not implemented'); }
  }
  const make = (...a) => new Counter(...a);

  it('passes a correct sequence, skipping null expectations', () => {
    runOps(make, ['Counter', 'inc', 'inc', 'get'], [[5], [], [], []], [null, null, null, 7]);
  });
  it('compares non-integers with tolerance', () => {
    runOps(make, ['Counter', 'half'], [[1], []], [null, 0.33333333]);
  });
  it('reports the failing step clearly', () => {
    failsWith(
      () => runOps(make, ['Counter', 'inc', 'get'], [[0], [], []], [null, null, 5]),
      /step 2: get\(\)[\s\S]*expected: 5[\s\S]*actual:\s+1/,
    );
  });
  it('shows args of the failing step', () => {
    class Adder { add(a, b) { return a + b; } }
    failsWith(
      () => runOps(() => new Adder(), ['Adder', 'add'], [[], [1, 2]], [null, 4]),
      /step 1: add\(1, 2\)/,
    );
  });
  it('wraps thrown errors with step info and original message', () => {
    failsWith(() => runOps(make, ['Counter', 'boom'], [[], []], [null, null]), /step 1: boom\(\).*Not implemented/);
  });
  it('flags unknown methods', () => {
    failsWith(() => runOps(make, ['Counter', 'nope'], [[], []], [null, null]), /method "nope" does not exist/);
  });
  it('reports a throwing constructor', () => {
    failsWith(() => runOps(() => { throw new Error('bad ctor'); }, ['X'], [[]], [null]), /bad ctor/);
  });
  it('requires equal-length arrays', () => assert.throws(() => runOps(make, ['Counter'], [], [null])));
  it('checks falsy but real expectations (0, false)', () => {
    class T { f() { return false; } z() { return 0; } }
    runOps(() => new T(), ['T', 'f', 'z'], [[], [], []], [null, false, 0]);
    assert.throws(() => runOps(() => new T(), ['T', 'z'], [[], []], [null, 1]));
  });
});

describe('makeRng', () => {
  it('is deterministic per seed', () => {
    const a = makeRng(42);
    const b = makeRng(42);
    for (let i = 0; i < 50; i++) assert.equal(a.next(), b.next());
  });
  it('differs between seeds', () => {
    assert.notEqual(makeRng(1).next(), makeRng(2).next());
  });
  it('next is in [0,1)', () => {
    const r = makeRng(7);
    for (let i = 0; i < 1000; i++) {
      const v = r.next();
      assert.ok(v >= 0 && v < 1);
    }
  });
  it('int is inclusive on both ends and covers the range', () => {
    const r = makeRng(3);
    const seen = new Set();
    for (let i = 0; i < 500; i++) seen.add(r.int(-2, 2));
    assert.deepEqual([...seen].sort((a, b) => a - b), [-2, -1, 0, 1, 2]);
    assert.equal(r.int(5, 5), 5);
  });
  it('pick returns members', () => {
    const r = makeRng(9);
    for (let i = 0; i < 50; i++) assert.ok(['a', 'b', 'c'].includes(r.pick(['a', 'b', 'c'])));
  });
  it('shuffle returns a new permutation without mutating', () => {
    const r = makeRng(11);
    const src = [1, 2, 3, 4, 5, 6, 7, 8];
    const out = r.shuffle(src);
    assert.deepEqual(src, [1, 2, 3, 4, 5, 6, 7, 8]);
    assert.notEqual(out, src);
    assert.deepEqual([...out].sort((a, b) => a - b), src);
  });
  it('randomArray has length and bounds, reproducible', () => {
    const a = randomArray(makeRng(5), 100, -3, 3);
    assert.equal(a.length, 100);
    assert.ok(a.every((v) => v >= -3 && v <= 3 && Number.isInteger(v)));
    assert.deepEqual(a, randomArray(makeRng(5), 100, -3, 3));
  });
  it('known first value is stable across platforms', () => {
    assert.equal(makeRng(1).next(), 0.6270739405881613);
  });
});

describe('fmt', () => {
  it('primitives and specials', () => {
    assert.equal(fmt(undefined), 'undefined');
    assert.equal(fmt(null), 'null');
    assert.equal(fmt(NaN), 'NaN');
    assert.equal(fmt(Infinity), 'Infinity');
    assert.equal(fmt(-Infinity), '-Infinity');
    assert.equal(fmt(-0), '-0');
    assert.equal(fmt('a"b'), '"a\\"b"');
    assert.equal(fmt(10n), '10n');
  });
  it('arrays and objects', () => {
    assert.equal(fmt([1, [2, undefined], 'x']), '[1, [2, undefined], "x"]');
    assert.equal(fmt({ a: 1, b: [NaN] }), '{a: 1, b: [NaN]}');
  });
  it('truncates big arrays', () => {
    const s = fmt(Array.from({ length: 1000 }, (_, i) => i));
    assert.match(s, /\.\.\.\(980 more\)/);
    assert.ok(s.length < 200);
  });
  it('truncates long strings', () => {
    assert.match(fmt('x'.repeat(1000)), /\(1000 chars\)/);
  });
  it('is cycle safe', () => {
    const a = { name: 'a' };
    a.self = a;
    const l = [1];
    l.push(l);
    assert.match(fmt(a), /\[Circular\]/);
    assert.match(fmt(l), /\[Circular\]/);
  });
  it('limits depth', () => {
    let deep = [];
    for (let i = 0; i < 100; i++) deep = [deep];
    assert.match(fmt(deep), /\[\.\.\.\]/);
  });
  it('shows class names, Map and Set, functions', () => {
    class P { constructor() { this.x = 1; } }
    assert.equal(fmt(new P()), 'P {x: 1}');
    assert.equal(fmt(new Map([[1, 2]])), 'Map{1 => 2}');
    assert.equal(fmt(new Set([1])), 'Set{1}');
    assert.match(fmt(function foo() {}), /Function foo/);
  });
});
