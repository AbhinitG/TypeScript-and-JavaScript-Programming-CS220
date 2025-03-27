export async function fetchGeoCoord(query) {
  // TODO
  const searchUrl = new URL("https://220a.maxkuechen.com/geoCoord/search/");
  searchUrl.searchParams.append("q", query);
  const result = await fetch(searchUrl.toString())
    .then(res => (res.ok ? res.json() : Promise.reject(new Error(res.statusText))))
    .then(json =>
      Array.isArray(json) && json.length > 0
        ? Promise.resolve({
            lon: parseFloat(json[0].lon),
            lat: parseFloat(json[0].lat),
            importances: json[0].importances,
          })
        : Promise.reject(new Error("does not exist"))
    )
    .catch(error => {
      throw error;
    });

  return result;
}

export async function locationImportantEnough(place, importanceThreshold) {
  // TODO
  const result = await fetchGeoCoord(place)
    .then(res => Promise.resolve(res.importances.some(x => x > importanceThreshold)))
    .catch(error => {
      throw error;
    });
  return result;
}
