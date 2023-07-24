import { api } from "../configs/axios";

export const getProfile = (type) => {
  return api.get(`/${type}`);
};

export const getUserProject = (type) => {
  return api.get(`/${type}`);
};

export const updateUser = (data) => {
  return api.put("/users", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const sendEmail = (data) => {
  return api.post("/notifications", data);
};
