import { describe, it, expect } from 'vitest';
import { cellsGridAscii } from './cells-grid-ascii';
import { multiply } from './multiply';
import { randomParam, randomInt } from './brute-force-helpers';

describe('multiply', () => {
  it('edge 0s', () =>
    expect(cellsGridAscii(multiply(['0', '0']))).toEqual([
      ` 0`,
      `x0`,
      `==`,
      ` 0`
    ]));
  it('edge 1s', () =>
    expect(cellsGridAscii(multiply(['1', '1']))).toEqual([
      ` 1`,
      `x1`,
      `==`,
      ` 1`
    ]));
  it('simple', () =>
    expect(cellsGridAscii(multiply(['41', '23']))).toEqual([
      `  41`,
      ` x23`,
      ` ===`,
      ` 123`,
      `+82 `,
      `====`,
      ` 943`
    ]));
  it('diff num digits', () =>
    expect(cellsGridAscii(multiply(['12', '234']))).toEqual([
      `   12`,
      ` x234`,
      ` ====`,
      `   48`,
      `  36 `,
      `+24  `,
      `=====`,
      ` 2808`
    ]));
  it('diff num digits 2', () =>
    expect(cellsGridAscii(multiply(['234', '12']))).toEqual([
      `  234`,
      ` x 12`,
      ` ====`,
      `  468`,
      `+234 `,
      `=====`,
      ` 2808`
    ]));
  it('diff num digits 3', () =>
    expect(cellsGridAscii(multiply(['23', '1']))).toEqual([
      ` 23`,
      `x 1`,
      `===`,
      ` 23`
    ]));
  it('decimals', () =>
    expect(cellsGridAscii(multiply(['4.1', '23']))).toEqual([
      `  4,1`,
      ` x2 3`,
      ` ====`,
      ` 12 3`,
      `+82  `,
      `=====`,
      ` 94,3`
    ]));
  it('decimals2', () =>
    expect(cellsGridAscii(multiply(['23', '9.8']))).toEqual([
      `   2 3`,
      `  x9,8`,
      `  ====`,
      `  18 4`,
      `+207  `,
      `======`,
      ` 225,4`
    ]));
  it('decimals3', () =>
    expect(cellsGridAscii(multiply(['1.23', '2']))).toEqual([
      ` 1,23`,
      `x   2`,
      `=====`,
      ` 2,46`
    ]));
  it('diff than 2 factors throws', () =>
    expect(() => multiply(['5', '2', '1'])).toThrowError(
      'multiplication expects 2 numbers',
    ));
  it('negative throw', () =>
    expect(() => multiply(['-2', '34'])).toThrowError(
      'negative number is unsupported',
    ));
  });

///////

const NUM = 100;

function expectedMul(a_:string, b_:string, fixed:number) {
  const a = parseFloat(a_);
  const b = parseFloat(b_);
  return parseFloat((a * b).toFixed(fixed));
}

function generateEntry() : [string, string, number] {
  const a = randomParam(1 + randomInt(3), randomInt(2) ? 1 + randomInt(1) : 0);
  const b = randomParam(1 + randomInt(3), randomInt(2) ? 1 + randomInt(1) : 0);
  const decA = a.split('.')[1];
  const decB = b.split('.')[1];
  const sumDecimalPlaces = decA ? decA.length : 0 + decB ? decB.length : 0
  const res = expectedMul(a, b, sumDecimalPlaces);
  return [a, b, res];
}

describe.skip('multiply brute force', () => {
  const entries = new Array(NUM).fill(1).map(generateEntry);
  it.each(entries)(`multiply(%f, %f) -> %f`, (a, b, expected) => {
    const resS = cellsGridAscii(multiply([a, b])).pop()?.replace(',', '.').trim() || '0';
    const res = parseFloat(resS);

    const smaller = Math.min(res, expected);
    const bigger = Math.max(res, expected);

    const errorRatio = Math.abs(1 - (bigger / smaller));
    expect(errorRatio).toBeLessThan(0.01);
  });
});
