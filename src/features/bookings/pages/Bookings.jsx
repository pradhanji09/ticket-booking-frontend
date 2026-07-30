import { useState, useEffect } from "react";
import styled from "styled-components";
import { getMyBookings, cancelBookingApi } from "../api/bookingsService";
import {
  PageContainer,
  Card,
  TableWrapper,
  Table,
  Select,
  Label,
  Badge,
  DangerButton,
  FlexRow,
  SecondaryButton,
  PaginationContainer,
} from "../../../components/ui";

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  gap: 12px;
`;

const PageTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const ActionMsg = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  margin-bottom: 12px;
`;

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const fetchBookings = async (p, status) => {
    try {
      const res = await getMyBookings(p, 10, status);
      if (res.success) {
        setBookings(res.data.bookings);
        setPagination(res.data.pagination);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchBookings(page, statusFilter);
  }, [page, statusFilter]);

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const handleCancelMyBooking = async (bookingId) => {
    if (!window.confirm("Cancel this booking? Refund will be credited to your wallet.")) return;
    setActionMessage("");
    try {
      const res = await cancelBookingApi(bookingId);
      if (res.success) {
        setActionMessage("Booking cancelled successfully and wallet refunded.");
        fetchBookings(page, statusFilter);
      }
    } catch (err) {
      setActionMessage(err.error || err.message || "Failed to cancel booking");
    }
  };

  return (
    <PageContainer>
      <HeaderSection>
        <PageTitle>My Bookings</PageTitle>

        <FlexRow>
          <Label htmlFor="statusFilter" style={{ marginBottom: 0 }}>
            Filter:
          </Label>
          <Select
            id="statusFilter"
            value={statusFilter}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="CANCELLED">CANCELLED</option>
          </Select>
        </FlexRow>
      </HeaderSection>

      {actionMessage && <ActionMsg>{actionMessage}</ActionMsg>}

      {bookings.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "30px 20px" }}>
          <p style={{ color: "#64748b" }}>No bookings found.</p>
        </Card>
      ) : (
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Seats</th>
                <th>Count</th>
                <th>Amount (₹)</th>
                <th>Status</th>
                <th>Booking Date</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id || b._id}>
                  <td style={{ fontWeight: 600 }}>{b.eventName}</td>
                  <td>{Array.isArray(b.seats) ? b.seats.join(", ") : b.seats}</td>
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
                        onClick={() => handleCancelMyBooking(b.id || b._id)}
                      >
                        Cancel
                      </DangerButton>
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
