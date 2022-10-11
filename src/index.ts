import { default as m, mount } from 'mithril';
import { cellsGrid } from './cells-grid';
import { sum } from './sum';
import { subtract } from './subtract';
import { multiply } from './multiply';
import { divide } from './divide';

const mainEl = document.body.querySelector('main');

const searchParams = new URLSearchParams(location.search);
const sumParams = searchParams.get('sum');
const subParams = searchParams.get('sub');
const mulParams = searchParams.get('mul');
const divParams = searchParams.get('div');
let op:Function = () => {};
let params:string = '';
if (sumParams) {
  op = sum;
  params = sumParams;
}
else if (subParams) {
  op = subtract;
  params = subParams;
}
else if (mulParams) {
  op = multiply;
  params = mulParams;
}
else if (divParams) {
  op = divide;
  params = divParams;
}
else {
  const ops: { [ key: string ]:string } = {
    sum: 'add',
    sub: 'subtract',
    mul: 'multiply',
    div: 'divide'
  };

  function go(ev:Event) {
    ev.preventDefault();
    ev.stopPropagation();

    // @ts-ignore
    const vA = document.getElementById('a').value.replace(',', '.');
    // @ts-ignore
    const vB = document.getElementById('b').value.replace(',', '.');
    // @ts-ignore
    const opName = ev.target?.dataset?.op;

    if (!opName) return;

    for (let op_ of Object.keys(ops)) {
      searchParams.delete(op_);
    }

    searchParams.set(opName, [vA, vB].join(','));
    location.search = searchParams.toString();
  }
  const Form = {
    view: () => m('.form', [
      m('h1', 'basic algebra'),
      m('p', [
        m('label', { for: 'a' }, '1st number:'),
        m('input#a', { value:'12' }),
      ]),
      m('p', [
        m('label', { for: 'b' }, '2nd number:'),
        m('input#b', { value: '3'}),
      ]),
      m('p',
      { onclick: go },
        Object.entries(ops)
        .map(([op, opName]) => m('button', { 'data-op': op }, opName))),
      m('p', [
        m('br'),
        m('a', { href: 'https://github.com/JosePedroDias/basic-algebra' }, 'project source code on GitHub'),
      ])
    ])
  };

  mainEl && mount(mainEl, Form);
}

if (params) {
  const { cells, lines } = op(params.split(','));
  mainEl && mount(mainEl, cellsGrid(cells, lines));
}
