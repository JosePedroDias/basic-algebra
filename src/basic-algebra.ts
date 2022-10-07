export const RESULT_COLOR = 'green';
export const ANNOTATION_COLOR = 'purple';
export const DECIMALS_SEPARATOR = ',';
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

export { cellsGrid } from './cells-grid.js';
export { sum } from './sum.js';
