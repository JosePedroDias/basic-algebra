function assert(expr, label) {
    if (!expr) {
        window.alert(label);
        throw new Error(label);
    }
}


const GRID_SIZE = 40;
const RESULT_COLOR = 'green';
const ANNOTATION_COLOR = 'purple';

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


const searchParams = new URLSearchParams(location.search);
const sumParam = searchParams.get('sum');
// console.warn(['sumParam', sumParam]);
if (!sumParam || sumParam === '' || sumParam === null) {
    searchParams.set('sum', '533,819');
    location.search = searchParams.toString(); // reloads page
}
const params = sumParam.split(',').map(n => parseInt(n, 10));
console.warn('summing', params);
const tmp = sum(params);

const comp = {
    cells: tmp.cells,
    lines: tmp.lines,
    view() {
        return m('svg', {
            viewBox: tmp.viewBox
        }, [
            m('defs', [
                createGridPattern('grid', GRID_SIZE, 1)
            ]),
            m('rect', {
                x: tmp.viewBoxParts[0],
                y: tmp.viewBoxParts[1],
                width: tmp.viewBoxParts[2],
                height: tmp.viewBoxParts[3],
                fill: 'url(#grid)'
            }),
            ...this.cells.map(c => createNumber(c.value, c.pos, c.scale||1, c.fill)),
            ...this.lines.map(l => createLine([l.x1, l.y1], [l.x2, l.y2], l.strokeWidth||1, l.stroke))
        ]);
    }
}

/*
533 + 819

 533
+819
1352
*/
function sum(numbers) {
    for (let n of numbers) {
        assert(n >= 0, 'negative number is unsupported');
    }

    const cells = [];
    const lines = [];

    const invertedDigits = numbers.map(num => {
        const arr = num.toString().split('').reverse();
        return arr.map(s => parseInt(s, 10));
    });

    const numDigits = Math.max(... invertedDigits.map(id => id.length) );
    
    let carries = 0;
    for (let d = 0; d < numDigits; ++d) { // x (right to left)
        let localSum = 0;
        for (let i = 0; i < numbers.length; ++i) { // y (up to down)
            const v = invertedDigits[i][d];
            if (v === undefined) continue;
            cells.push({
                value: v,
                pos: [-d, i]
            });
            localSum += v;
        }
        localSum += carries;
        if (localSum > 9) {
            localSum = localSum - 10;
            carries = 1;
            cells.push({
                value: 1,
                pos: [-d-0.5, -0.5],
                scale: 0.75,
                fill: ANNOTATION_COLOR
            });
            lines.push({
                x1: -d +0.2,
                x2: -d -0.2,
                y1: -0.2,
                y2: +0.2,
                strokeWidth: 1,
                stroke: ANNOTATION_COLOR
            });
        } else {
            carries = 0;
        }
        cells.push({
            value: localSum,
            pos: [-d, numbers.length],
            fill: RESULT_COLOR
        });
    }

    if (carries) {
        cells.push({
            value: carries,
            pos: [-numDigits, numbers.length],
            fill: RESULT_COLOR
        });
    }

    cells.push({
        value: '+',
        pos: [-numDigits, numbers.length-1],
    });

    lines.push({
        x1: -numDigits+1,
        x2: 1,
        y1: numbers.length,
        y2: numbers.length,
        strokeWidth: 2
    });

    const extents = [
        [Number.MAX_SAFE_INTEGER, -Number.MAX_SAFE_INTEGER], // X min max
        [Number.MAX_SAFE_INTEGER, -Number.MAX_SAFE_INTEGER]  // Y min max
    ];
    for (let c of cells) {
        const [x, y] = c.pos;
        const x0 = (x-0)*GRID_SIZE;
        const y0 = (y-0)*GRID_SIZE;
        const x1 = (x+1)*GRID_SIZE;
        const y1 = (y+1)*GRID_SIZE;
        if (x0 < extents[0][0]) extents[0][0] = x0;
        if (y0 < extents[1][0]) extents[1][0] = y0;
        if (x1 > extents[0][1]) extents[0][1] = x1;
        if (y1 > extents[1][1]) extents[1][1] = y1;
    }
    const viewBoxParts = [
        extents[0][0],
        extents[1][0],
        extents[0][1]-extents[0][0],
        extents[1][1]-extents[1][0]
    ];
    const viewBox = viewBoxParts.join(' ');

    return {cells, lines, viewBoxParts, viewBox};
}

//sum([23, 111]);

m.mount(document.body.querySelector('main'), comp);
