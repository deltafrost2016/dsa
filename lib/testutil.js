/**
 * Test helpers shared by every problem test. Only depends on node:assert/strict.
 */
import assert from 'node:assert/strict';

// ------------------------------------------------------------------------ fmt

/**
 * JSON-ish stringifier for failure messages. Handles undefined, NaN, +-Infinity,
 * -0, bigint, Map/Set, functions, cycles ("[Circular]") and truncates long
 * arrays, long strings and deep nesting so messages stay readable.
 * @param {unknown} x
 * @param {{maxItems?: number, maxDepth?: number, maxString?: number}} [opts]
 * @returns {string}
 */
export function fmt(x, opts = {}) {
  const { maxItems = 20, maxDepth = 6, maxString = 200 } = opts;
  const path = [];
  const walk = (v, depth) => {
    if (v === undefined) return 'undefined';
    if (v === null) return 'null';
    switch (typeof v) {
      case 'number':
        return Object.is(v, -0) ? '-0' : String(v);
      case 'bigint':
        return `${v}n`;
      case 'boolean':
        return String(v);
      case 'string': {
        const s = v.length > maxString ? `${v.slice(0, maxString)}...(${v.length} chars)` : v;
        return JSON.stringify(s);
      }
      case 'function':
        return `[Function ${v.name || 'anonymous'}]`;
      case 'symbol':
        return v.toString();
      default:
    }
    if (path.includes(v)) return '[Circular]';
    if (depth >= maxDepth) return Array.isArray(v) ? '[...]' : '{...}';
    path.push(v);
    let out;
    if (Array.isArray(v) || v instanceof Set) {
      const items = [...v];
      const shown = items.slice(0, maxItems).map((e) => walk(e, depth + 1));
      if (items.length > maxItems) shown.push(`...(${items.length - maxItems} more)`);
      out = v instanceof Set ? `Set{${shown.join(', ')}}` : `[${shown.join(', ')}]`;
    } else if (v instanceof Map) {
      const items = [...v];
      const shown = items.slice(0, maxItems).map(([k, e]) => `${walk(k, depth + 1)} => ${walk(e, depth + 1)}`);
      if (items.length > maxItems) shown.push(`...(${items.length - maxItems} more)`);
      out = `Map{${shown.join(', ')}}`;
    } else {
      const keys = Object.keys(v);
      const shown = keys.slice(0, maxItems).map((k) => `${k}: ${walk(v[k], depth + 1)}`);
      if (keys.length > maxItems) shown.push(`...(${keys.length - maxItems} more)`);
      const name = v.constructor && v.constructor !== Object ? `${v.constructor.name} ` : '';
      out = `${name}{${shown.join(', ')}}`;
    }
    path.pop();
    return out;
  };
  return walk(x, 0);
}

// ----------------------------------------------------------------- comparison

const key = (v) => JSON.stringify(v);
const byKey = (a, b) => {
  const ka = key(a);
  const kb = key(b);
  return ka < kb ? -1 : ka > kb ? 1 : 0;
};

/**
 * Assert two arrays contain the same members regardless of order.
 *
 * - Works for arrays of primitives and arrays of arrays/objects.
 * - The OUTER array is always sorted by a canonical JSON key before comparing.
 * - Inner arrays are sorted too ONLY when `{ sortInner: true }` is passed
 *   (use it for e.g. 3Sum / subsets where [1,2] and [2,1] are the same answer;
 *   leave it off when inner order matters, e.g. permutations or paths).
 * - Inputs are never mutated. Comparison is deepStrictEqual.
 *
 * @param {unknown[]} actual
 * @param {unknown[]} expected
 * @param {{sortInner?: boolean, message?: string}} [opts]
 * @returns {void}
 */
export function sameMembers(actual, expected, opts = {}) {
  const { sortInner = false, message = '' } = opts;
  const prefix = message ? `${message}\n` : '';
  assert.ok(Array.isArray(actual), `${prefix}expected an array but got ${fmt(actual)}`);
  assert.ok(Array.isArray(expected), 'sameMembers: `expected` must be an array');
  const norm = (arr) => {
    const copy = arr.map((e) => (sortInner && Array.isArray(e) ? [...e].sort(byKey) : e));
    return copy.sort(byKey);
  };
  assert.deepStrictEqual(
    norm(actual),
    norm(expected),
    `${prefix}same members (any order${sortInner ? ', inner order ignored' : ''}) expected\n` +
      `  expected: ${fmt(expected)}\n  actual:   ${fmt(actual)}`,
  );
}

/**
 * Assert two numbers are within `eps` of each other.
 * @param {number} actual
 * @param {number} expected
 * @param {number} [eps=1e-5]
 * @param {string} [message] optional extra context (e.g. the input)
 * @returns {void}
 */
export function closeTo(actual, expected, eps = 1e-5, message = '') {
  const ok = typeof actual === 'number' && Math.abs(actual - expected) <= eps;
  assert.ok(
    ok,
    `${message ? `${message}\n` : ''}expected ${fmt(actual)} to be within ${eps} of ${fmt(expected)}` +
      (typeof actual === 'number' ? ` (diff ${Math.abs(actual - expected)})` : ''),
  );
}

/**
 * Deep clone (structuredClone) so a solution that mutates its input cannot
 * affect the test's expectations.
 * @template T
 * @param {T} x
 * @returns {T}
 */
export function clone(x) {
  return structuredClone(x);
}

// ---------------------------------------------------------------------- runOps

/**
 * Replay a LeetCode operation sequence against a class.
 *
 * ops[0] is the constructor name (ignored except for reporting) and args[0]
 * its constructor arguments; every later op is a method name. Each return
 * value is compared (deepStrictEqual; non-integer numbers use closeTo 1e-5)
 * to the matching `expected` entry unless that entry is null/undefined, which
 * means "don't check" (LeetCode prints null for void methods).
 *
 * On failure the error message names the step: index, op, args, expected, actual.
 * If a method throws, the error is rethrown with the step info and the original
 * message included (original kept as `cause`).
 *
 * @param {(...ctorArgs: any[]) => any} instanceFactory e.g. (...a) => new MinStack(...a)
 * @param {string[]} ops
 * @param {any[][]} args
 * @param {any[]} expected
 * @returns {void}
 */
export function runOps(instanceFactory, ops, args, expected) {
  assert.equal(ops.length, args.length, 'runOps: ops and args must have equal length');
  assert.equal(ops.length, expected.length, 'runOps: ops and expected must have equal length');
  const describeStep = (i) => `step ${i}: ${ops[i]}(${(args[i] ?? []).map((a) => fmt(a)).join(', ')})`;
  let obj;
  try {
    obj = instanceFactory(...(args[0] ?? []));
  } catch (err) {
    throw new Error(`${describeStep(0)} (constructor) threw: ${err?.message ?? err}`, { cause: err });
  }
  for (let i = 1; i < ops.length; i++) {
    if (typeof obj?.[ops[i]] !== 'function') {
      assert.fail(`${describeStep(i)}: method "${ops[i]}" does not exist on the instance`);
    }
    let actual;
    try {
      actual = obj[ops[i]](...(args[i] ?? []));
    } catch (err) {
      throw new Error(`${describeStep(i)} threw: ${err?.message ?? err}`, { cause: err });
    }
    const exp = expected[i];
    if (exp === null || exp === undefined) continue;
    const msg = `${describeStep(i)}\n  expected: ${fmt(exp)}\n  actual:   ${fmt(actual)}`;
    if (typeof exp === 'number' && !Number.isInteger(exp)) {
      closeTo(actual, exp, 1e-5, msg);
    } else {
      assert.deepStrictEqual(actual, exp, msg);
    }
  }
}

// ------------------------------------------------------------------------- rng

/**
 * @typedef {Object} Rng
 * @property {() => number} next uniform float in [0, 1)
 * @property {(min: number, max: number) => number} int integer in [min, max] inclusive
 * @property {<T>(arr: T[]) => T} pick random element
 * @property {<T>(arr: T[]) => T[]} shuffle new shuffled copy (Fisher-Yates)
 */

/**
 * Deterministic PRNG (mulberry32). Same seed => same sequence on every machine.
 * @param {number} [seed=1]
 * @returns {Rng}
 */
export function makeRng(seed = 1) {
  let s = seed >>> 0;
  const next = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (min, max) => min + Math.floor(next() * (max - min + 1));
  const pick = (arr) => arr[int(0, arr.length - 1)];
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = int(0, i);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  return { next, int, pick, shuffle };
}

/**
 * Array of `n` random integers in [min, max] inclusive.
 * @param {Rng} rng
 * @param {number} n
 * @param {number} min
 * @param {number} max
 * @returns {number[]}
 */
export function randomArray(rng, n, min, max) {
  return Array.from({ length: n }, () => rng.int(min, max));
}
