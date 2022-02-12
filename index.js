const GRID_SIZE = 40;

function createGridPattern(id='grid', side=20, strokeWidth=1, stroke='rgb(200, 200, 200)',) {
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
        y: (y+0.55)*GRID_SIZE,
        //'text-anchor': 'middle',
        //'alignment-baseline':'middle',
        //'dominant-baseline':'middle',
        'font-size': GRID_SIZE*0.75*scale,
        fill:fill
    }, text);
}

const comp = {
    cells: [
        {value:4, pos:[0, 0]},
        {value:3, pos:[1, 0], scale:0.5},
        {value:2, pos:[0, 1], fill:'red'},
    ],

    view() {
        return m('svg', { viewBox:`0 0 400 400`, width:400, height:400 }, [
            m('defs', [
                createGridPattern('grid', GRID_SIZE, 1)
            ]),
            m('rect', {width:'100%', height:'100%', /*transform:'translate(0,0)',*/ fill:'url(#grid)'}),
            ...this.cells.map(c => createNumber(c.value, c.pos, c.scale||1, c.fill))
            /*createNumber(4, [0, 0]),
            createNumber(2, [1, 0], 0.5),
            createNumber(2, [0, 1], 1, 'red'),*/
        ]);
    }
}

function sum(...numbers) {

}

m.mount(document.body.querySelector('main'), comp);
