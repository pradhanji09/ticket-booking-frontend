import { useState, useEffect } from "react";
import styled from "styled-components";
import { getAdminBookings } from "../api/adminBookingsService";
import {
  PageContainer,
  Card,
  TableWrapper,
  Table,
  Input,
  Select,
  Label,
  Button,
  SecondaryButton,
  Badge,
  FlexRow,
  PaginationContainer,
} from "../../../components/ui";

const PageTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
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

  return (
    <PageContainer>
      <PageTitle>Admin Booking Dashboard</PageTitle>

      <Card style={{ marginBottom: "20px" }}>
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
        <Card style={{ textAlign: "center", padding: "30px 20px" }}>
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
                <th>Seat Count</th>
                <th>Amount (₹)</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id || b.id}>
                  <td style={{ fontSize: "11px", fontFamily: "monospace", color: "#64748b" }}>
                    {(b.user?._id || b.user?.id || b.userId)?.slice(0, 10)}...
                  </td>
                  <td style={{ fontWeight: 600 }}>{b.user?.name}</td>
                  <td>{b.user?.email}</td>
                  <td>{b.event?.name || b.eventName}</td>
                  <td>{b.seatCount}</td>
                  <td style={{ fontWeight: 700, color: "#e23744" }}>
                    ₹{(b.amount / 100).toFixed(2)}
                  </td>
                  <td>
                    <Badge status={b.status}>{b.status}</Badge>
                  </td>
                  <td>{new Date(b.createdAt).toLocaleString()}</td>
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
