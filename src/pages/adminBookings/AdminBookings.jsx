import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  getAdminBookings,
  cancelAdminBookingApi,
} from "./adminBookingsService";
import {
  PageContainer,
  Card,
  Table,
  Input,
  Select,
  Label,
  FormGroup,
  Button,
  DangerButton,
  SecondaryButton,
  FlexRow,
  PaginationContainer,
} from "../../components/ui";

const PageTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const InfoText = styled.p`
  color: #2c2c2c;
  font-size: 13px;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

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
      const res = await getAdminBookings(p, 20, currentFilters);
      if (res.success) {
        setBookings(res.data.bookings);
        setPagination(res.data.pagination);
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
      const res = await cancelAdminBookingApi(bookingId);
      if (res.success) {
        const refundRupees = (res.data.refundAmount / 100).toFixed(2);
        setActionMessage(`Booking cancelled. Refunded: ₹${refundRupees}`);
        fetchBookings(page, filters);
      }
    } catch (err) {
      setActionMessage(err.error || err.message || "Failed to cancel booking");
    }
  };

  return (
    <PageContainer>
      <PageTitle>Admin Booking Dashboard</PageTitle>

      {actionMessage && <InfoText>{actionMessage}</InfoText>}

      <Card>
        <form onSubmit={handleApplyFilters}>
          <FlexRow gap="12px" style={{ alignItems: "flex-end" }}>
            <div>
              <Label htmlFor="userIdInput">User ID</Label>
              <Input
                id="userIdInput"
                type="text"
                value={userIdInput}
                onChange={(e) => setUserIdInput(e.target.value)}
                placeholder="User ID"
              />
            </div>
            <div>
              <Label htmlFor="eventIdInput">Event ID</Label>
              <Input
                id="eventIdInput"
                type="text"
                value={eventIdInput}
                onChange={(e) => setEventIdInput(e.target.value)}
                placeholder="Event ID"
              />
            </div>
            <div>
              <Label htmlFor="statusInput">Status</Label>
              <Select
                id="statusInput"
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value)}
              >
                <option value="">All</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="CANCELLED">CANCELLED</option>
              </Select>
            </div>
            <Button type="submit">Apply Filters</Button>
          </FlexRow>
        </form>
      </Card>

      {bookings?.length === 0 ? (
        <Card>No bookings found</Card>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>User Name</th>
              <th>User Email</th>
              <th>Event Name</th>
              <th>Seat Count</th>
              <th>Amount (₹)</th>
              <th>Status</th>
              <th>Date</th>
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
