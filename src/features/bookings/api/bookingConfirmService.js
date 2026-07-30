import httpService from "../../../api/httpService";

export const confirmBookingApi = (reservationGroupId, idempotencyKey) => {
  return httpService.post(
    "/api/bookings/confirm",
    { reservationGroupId },
    { headers: { "Idempotency-Key": idempotencyKey } }
  );
};
