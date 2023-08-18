import { api } from "../configs/axios";

export const getEventList = (type) => {
  return api.get(`/${type}`);
};

export const getEventDetail = (id) => {
    return api.get(`/events/${id}`)
}

export const postEvent = (data) => {
    return api.post('/events',data)
}
  
export const updateEvent = (data) => {
    return api.put('/events',data)
}

export const deleteEvent = (id) => {
    return api.patch(`/events/${id}`)
}

export const authZoom = (type) => {
    return api.get(`/${type}`);
  };