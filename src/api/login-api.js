import { api } from "../configs/axios";

export const login = (data) => {
    return api.post('/users/login',data)
}

export const refresh = (data) => {
    return api.post('/users/refresh',data)
}