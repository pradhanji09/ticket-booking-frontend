import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  getAdminEvents,
  createEventApi,
  updateEventApi,
  cancelEventApi,
  bulkCreateSeatsApi,
} from "../api/adminEventsService";
import {
  PageContainer,
  Card,
  TableWrapper,
  Table,
  Input,
  Label,
  FormGroup,
  Button,
  DangerButton,
  SecondaryButton,
  Badge,
  ErrorText,
  SuccessText,
  FlexRow,
  PaginationContainer,
} from "../../../components/ui";

const PageTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const InfoText = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: 500;
`;

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
        setEvents(res.events);
        setPagination(res.pagination);
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
    setEditingEventId(event._id);
    setFormError("");
    setFormMessage("");
    setForm({
      name: event.name || "",
      description: event.description || "",
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
            `Event cancelled. Refunded bookings: ${res.data.refundedBookings}`,
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
        seatForm.prefix,
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
    <PageContainer>
      <PageTitle>Admin Event Management</PageTitle>

      {actionMessage && <InfoText>{actionMessage}</InfoText>}

      <Card style={{ marginBottom: "24px" }}>
        <SectionTitle>
          {editingEventId ? "Edit Event Details" : "Create New Event"}
        </SectionTitle>
        {formMessage && <SuccessText>{formMessage}</SuccessText>}
        {formError && <ErrorText>{formError}</ErrorText>}

        <form onSubmit={handleSubmitForm}>
          <FormGroup>
            <Label htmlFor="eventName">Event Name</Label>
            <Input
              id="eventName"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="e.g. Rock Concert 2026"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="eventDescription">Description</Label>
            <Input
              id="eventDescription"
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Event summary..."
            />
          </FormGroup>

          <FlexRow gap="16px" style={{ marginBottom: "16px" }}>
            <div style={{ flex: 1 }}>
              <Label htmlFor="eventDate">Event Date & Time</Label>
              <Input
                id="eventDate"
                type="datetime-local"
                value={form.eventDate}
                onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                required
              />
            </div>

            <div style={{ flex: 1 }}>
              <Label htmlFor="eventPrice">Price per Seat (₹)</Label>
              <Input
                id="eventPrice"
                type="number"
                step="any"
                min="0"
                value={form.pricePerSeat}
                onChange={(e) =>
                  setForm({ ...form, pricePerSeat: e.target.value })
                }
                required
                placeholder="100"
              />
            </div>
          </FlexRow>

          <FlexRow>
            <Button type="submit">
              {editingEventId ? "Update Event" : "Create Event"}
            </Button>
            {editingEventId && (
              <SecondaryButton type="button" onClick={handleCancelEdit}>
                Cancel Edit
              </SecondaryButton>
            )}
          </FlexRow>
        </form>
      </Card>

      <SectionTitle>Events List</SectionTitle>
      {events.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "30px 20px" }}>
          <p style={{ color: "#64748b" }}>No events found.</p>
        </Card>
      ) : (
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Event Date</th>
                <th>Price (₹)</th>
                <th>Total Seats</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id || event.id}>
                  <td style={{ fontWeight: 600 }}>{event.name}</td>
                  <td>{new Date(event.eventDate).toLocaleString()}</td>
                  <td style={{ fontWeight: 700, color: "#e23744" }}>
                    ₹{(event.pricePerSeat / 100).toFixed(2)}
                  </td>
                  <td>{event.totalSeats}</td>
                  <td>
                    <Badge status={event.status}>{event.status}</Badge>
                  </td>
                  <td>
                    <FlexRow gap="6px">
                      <SecondaryButton
                        style={{ padding: "4px 8px", fontSize: "12px" }}
                        onClick={() => handleEditClick(event)}
                      >
                        Edit
                      </SecondaryButton>
                      <DangerButton
                        style={{ padding: "4px 8px", fontSize: "12px" }}
                        onClick={() => handleCancelEvent(event._id)}
                      >
                        Delete
                      </DangerButton>
                      <SecondaryButton
                        style={{ padding: "4px 8px", fontSize: "12px" }}
                        onClick={() =>
                          setSeatFormEventId(
                            seatFormEventId === event._id ? null : event._id,
                          )
                        }
                      >
                        Seats
                      </SecondaryButton>
                      <Link
                        to={`/admin/events/${event._id}/seats`}
                        style={{
                          fontSize: "12px",
                          color: "#e23744",
                          fontWeight: 600,
                          padding: "4px 6px",
                        }}
                      >
                        Overview
                      </Link>
                    </FlexRow>

                    {seatFormEventId === (event._id || event.id) && (
                      <Card style={{ marginTop: "10px", padding: "12px", backgroundColor: "#f8fafc" }}>
                        <form
                          onSubmit={(e) =>
                            handleBulkCreateSeats(e, event._id || event.id)
                          }
                        >
                          <FlexRow gap="8px" style={{ alignItems: "flex-end" }}>
                            <div>
                              <Label style={{ fontSize: "11px" }}>Count</Label>
                              <Input
                                type="number"
                                min="1"
                                value={seatForm.count}
                                onChange={(e) =>
                                  setSeatForm({
                                    ...seatForm,
                                    count: e.target.value,
                                  })
                                }
                                required
                                style={{ width: "80px", padding: "6px" }}
                              />
                            </div>
                            <div>
                              <Label style={{ fontSize: "11px" }}>Prefix</Label>
                              <Input
                                type="text"
                                value={seatForm.prefix}
                                onChange={(e) =>
                                  setSeatForm({
                                    ...seatForm,
                                    prefix: e.target.value,
                                  })
                                }
                                required
                                style={{ width: "80px", padding: "6px" }}
                              />
                            </div>
                            <Button
                              type="submit"
                              style={{ padding: "6px 12px", fontSize: "12px" }}
                            >
                              Create
                            </Button>
                            <SecondaryButton
                              type="button"
                              onClick={() => setSeatFormEventId(null)}
                              style={{ padding: "6px 12px", fontSize: "12px" }}
                            >
                              Cancel
                            </SecondaryButton>
                          </FlexRow>
                        </form>
                      </Card>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      )}

      <PaginationContainer>
        <SecondaryButton
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </SecondaryButton>
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <SecondaryButton
          disabled={page >= pagination.totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </SecondaryButton>
      </PaginationContainer>
    </PageContainer>
  );
}
