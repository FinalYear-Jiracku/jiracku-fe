import { api } from "../configs/axios"

export const getListMessage = (id) => {
    return api.get(`/messages/${id}`)
}