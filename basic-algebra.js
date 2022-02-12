// @ts-check

export const RESULT_COLOR = 'green';
export const ANNOTATION_COLOR = 'purple';
export const DECIMALS_SEPARATOR = ',';
export const GRID_SIZE = 40; // in pixels of SVG referential

/**
 * @param {string} numS 
 * @returns {number}
 */
export function numDecimals(numS) {
    let decimals = numS.split('.')[1];
    return decimals ? decimals.length : 0;
}

/**
 * @param {boolean} expr 
 * @param {string} label 
 */
export function assert(expr, label) {
    if (!expr) {
        window.alert(label);
        throw new Error(label);
    }
}

export { cellsGrid } from './cells-grid.js';
export { sum } from './sum.js';
