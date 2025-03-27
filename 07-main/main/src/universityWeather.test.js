import { jest } from "@jest/globals";
import { fetchUMichWeather, fetchUMassWeather, fetchUniversityWeather } from "./universityWeather.js";
import assert from "assert";
import fetchMock from "jest-fetch-mock";

const SECOND = 1000;
jest.setTimeout(40 * SECOND);

describe("fetchUMichWeather", () => {
  // TODO
  it("returns the correct object types", async () => {
    const promise = fetchUMichWeather();
    return promise.then(result => {
      assert(typeof result === "object");
      console.log(typeof result.totalAverage);
      assert(typeof result.totalAverage === "number");
      assert(Object.keys(result).length === 4);
      console.log(typeof result["University of Michigan-Flint"]);
      assert(typeof result["University of Michigan-Flint"] === "number");
    });
  });
});

describe("fetchUMassWeather", () => {
  // TODO
  it("returns the correct object types", async () => {
    const promise = fetchUMassWeather();
    return promise.then(result => {
      assert(typeof result === "object");
      assert(typeof result.totalAverage === "number");
      assert(Object.keys(result).length === 5);
    });
  });
});

describe("fetchUniversityWeather", () => {
  // TODO
  it("returns the correct object types", async () => {
    const promise = fetchUniversityWeather("Amherst College", x => x);
    return promise.then(result => {
      assert(typeof result === "object");
      assert(typeof result.totalAverage === "number");
      //assert(Object.keys(result).length === 4);
    });
  });

  it("throws an error for an invalid json", async () => {
    fetchMock.enableMocks();
    fetchMock.mockResponse("", { status: 404, statusText: "404 Page not found" });
    await expect(fetchUniversityWeather("", s => s)).rejects.toThrow("404 Page not found");
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });

  it("throws an error for an empty result", async () => {
    fetchMock.enableMocks();
    fetchMock.mockReject(new Error("No results found for query."));
    await expect(fetchUniversityWeather("lol", x => x)).rejects.toEqual(new Error("No results found for query."));
    fetchMock.disableMocks();
  });
});
