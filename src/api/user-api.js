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

export const getUserList = (type) => {
  return api.get(`/${type}`);
};

export const disableUser = (id) => {
  return api.patch(`/users/disable/${id}`)
}

export const enableUser = (id) => {
  return api.patch(`/users/enable/${id}`)
}

export const getUserStatis = (type) => {
  return api.get(`/${type}`);
};
