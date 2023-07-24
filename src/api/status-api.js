import { api } from "../configs/axios";

export const dropdownStatusList = (type) => {
  return api.get(`/${type}`);
};