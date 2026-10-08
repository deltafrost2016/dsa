import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { encode, decode } from './encode-and-decode-strings.js';
import { clone, makeRng, fmt } from '../../lib/testutil.js';

const roundTrip = (strs) => {
  const input = clone(strs);
  const encoded = encode(input);
  assert.equal(typeof encoded, 'string', `encode(${fmt(strs)}) must return a string, got ${fmt(encoded)}`);
  const decoded = decode(encoded);
  assert.deepStrictEqual(decoded, strs, `decode(encode(x)) mismatch\n  input:   ${fmt(strs)}\n  encoded: ${fmt(encoded)}\n  decoded: ${fmt(decoded)}`);
};

describe('Encode and Decode Strings', () => {
  it('example 1: ["neet","code","love","you"]', () => roundTrip(['neet', 'code', 'love', 'you']));
  it('example 2: ["we","say",":","yes"]', () => roundTrip(['we', 'say', ':', 'yes']));
  it('empty list', () => roundTrip([]));
  it('list with one empty string', () => roundTrip(['']));
  it('list of several empty strings', () => roundTrip(['', '', '']));
  it('empty strings mixed with words', () => roundTrip(['', 'a', '', 'b', '']));
  it('single word', () => roundTrip(['hello']));
  it('strings containing "#"', () => roundTrip(['#', '##', 'a#b', '#a', 'a#']));
  it('strings containing commas, colons and pipes', () => roundTrip([',', ',,', 'a,b', ':', '|', 'a:b|c']));
  it('strings that look like length prefixes', () => roundTrip(['3#abc', '12', '0#', '4', '1#a#1#b']));
  it('strings made only of digits', () => roundTrip(['123', '0', '007', '99999']));
  it('strings containing newlines, tabs and spaces', () => roundTrip(['line1\nline2', '\n', '\t', ' ', '  a  ', '\r\n']));
  it('unicode and emoji', () => roundTrip(['héllo', '日本語', '😀😃', 'a😀b', 'Ω≈ç√']));
  it('string containing the encoding of another list', () => {
    const inner = encode(['x', 'y']);
    roundTrip([inner, 'z']);
  });
  it('a long string next to short ones', () => roundTrip(['a'.repeat(1000), 'b', '', 'c'.repeat(500)]));

  it('encode returns a single string, not an array', () => {
    const out = encode(['a', 'b']);
    assert.equal(typeof out, 'string', `expected a string, got ${fmt(out)}`);
  });

  it('decode is independent of earlier calls (stateless)', () => {
    const e1 = encode(['one', 'two']);
    const e2 = encode(['three']);
    assert.deepStrictEqual(decode(e2), ['three']);
    assert.deepStrictEqual(decode(e1), ['one', 'two']);
  });

  it('does not mutate the input array', () => {
    const strs = ['a', 'b', 'c'];
    const copy = [...strs];
    encode(strs);
    assert.deepStrictEqual(strs, copy, 'encode mutated its input');
  });

  it('randomized round trips with a nasty alphabet (200 strings x 200 chars)', { timeout: 2000 }, () => {
    const rng = makeRng(271);
    const alphabet = ['#', ',', ':', '|', '0', '1', '9', '\n', ' ', 'a', 'Z', '😀', 'é', '/', '\\', '"'];
    for (let round = 0; round < 25; round++) {
      const n = rng.int(0, 200);
      const strs = Array.from({ length: n }, () =>
        Array.from({ length: rng.int(0, 200) }, () => rng.pick(alphabet)).join(''),
      );
      roundTrip(strs);
    }
  });
});
