import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { clone, fmt } from '../../lib/testutil.js';
import { findItinerary } from './reconstruct-itinerary.js';

function check(tickets, expected) {
  const actual = findItinerary(clone(tickets));
  assert.deepStrictEqual(
    actual,
    expected,
    `findItinerary(${fmt(tickets)})\n  expected: ${fmt(expected, { maxItems: 12 })}\n  actual:   ${fmt(actual, { maxItems: 12 })}`,
  );
}

// Unique code for index i (prefix + 3 base-26 letters), increasing lexically with i.
const code = (prefix, i) =>
  prefix +
  String.fromCharCode(65 + (Math.floor(i / 676) % 26)) +
  String.fromCharCode(65 + (Math.floor(i / 26) % 26)) +
  String.fromCharCode(65 + (i % 26));

describe('Reconstruct Itinerary', () => {
  it('example 1: simple path', () => {
    check(
      [['MUC', 'LHR'], ['JFK', 'MUC'], ['SFO', 'SJC'], ['LHR', 'SFO']],
      ['JFK', 'MUC', 'LHR', 'SFO', 'SJC'],
    );
  });

  it('example 2: must pick the lexically smaller valid itinerary', () => {
    check(
      [['JFK', 'SFO'], ['JFK', 'ATL'], ['SFO', 'ATL'], ['ATL', 'JFK'], ['ATL', 'SFO']],
      ['JFK', 'ATL', 'JFK', 'SFO', 'ATL', 'SFO'],
    );
  });

  it('single ticket', () => {
    check([['JFK', 'LAX']], ['JFK', 'LAX']);
  });

  it('smaller destination is a dead end, so it must come last', () => {
    check([['JFK', 'AAA'], ['JFK', 'BBB'], ['BBB', 'JFK']], ['JFK', 'BBB', 'JFK', 'AAA']);
  });

  it('duplicate tickets are each used once', () => {
    check([['JFK', 'ABC'], ['ABC', 'JFK'], ['JFK', 'ABC']], ['JFK', 'ABC', 'JFK', 'ABC']);
  });

  it('self loop at the start', () => {
    check([['JFK', 'JFK']], ['JFK', 'JFK']);
  });

  it('LeetCode extra case with a dead end and a cycle', () => {
    check(
      [['JFK', 'KUL'], ['JFK', 'NRT'], ['NRT', 'JFK']],
      ['JFK', 'NRT', 'JFK', 'KUL'],
    );
  });

  it('two cycles through JFK are taken smallest first', () => {
    check(
      [['JFK', 'AAA'], ['AAA', 'JFK'], ['JFK', 'BBB'], ['BBB', 'JFK'], ['JFK', 'CCC']],
      ['JFK', 'AAA', 'JFK', 'BBB', 'JFK', 'CCC'],
    );
  });

  it('nested sub-tour is spliced in at the right place', () => {
    check(
      [['JFK', 'AAA'], ['AAA', 'BBB'], ['BBB', 'CCC'], ['CCC', 'AAA'], ['AAA', 'DDD']],
      ['JFK', 'AAA', 'BBB', 'CCC', 'AAA', 'DDD'],
    );
  });

  it('large star with a dead-end trap (2001 tickets)', { timeout: 2000 }, () => {
    // JFK<->Bxx for 1000 cities, plus JFK->AAA where AAA is a dead end.
    // AAA sorts first but can only be the final stop.
    const n = 1000;
    const tickets = [['JFK', 'AAA']];
    const expected = ['JFK'];
    for (let i = 0; i < n; i++) {
      const c = code('B', i);
      tickets.push(['JFK', c], [c, 'JFK']);
      expected.push(c, 'JFK');
    }
    expected.push('AAA');
    check(tickets.reverse(), expected);
  });

  it('long chain of 2000 tickets (deep recursion safe)', { timeout: 2000 }, () => {
    const n = 2000;
    const tickets = [];
    const expected = ['JFK'];
    let prev = 'JFK';
    for (let i = 0; i < n; i++) {
      const c = code('C', i);
      tickets.push([prev, c]);
      expected.push(c);
      prev = c;
    }
    check(tickets.reverse(), expected);
  });
});
