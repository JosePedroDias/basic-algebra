function randomDigit() {
  return Math.floor(10 * Math.random());
}

function randomNonZeroDigit() {
  return 1 + Math.floor(9 * Math.random());
}

export function randomInt(n: number): number {
  return Math.floor(n * Math.random());
}

export function randomParam(numLeftDigits: number, numDecimals: number) {
  const digits = [];

  for (let i = 0; i < numLeftDigits; ++i) {
    digits.push(i === 0 ? randomNonZeroDigit() : randomDigit());
  }
  if (numLeftDigits === 0) {
    digits.push(0);
  }

  if (numDecimals) {
    digits.push('.');
    for (let i = 0; i < numDecimals; ++i) {
      digits.push(i === numDecimals - 1 ? randomNonZeroDigit() : randomDigit());
    }
  }

  return digits.join('');
}

// @ts-ignore
/* if (import.meta.vitest) {
  // @ts-ignore
  const { describe, it, expect } = import.meta.vitest;
  describe('randomParam', () => {
    it('2, 0', () => {
      const d = parseFloat(randomParam(2, 0));
      expect(d % 1).toBe(0);
      expect(d).toBeGreaterThan(9);
      expect(d).toBeLessThan(100);
    });
  })
}

console.log(
  'X',
  [
    randomParam(2, 0),
    randomParam(1, 0),
    randomParam(1, 1),
    randomParam(0, 1),
    randomParam(0, 2),
    randomParam(2, 2)
  ].join('\n')
); */
