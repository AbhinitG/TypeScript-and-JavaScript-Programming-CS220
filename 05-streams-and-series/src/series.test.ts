import assert from "assert";
import { sempty, Stream, to } from "../include/stream.js";
import {
  recurSeries,
  expSeries,
  applySeries,
  evalSeries,
  coeff,
  derivSeries,
  prodSeries,
  addSeries,
} from "./series.js";

function expectStreamToBe<T>(s: Stream<T>, a: T[]) {
  for (const element of a) {
    expect(s.isEmpty()).toBe(false);
    expect(s.head()).toBe(element);

    s = s.tail();
  }

  expect(s.isEmpty()).toBe(true);
}

describe("addSeries", () => {
  it("adds simple streams together", () => {
    // Open `include/stream.ts` to learn how to use `to`
    // 1 -> 2 -> 3 -> 4 -> 5
    const a = to(1, 5);
    const b = to(1, 5);
    const c = addSeries(a, b);

    expectStreamToBe(c, [2, 4, 6, 8, 10]);
  });

  it("returns the other stream when one is empty", () => {
    // Open `include/stream.ts` to learn how to use `to`
    // 1 -> 2 -> 3 -> 4 -> 5
    const a = to(1, 5);
    const b = sempty<number>();
    const c = addSeries(a, b);
    const d = to(2, 5);
    const e = addSeries(b, d);

    expectStreamToBe(c, [1, 2, 3, 4, 5]);
    expectStreamToBe(e, [2, 3, 4, 5]);
  });
});

describe("prodSeries", () => {
  // More tests for prodSeries go here
  it("multiplies simple streams together", () => {
    // Open `include/stream.ts` to learn how to use `to`
    // 1 -> 2 -> 3 -> 4 -> 5
    const a = to(1, 5);
    const b = to(1, 5);
    const c = prodSeries(a, b);

    // (1 + 2x + 3x^2 + 4x^3 + 5x^4)^2 = 1 + 4x + 10x^2 + 20x^3 + 35x^4 + 44x^5 + 46x^6 + 40x^7 + 25x^8
    expectStreamToBe(c, [1, 4, 10, 20, 35, 44, 46, 40, 25]);
  });

  it("should return sempty() when either stream is empty", () => {
    // Open `include/stream.ts` to learn how to use `to`
    // 1 -> 2 -> 3 -> 4 -> 5
    const a = to(1, 5);
    const b = sempty<number>();
    const c = prodSeries(b, a);

    expectStreamToBe(c, []);
  });
});

describe("derivSeries", () => {
  // More tests for derivSeries go here
  it("derives a simple stream", () => {
    // Open `include/stream.ts` to learn how to use `to`
    // 1 -> 2 -> 3 -> 4 -> 5
    const a = to(1, 5);
    const c = derivSeries(a);

    // derivative of (1 + 2x + 3x^2 + 4x^3 + 5x^4) = 2 + 6x + 12x^2 + 20x^3
    expectStreamToBe(c, [2, 6, 12, 20]);
  });

  it("should return sempty() when the stream passed is empty", () => {
    // Open `include/stream.ts` to learn how to use `to`
    // 1 -> 2 -> 3 -> 4 -> 5
    const a = sempty<number>();
    const c = derivSeries(a);

    // derivative of (1 + 2x + 3x^2 + 4x^3 + 5x^4) = 2 + 6x + 12x^2 + 20x^3
    expectStreamToBe(c, []);
  });

  it("should return a stream with only 0 when the stream passed in has a single term", () => {
    // Open `include/stream.ts` to learn how to use `to`
    // 1 -> 2 -> 3 -> 4 -> 5
    const a = to(1, 1);
    const c = derivSeries(a);

    // derivative of (1 + 2x + 3x^2 + 4x^3 + 5x^4) = 2 + 6x + 12x^2 + 20x^3
    expectStreamToBe(c, [0]);
  });
});

describe("coeff", () => {
  // More tests for coeff go here
  it("returns a simple stream", () => {
    // Open `include/stream.ts` to learn how to use `to`
    // 1 -> 2 -> 3 -> 4 -> 5
    const a = to(1, 5);
    const c = coeff(a, 4);
    const sol = [1, 2, 3, 4, 5];

    //
    expect(c).toEqual(sol);
  });
});

describe("evalSeries", () => {
  // More tests for coeff go here
  it("returns the sum of all terms", () => {
    // Open `include/stream.ts` to learn how to use `to`
    // 1 -> 2 -> 3 -> 4 -> 5
    const a = to(1, 5);
    const c = evalSeries(a, 4);
    // solution if x = 3
    assert(c(3) === 547);
  });
});

describe("applySeries", () => {
  // More tests for applySeries go here
  it("returns the stream representing the infinite series", () => {
    const multBy3 = (c: number) => 3 * c;
    const a = applySeries(multBy3, 1);
    const c = coeff(a, 4);
    const sol = [1, 3, 9, 27, 81];

    expect(c).toEqual(sol);
  });
});

describe("expSeries", () => {
  // More tests for applySeries go here
  it("returns the stream representing the taylor series", () => {
    const a = expSeries();
    const k = [0, 1, 2, 3, 4];
    let prev = 0;
    const b = k.map(e => {
      return prev === 0 ? (prev = 1) : (prev = (1 / e) * prev);
    });
    const c = coeff(a, 4);
    expect(c).toEqual(b);
  });
});

describe("recurSeries", () => {
  // More tests for recurSeries go here
  it("should work with trivial numbers", () => {
    const a = [1, 2, 3, 4];
    const c = [1, 2, 3, 4];

    const b = recurSeries(c, a);
    const d = coeff(b, 5);

    expect(d).toEqual([1, 2, 3, 4, 30, 140]);
  });
});
