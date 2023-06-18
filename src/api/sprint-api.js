import { api } from "../configs/axios";

export const getSprintList = (type) => {
  return api.get(`/${type}`);
};

export const getSprintDetail = (id) => {
  return api.get(`/projects/${id}`)
}

export const postSprint = (data) => {
  return api.post('/projects',data)
}

export const updateSprint = (data) => {
  return api.put('/projects',data)
}

export const deleteSprint = (id) => {
  return api.patch(`/projects/${id}`)
}