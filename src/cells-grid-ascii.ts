import { Cell, Line } from './basic-algebra';

function updateLimit(n: number, limits: [number, number]) {
  const [m, M] = limits;
  if (n < m && n % 1 === 0) limits[0] = n;
  if (n > M && n % 1 === 0) limits[1] = n;
}

const DIVIDER_HOR = '=';
const DIVIDER_VER = '|';

const regexL = new RegExp('[-+x()=|0-9\.,]');
const regexC = new RegExp('[-+x()|0-9\.,]');

function dropWhitespace(lines_:string[]):string[] {
  const lines = lines_.filter(l => regexL.test(l));
  const h = lines.length;
  let w = lines[0].length;
  for (let x = w-1; x >= 0; --x) {
    let skip = true;
    for (let y = 0; y < h; ++y) {
      if (regexC.test(lines[y][x] || '')) {
        skip = false;
      }
    }
    if (skip) {
      for (let y = 0; y < h; ++y) {
        lines[y] = `${lines[y].substring(0, x)}${lines[y].substring(x+1)}`;
      }
      --w;
    }
  }
  return lines;
}

export function cellsGridAscii(o: { cells: Cell[], lines: Line[] }): string[] {
  const { cells, lines } = o;
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

  for (const l of lines) {
    if ((l.x1 * 2) % 1 !== 0 || (l.y1 * 2) % 1 !== 0) continue;
    
    if (l.x1 === l.x2) {
      for (let y = l.y1; y <= l.y2; y += 0.5) {
        const key = [l.x1-0.5, y].join(',');
        values.set(key, DIVIDER_VER);
      }
    }
    else if (l.y1 === l.y2) {
      for (let x = l.x1; x <= l.x2; x += 0.5) {
        const key = [x, l.y1-0.5].join(',');
        values.set(key, DIVIDER_HOR);
      }
    }
  }

  //console.log(limits);
  //console.log(values);

  const outputLines: string[] = [];
  for (let y = limits.y[0]; y <= limits.y[1]; y += 0.5) {
    const line: string[] = [];
    for (let x = limits.x[0]; x <= limits.x[1]; x += 0.5) {
      let v = values.get([x, y].join(','));
      if (v === undefined) v = ' ';
      //console.log(x, y, v, typeof v, JSON.stringify(v));
      line.push(v as string);
    }
    outputLines.push(line.join(''));
  }

  //console.log(outputLines.join('\n'));
  //return '\n' + outputLines.join('\n');
  //return outputLines;

  return dropWhitespace(outputLines);
}
