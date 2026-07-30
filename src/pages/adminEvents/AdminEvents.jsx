import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  getAdminEvents,
  createEventApi,
  updateEventApi,
  cancelEventApi,
  bulkCreateSeatsApi,
} from "./adminEventsService";
import {
  PageContainer,
  Card,
  Table,
  Input,
  Label,
  FormGroup,
  Button,
  DangerButton,
  SecondaryButton,
  ErrorText,
  SuccessText,
  FlexRow,
  PaginationContainer,
} from "../../components/ui";

const PageTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const InfoText = styled.p`
  color: #2c2c2c;
  font-size: 13px;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
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

      <Card>
        <SectionTitle>
          {editingEventId ? "Edit Event" : "Create Event"}
        </SectionTitle>
        {formMessage && <SuccessText>{formMessage}</SuccessText>}
        {formError && <ErrorText>{formError}</ErrorText>}

        <form onSubmit={handleSubmitForm}>
          <FormGroup>
            <Label htmlFor="eventName">Name</Label>
            <Input
              id="eventName"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
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
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="eventDate">Event Date</Label>
            <Input
              id="eventDate"
              type="datetime-local"
              value={form.eventDate}
              onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
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
            />
          </FormGroup>

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
        <Card>No events found</Card>
      ) : (
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
                <td>{event.name}</td>
                <td>{new Date(event.eventDate).toLocaleString()}</td>
                <td>₹{(event.pricePerSeat / 100).toFixed(2)}</td>
                <td>{event.totalSeats}</td>
                <td>{event.status}</td>
                <td>
                  <FlexRow gap="4px">
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
                        color: "#1a1a1a",
                        textDecoration: "underline",
                      }}
                    >
                      Overview
                    </Link>
                  </FlexRow>

                  {seatFormEventId === (event._id || event.id) && (
                    <Card style={{ marginTop: "8px", padding: "8px" }}>
                      <form
                        onSubmit={(e) =>
                          handleBulkCreateSeats(e, event._id || event.id)
                        }
                      >
                        <FormGroup>
                          <Label style={{ fontSize: "12px" }}>Seat Count</Label>
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
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label style={{ fontSize: "12px" }}>Prefix</Label>
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
                          />
                        </FormGroup>
                        <Button
                          type="submit"
                          style={{ padding: "4px 8px", fontSize: "12px" }}
                        >
                          Create
                        </Button>
                        <Button
                          type="button"
                          onClick={() =>
                            setSeatFormEventId(
                              seatFormEventId === event._id ? null : event._id,
                            )
                          }
                          style={{
                            padding: "4px 8px",
                            fontSize: "12px",
                            marginLeft: "8px",
                          }}
                        >
                          Cancel
                        </Button>
                      </form>
                    </Card>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
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
