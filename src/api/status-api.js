import { api } from "../configs/axios";

export const dropdownStatusList = (type) => {
  return api.get(`/${type}`);
};

export const getDataStatusList = (type) => {
  return api.get(`/${type}`);
};

export const postStatus = (data) => {
  return api.post('/statuses',data)
}

export const deleteStatus = (id) => {
  return api.delete(`/statuses/${id}`)
}

export const getStatusDetail = (id) => {
  return api.get(`/statuses/${id}`)
}

export const updateStatus = (data) => {
  return api.put('/statuses',data)
}
