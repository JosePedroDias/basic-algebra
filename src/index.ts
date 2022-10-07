import { mount } from 'mithril';
import { sum, cellsGrid } from './basic-algebra';

const searchParams = new URLSearchParams(location.search);
const sumParam = searchParams.get('sum');
if (!sumParam || sumParam === '' || sumParam === null) {
  searchParams.set('sum', '533,819');
  location.search = searchParams.toString();
} else {
  console.warn('summing', sumParam.split(','));
  const result = sum(sumParam.split(','));
  const mainEl = document.body.querySelector('main');
  mainEl && mount(mainEl, cellsGrid(result));
}
