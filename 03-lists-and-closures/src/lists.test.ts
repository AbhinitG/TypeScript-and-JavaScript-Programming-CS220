import assert from "assert";
import { List, node, empty, listToArray, arrayToList } from "../include/lists.js";
import {
  keepTrendMiddles,
  keepLocalMaxima,
  keepLocalMinima,
  keepLocalMinimaAndMaxima,
  everyNList,
  everyNRev,
  everyNCond,
  nonNegativeProducts,
  negativeProducts,
  squashList,
  composeList,
  composeFunctions,
} from "./lists.js";

// listToArray and arrayToList are provided for your testing convinience only.

describe("keepTrendMiddles", () => {
  // Tests for keepTrendMiddles go here
  it("should return a new list", () => {
    const lst = node(1, node(2, node(3, empty())));
    const newlst = keepTrendMiddles(lst, (x, y, z) => y >= x && y <= z);
    assert(newlst !== lst);
  });

  it("should return an empty list if list has less than three numbers", () => {
    const lst1 = node(1, empty());
    const lst2 = node(1, node(2, empty()));
    const newlst1 = keepTrendMiddles(lst1, (x, y, z) => y >= x && y <= z);
    const newlst2 = keepTrendMiddles(lst2, (x, y, z) => y >= x && y <= z);

    assert(newlst1.isEmpty());
    assert(newlst2.isEmpty());
  });

  it("should return a list with just the number whose adjacent neighbors and itself satisfies the condition", () => {
    const lst1 = node(1, node(2, node(3, empty())));
    const lst2 = node(1, node(0, node(3, node(7, empty()))));
    const newlst1 = keepTrendMiddles(lst1, (x, y, z) => y >= x && y <= z);
    const newlst2 = keepTrendMiddles(lst2, (x, y, z) => y >= x && y <= z);

    assert(newlst1.head() === 2);
    assert(newlst1.tail().isEmpty());
    assert(newlst2.head() === 3);
    assert(newlst2.tail().isEmpty());
  });
});

describe("keepLocalMaxima", () => {
  // Tests for keepLocalMaxima go here
  it("should return an empty list if there exists no local maxima", () => {
    const lst = arrayToList([1, 2, 3, 4, 5, 6, 7]);
    const newlst = keepLocalMaxima(lst);
    assert(newlst.isEmpty());
  });

  it("should return a list with just the numbers that are the local maxima", () => {
    const lst = arrayToList([1, 2, 3, 0, 5, 4]);
    const newlst = keepLocalMaxima(lst);
    assert(newlst.head() === 3);
    assert(newlst.tail().head() == 5);
    assert(newlst.tail().tail().isEmpty());
  });
});

describe("keepLocalMinima", () => {
  // Tests for keepLocalMinima go here
  it("should return an empty list if there exists no local maxima", () => {
    const lst = arrayToList([1, 2, 3, 4, 5, 6, 7]);
    const newlst = keepLocalMaxima(lst);
    assert(newlst.isEmpty());
  });

  it("should return a list with just the numbers that are the local minima", () => {
    const lst = arrayToList([1, 2, 3, 0, 5, 4, -1, 7]);
    const newlst = keepLocalMinima(lst);
    assert(newlst.head() === 0);
    assert(newlst.tail().head() === -1);
    assert(newlst.tail().tail().isEmpty());
  });
});

describe("keepLocalMinimaAndMaxima", () => {
  // Tests for keepLocalMinimaAndMaxima go here
  it("should return an empty list if there exists no local maxima or minima", () => {
    const lst = arrayToList([1, 2, 3, 4, 5, 6, 7]);
    const newlst = keepLocalMinimaAndMaxima(lst);
    assert(newlst.isEmpty());
  });

  it("should return a list with the local maxima and minima", () => {
    const lst = arrayToList([1, 2, 3, 0, 5, 4, -1, 7]);
    const newlst = keepLocalMinimaAndMaxima(lst);
    const newArr = listToArray(newlst);
    const expectedAnswers = [3, 0, 5, -1];

    assert(newArr.length === expectedAnswers.length);
    for (let i = 0; i < newArr.length; ++i) {
      assert(newArr[i] === expectedAnswers[i]);
    }
    expect(newArr).toEqual(expectedAnswers);
  });
});

describe("everyNList", () => {
  // Tests for everyNList go here
  it("should return a list with every nth element of the list", () => {
    const lst = arrayToList([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const newlst1 = everyNList(lst, 2);
    const newlst2 = everyNList(lst, 3);
    const newArr1 = listToArray(newlst1);
    const newArr2 = listToArray(newlst2);
    const expectedVals1 = [2, 4, 6, 8, 10];
    const expectedVals2 = [3, 6, 9];

    assert(newArr1.length === expectedVals1.length);
    assert(newArr2.length === expectedVals2.length);
    expect(newArr1).toEqual(expectedVals1);
    expect(newArr2).toEqual(expectedVals2);
  });
});

describe("everyNRev", () => {
  // Tests for everyNRev go here
  it("should return an empty list if n is not a natural number", () => {
    const lst = arrayToList([1, 2, 3, 4, 5, 6, 7]);
    const newlst = everyNRev(lst, -1);
    const newlst2 = everyNRev(lst, 1.589);

    assert(newlst.isEmpty());
    assert(newlst2.isEmpty());
  });

  it("should return a list with every nth element of the list in reverse order", () => {
    const lst = arrayToList([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const newlst1 = everyNRev(lst, 2);
    const newlst2 = everyNRev(lst, 3);
    const newArr1 = listToArray(newlst1);
    const newArr2 = listToArray(newlst2);
    const expectedVals1 = [9, 7, 5, 3, 1];
    const expectedVals2 = [8, 5, 2];

    assert(newArr1.length === expectedVals1.length);
    assert(newArr2.length === expectedVals2.length);
    expect(newArr1).toEqual(expectedVals1);
    expect(newArr2).toEqual(expectedVals2);
  });
});

describe("everyNCond", () => {
  // Tests for everyNCond go here
  it("should return an empty list if n is not a natural number", () => {
    const lst = arrayToList([1, 2, 3, 4, 5, 6, 7]);
    const func = (e: number): boolean => e % 2 === 0;
    const newlst = everyNCond(lst, -1, func);
    const newlst2 = everyNCond(lst, 1.589, func);

    assert(newlst.isEmpty());
    assert(newlst2.isEmpty());
  });

  it("should return a list with every nth element of the list that satisfies the condition", () => {
    const lst = arrayToList([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const func1 = (e: number): boolean => e > 2;
    const func2 = (e: number): boolean => e > 5;
    const newlst1 = everyNCond(lst, 2, func1);
    const newlst2 = everyNCond(lst, 3, func2);
    const newArr1 = listToArray(newlst1);
    const newArr2 = listToArray(newlst2);
    const expectedVals1 = [4, 6, 8, 10];
    const expectedVals2 = [6, 9];

    assert(newArr1.length === expectedVals1.length);
    assert(newArr2.length === expectedVals2.length);
    expect(newArr1).toEqual(expectedVals1);
    expect(newArr2).toEqual(expectedVals2);
  });
});

describe("nonNegativeProducts", () => {
  // Tests for nonNegativeProducts go here
  it("should return an empty list if the list passed in contains only negative numbers", () => {
    const arr = [-1, -2, -3, -4, -5];
    const lst = arrayToList(arr);
    const newlst = nonNegativeProducts(lst);

    assert(newlst.isEmpty());
  });

  it("should return a list with only nonnegative numbers if there are no instance of consecutive nonnegative numbers", () => {
    const arr = [-1, 1, -2, 2, -3, 3, -4, 4];
    const lst = arrayToList(arr);
    const newlst = nonNegativeProducts(lst);
    const newArr = listToArray(newlst);
    const expected = [1, 2, 3, 4];

    expect(newArr).toEqual(expected);
  });

  it("should return a list with a product if there are consecutive nonnegative numbers", () => {
    const arr = [2, 3, -1, 0.5, 2];
    const lst = arrayToList(arr);
    const newlst = nonNegativeProducts(lst);
    const newArr = listToArray(newlst);
    const expected = [2, 6, 0.5, 1];

    expect(newArr).toEqual(expected);
  });
});

describe("negativeProducts", () => {
  // Tests for nonNegativeProducts go here
});

describe("squashList", () => {
  // Tests for squashList go here
});

describe("composeList", () => {
  // Tests for composeList go here
});
