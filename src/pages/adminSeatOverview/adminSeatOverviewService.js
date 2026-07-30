import httpService from "../../api/httpService";

export const getAdminSeatOverview = (id, filter = "") => {
  let url = `/api/events/${id}/seats`;
  if (filter) {
    url += `?status=${filter}`;
  }
  return httpService.get(url);
};
