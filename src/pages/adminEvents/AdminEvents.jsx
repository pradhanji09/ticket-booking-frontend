import { useState, useEffect } from "react";
import {
  getAdminEvents,
  createEventApi,
  updateEventApi,
  cancelEventApi,
  bulkCreateSeatsApi,
} from "./adminEventsService";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [page, setPage] = useState(1);

  const [form, setForm] = useState({
    name: "",
    description: "",
    venue: "",
    eventDate: "",
    pricePerSeat: "",
  });
  const [editingEventId, setEditingEventId] = useState(null);
  const [formError, setFormError] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const [seatFormEventId, setSeatFormEventId] = useState(null);
  const [seatForm, setSeatForm] = useState({ count: 10, prefix: "S" });

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const fetchEvents = async (p) => {
    try {
      const res = await getAdminEvents(p, 10);
      if (res.success) {
        setEvents(res.data.events);
        setPagination(res.data.pagination);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchEvents(page);
  }, [page]);

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      venue: "",
      eventDate: "",
      pricePerSeat: "",
    });
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormMessage("");
    const paise = Math.round(parseFloat(form.pricePerSeat) * 100);
    const payload = {
      name: form.name,
      description: form.description,
      venue: form.venue,
      eventDate: new Date(form.eventDate).toISOString(),
      pricePerSeat: paise,
    };

    try {
      if (editingEventId) {
        const res = await updateEventApi(editingEventId, payload);
        if (res.success) {
          setFormMessage("Event updated successfully");
          setEditingEventId(null);
          resetForm();
          fetchEvents(page);
        }
      } else {
        const res = await createEventApi(payload);
        if (res.success) {
          setFormMessage("Event created successfully");
          resetForm();
          fetchEvents(page);
        }
      }
    } catch (err) {
      setFormError(err.error || err.message || "Operation failed");
    }
  };

  const handleEditClick = (event) => {
    setEditingEventId(event.id);
    setFormError("");
    setFormMessage("");
    setForm({
      name: event.name || "",
      description: event.description || "",
      venue: event.venue || "",
      eventDate: formatDateForInput(event.eventDate),
      pricePerSeat: event.pricePerSeat
        ? (event.pricePerSeat / 100).toString()
        : "",
    });
  };

  const handleCancelEdit = () => {
    setEditingEventId(null);
    resetForm();
  };

  const handleCancelEvent = async (id) => {
    if (!window.confirm("Cancel this event?")) return;
    setActionMessage("");
    try {
      const res = await cancelEventApi(id);
      if (res.success) {
        setActionMessage(
          res.data.message ||
            `Event cancelled. Refunded bookings: ${res.data.refundedBookings}`
        );
        fetchEvents(page);
      }
    } catch (err) {
      setActionMessage(err.error || err.message || "Failed to cancel event");
    }
  };

  const handleBulkCreateSeats = async (e, eventId) => {
    e.preventDefault();
    setActionMessage("");
    try {
      const res = await bulkCreateSeatsApi(
        eventId,
        Number(seatForm.count),
        seatForm.prefix
      );
      if (res.success) {
        setActionMessage(`Created ${res.data.created} seats`);
        setSeatFormEventId(null);
        fetchEvents(page);
      }
    } catch (err) {
      setActionMessage(err.error || err.message || "Failed to create seats");
    }
  };

  return (
    <div>
      <h2>Admin Event Management</h2>

      {actionMessage && <p style={{ color: "blue" }}>{actionMessage}</p>}

      <h3>{editingEventId ? "Edit Event" : "Create Event"}</h3>
      {formMessage && <p style={{ color: "green" }}>{formMessage}</p>}
      {formError && <p style={{ color: "red" }}>{formError}</p>}

      <form onSubmit={handleSubmitForm} style={{ marginBottom: "20px" }}>
        <div>
          <label>Name: </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Description: </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>
        <div>
          <label>Venue: </label>
          <input
            type="text"
            value={form.venue}
            onChange={(e) => setForm({ ...form, venue: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Event Date: </label>
          <input
            type="datetime-local"
            value={form.eventDate}
            onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Price per Seat (₹): </label>
          <input
            type="number"
            step="any"
            min="0"
            value={form.pricePerSeat}
            onChange={(e) =>
              setForm({ ...form, pricePerSeat: e.target.value })
            }
            required
          />
        </div>
        <button type="submit">
          {editingEventId ? "Update Event" : "Create Event"}
        </button>
        {editingEventId && (
          <button
            type="button"
            onClick={handleCancelEdit}
            style={{ marginLeft: "10px" }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      <h3>Events List</h3>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Venue</th>
            <th>Event Date</th>
            <th>Price per Seat (₹)</th>
            <th>Total Seats</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.name}</td>
              <td>{event.venue}</td>
              <td>{new Date(event.eventDate).toLocaleString()}</td>
              <td>₹{(event.pricePerSeat / 100).toFixed(2)}</td>
              <td>{event.totalSeats}</td>
              <td>{event.status}</td>
              <td>
                <button onClick={() => handleEditClick(event)}>Edit</button>
                <button
                  onClick={() => handleCancelEvent(event.id)}
                  style={{ marginLeft: "5px" }}
                >
                  Cancel Event
                </button>
                <button
                  onClick={() =>
                    setSeatFormEventId(
                      seatFormEventId === event.id ? null : event.id
                    )
                  }
                  style={{ marginLeft: "5px" }}
                >
                  Manage Seats
                </button>

                {seatFormEventId === event.id && (
                  <form
                    onSubmit={(e) => handleBulkCreateSeats(e, event.id)}
                    style={{
                      marginTop: "5px",
                      padding: "5px",
                      border: "1px solid #ccc",
                    }}
                  >
                    <div>
                      <label>Count: </label>
                      <input
                        type="number"
                        min="1"
                        value={seatForm.count}
                        onChange={(e) =>
                          setSeatForm({ ...seatForm, count: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label>Prefix: </label>
                      <input
                        type="text"
                        value={seatForm.prefix}
                        onChange={(e) =>
                          setSeatForm({ ...seatForm, prefix: e.target.value })
                        }
                        required
                      />
                    </div>
                    <button type="submit">Create Seats</button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
