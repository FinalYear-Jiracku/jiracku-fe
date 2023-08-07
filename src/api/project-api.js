import { api } from "../configs/axios";

export const getProjectList = (type) => {
  return api.get(`/${type}`);
};

export const getProjectDetail = (id) => {
  return api.get(`/projects/${id}`)
}

export const postProject = (data) => {
  return api.post('/projects',data)
}

export const updateProject = (data) => {
  return api.put('/projects',data)
}

export const upgradeProject = (data) => {
  return api.put('/projects/upgrade',data)
}

export const deleteProject = (id) => {
  return api.patch(`/projects/${id}`)
}