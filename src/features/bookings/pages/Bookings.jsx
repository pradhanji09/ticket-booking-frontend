import { useState, useEffect } from "react";
import styled from "styled-components";
import { getMyBookings } from "../api/bookingsService";
import {
  PageContainer,
  Card,
  Table,
  Select,
  Label,
  FlexRow,
  SecondaryButton,
  PaginationContainer,
} from "../../../components/ui";

const PageTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FilterGroup = styled(FlexRow)`
  margin-bottom: ${({ theme }) => theme.spacing.md};
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

  return (
    <PageContainer>
      <PageTitle>My Bookings</PageTitle>

      <FilterGroup>
        <Label htmlFor="statusFilter" style={{ marginBottom: 0 }}>
          Status Filter:
        </Label>
        <Select
          id="statusFilter"
          value={statusFilter}
          onChange={handleFilterChange}
        >
          <option value="">All</option>
          <option value="CONFIRMED">CONFIRMED</option>
          <option value="CANCELLED">CANCELLED</option>
        </Select>
      </FilterGroup>

      {bookings.length === 0 ? (
        <Card>No bookings yet</Card>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Seats</th>
              <th>Seat Count</th>
              <th>Amount (₹)</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id || b._id}>
                <td>{b.eventName}</td>
                <td>{Array.isArray(b.seats) ? b.seats.join(", ") : b.seats}</td>
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
