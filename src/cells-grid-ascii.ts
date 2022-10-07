import { Cell } from './basic-algebra';

function updateLimit(n: number, limits: [number, number]) {
  const [m, M] = limits;
  if (n < m && n % 1 === 0) limits[0] = n;
  if (n > M && n % 1 === 0) limits[1] = n;
}

export function cellsGridAscii(cells: Cell[] /*, lines: Line[]*/): string[] {
  const limits: { [label: string]: [number, number] } = {
    x: [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
    y: [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
  };
  const values = new Map<string, string | number>();

  for (const c of cells) {
    updateLimit(c.pos[0], limits.x);
    updateLimit(c.pos[1], limits.y);
    const key = c.pos.join(',');
    values.set(key, c.value);
  }

  //console.log(limits);
  //console.log(values);

  const outputLines: string[] = [];
  for (let y = limits.y[0]; y <= limits.y[1]; ++y) {
    const line: string[] = [];
    for (let x = limits.x[0]; x <= limits.x[1]; ++x) {
      const v = values.get([x, y].join(',')) || ' ';
      //console.log(x, y, v, typeof v, JSON.stringify(v));
      line.push(v as string);
    }
    outputLines.push(line.join(''));
  }

  //console.log(outputLines.join('\n'));
  //return '\n' + outputLines.join('\n');
  return outputLines;
}
