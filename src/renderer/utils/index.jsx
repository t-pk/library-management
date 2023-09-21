export const objectToQueryString = (obj) => {
  const queryParams = new URLSearchParams(obj);
  return queryParams.toString();
}
export const queryStringToObject = (queryString) => {
  const queryParams = new URLSearchParams(queryString);

  const queryObject = {};

  // Loop through the URLSearchParams and populate the object while decoding values
  queryParams.forEach((value, key) => {
    queryObject[key] = decodeURIComponent(value);
  });
  return queryObject;
}
