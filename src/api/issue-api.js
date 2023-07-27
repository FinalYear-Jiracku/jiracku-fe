import { api } from "../configs/axios";

export const getIssueList = (type) => {
  return api.get(`/${type}`);
};

export const getIssueDetail = (id) => {
  return api.get(`/issues/${id}`)
}

export const postIssue = (data) => {
  return api.post('/issues',data)
}

export const updateIssue = (data) => {
  return api.put('/issues',data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const deleteIssue = (id) => {
  return api.patch(`/issues/${id}`)
}

export const updateOrder = (data) => {
  return api.put('/issues/order',data)
}

export const updateDnd = (data) => {
  return api.put('/issues/dnd',data)
}