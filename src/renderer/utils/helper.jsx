import { TOKEN_KEY } from '../constants';
export const objectToQueryString = (obj) => {
  const queryParams = new URLSearchParams(obj);
  return queryParams.toString();
};

export const queryStringToObject = (queryString) => {
  const queryParams = new URLSearchParams(queryString);

  const queryObject = {};

  // Loop through the URLSearchParams and populate the object while decoding values
  queryParams.forEach((value, key) => {
    queryObject[key] = decodeURIComponent(value);
  });
  return queryObject;
};

export const addDays = function (dateTime, days) {
  var date = new Date(dateTime);
  date.setDate(date.getDate() + days);
  return date;
};

export const formatDateTime = (date) => {
  if (!date) return date;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:00`;
};

export const formatDmy = (date) => {
  const day = String(new Date(date).getDate()).padStart(2, '0');
  const month = String(new Date(date).getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = new Date(date).getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatYmd = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
};

export const delay = (t) => {
  return new Promise((resolve) => setTimeout(resolve, t));
};

export const parseDataSelect = (data) => {
  return (data || []).map((item) => ({
    id: item.id,
    value: `${item.id} - ${item.name}`,
  }));
};

export const getUser = () => {
  const user = localStorage.getItem(TOKEN_KEY);
  return JSON.parse(user) || {};
};
