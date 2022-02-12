// MITHRIL

interface Mithril {
    (nodeNameOrString:string|number, attributes?:Object, children?:Mithril[]|string|number);
    redraw():void;
    mount(el:Element, comp:any):void;
    unmount():void;
}

declare const m:Mithril;

declare interface MithrilComponent {
    cells: Cell[];
    lines: Line[];
    view: () => Mithril;
}


// CELL-GRID

interface Line {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    strokeWidth?: number;
    stroke?: string;
}

interface Cell {
    pos: [number, number];
    value: string | number;
    scale?: number;
    fill?: string;
}

type ViewBox = [number, number, number, number];
