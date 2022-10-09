import { mount } from 'mithril';
import { cellsGrid } from './cells-grid';
import { sum } from './sum';
import { subtract } from './subtract';

const searchParams = new URLSearchParams(location.search);
const sumParams = searchParams.get('sum');
const subParams = searchParams.get('sub');
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
else {
  searchParams.set('sum', '533,819');
  location.search = searchParams.toString();
  // TODO DOES REFRESH?
}

const mainEl = document.body.querySelector('main');
const { cells, lines } = op(params.split(','));
mainEl && mount(mainEl, cellsGrid(cells, lines));
