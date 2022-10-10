import {
  assert,
  RESULT_COLOR,
  DECIMALS_SEPARATOR,
  Cell,
  Line,
  getInvertedDigits,
  getNumDigits,
  numDecimals
} from './basic-algebra';

import { sum } from './sum';

export function multiply(factors:string[]): {
  cells: Cell[];
  lines: Line[];
} {
  for (const n of factors) {
    assert(isFinite(n as any as number), 'must be a valid number');
    assert((n as any as number) >= 0, 'negative number is unsupported');
  }
  assert(factors.length === 2, 'multiplication expects 2 numbers');

  const individualNumDecimals = factors.map(numDecimals);
  const sumDecimalPlaces = individualNumDecimals[0] + individualNumDecimals[1];
  const invertedDigits = getInvertedDigits(factors);
  const numDigits = getNumDigits(invertedDigits);

  const cells:Cell[] = [];
  const lines:Line[] = [];

  for (let d = 0; d < numDigits; ++d) {
    // x (right to left)
    for (let i = 0; i < 2; ++i) {
      // y (up to down)
      const v = invertedDigits[i][d];// || 0;
      if (v === undefined) continue;
      cells.push({
        value: v,
        pos: [-d, i],
      });
    }
  }

  for (let i = 0; i < 2; ++i) {
    if (individualNumDecimals[i] > 0) {
      cells.push({
        value: DECIMALS_SEPARATOR,
        pos: [0.5 - individualNumDecimals[i], i],
      });
    }
  }

  cells.push({
    value: 'x',
    pos: [0 - numDigits, 1],
  });

  lines.push({
    x1: 0 - numDigits,
    x2: 1,
    y1: 2,
    y2: 2,
    strokeWidth: 2,
  });

  let carries = 0;
  const invA = invertedDigits[1];
  const invB = invertedDigits[0];

  const sumArgs:number[][] = new Array(invA.length).fill(1).map(() => []);

  for (let iA = 0; iA < invA.length; ++iA) {
    carries = 0;
    for (let iB = 0; iB < invB.length; ++iB) {
      const a = invA[iA] as number;
      const b = invB[iB] as number;
      let v_ = a * b + carries;
      const v = v_ % 10;
      carries = Math.floor(v_ / 10);
      sumArgs[iA].push(v);
    }

    if (carries) {
      sumArgs[iA].push(carries);
    }
  }

  const numSumLines = invA.length;

  if (numSumLines === 1) {
    const res = sumArgs[0];
    for (let i = 0; i < res.length; ++i) {
      cells.push({
        value: res[i],
        pos: [-i, 2],
        fill: RESULT_COLOR
      });
    }

    if (sumDecimalPlaces > 0) {
      cells.push({
        value: DECIMALS_SEPARATOR,
        pos: [0.5 - sumDecimalPlaces, 2],
        fill: RESULT_COLOR,
      });
    }

    return { cells, lines };
  }
  else {
    const toDelete = new Set<string>();
    for (let i = 0; i < numSumLines; ++i) { // i ~ y
      for (let j = 0; j < i; ++j) { // j ~ x
        sumArgs[i].unshift(0);
        toDelete.add(`${i + 2},${-j}`);
      }
    }
  
    const sumArgs2 = sumArgs.map(sa => sa.reverse().join('') );
  
    const { cells: cells2, lines: lines2 } = sum(sumArgs2, { skipAnnotations: true });

    cells2.forEach(c => {
      c.pos[1] += 2;
      if (toDelete.has(`${c.pos[1]},${c.pos[0]}`)) {
        c.value = undefined as any;
      }
    });
    lines2.forEach(l => {
      l.y1 += 2;
      l.y2 += 2;
    });
  
    if (sumDecimalPlaces > 0) {
      cells.push({
        value: DECIMALS_SEPARATOR,
        pos: [0.5 - sumDecimalPlaces, 4],
        fill: RESULT_COLOR,
      });
    }
    
    return {
      cells: [...cells, ...cells2],
      lines: [...lines, ...lines2]
    };
  }
}
