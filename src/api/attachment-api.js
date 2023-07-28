import { api } from "../configs/axios"

export const deleteAttachment = (id) => {
    return api.delete(`/issues/attachment/${id}`)
  }