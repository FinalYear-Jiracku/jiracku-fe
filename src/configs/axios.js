import axios from "axios";

const baseURL = `${process.env.REACT_APP_API_URL}`;
export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);