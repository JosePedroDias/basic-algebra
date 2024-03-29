export const RESULT_COLOR = 'green';
export const ANNOTATION_COLOR = 'purple';
export const DECIMALS_SEPARATOR = ',';
export const CARRY_OFFSET = 0.5;
export const CARRY_SCALE = 0.75;
export const GRID_SIZE = 40; // in pixels of SVG referential

export interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  strokeWidth?: number;
  stroke?: string;
}

export interface Cell {
  pos: [number, number];
  value: string | number;
  scale?: number;
  fill?: string;
}

export type ViewBox = [number, number, number, number];

export function numDecimals(numS: string): number {
  const decimals = numS.split('.')[1];
  return decimals ? decimals.length : 0;
}

export function assert(expr: boolean, label: string) {
  if (!expr) {
    try {
      window.alert(label);
    } catch (_) {}
    throw new Error(label);
  }
}

export function extractViewBoxFromCells(cells: Cell[]): ViewBox {
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

  return viewBox;
}

export function getNumDecimals(numbers: string[]): number {
  return numbers.reduce((prev, v) => Math.max(prev, numDecimals(v)), 0);
}

export type InvertedDigits = (number | undefined)[];

export function arrayToNum(arr: number[], startIndex = 0, len: number): number {
  let n = 0;
  let i = 0;
  let v;
  while ((v = arr[i + startIndex]) !== undefined && i < len) {
    n += (v as any as number) * Math.pow(10, len - i - 1);
    ++i;
  }
  if (i === 0) {
    throw new Error('not found');
  }
  return n;
}

export function numToArray(num: number): number[] {
  return String(num)
    .split('')
    .map((n) => parseInt(n, 10));
}

export function getKey(i: number, j: number): string {
  return `${i},${j}`;
}

export function mapToNum(
  map: Map<string, number>,
  y: number,
  startIndex = 0,
  len: number,
): number {
  let n = 0;
  let i = 0;
  let v;
  while ((v = map.get(getKey(y, i + startIndex))) !== undefined && i < len) {
    n += (v as any as number) * Math.pow(10, len - i - 1);
    ++i;
  }
  return n;
}

export function getDigits(
  numbers: string[],
  maxNumDecimals = 0,
): InvertedDigits[] {
  return numbers.map((numS: string) => {
    const numDecs = numDecimals(numS);
    numS = numS.replace('.', '');
    const arr = numS.split('');
    for (let i = 0; i < maxNumDecimals - numDecs; ++i) {
      arr.push(undefined as any as string);
    }
    return arr.map((s) => (s === undefined ? undefined : parseInt(s, 10)));
  });
}

export function getInvertedDigits(
  numbers: string[],
  maxNumDecimals = 0,
): InvertedDigits[] {
  return numbers.map((numS: string) => {
    const numDecs = numDecimals(numS);
    numS = numS.replace('.', '');
    const arr = numS.split('').reverse();
    for (let i = 0; i < maxNumDecimals - numDecs; ++i) {
      arr.unshift(undefined as any as string);
    }
    return arr.map((s) => (s === undefined ? undefined : parseInt(s, 10)));
  });
}

export function getNumDigits(invertedDigits: InvertedDigits[]) {
  return Math.max(...invertedDigits.map((id) => id.length));
}

export function nthFromEnd(arr: number[], n: number): number | undefined {
  const l = arr.length - 1;
  return arr[l - n];
}
