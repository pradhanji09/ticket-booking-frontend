import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  getAdminBookings,
  cancelAdminBookingApi,
} from "../api/adminBookingsService";
import {
  PageContainer,
  Card,
  TableWrapper,
  Table,
  Input,
  Select,
  Label,
  Button,
  DangerButton,
  SecondaryButton,
  Badge,
  FlexRow,
  PaginationContainer,
} from "../../../components/ui";

const PageTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const InfoText = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: 500;
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
      if (res?.success || res?.bookings || res?.data?.bookings) {
        const list = res.bookings || res.data?.bookings || [];
        const pag = res.pagination || res.data?.pagination;
        setBookings(list);
        if (pag) {
          setPagination({
            page: Number(pag.page),
            limit: Number(pag.limit),
            total: Number(pag.total),
            totalPages: Number(pag.totalPages),
          });
        }
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
    if (!window.confirm("Cancel this booking and refund the user?")) return;
    setActionMessage("");
    try {
      const res = await cancelAdminBookingApi(bookingId);
      if (res.success) {
        const refundRupees = (
          res.data?.refundAmount ? res.data.refundAmount / 100 : 0
        ).toFixed(2);
        setActionMessage(
          `Booking cancelled successfully. Refunded: ₹${refundRupees}`,
        );
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

      <Card style={{ marginBottom: "16px" }}>
        <form onSubmit={handleApplyFilters}>
          <FlexRow gap="12px" style={{ alignItems: "flex-end" }}>
            <div style={{ flex: 1, minWidth: "140px" }}>
              <Label htmlFor="userIdInput">User ID</Label>
              <Input
                id="userIdInput"
                type="text"
                value={userIdInput}
                onChange={(e) => setUserIdInput(e.target.value)}
                placeholder="User ID"
              />
            </div>
            <div style={{ flex: 1, minWidth: "140px" }}>
              <Label htmlFor="eventIdInput">Event ID</Label>
              <Input
                id="eventIdInput"
                type="text"
                value={eventIdInput}
                onChange={(e) => setEventIdInput(e.target.value)}
                placeholder="Event ID"
              />
            </div>
            <div style={{ flex: 1, minWidth: "140px" }}>
              <Label htmlFor="statusInput">Status</Label>
              <Select
                id="statusInput"
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="">All Statuses</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="CANCELLED">CANCELLED</option>
              </Select>
            </div>
            <Button type="submit">Apply Filters</Button>
          </FlexRow>
        </form>
      </Card>

      {bookings?.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "24px" }}>
          <p style={{ color: "#64748b" }}>No bookings found.</p>
        </Card>
      ) : (
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>User Name</th>
                <th>User Email</th>
                <th>Event Name</th>
                <th>Event ID</th>
                <th>Seats</th>
                <th>Amount (₹)</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const userIdVal = b.user?._id || b.user?.id || b.userId || "";
                const eventIdVal =
                  b.event?._id || b.event?.id || b.eventId || "";
                return (
                  <tr key={b._id || b.id}>
                    <td
                      style={{
                        fontSize: "12px",
                        fontFamily: "monospace",
                        userSelect: "all",
                      }}
                    >
                      {userIdVal}
                    </td>
                    <td style={{ fontWeight: 600 }}>{b.user?.name || "N/A"}</td>
                    <td>{b.user?.email || "N/A"}</td>
                    <td>{b.event?.name || b.eventName}</td>
                    <td
                      style={{
                        fontSize: "12px",
                        fontFamily: "monospace",
                        userSelect: "all",
                      }}
                    >
                      {eventIdVal}
                    </td>
                    <td>{b.seatCount}</td>
                    <td style={{ fontWeight: 600 }}>
                      ₹{(b.amount / 100).toFixed(2)}
                    </td>
                    <td>
                      <Badge status={b.status}>{b.status}</Badge>
                    </td>
                    <td>{new Date(b.createdAt).toLocaleString()}</td>
                    <td style={{ textAlign: "right" }}>
                      {b.status === "CONFIRMED" && (
                        <DangerButton
                          style={{ padding: "4px 8px", fontSize: "12px" }}
                          onClick={() => handleCancelBooking(b._id || b.id)}
                        >
                          Cancel
                        </DangerButton>
                      )}
                    </td>
                  </tr>
                );
              })}
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
