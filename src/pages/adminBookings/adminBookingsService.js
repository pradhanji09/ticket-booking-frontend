import httpService from "../../api/httpService";

export const getAdminBookings = (page = 1, limit = 20, currentFilters = {}) => {
  let url = `/api/bookings/admin?page=${page}&limit=${limit}`;
  if (currentFilters.userId)
    url += `&userId=${encodeURIComponent(currentFilters.userId)}`;
  if (currentFilters.eventId)
    url += `&eventId=${encodeURIComponent(currentFilters.eventId)}`;
  if (currentFilters.status)
    url += `&status=${encodeURIComponent(currentFilters.status)}`;

  return httpService.get(url);
};

export const cancelAdminBookingApi = (bookingId) => {
  return httpService.post(`/api/bookings/${bookingId}/cancel`);
};
