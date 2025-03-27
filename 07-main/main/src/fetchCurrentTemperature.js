import { URL } from "url";

export async function fetchCurrentTemperature(coords) {
  // TODO
  const url = new URL("https://220a.maxkuechen.com/currentTemperature/forecast");
  url.searchParams.append("latitude", coords.lat);
  url.searchParams.append("longitude", coords.lon);
  url.searchParams.append("hourly", "temperature_2m");
  url.searchParams.append("temperature_unit", "fahrenheit");
  const a = url.toString();
  return fetch(a)
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        return Promise.reject(new Error(res.statusText));
      }
    })
    .then(data => {
      if (typeof data === "object") {
        return Promise.resolve({
          time: data.hourly.time,
          temperature_2m: data.hourly.temperature_2m,
        });
      } else {
        return Promise.reject(new Error("Not object"));
      }
    })
    .catch(error => {
      throw error;
    });
}

export async function tempAvgAboveAtCoords(coords, temp) {
  return fetchCurrentTemperature(coords)
    .then(data => {
      const tempArray = data.temperature_2m;
      const aveTemp = tempArray.reduce((acc, e) => acc + e, 0) / tempArray.length;
      return aveTemp > temp;
    })
    .then(bool => Promise.resolve(bool))
    .catch(error => Promise.reject(error));
}
