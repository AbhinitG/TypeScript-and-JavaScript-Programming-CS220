import assert from "assert";

import type { Hire, StableMatcher, StableMatcherWithTrace } from "../include/stableMatching.js";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

function shuffle(arr: number[]): number[] {
  for (let i = arr.length - 1; i > 0; --i) {
    const j = Math.floor(randomInt(0, i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateRow(n: number): number[] {
  const arr = [];
  for (let i = 0; i < n; ++i) {
    arr.push(i);
  }
  return arr;
}

export function generateInput(n: number): number[][] {
  // TODO
  const input = [];
  if (Number.isInteger(n)) {
    for (let j = 0; j < n; ++j) {
      const row = generateRow(n);
      input.push(shuffle(row));
    }
  }
  return input;
}

const NUM_TESTS = 20; // Change this to some reasonably large value
const N = 6; // Change this to some reasonable size

/**
 * Tests whether or not the supplied function is a solution to the stable matching problem.
 * @param makeStableMatching A possible solution to the stable matching problem
 * @throws An `AssertionError` if `makeStableMatching` in not a solution to the stable matching problem
 */
export function stableMatchingOracle(makeStableMatching: StableMatcher): void {
  for (let i = 0; i < NUM_TESTS; ++i) {
    const companies = generateInput(N);
    const candidates = generateInput(N);
    const hires = makeStableMatching(companies, candidates);

    assert(companies.length === hires.length && candidates.length === hires.length, "Hires length is correct.");

    // TODO: More assertions go here.
    assert(companies.length === candidates.length, "Companies and Candidates have the same length.");
    assert(checkDuplicates(companies), "Companies has no duplicates.");
    assert(checkDuplicates(candidates), "Candidates has no duplicates.");
    assert(checkStableMatching(companies, candidates, hires), "Hires contains no unstable pair.");
  }
}

function checkDuplicates(arr: number[][]): boolean {
  for (let i = 0; i < arr.length; ++i) {
    const newArr = arr[i].filter(e => arr[i].some(n => n === e && arr[i].indexOf(n) !== arr[i].indexOf(e)));
    if (newArr.length > 0) {
      return false;
    }
  }
  return true;
}

function checkStableMatching(companies: number[][], candidates: number[][], hires: Hire[]): boolean {
  for (let i = 0; i < hires.length; ++i) {
    const h = hires[i];
    for (let j = 0; j < hires.length; ++j) {
      if (i !== j) {
        const h2 = hires[j];
        if (
          companies[h.company].indexOf(h2.candidate) < companies[h.company].indexOf(h.candidate) &&
          candidates[h2.candidate].indexOf(h.company) < candidates[h2.candidate].indexOf(h2.company)
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

// Part B

/**
 * Tests whether or not the supplied function follows the supplied algorithm.
 * @param makeStableMatchingTrace A possible solution to the stable matching problem and its possible steps
 * @throws An `AssertionError` if `makeStableMatchingTrace` does not follow the specified algorithm, or its steps (trace)
 * do not match with the result (out).
 */
export function stableMatchingRunOracle(makeStableMatchingTrace: StableMatcherWithTrace): void {
  for (let i = 0; i < NUM_TESTS; ++i) {
    const companies = generateInput(N);
    const candidates = generateInput(N);
    const { trace, out } = makeStableMatchingTrace(companies, candidates);

    // This statement is here to prevent linter warnings about `trace` and `out` not being used.
    // Remove it as necessary.
    console.log(trace, out);

    // TODO: Assertions go here
  }
}
