import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents } from "./eventsService";

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
      const res = await getEvents(p, 10);
      if (res?.success) {
        setEvents(res.events || []);
        if (res.pagination) {
          setPagination({
            page: Number(res.pagination.page),
            limit: Number(res.pagination.limit),
            total: Number(res.pagination.total),
            totalPages: Number(res.pagination.totalPages),
          });
        }
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
              key={event._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <h3>{event.name}</h3>
              {event.description && <p>{event.description}</p>}
              <p>Date: {new Date(event.eventDate).toLocaleString()}</p>
              <p>Price: ₹{event.pricePerSeat}</p>
              <p>
                Total Seats: {event.totalSeats} | Status: {event.status}
              </p>
              <button onClick={() => navigate(`/events/${event._id}`)}>
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
