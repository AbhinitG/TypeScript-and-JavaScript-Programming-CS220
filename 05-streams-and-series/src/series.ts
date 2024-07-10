import { snode, sempty, Stream } from "../include/stream.js";

export type Series = Stream<number>;

export function addSeries(s: Series, t: Series): Series {
  // TODO
  if (s.isEmpty()) return t;
  if (t.isEmpty()) return s;

  const sum = s.head() + t.head();
  return snode(sum, () => addSeries(s.tail(), t.tail()));
}

// function sreduce<T, R>(s: Stream<T>, f: (acc: R, e: T) => R, init: R) {
//   return snode(init, () => (s.isEmpty() ? sempty<R>() : sreduce(s.tail(), f, f(init, s.head()))));
// }

export function prodSeries(s: Series, t: Series): Series {
  //TODO
  if (s.isEmpty()) {
    return sempty();
  }

  const prod = t.map(e => s.head() * e);
  const new_t = snode(0, () => prodSeries(s.tail(), t));

  return addSeries(prod, new_t);
}

export function derivSeries(s: Series): Series {
  // TODO
  if (s.isEmpty()) {
    return sempty();
  } else if (s.tail().isEmpty()) {
    return snode(0, () => sempty());
  } else {
    let count = 1;
    return s.tail().map(e => {
      const prod = e * count;
      count += 1;
      return prod;
    });
  }
}

export function coeff(s: Series, n: number): number[] {
  // TODO
  const arr = [];
  for (let i = 0; i <= n; ++i) {
    if (s.isEmpty()) break;
    arr.push(s.head());
    s = s.tail();
  }
  return arr;
}

export function evalSeries(s: Series, n: number): (x: number) => number {
  // TODO
  let exp = 0;
  return (x: number) =>
    coeff(s, n).reduce((acc, e) => {
      acc += e * Math.pow(x, exp);
      exp += 1;
      return acc;
    }, 0);
}

export function applySeries(f: (c: number) => number, v: number): Series {
  // TODO
  return snode(v, () => applySeries(f, f(v)));
}

export function expSeries(): Series {
  // TODO
  function fact(n: number): number {
    return n < 2 ? 1 : n * fact(n - 1);
  }

  function generateSeries(f: (k: number) => number, n: number): Series {
    return snode(f(n), () => generateSeries(f, n + 1));
  }

  const f = (k: number) => 1 / fact(k);
  return generateSeries(f, 0);
}

function nextVal(prevVals: number[], coef: number[]): number {
  let val = 0;
  for (let i = 0; i < coef.length; ++i) {
    val += coef[i] * prevVals[i];
  }
  return val;
}

function genRecurSeries(prevVals: number[], coef: number[]): Series {
  const newVals = [...prevVals.slice(1), nextVal(prevVals, coef)];
  return snode(prevVals[0], () => genRecurSeries(newVals, coef));
}

export function recurSeries(coef: number[], init: number[]): Series {
  // TODO
  return genRecurSeries(init, coef);
}
