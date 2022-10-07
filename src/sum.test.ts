import { describe, it, expect } from 'vitest';
import { cellsGridAscii } from './cells-grid-ascii';
import { sum } from './sum';

describe('sum', () => {
  it('simple', () =>
    expect(cellsGridAscii(sum(['11', '23']).cells)).toEqual([
      ` 11`,
      `+23`,
      ` 34`,
    ]));
  it('small 1st', () =>
    expect(cellsGridAscii(sum(['1', '23']).cells)).toEqual([
      `  1`,
      `+23`,
      ` 24`,
    ]));
  it('small 2nd', () =>
    expect(cellsGridAscii(sum(['43', '9']).cells)).toEqual([
      ` 43`,
      `+ 9`,
      ` 52`,
    ]));
  it('decimals', () =>
    expect(cellsGridAscii(sum(['4.3', '0.29']).cells)).toEqual([
      ` 43 `,
      `+ 29`,
      ` 459`,
    ]));
  it('longer', () =>
    expect(cellsGridAscii(sum(['533', '819']).cells)).toEqual([
      ` 533`,
      `+819`,
      `1352`,
    ]));
  it('3 numbers', () =>
    expect(cellsGridAscii(sum(['2', '34', '456']).cells)).toEqual([
      `   2`,
      `  34`,
      `+456`,
      ` 492`,
    ]));
  it('negative throw', () =>
    expect(() => sum(['-2', '34'])).toThrowError(
      'negative number is unsupported',
    ));
});
