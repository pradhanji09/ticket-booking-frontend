import httpService from "../../api/httpService";

export const getEvents = (page = 1, limit = 10) => {
  return httpService.get(`/api/events?page=${page}&limit=${limit}`);
};
