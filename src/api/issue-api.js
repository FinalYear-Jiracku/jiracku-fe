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

export const completeIssue = (id,sprintId) => {
  return api.put(`/issues/sprints/${id}?sprintToUpdate=${sprintId}`)
}

export const getNumberIssueComplete = (id) => {
  return api.get(`/issues/complete/sprints/${id}`)
}

export const getNumberIssueNotComplete = (id) => {
  return api.get(`/issues/uncomplete/sprints/${id}`)
}

export const getStatisTypeIssue = (type) => {
  return api.get(`/${type}`)
}

export const getStatisPriorityIssue = (type) => {
  return api.get(`/${type}`)
}

export const getStatisStatusIssue = (type) => {
  return api.get(`/${type}`)
}

export const getStatisUser = (type) => {
  return api.get(`/${type}`)
}

export const getStatisDeadlineIssue = (id) => {
  return api.get(`/issues/deadline/sprints/${id}`)
}