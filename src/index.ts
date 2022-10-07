import { mount } from 'mithril';
import { sum, cellsGrid } from './basic-algebra';

const searchParams = new URLSearchParams(location.search);
const sumParam = searchParams.get('sum');
if (!sumParam || sumParam === '' || sumParam === null) {
  searchParams.set('sum', '533,819');
  location.search = searchParams.toString();
} else {
  const mainEl = document.body.querySelector('main');
  console.warn('summing', sumParam.split(','));
  const { cells, lines } = sum(sumParam.split(','));
  mainEl && mount(mainEl, cellsGrid(cells, lines));
}
