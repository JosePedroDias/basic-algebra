// @ts-check

import { GRID_SIZE } from './basic-algebra.js';

function createGridPattern(id='grid', side=20, strokeWidth=1, stroke='rgb(220, 220, 220)',) {
    const W = side;
    const W2 = W/2;
    return m('pattern', {
        id: id,
        patternUnits: 'userSpaceOnUse',
        width: W,
        height: W,
        patternTransform: `translate(${-W2} ${-W2})`
    }, [
        //m('rect', {x:0, y:0, width:W, height:W, fill:'yellow'}),
        m('path', {d:`M ${W2},0 V ${W} Z M 0,${W2} H ${W} Z`, stroke, strokeWidth, fill:'none'})
    ])
}

/**
 * @param {string|number} text 
 * @param {[number, number]} param1 
 * @param {number} scale
 * @param {string} fill 
 * @returns {Mithril}
 */
function createNumber(text, [x, y], scale=1, fill) {
    return m('text', {
        x: (x+0.5)*GRID_SIZE,
        y: (y+0.5)*GRID_SIZE,
        dy: GRID_SIZE*0.25*scale,
        'font-size': GRID_SIZE*0.75*scale,
        fill: fill
    }, text);
}

function createLine([x1, y1], [x2, y2], strokeWidth=1, stroke='black') {
    return m('line', {
        x1: x1*GRID_SIZE,
        y1: y1*GRID_SIZE,
        x2: x2*GRID_SIZE,
        y2: y2*GRID_SIZE,
        stroke: stroke,
        'stroke-width': strokeWidth
    });
}

/**
 * @param {{ cells:Cell[], lines:Line[], viewBox:ViewBox }} param0 
 * @returns {MithrilComponent}
 */
export function cellsGrid({ cells, lines, viewBox }) {
    return {
        cells: cells,
        lines: lines,
        view() {
            return m('svg', {
                viewBox: viewBox.join(' ')
            }, [
                m('defs', [
                    createGridPattern('grid', GRID_SIZE, 1)
                ]),
                m('rect', {
                    x: viewBox[0],
                    y: viewBox[1],
                    width: viewBox[2],
                    height: viewBox[3],
                    fill: 'url(#grid)'
                }),
                ...this.cells.map(c => createNumber(c.value, c.pos, c.scale||1, c.fill)),
                ...this.lines.map(l => createLine([l.x1, l.y1], [l.x2, l.y2], l.strokeWidth||1, l.stroke))
            ]);
        }
    };
};
