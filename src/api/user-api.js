import { api } from "../configs/axios";

export const getProfile = (type) => {
    return api.get(`/${type}`);
};