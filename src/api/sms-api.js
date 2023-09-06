import { api } from "../configs/axios"

export const generateSms = (data) => {
    return api.post('/smss/generate',data)
}

export const verifySms = (data) => {
    return api.post('/smss/verify',data)
}

export const disableSms = (id) => {
    return api.put(`/smss/disable/${id}`)
}