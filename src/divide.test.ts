import { describe, it, expect } from 'vitest';
import { cellsGridAscii } from './cells-grid-ascii';
import { divide } from './divide';
// import { randomParam, randomInt } from './brute-force-helpers';

describe('divide', () => {
  it('edge 1s', () =>
    expect(cellsGridAscii(divide(['1', '1']))).toEqual([
      `1|1`,
      ` |=`,
      `0 1`
    ]));
  it('diff than 2 factors throws', () =>
    expect(() => divide(['5', '2', '1'])).toThrowError(
      'division expects 2 numbers',
    ));
  it('negative throw', () =>
    expect(() => divide(['-2', '34'])).toThrowError(
      'negative number is unsupported',
    ));
  it('0/0', () =>
    expect(() => divide(['0', '0'])).toThrowError(
      'zero over zero is undefined',
    ));
  it('N/0', () =>
    expect(() => divide(['1', '0'])).toThrowError(
      'something over zero results in infinity',
    ));
  });

///////

/* const NUM = 24;

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

describe('multiply brute force', () => {
  const entries = new Array(NUM).fill(1).map(generateEntry);
  it.each(entries)(`multiply(%f, %f) -> %f`, (a, b, expected) => {
    const resS = cellsGridAscii(multiply([a, b])).pop()?.replace(',', '.').trim();
    const res = parseFloat(resS || '0');

    const smaller = Math.min(res, expected);
    const bigger = Math.max(res, expected);
    const errorRatio = 1 - (bigger / smaller);
    expect(errorRatio).toBeLessThan(0.01);
  });
});
 */
