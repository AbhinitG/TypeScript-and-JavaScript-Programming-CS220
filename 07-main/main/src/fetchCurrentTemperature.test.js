import { jest } from "@jest/globals";
import assert from "assert";
import fetchMock from "jest-fetch-mock";
import { fetchCurrentTemperature, tempAvgAboveAtCoords } from "./fetchCurrentTemperature.js";
const SECOND = 1000;
jest.setTimeout(30 * SECOND);

describe("fetchCurrentTemperature", () => {
  it("follows type specification", async () => {
    const coords = { lon: 40, lat: 40, importances: [1, 2, 3] };
    const result = await fetchCurrentTemperature(coords);
    assert(typeof result === "object");
    assert(Object.keys(result).length === 2);
    assert(Array.isArray(result.time));
    assert(Array.isArray(result.temperature_2m));
  });
});
describe("Test for fetchCurrentTemperature", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
  });
  it("Test for the time and temperature content", async () => {
    const data = {
      hourly: {
        time: ["2024-04-28T00:00"],
        temperature_2m: [51.7],
      },
    };
    fetchMock.mockResponse(JSON.stringify(data));

    const coords = { lat: 40, lon: 40 };
    const result = await fetchCurrentTemperature(coords);
    expect(result.time[0]).toEqual("2024-04-28T00:00");
    expect(result.temperature_2m[0]).toEqual(51.7);
  });
  it("Test for the time and temperature content2", async () => {
    const data = {
      hourly: {
        time: ["2024-04-28T00:00", "2024-04-28T01:00"],
        temperature_2m: [51.7, 51],
      },
    };
    fetchMock.mockResponse(JSON.stringify(data));

    const coords = { lat: 40, lon: 40 };
    const result = await fetchCurrentTemperature(coords);
    expect(result.time[0]).toEqual("2024-04-28T00:00");
    expect(result.temperature_2m[0]).toEqual(51.7);
    expect(result.time[1]).toEqual("2024-04-28T01:00");
    expect(result.temperature_2m[1]).toEqual(51);
  });
  afterEach(() => {
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });
});

describe("tempAvgAboveAtCoords", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
  });
  it("Test for true", async () => {
    const data = {
      hourly: {
        time: ["2024-04-28T00:00", "2024-04-28T01:00", "2024-04-28T02:00"],
        temperature_2m: [51.7, 51, 50.1],
      },
    };
    fetchMock.mockResponse(JSON.stringify(data));

    const coords = { lat: 40, lon: 40 };
    const result = await tempAvgAboveAtCoords(coords, 49);
    expect(result).toBe(true);
  });
  it("Test for false", async () => {
    const data = {
      hourly: {
        time: ["2024-04-28T00:00", "2024-04-28T01:00"],
        temperature_2m: [51.7, 51],
      },
    };
    fetchMock.mockResponse(JSON.stringify(data));

    const coords = { lat: 40, lon: 40 };
    const result = await tempAvgAboveAtCoords(coords, 52);
    expect(result).toBe(false);
  });
  it("Test for error", async () => {
    fetchMock.mockReject(new Error("Received status code 400: Bad Request"));
    const coords = { lat: 40, lon: 10000 };
    await expect(tempAvgAboveAtCoords(coords, 52)).rejects.toThrow("Received status code 400: Bad Request");
  });

  afterEach(() => {
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });
});
