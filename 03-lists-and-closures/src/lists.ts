import { List, node, empty, reverseList } from "../include/lists.js";

export function keepTrendMiddles(
  lst: List<number>,
  allSatisfy: (prev: number, curr: number, next: number) => boolean
): List<number> {
  if (lst.isEmpty() || lst.tail().isEmpty() || lst.tail().tail().isEmpty()) {
    return empty();
  } else if (allSatisfy(lst.head(), lst.tail().head(), lst.tail().tail().head())) {
    return node(lst.tail().head(), keepTrendMiddles(lst.tail(), allSatisfy));
  } else {
    return keepTrendMiddles(lst.tail(), allSatisfy);
  }
}

export function keepLocalMaxima(lst: List<number>): List<number> {
  return keepTrendMiddles(lst, (p, c, n) => c > p && c > n);
}

export function keepLocalMinima(lst: List<number>): List<number> {
  return keepTrendMiddles(lst, (p, c, n) => c < p && c < n);
}

export function keepLocalMinimaAndMaxima(lst: List<number>): List<number> {
  return keepTrendMiddles(lst, (p, c, n) => (c < p && c < n) || (c > p && c > n));
}

export function invalidN(n: number): boolean {
  return n <= 0 || !Number.isInteger(n);
}

export function everyNList<T>(lst: List<T>, n: number): List<T> {
  // TODO: Implement this function
  const revlst = reverseList(lst);
  return everyNRev(revlst, n);
}

export function everyNRev<T>(lst: List<T>, n: number): List<T> {
  // TODO: Implement this function;
  if (invalidN(n)) return empty();
  let i = 1;

  const revlst = lst.reduce((acc, e) => node(e, acc), empty<T>());
  const reducedlst = revlst.reduce((acc, e) => {
    if (i++ === n) {
      i = 1;
      acc = node(e, acc);
    }
    return acc;
  }, empty<T>());
  return reducedlst.reduce((acc, e) => node(e, acc), empty<T>());
}

export function everyNCond<T>(lst: List<T>, n: number, cond: (e: T) => boolean): List<T> {
  // TODO: Implement this function
  if (invalidN(n)) return empty();
  let i = 0;
  return lst.filter((e: T) => {
    const nthElement = ++i % n === 0;
    return cond(e) && nthElement;
  });
}

export function productsHelper(lst: List<number>, cond: (n: number) => boolean): List<number> {
  let prev = 1;
  const newlst = lst.reduce((acc: List<number>, e: number) => {
    acc = cond(e) ? node(e * prev, acc) : acc;
    prev = cond(e) ? e * prev : 1;
    return acc;
  }, empty<number>());
  return reverseList(newlst);
}

export function nonNegativeProducts(lst: List<number>): List<number> {
  // TODO: Implement this function
  return productsHelper(lst, (n: number): boolean => n >= 0);
}

export function negativeProducts(lst: List<number>): List<number> {
  // TODO: Implement this function
  return productsHelper(lst, (n: number): boolean => n < 0);
}

export function listSum(lst: List<number>): number {
  return lst.isEmpty() ? 0 : lst.head() + listSum(lst.tail());
}

export function squashList(lst: List<number | List<number>>): List<number> {
  // TODO: Implement this function
  return lst.map(e => (typeof e === "number" ? e : listSum(e)));
}

export function composeList<T>(lst: List<(n: T) => T>): (n: T) => T {
  // TODO: Implement this function
  return (n: T): T => lst.reduce((acc, f) => f(acc), n);
}

export function composeFunctions<T, U>(funcArr: ((arg1: T, arg2: U) => T)[]): (a: U) => (x: T) => T {
  // TODO: Implement this function
  return (a: U) => (x: T) => funcArr.reduce((acc, f) => f(acc, a), x);
}
