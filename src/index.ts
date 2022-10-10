import { mount } from 'mithril';
import { cellsGrid } from './cells-grid';
import { sum } from './sum';
import { subtract } from './subtract';
import { multiply } from './multiply';
import { divide } from './divide';

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
  searchParams.set('sum', '533,819');
  location.search = searchParams.toString();
}

const mainEl = document.body.querySelector('main');
const { cells, lines } = op(params.split(','));
mainEl && mount(mainEl, cellsGrid(cells, lines));
