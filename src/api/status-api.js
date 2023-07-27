import { api } from "../configs/axios";

export const dropdownStatusList = (type) => {
  return api.get(`/${type}`);
};

export const getDataStatusList = (type) => {
  return api.get(`/${type}`);
};