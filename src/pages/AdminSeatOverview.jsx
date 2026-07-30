import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";

export default function AdminSeatOverview() {
  const { id } = useParams();
  const [eventName, setEventName] = useState("");
  const [seats, setSeats] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchSeats = async (filter) => {
    try {
      let url = `/api/events/${id}/seats`;
      if (filter) {
        url += `?status=${filter}`;
      }
      const res = await API.get(url);
      if (res.data.success) {
        setEventName(res.data.event);
        setSeats(res.data.seats);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchSeats(statusFilter);
  }, [id, statusFilter]);

  return (
    <div>
      <p>
        <Link to="/admin/events">&larr; Back to Events</Link>
      </p>
      <h2>Admin Seat Overview</h2>
      {eventName && <h3>Event: {eventName}</h3>}

      <div style={{ marginBottom: "15px" }}>
        <label>Filter Status: </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="AVAILABLE">AVAILABLE</option>
          <option value="RESERVED">RESERVED</option>
          <option value="BOOKED">BOOKED</option>
        </select>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {seats.map((seat, index) => (
          <div
            key={seat.id || index}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              minWidth: "100px",
              backgroundColor:
                seat.status === "AVAILABLE"
                  ? "#e8f5e9"
                  : seat.status === "RESERVED"
                    ? "#fff3e0"
                    : "#ffebee",
            }}
          >
            <strong>Seat {seat.seatNumber}</strong>
            <p>Status: {seat.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
