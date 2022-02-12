// @ts-check

import { sum, cellsGrid } from './basic-algebra.js';

const searchParams = new URLSearchParams(location.search);
const sumParam = searchParams.get('sum');
if (!sumParam || sumParam === '' || sumParam === null) {
    searchParams.set('sum', '533,819');
    location.search = searchParams.toString();
}
console.warn('summing', sumParam.split(','));

const result = sum(sumParam.split(','));

m.mount(document.body.querySelector('main'), cellsGrid(result));
