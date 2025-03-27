import { fetchCurrentTemperature } from "./fetchCurrentTemperature.js";
import { fetchGeoCoord } from "./fetchGeoCoord.js";
import { fetchUniversities } from "./fetchUniversities.js";

export async function fetchUniversityWeather(universityQuery, transformName) {
  // TODO
  const listOfUniv = await fetchUniversities(universityQuery);
  if (listOfUniv.length === 0 || !Array.isArray(listOfUniv)) {
    return Promise.reject(new Error("No results found for query."));
  }
  const namesTransformed = transformName ? listOfUniv.map(x => transformName(x)) : listOfUniv.map(x => x);

  const coordPromises = namesTransformed.map(x => fetchGeoCoord(x));
  const geoCoords = await Promise.all(coordPromises);

  const locationPromises = geoCoords.map(x => fetchCurrentTemperature(x));
  const locations = await Promise.all(locationPromises);

  const collegeAvgTemp = locations.map(x => {
    return x.temperature_2m.reduce((acc, curr) => (acc = acc + curr), 0) / x.temperature_2m.length;
  });

  const averageAll = collegeAvgTemp.reduce((acc, curr) => (acc = acc + curr), 0) / collegeAvgTemp.length;
  const result = { totalAverage: averageAll };
  for (let i = 0; i < collegeAvgTemp.length; ++i) {
    result[listOfUniv[i]] = collegeAvgTemp[i];
  }
  return Promise.resolve(result);
}

export function fetchUMassWeather() {
  // TODO
  return fetchUniversityWeather("University of Massachusetts", x => {
    if (x.includes(" at ")) {
      return x.replace(" at ", " ");
    } else {
      return x;
    }
  });
}

export function fetchUMichWeather() {
  // TODO
  return fetchUniversityWeather("University of Michigan");
}
