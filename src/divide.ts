import {
  assert,
  RESULT_COLOR,
  DECIMALS_SEPARATOR,
  Cell,
  Line,
  numDecimals,
  getDigits,
  arrayToNum,
  numToArray,
  getKey,
  mapToNum,
  nthFromEnd
} from './basic-algebra';

export function divide(divs:string[], options: { maxIterations: number } = { maxIterations: 10 }): {
  cells: Cell[];
  lines: Line[];
} {
  for (const n of divs) {
    assert(isFinite(n as any as number), 'must be a valid number');
    assert((n as any as number) >= 0, 'negative number is unsupported');
  }
  assert(divs.length === 2, 'division expects 2 numbers');
  let zeroError;
  if (divs[1] === '0') {
    zeroError = divs[0] === '0' ? 'zero over zero is undefined' : 'something over zero results in infinity';
  }
  assert(zeroError === undefined, zeroError as string);

  const { maxIterations } = options;

  const individualNumDecimals = divs.map(numDecimals);

  const digits = getDigits(divs);

  const dividend = digits[0] as number[];//[5,6];
  const divisor = digits[1] as number[];
  const quotient:number[] = [];
  const rest = new Map<string, number>();
  let numIterations = 0;
  const originalDividendLength = dividend.length;

  const divisorAll = arrayToNum(divisor, 0, divisor.length);

  let cutFrom = 0;
  let cutLen = 1;
  let candidate;
  let periodLength = 0;

  //let maxIterations = 10;
  const rests:number[] = [];

  candidate = arrayToNum(dividend, cutFrom, cutLen);
  while (candidate < divisorAll) {
    ++cutLen;
    candidate = arrayToNum(dividend, cutFrom, cutLen);
  }

  let q = Math.floor(candidate / divisorAll);
  let r = candidate - q*divisorAll;
  rests.push(r);
  let rr = numToArray(r);
  //console.log({ cutFrom, cutLen });
  while (rr.length < cutLen) {
    rr.unshift(0);
  }
  //console.log({ c:candidate, q, r, rr });
  quotient.push(q);
  for (let i = 0; i < rr.length; ++i) {
    rest.set(getKey(numIterations, i), rr[i]);
  }
  ++numIterations;
  cutFrom = cutFrom + cutLen;

  while (numIterations < maxIterations && (rests[rests.length-1] !== 0 || numIterations < originalDividendLength)) {
    let goingDown = 0;
    try {
      goingDown = arrayToNum(dividend, cutFrom, 1);
      //console.log(`going down of ${goingDown} from #${cutFrom}`);
    } catch (_) {
      //console.log(`failed getting going down of from #${cutFrom}. using 0`);
      dividend.push(0);
      ++individualNumDecimals[0];
    }
    rest.set(getKey(numIterations-1, cutFrom), goingDown);

    candidate = mapToNum(rest, numIterations -1, numIterations-1, cutLen);
    if (candidate < divisorAll) {
      candidate = mapToNum(rest, numIterations -1, numIterations-1, cutLen+1);
    }

    q = Math.floor(candidate / divisorAll);
    r = candidate - q*divisorAll;
    rests.push(r);
    rr = numToArray(r);
    while (rr.length < cutLen) {
      rr.unshift(0);
    }
    //console.log({ c:candidate, q, r, rr });
    quotient.push(q);
    for (let i = 0; i < rr.length; ++i) {
      rest.set(getKey(numIterations, i + numIterations), rr[i]);
    }
    ++numIterations;
    
    if (nthFromEnd(quotient, 0) === nthFromEnd(quotient, 1) &&
      nthFromEnd(rests, 0) === nthFromEnd(rests, 1)) {
        periodLength = 1;
        //console.log(`period (${nthFromEnd(quotient, 0)})`);
        break;
    }
    else if (nthFromEnd(quotient, 0) === nthFromEnd(quotient, 2) &&
      nthFromEnd(quotient, 1) === nthFromEnd(quotient, 3) &&
      nthFromEnd(rests, 0) === nthFromEnd(rests, 2)) {
        periodLength = 2;
        //console.log(`period (${nthFromEnd(quotient, 1)}${nthFromEnd(quotient, 0)})`);
        break;
    }
    ++cutFrom;
  }

  // http://127.0.0.1:5173/?div=384,4

  function backTrack() {
    //console.log(`backtrack`);
    dividend.pop();
    quotient.pop();
    --individualNumDecimals[0];
  }

  if (periodLength) {
    //for (let i = 0; i < periodLength; ++i) backTrack();
    --numIterations;
  }
  if (quotient[quotient.length-1] === 0) backTrack();

  //console.log('rest', rest);
  //console.log('rests', rests);

  const cells:Cell[] = [];
  const lines:Line[] = [];

  // dividend
  for (let i = 0; i < dividend.length; ++i) {
    cells.push({ pos: [- dividend.length + i, 0], value: dividend[i] });
  }
  if (individualNumDecimals[0] > 0) {
    cells.push({
      value: DECIMALS_SEPARATOR,
      pos: [-0.5 - individualNumDecimals[0], 0],
    });
  }

  // divisor
  for (let i = 0; i < divisor.length; ++i) {
    cells.push({ pos: [i, 0], value: divisor[i] });
  }
  if (individualNumDecimals[1] > 0) {
    cells.push({
      value: DECIMALS_SEPARATOR,
      pos: [divisor.length - 0.5 - individualNumDecimals[1], 0],
    });
  }

  // quotient
  const sumDecimalPlaces = individualNumDecimals[0] + individualNumDecimals[1];

  for (let i = 0; i < quotient.length; ++i) {
    cells.push({ pos: [i, 1], value: quotient[i], fill: RESULT_COLOR });
  }
  if (sumDecimalPlaces > 0) {
    cells.push({
      value: DECIMALS_SEPARATOR,
      pos: [quotient.length - 0.5 - sumDecimalPlaces, 1],
      fill: RESULT_COLOR
    });
  }
  if (periodLength) { // 1234,450 // 1234,33
    cells.push({
      value: '(',
      pos: [quotient.length - 0.5 - periodLength, 1],
      fill: RESULT_COLOR
    });
    cells.push({
      value: ')',
      pos: [quotient.length - 0.5, 1],
      fill: RESULT_COLOR
    });
  }

  // rest
  for (let i = 0; i < dividend.length; ++i) {
    for (let j = 0; j < numIterations; ++j) {
      const v = rest.get(getKey(j, i));
      if (v !== undefined) {
        cells.push({ pos: [- dividend.length + i, j+1], value: v });
      }
    }
  }

  lines.push({
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 1,
    strokeWidth: 2,
  });

  lines.push({
    x1: 0,
    x2: Math.max(divisor.length, quotient.length),
    y1: 1,
    y2: 1,
    strokeWidth: 2,
  });

  return { cells, lines };
};
