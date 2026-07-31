import httpService from "../../../api/httpService";

export const getEvents = (page = 1, limit = 10, status = "") => {
  let url = `/api/events?page=${page}&limit=${limit}`;
  if (status) {
    url += `&status=${encodeURIComponent(status)}`;
  }
  return httpService.get(url);
};
