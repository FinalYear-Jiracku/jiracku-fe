import { api } from "../configs/axios";

export const getSubIssueDetail = (id) => {
  return api.get(`/subIssues/${id}`)
}

export const postSubIssue = (data) => {
  return api.post('/subIssues',data)
}

export const updateSubIssue = (data) => {
  return api.put('/subIssues',data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const deleteSubIssue = (id) => {
  return api.patch(`/subIssues/${id}`)
}