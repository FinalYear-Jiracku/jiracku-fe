import { api } from "../configs/axios"

export const generateOtp = (data) => {
    return api.post('/totps/generate',data)
}

export const verifyOtp = (data) => {
    return api.post('/totps/verify',data)
}

export const validateOtp = (data) => {
    return api.post('/totps/validate',data)
}

export const disableOtp = (id) => {
    return api.put(`/totps/disable/${id}`)
}

export const generateSms = (data) => {
    return api.post('/smss/generate',data)
}

export const verifySms = (data) => {
    return api.post('/smss/verify',data)
}

export const disableSms = (id) => {
    return api.put(`/smss/disable/${id}`)
}