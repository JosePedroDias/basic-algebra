import { describe, it, expect } from 'vitest';
import { cellsGridAscii } from './cells-grid-ascii';
import { sum } from './sum';
import { randomParam, randomInt } from './brute-force-helpers';

describe('sum', () => {
  it('simple', () =>
    expect(cellsGridAscii(sum(['11', '23']))).toEqual([
      ` 11`,
      `+23`,
      `===`,
      ` 34`,
    ]));
  it('with zero results', () =>
    expect(cellsGridAscii(sum(['10', '20']))).toEqual([
      ` 10`,
      `+20`,
      `===`,
      ` 30`,
    ]));
  it('small 1st', () =>
    expect(cellsGridAscii(sum(['1', '23']))).toEqual([
      `  1`,
      `+23`,
      `===`,
      ` 24`,
    ]));
  it('small 2nd', () =>
    expect(cellsGridAscii(sum(['43', '9']))).toEqual([
      ` 43`,
      `+ 9`,
      `===`,
      ` 52`,
    ]));
  it('small 3rd', () =>
    expect(cellsGridAscii(sum(['3', '99']))).toEqual([
      `  3`,
      `+99`,
      `===`,
      `102`,
    ]));
  it('decimals', () =>
    expect(cellsGridAscii(sum(['4.3', '0.29']))).toEqual([
      ` 4,3 `,
      `+0,29`,
      `=====`,
      ` 4,59`,
    ]));
  it('longer', () =>
    expect(cellsGridAscii(sum(['533', '819']))).toEqual([
      ` 533`,
      `+819`,
      `====`,
      `1352`,
    ]));
  it('3 numbers', () =>
    expect(cellsGridAscii(sum(['2', '34', '456']))).toEqual([
      `   2`,
      `  34`,
      `+456`,
      `====`,
      ` 492`,
    ]));
  it('carry twice', () =>
    expect(cellsGridAscii(sum(['166', '57']))).toEqual([
      ` 166`,
      `+ 57`,
      `====`,
      ` 223`,
    ]));
  it('carry above max', () =>
    expect(cellsGridAscii(sum(['66', '57']))).toEqual([
      ` 66`,
      `+57`,
      `===`,
      `123`,
    ]));

  it('negative throw', () =>
    expect(() => sum(['-2', '34'])).toThrowError(
      'negative number is unsupported',
    ));
});

///////

const NUM = 100;

function expectedSum(a_:string, b_:string) {
  const a = parseFloat(a_);
  const b = parseFloat(b_);
  return parseFloat((a + b).toFixed(3));
}

function generateEntry() : [string, string, number] {
  const a = randomParam(1 + randomInt(3), randomInt(2) ? 1 + randomInt(3) : 0);
  const b = randomParam(1 + randomInt(3), randomInt(2) ? 1 + randomInt(3) : 0);
  const res = expectedSum(a, b);
  return [a, b, res];
}

describe('sum brute force', () => {
  const entries = new Array(NUM).fill(1).map(generateEntry);
  it.each(entries)(`add(%f, %f) -> %f`, (a, b, expected) => {
    const resS = cellsGridAscii(sum([a, b])).pop()?.replace(',', '.').trim();
    const res = parseFloat(resS || '0');
    expect(res).toBeCloseTo(expected, 3);
  });
});
