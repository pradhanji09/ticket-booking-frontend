import httpService from "../../../api/httpService";

export const getAdminEvents = (page = 1, limit = 10) => {
  return httpService.get(`/api/events?page=${page}&limit=${limit}`);
};

export const createEventApi = (payload) => {
  return httpService.post("/api/events", payload);
};

export const updateEventApi = (id, payload) => {
  return httpService.put(`/api/events/${id}`, payload);
};

export const cancelEventApi = (id) => {
  return httpService.delete(`/api/events/${id}`);
};

export const bulkCreateSeatsApi = (id, count, prefix) => {
  return httpService.post(`/api/events/${id}/seats/bulk`, { count, prefix });
};
