import { describe, it, expect } from 'vitest';
import { cellsGridAscii } from './cells-grid-ascii';
import { subtract } from './subtract';
import { randomParam, randomInt } from './brute-force-helpers';

describe('subtract', () => {
  it('simple', () =>
    expect(cellsGridAscii(subtract(['23', '11']))).toEqual([
      ` 23`,
      `-11`,
      `===`,
      ` 12`,
    ]));
  it('simple2', () =>
    expect(cellsGridAscii(subtract(['23', '1']))).toEqual([
      ` 23`,
      `- 1`,
      `===`,
      ` 22`,
    ]));
  it('decimals', () =>
    expect(cellsGridAscii(subtract(['12.3', '0.46']))).toEqual([
      ` 12,3 `,
      `- 0,46`,
      `======`,
      ` 11,84`,
    ]));
  it('decimals2', () =>
    expect(cellsGridAscii(subtract(['22', '1.1']))).toEqual([
      ` 22  `,
      `- 1,1`,
      `=====`,
      ` 20,9`,
    ]));

  it('if A < B throws', () =>
    expect(() => subtract(['23', '36'])).toThrowError(
      'A must not be less than B. invert params and change the sign after result',
    ));
  it('diff than 2 addends throws', () =>
    expect(() => subtract(['5', '2', '1'])).toThrowError(
      'subtraction expects 2 numbers',
    ));
  it('negative throw', () =>
    expect(() => subtract(['-2', '34'])).toThrowError(
      'negative number is unsupported',
    ));
});

///////

const NUM = 100;

function expectedSub(a_: string, b_: string) {
  const a = parseFloat(a_);
  const b = parseFloat(b_);
  return parseFloat((a - b).toFixed(3));
}

function generateEntry(): [string, string, number] {
  const a = randomParam(1 + randomInt(3), randomInt(2) ? 1 + randomInt(3) : 0);
  let b;
  do {
    b = randomParam(1 + randomInt(3), randomInt(2) ? 1 + randomInt(3) : 0);
  } while (parseFloat(b) > parseFloat(a));
  const res = expectedSub(a, b);
  return [a, b, res];
}

describe('subtract brute force', () => {
  const entries = new Array(NUM).fill(1).map(generateEntry);
  it.each(entries)(`subtract(%f, %f) -> %f`, (a, b, expected) => {
    const resS = cellsGridAscii(subtract([a, b]))
      .pop()
      ?.replace(',', '.')
      .trim();
    const res = parseFloat(resS || '0');
    expect(res).toBeCloseTo(expected, 3);
  });
});
