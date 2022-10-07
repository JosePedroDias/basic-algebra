import {
  numDecimals,
  assert,
  RESULT_COLOR,
  ANNOTATION_COLOR,
  DECIMALS_SEPARATOR,
  GRID_SIZE,
  Cell,
  Line,
  ViewBox,
} from './basic-algebra';

export function sum(numbers: string[]): {
  cells: Cell[];
  lines: Line[];
  viewBox: ViewBox;
} {
  for (const n of numbers) {
    assert(isFinite(n as any as number), 'must be a valid number');
    assert((n as any as number) >= 0, 'negative number is unsupported');
  }

  const cells: Cell[] = [];
  const lines: Line[] = [];

  const maxNumDecimals = numbers.reduce(
    (prev, v) => Math.max(prev, numDecimals(v)),
    0,
  );

  const invertedDigits = numbers.map((numS) => {
    const numDecs = numDecimals(numS);
    numS = numS.replace('.', '');
    const arr = numS.split('').reverse();
    for (let i = 0; i < maxNumDecimals - numDecs; ++i) {
      arr.unshift(undefined as any as string);
    }
    return arr.map((s) => (s === undefined ? undefined : parseInt(s, 10)));
  });

  const numDigits = Math.max(...invertedDigits.map((id) => id.length));

  let carries = 0;
  for (let d = 0; d < numDigits; ++d) {
    // x (right to left)
    let localSum = 0;
    for (let i = 0; i < numbers.length; ++i) {
      // y (up to down)
      const v = invertedDigits[i][d];
      if (v === undefined) continue;
      cells.push({
        value: v,
        pos: [-d, i],
      });
      localSum += v;
    }
    localSum += carries;
    if (localSum > 9) {
      localSum = localSum - 10;
      carries = 1;
      cells.push({
        value: 1,
        pos: [-d - 0.5, -0.5],
        scale: 0.75,
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
    } else {
      carries = 0;
    }
    cells.push({
      value: localSum,
      pos: [-d, numbers.length],
      fill: RESULT_COLOR,
    });
  }

  if (carries) {
    cells.push({
      value: carries,
      pos: [-numDigits, numbers.length],
      fill: RESULT_COLOR,
    });
  }

  if (maxNumDecimals > 0) {
    for (let i = 0; i < numbers.length; ++i) {
      if (numbers[i].includes('.')) {
        cells.push({
          value: DECIMALS_SEPARATOR,
          pos: [0.5 - maxNumDecimals, i],
        });
      }
    }
    cells.push({
      value: DECIMALS_SEPARATOR,
      pos: [0.5 - maxNumDecimals, numbers.length],
      fill: RESULT_COLOR,
    });
  }

  cells.push({
    value: '+',
    pos: [-numDigits, numbers.length - 1],
  });

  lines.push({
    x1: -numDigits,
    x2: 1,
    y1: numbers.length,
    y2: numbers.length,
    strokeWidth: 2,
  });

  const extents = [
    [Number.MAX_SAFE_INTEGER, -Number.MAX_SAFE_INTEGER], // X min max
    [Number.MAX_SAFE_INTEGER, -Number.MAX_SAFE_INTEGER], // Y min max
  ];
  for (const c of cells) {
    const [x, y] = c.pos;
    const x0 = (x - 0) * GRID_SIZE;
    const y0 = (y - 0) * GRID_SIZE;
    const x1 = (x + 1) * GRID_SIZE;
    const y1 = (y + 1) * GRID_SIZE;
    if (x0 < extents[0][0]) extents[0][0] = x0;
    if (y0 < extents[1][0]) extents[1][0] = y0;
    if (x1 > extents[0][1]) extents[0][1] = x1;
    if (y1 > extents[1][1]) extents[1][1] = y1;
  }

  const viewBox: ViewBox = [
    extents[0][0],
    extents[1][0],
    extents[0][1] - extents[0][0],
    extents[1][1] - extents[1][0],
  ];

  return { cells, lines, viewBox };
}
