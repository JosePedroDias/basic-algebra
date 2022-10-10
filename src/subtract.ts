import {
  assert,
  RESULT_COLOR,
  ANNOTATION_COLOR,
  DECIMALS_SEPARATOR,
  Cell,
  Line,
  CARRY_OFFSET,
  CARRY_SCALE,
  getNumDecimals,
  getInvertedDigits,
  getNumDigits,
} from './basic-algebra';

export function subtract(addends: string[]): {
  cells: Cell[];
  lines: Line[];
} {
  for (const n of addends) {
    assert(isFinite(n as any as number), 'must be a valid number');
    assert((n as any as number) >= 0, 'negative number is unsupported');
  }
  assert(addends.length === 2, 'subtraction expects 2 numbers');
  assert(parseFloat(addends[0]) >= parseFloat(addends[1]), 'A must not be less than B. invert params and change the sign after result');

  const cells: Cell[] = [];
  const lines: Line[] = [];

  const maxNumDecimals = getNumDecimals(addends);
  const invertedDigits = getInvertedDigits(addends, maxNumDecimals);
  const numDigits = getNumDigits(invertedDigits);

  let carries = 0;
  for (let d = 0; d < numDigits; ++d) {
    // x (right to left)
    for (let i = 0; i < addends.length; ++i) {
      // y (up to down)
      const v = invertedDigits[i][d];
      if (v === undefined) continue;
      cells.push({
        value: v,
        pos: [-d, i],
      });
    }

    const v1 = invertedDigits[0][d] || 0;
    const v2 = invertedDigits[1][d] || 0;

    let localDiff = v1 - v2 - carries;
    if (localDiff < 0) {
      localDiff += 10;
      carries = 1;
    }
    else {
      carries = 0;
    }

    if (carries) {
      cells.push({
        value: 1,
        pos: [-d - CARRY_OFFSET, -CARRY_OFFSET],
        scale: CARRY_SCALE,
        fill: ANNOTATION_COLOR,
      });

      lines.push({
        x1: -d + 0.2,
        x2: -d - 0.2,
        y1: -0.2,
        y2: +0.2,
        strokeWidth: 1,
        stroke: ANNOTATION_COLOR,
      });
    }
    cells.push({
      value: localDiff,
      pos: [-d, addends.length],
      fill: RESULT_COLOR,
    });
  }

  if (maxNumDecimals > 0) {
    for (let i = 0; i < addends.length; ++i) {
      if (addends[i].includes('.')) {
        cells.push({
          value: DECIMALS_SEPARATOR,
          pos: [0.5 - maxNumDecimals, i],
        });
      }
    }
    cells.push({
      value: DECIMALS_SEPARATOR,
      pos: [0.5 - maxNumDecimals, addends.length],
      fill: RESULT_COLOR,
    });
  }

  cells.push({
    value: '-',
    pos: [-numDigits, addends.length - 1],
  });

  lines.push({
    x1: -numDigits,
    x2: 1,
    y1: addends.length,
    y2: addends.length,
    strokeWidth: 2,
  });

  return { cells, lines };
}
