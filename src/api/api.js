import { api } from "../configs/axios";

export const getApi = (type) => {
    let dataUrl = `/${type}`;
    return api.get(dataUrl);
  };

  export const postProject = (data) => {
    return api.post('/projects',data)}