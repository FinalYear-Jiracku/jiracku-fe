import { api } from "../configs/axios";

export const getSprintList = (type) => {
  return api.get(`/${type}`);
};

export const dropdownSprintList = (type) => {
  return api.get(`/${type}`);
};

export const getSprintDetail = (id) => {
  return api.get(`/sprints/${id}`)
}

export const postSprint = (data) => {
  return api.post('/sprints',data)
}

export const updateSprint = (data) => {
  return api.put('/sprints',data)
}

export const deleteSprint = (id) => {
  return api.patch(`/sprints/${id}`)
}