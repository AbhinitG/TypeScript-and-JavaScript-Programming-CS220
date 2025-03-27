import { jest } from "@jest/globals";
import assert from "assert";
import { fetchUniversities, universityNameLengthOrderAscending } from "./fetchUniversities.js";
import fetchMock from "jest-fetch-mock";

const SECOND = 1000;
jest.setTimeout(10 * SECOND);

describe("fetchUniversities", () => {
  // TODO
  it("returns the correct type of data", () => {
    const promise = fetchUniversities("Amherst");
    return promise.then(res => {
      assert(Array.isArray(res));
    });
  });

  it("correctly returns an empty array for universities with no such names", () => {
    const promise = fetchUniversities("lol");
    return promise.then(res => {
      assert(res.length === 0);
    });
  });

  it("correctly returns universities with the query passed", () => {
    const promise = fetchUniversities("Amherst");
    return promise.then(res => {
      assert(res.length === 2);
      assert(res[0].localeCompare("Amherst College") === 0);
      assert(res[1].localeCompare("University of Massachusetts at Amherst") === 0);
    });
  });
});

describe("universityNameLengthOrderAscending", () => {
  // TODO
  it("gets true if the order is strictly ascending", async () => {
    fetchMock.enableMocks();

    const input = [
      { name: "Amherst College" },
      { name: "College of Amherst" },
      { name: "University of Massachusetts at Amherst" },
    ];
    fetchMock.mockResponse(JSON.stringify(input));

    const result = await universityNameLengthOrderAscending("Amherst");
    expect(result).toBe(true);

    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });

  it("gets false if the order is not strictly ascending", async () => {
    fetchMock.enableMocks();

    const input = [
      { name: "Amherst College" },
      { name: "University of Massachusetts at Amherst" },
      { name: "College of Amherst" },
    ];
    fetchMock.mockResponse(JSON.stringify(input));

    const result = await universityNameLengthOrderAscending("Amherst");
    expect(result).toBe(false);

    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });

  it("gets false if the universites have names with the same length", async () => {
    fetchMock.enableMocks();

    const input = [{ name: "Amherst College" }, { name: "College Amherst" }];
    fetchMock.mockResponse(JSON.stringify(input));

    const result = await universityNameLengthOrderAscending("Amherst");
    expect(result).toBe(false);

    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });

  it("correctly throws error when json is not ok", async () => {
    fetchMock.enableMocks();
    fetchMock.mockResponse("", { status: 404, statusText: "404 Page not found" });
    await expect(universityNameLengthOrderAscending("")).rejects.toThrow("404 Page not found");
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });
});
