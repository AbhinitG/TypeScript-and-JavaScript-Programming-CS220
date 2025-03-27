import { jest } from "@jest/globals";
import assert from "assert";
import { fetchGeoCoord, locationImportantEnough } from "./fetchGeoCoord.js";
import fetchMock from "jest-fetch-mock";

const SECOND = 1000;
jest.setTimeout(10 * SECOND);

describe("fetchGeoCoord", () => {
  // TODO
  it("returns the correct type of data", () => {
    const promise = fetchGeoCoord("New York");
    return promise.then(result => {
      assert(typeof result === "object");
      assert(typeof result.lat === "number");
      assert(typeof result.lon === "number");
      assert(typeof result.importances === "object");
      assert(Object.keys(result).length === 3);
    });
  });
  it("correctly throws error for nonexistant place", async () => {
    return expect(fetchGeoCoord("XDDDD")).rejects.toThrow("does not exist");
  });
  it("passes the mock test", async () => {
    const result = await fetchGeoCoord("New York");
    expect(result.lat).toEqual(40.7127281);
  });
});

describe("locationImportantEnough", () => {
  // TODO
  it("gets the correct fetch data", async () => {
    fetchMock.enableMocks();

    const input = [{ lon: 5, lat: 5, importances: [2, 3, 4] }];
    fetchMock.mockResponse(JSON.stringify(input));

    const result = await locationImportantEnough("New York", 1);
    expect(result).toBe(true);

    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });
  it("gets false if less than", async () => {
    fetchMock.enableMocks();

    const input = [{ lon: 5, lat: 5, importances: [2, 3, 4] }];
    fetchMock.mockResponse(JSON.stringify(input));

    const result = await locationImportantEnough("New York", 5);
    expect(result).toBe(false);

    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });
  it("gets false if equal", async () => {
    fetchMock.enableMocks();

    const input = [{ lon: 5, lat: 5, importances: [2, 3, 4] }];
    fetchMock.mockResponse(JSON.stringify(input));

    const result = await locationImportantEnough("New York", 4);
    expect(result).toBe(false);

    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });
  it("correctly throws an error when json isnt ok", async () => {
    fetchMock.enableMocks();
    fetchMock.mockResponse("", { status: 404, statusText: "Error 404" });
    await expect(locationImportantEnough("", 0)).rejects.toThrow("Error 404");
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });
});
