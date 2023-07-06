import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants/constants";

const baseURL = `${process.env.REACT_APP_API_URL}`;

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const newAccessToken = window.localStorage.getItem(ACCESS_TOKEN);
    if (newAccessToken) {
      config.headers.Authorization = `Bearer ${newAccessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (res) => {
    return res.data;
  },
  async (err) => {
    if (err.response.status === 401) {
      const res = await axios.post("http://localhost:4206/api/users/refresh", {
        accessToken: window.localStorage.getItem(ACCESS_TOKEN),
        refreshToken: window.localStorage.getItem(REFRESH_TOKEN),
      })
      window.localStorage.setItem(ACCESS_TOKEN, res.data.accessToken);
      window.localStorage.setItem(REFRESH_TOKEN, res.data.refreshToken);
      err.config.headers.Authorization = `Bearer ${res.data.accessToken}`;
      return await api.request(err.config);
    }
    return Promise.reject(err);
  }
);
