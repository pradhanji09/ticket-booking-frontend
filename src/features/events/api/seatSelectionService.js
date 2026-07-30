import httpService from "../../../api/httpService";

export const getEventDetails = (id) => {
  return httpService.get(`/api/events/${id}`);
};

export const getEventSeats = (id) => {
  return httpService.get(`/api/events/${id}/seats`);
};

export const reserveSeatsApi = (eventId, seatIds) => {
  return httpService.post("/api/bookings/reserve", { eventId, seatIds });
};
