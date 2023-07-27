import { api } from "../configs/axios"

export const getListNotification = (id) => {
    return api.get(`/notifications/${id}`)
}