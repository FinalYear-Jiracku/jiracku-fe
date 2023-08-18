import { api } from "../configs/axios"

export const getListMessage = (type) => {
    return api.get(`/${type}`)
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