import axios from "axios";
import { ACCESS_TOKEN, MESSAGE, REFRESH_TOKEN } from "../constants/constants";
import Cookies from "js-cookie";
import { message } from "antd";

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
    //const newAccessToken = Cookies.get(ACCESS_TOKEN);
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
      await axios.post("http://localhost:4206/api/users/refresh", {
        // accessToken: Cookies.get(ACCESS_TOKEN),
        // refreshToken: Cookies.get(REFRESH_TOKEN),
        accessToken: window.localStorage.getItem(ACCESS_TOKEN),
        refreshToken: window.localStorage.getItem(REFRESH_TOKEN),
      }).then((res) => {
        //Cookies.set(ACCESS_TOKEN, res.data.accessToken);
        window.localStorage.setItem(ACCESS_TOKEN, res.data.accessToken);
        err.config.headers.Authorization = `Bearer ${res.data.accessToken}`;
      }).catch((err) => {
        if(err.response.status === 400){
          if(err.response.data === "User Not Found"){
            message.error(MESSAGE.USER_NOT_FOUND)
            // Cookies.remove(ACCESS_TOKEN);
            // Cookies.remove(REFRESH_TOKEN);
            window.localStorage.removeItem(ACCESS_TOKEN)
            window.localStorage.removeItem(REFRESH_TOKEN)
            window.location.reload();
          }
          if(err.response.data === "Invalid client request"){
            message.error(MESSAGE.INVALID_REQUEST)
            // Cookies.remove(ACCESS_TOKEN);
            // Cookies.remove(REFRESH_TOKEN);
            window.localStorage.removeItem(ACCESS_TOKEN)
            window.localStorage.removeItem(REFRESH_TOKEN)
            window.location.reload();
          }
        }
      })
      return await api.request(err.config);
    }
    return Promise.reject(err);
  }
);
