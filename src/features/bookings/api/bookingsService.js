import httpService from "../../../api/httpService";

export const getMyBookings = (page = 1, limit = 10, status = "") => {
  let url = `/api/bookings/my?page=${page}&limit=${limit}`;
  if (status) {
    url += `&status=${status}`;
  }
  return httpService.get(url);
};

export const cancelBookingApi = (bookingId) => {
  return httpService.post(`/api/bookings/${bookingId}/cancel`);
};
