import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function SeatSelection() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [error, setError] = useState("");

  const fetchEvent = async () => {
    try {
      const res = await API.get(`/api/events/${id}`);
      if (res.data.success) {
        setEvent(res.data.data);
      }
    } catch (err) {}
  };

  const fetchSeats = async () => {
    try {
      const res = await API.get(`/api/events/${id}/seats`);
      if (res.data.success) {
        setSeats(res.data.seats);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchEvent();
    fetchSeats();
  }, [id]);

  const toggleSeat = (seatId) => {
    if (selectedSeatIds.includes(seatId)) {
      setSelectedSeatIds(selectedSeatIds.filter((sId) => sId !== seatId));
    } else {
      setSelectedSeatIds([...selectedSeatIds, seatId]);
    }
  };

  const handleReserve = async () => {
    setError("");
    try {
      const res = await API.post("/api/bookings/reserve", {
        eventId: id,
        seatIds: selectedSeatIds,
      });
      if (res.data.success) {
        const { reservationGroupId, amount, expiresAt } = res.data.data;
        navigate(`/booking/confirm/${reservationGroupId}`, {
          state: { amount, expiresAt },
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reserve seats");
    }
  };

  const totalPrice = selectedSeatIds.length * (event?.pricePerSeat || 0);

  return (
    <div>
      <h2>Seat Selection</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {event && (
        <div>
          <h3>{event.name}</h3>
          <p>Venue: {event.venue}</p>
          <p>Date: {new Date(event.eventDate).toLocaleDateString()}</p>
          <p>Price per seat: ₹{(event.pricePerSeat / 100).toFixed(2)}</p>
        </div>
      )}

      <h3>Seats</h3>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginBottom: "20px",
        }}
      >
        {seats.map((seat) => {
          const isAvailable = seat.status === "AVAILABLE";
          const isSelected = selectedSeatIds.includes(seat.id);
          return (
            <button
              key={seat.id}
              disabled={!isAvailable}
              onClick={() => toggleSeat(seat.id)}
              style={{
                padding: "10px 15px",
                backgroundColor: isSelected
                  ? "#4CAF50"
                  : isAvailable
                    ? "#fff"
                    : "#ccc",
                color: isSelected ? "#fff" : "#000",
                cursor: isAvailable ? "pointer" : "not-allowed",
              }}
            >
              {seat.seatNumber}
            </button>
          );
        })}
      </div>

      <p>Total Price: ₹{(totalPrice / 100).toFixed(2)}</p>
      <button disabled={selectedSeatIds.length === 0} onClick={handleReserve}>
        Reserve Seats
      </button>
    </div>
  );
}
