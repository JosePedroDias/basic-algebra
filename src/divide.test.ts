import { describe, it, expect } from 'vitest';
import { cellsGridAscii } from './cells-grid-ascii';
import { divide } from './divide';
import { randomParam, randomInt } from './brute-force-helpers';

describe('divide', () => {
  it('edge 1s', () =>
    expect(cellsGridAscii(divide(['1', '1']))).toEqual([
      `1|1`,
      ` |=`,
      `0|1`
    ]));
  it('24/2 basic', () =>
    expect(cellsGridAscii(divide(['24', '2']))).toEqual([
      `24|2 `,
      `  |==`,
      `04|12`,
      ` 0   `
    ]));
  it('24/5 stop at rest 0', () =>
    expect(cellsGridAscii(divide(['24', '5']))).toEqual([
      `24,0|5  `,
      `    |===`,
      `04 0|4,8`,
      ` 0 0    `
    ]));
  it('24/9 period (6)', () =>
    expect(cellsGridAscii(divide(['24', '9']))).toEqual([
      `24,00|9    `,
      `     |=====`,
      `06 0 |2,6(6`,
      ` 0 60      `
    ]));
  it('24/11 period (11)', () =>
    expect(cellsGridAscii(divide(['24', '11']))).toEqual([
      `24,0000|1 1    `,
      `       |=======`,
      `02 0   |2,18(18`,
      ` 0 90          `,
      `   020         `,
      `    090        `
    ]));
  it('24/13 hitting default maxIterations 10', () =>
    expect(cellsGridAscii(divide(['24', '13']))).toEqual([
      `24,000000000|1 3        `,
      `            |===========`,
      `11 0        |1,846153846`,
      ` 0 60                   `,
      `   080                  `,
      `    020                 `,
      `     070                `,
      `      050               `,
      `       110              `,
      `        060             `,
      `         080            `,
      `          02            `
    ]));
  it('24/13 custom maxIterations 3', () =>
    expect(cellsGridAscii(divide(['24', '13'], { maxIterations: 3 }))).toEqual([
      `24,00|1 3 `,
      `     |====`,
      `11 0 |1,84`,
      ` 0 60     `,
      `   08     `
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

const NUM = 100;

function expectedDiv(a_:string, b_:string, fixed:number) {
  const a = parseFloat(a_);
  const b = parseFloat(b_);
  return parseFloat((a / b).toFixed(fixed));
}

function generateEntry() : [string, string, number] {
  const a = randomParam(1 + randomInt(3), randomInt(2) ? 1 + randomInt(1) : 0);
  let b = randomParam(1 + randomInt(2), randomInt(2) ? 1 + randomInt(1) : 0);
  do {
    b = randomParam(1 + randomInt(3), randomInt(2) ? 1 + randomInt(3) : 0);
  } while (parseFloat(b) > parseFloat(a));
  const decA = a.split('.')[1];
  const decB = b.split('.')[1];
  const sumDecimalPlaces = decA ? decA.length : 0 + decB ? decB.length : 0
  const res = expectedDiv(a, b, sumDecimalPlaces);
  return [a, b, res];
}

describe.skip('divide brute force', () => {
  const entries = new Array(NUM).fill(1).map(generateEntry);
  it.each(entries)(`divide(%f, %f) -> %f`, (a, b, expected) => {
    const lines = cellsGridAscii(divide([a, b]));
    const resS = lines[2].split('|')[1].replace(',', '.').replace(/ /g, '').trim();
    //console.log(`resS: ${resS} expected:${expected}`);
    const res = parseFloat(resS);

    const smaller = Math.min(res, expected);
    const bigger = Math.max(res, expected);
    const errorRatio = Math.abs(1 - (bigger / smaller));
    //console.log(smaller, bigger, errorRatio);
    expect(errorRatio).toBeLessThan(0.01);
  });
});
