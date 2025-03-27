export async function fetchUniversities(query) {
  // TODO
  const searchUrl = new URL("https://220a.maxkuechen.com/universities/search/");
  searchUrl.searchParams.append("name", query);
  const result = await fetch(searchUrl.toString())
    .then(res => (res.ok ? res.json() : Promise.reject(new Error(res.statusText))))
    .then(json =>
      Array.isArray(json) ? Promise.resolve(json.map(e => e.name)) : Promise.reject(new Error("json error"))
    )
    .catch(error => {
      throw error;
    });
  return result;
}

export async function universityNameLengthOrderAscending(queryName) {
  // TODO
  const result = await fetchUniversities(queryName)
    .then(arr => {
      let curr = arr[0];
      const bool = arr.slice(1).every(e => {
        const prev = curr;
        curr = e;
        return prev.length < curr.length;
      });
      return Promise.resolve(bool);
    })
    .catch(err => {
      throw err;
    });
  return result;
}
