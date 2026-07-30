import { useState, useEffect } from "react";
import API from "../api/axios";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });
  const [page, setPage] = useState(1);

  const [userIdInput, setUserIdInput] = useState("");
  const [eventIdInput, setEventIdInput] = useState("");
  const [statusInput, setStatusInput] = useState("");

  const [filters, setFilters] = useState({
    userId: "",
    eventId: "",
    status: "",
  });
  const [actionMessage, setActionMessage] = useState("");

  const fetchBookings = async (p, currentFilters) => {
    try {
      let url = `/api/admin/bookings?page=${p}&limit=20`;
      if (currentFilters.userId)
        url += `&userId=${encodeURIComponent(currentFilters.userId)}`;
      if (currentFilters.eventId)
        url += `&eventId=${encodeURIComponent(currentFilters.eventId)}`;
      if (currentFilters.status)
        url += `&status=${encodeURIComponent(currentFilters.status)}`;

      const res = await API.get(url);
      if (res.data.success) {
        setBookings(res.data.data.bookings);
        setPagination(res.data.data.pagination);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchBookings(page, filters);
  }, [page, filters]);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setFilters({
      userId: userIdInput.trim(),
      eventId: eventIdInput.trim(),
      status: statusInput,
    });
    setPage(1);
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Cancel this booking and refund?")) return;
    setActionMessage("");
    try {
      const res = await API.post(`/api/admin/bookings/${bookingId}/cancel`);
      if (res.data.success) {
        const refundRupees = (res.data.data.refundAmount / 100).toFixed(2);
        setActionMessage(`Booking cancelled. Refunded: ₹${refundRupees}`);
        fetchBookings(page, filters);
      }
    } catch (err) {
      setActionMessage(err.response?.data?.error || "Failed to cancel booking");
    }
  };

  return (
    <div>
      <h2>Admin Booking Dashboard</h2>

      {actionMessage && <p style={{ color: "blue" }}>{actionMessage}</p>}

      <form onSubmit={handleApplyFilters} style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div>
            <label>User ID: </label>
            <input
              type="text"
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
              placeholder="User ID"
            />
          </div>
          <div>
            <label>Event ID: </label>
            <input
              type="text"
              value={eventIdInput}
              onChange={(e) => setEventIdInput(e.target.value)}
              placeholder="Event ID"
            />
          </div>
          <div>
            <label>Status: </label>
            <select
              value={statusInput}
              onChange={(e) => setStatusInput(e.target.value)}
            >
              <option value="">All</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
          <button type="submit">Apply Filters</button>
        </div>
      </form>

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <table border="1" cellPadding="5" cellSpacing="0">
          <thead>
            <tr>
              <th>User Name</th>
              <th>User Email</th>
              <th>Event Name</th>
              <th>Seat Count</th>
              <th>Amount (₹)</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.user?.name}</td>
                <td>{b.user?.email}</td>
                <td>{b.event?.name}</td>
                <td>{b.seatCount}</td>
                <td>₹{(b.amount / 100).toFixed(2)}</td>
                <td>{b.status}</td>
                <td>{new Date(b.createdAt).toLocaleString()}</td>
                <td>
                  {b.status === "CONFIRMED" && (
                    <button onClick={() => handleCancelBooking(b.id)}>
                      Cancel Booking
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
