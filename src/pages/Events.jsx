import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const fetchEvents = async (p) => {
    try {
      const res = await API.get(`/api/events?page=${p}&limit=10`);
      if (res.data.success) {
        setEvents(res.data.data.events);
        setPagination(res.data.data.pagination);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchEvents(page);
  }, [page]);

  return (
    <div>
      <h2>Events</h2>
      {events.length === 0 ? (
        <p>No events available</p>
      ) : (
        <div>
          {events.map((event) => (
            <div
              key={event.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <h3>{event.name}</h3>
              <p>Venue: {event.venue}</p>
              <p>Date: {new Date(event.eventDate).toLocaleDateString()}</p>
              <p>Price: ₹{(event.pricePerSeat / 100).toFixed(2)}</p>
              <p>
                Seats: {event.availableSeats} / {event.totalSeats}
              </p>
              <button onClick={() => navigate(`/events/${event.id}`)}>
                View Seats
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "10px" }}>
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          disabled={page >= pagination.totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
