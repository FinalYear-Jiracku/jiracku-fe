import { api } from "../configs/axios"

export const getListMessage = (id) => {
    return api.get(`/messages/${id}`)
}

export const getMessageDetail = (id) => {
  return api.get(`/messages/detail/${id}`)
}

export const updateMessage = (data) => {
  return api.put('/messages',data)
}

export const deleteMessage = (id) => {
  return api.delete(`/messages/${id}`)
}