import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { getAdminSeatOverview } from "../api/adminSeatOverviewService";
import {
  PageContainer,
  Card,
  Select,
  Label,
  Badge,
  FlexRow,
} from "../../../components/ui";

const PageTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SubTitle = styled.h3`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SeatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 12px;
`;

const SeatCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  padding: 12px;
  background-color: ${({ status }) =>
    status === "AVAILABLE"
      ? "#f0fdf4"
      : status === "RESERVED"
        ? "#fffbeb"
        : "#fef2f2"};

  strong {
    display: block;
    font-size: 13px;
    margin-bottom: 6px;
    color: ${({ theme }) => theme.colors.text};
  }
`;

export default function AdminSeatOverview() {
  const { id } = useParams();
  const [eventName, setEventName] = useState("");
  const [seats, setSeats] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchSeats = async (filter) => {
    try {
      const res = await getAdminSeatOverview(id, filter);
      if (res.success) {
        setEventName(res.event);
        setSeats(res.seats);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchSeats(statusFilter);
  }, [id, statusFilter]);

  return (
    <PageContainer>
      <div style={{ marginBottom: "16px" }}>
        <Link
          to="/admin/events"
          style={{
            color: "#e23744",
            fontWeight: 600,
            fontSize: "13px",
          }}
        >
          &larr; Back to Events List
        </Link>
      </div>

      <PageTitle>Admin Seat Overview</PageTitle>
      {eventName && <SubTitle>Event: {eventName}</SubTitle>}

      <FlexRow style={{ marginBottom: "20px" }}>
        <Label htmlFor="seatFilter" style={{ marginBottom: 0 }}>
          Filter Status:
        </Label>
        <Select
          id="seatFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="AVAILABLE">AVAILABLE</option>
          <option value="RESERVED">RESERVED</option>
          <option value="BOOKED">BOOKED</option>
        </Select>
      </FlexRow>

      {seats.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "30px 20px" }}>
          <p style={{ color: "#64748b" }}>No seats match this status filter.</p>
        </Card>
      ) : (
        <SeatGrid>
          {seats.map((seat, index) => (
            <SeatCard key={seat.id || index} status={seat.status}>
              <strong>Seat {seat.seatNumber}</strong>
              <Badge status={seat.status}>{seat.status}</Badge>
            </SeatCard>
          ))}
        </SeatGrid>
      )}
    </PageContainer>
  );
}
