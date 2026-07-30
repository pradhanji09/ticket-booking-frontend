import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { getAdminSeatOverview } from "./adminSeatOverviewService";
import {
  PageContainer,
  Card,
  Select,
  Label,
  FlexRow,
} from "../../components/ui";

const PageTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SubTitle = styled.h3`
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SeatCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  padding: ${({ theme }) => theme.spacing.sm};
  min-width: 110px;
  background-color: ${({ status, theme }) =>
    status === "AVAILABLE"
      ? "#f0fdf4"
      : status === "RESERVED"
        ? "#fffbeb"
        : "#fef2f2"};

  strong {
    display: block;
    font-size: 13px;
    margin-bottom: 2px;
  }

  span {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textMuted};
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
      <div style={{ marginBottom: "12px" }}>
        <Link
          to="/admin/events"
          style={{
            textDecoration: "underline",
            color: "#1a1a1a",
            fontSize: "13px",
          }}
        >
          &larr; Back to Events
        </Link>
      </div>

      <PageTitle>Admin Seat Overview</PageTitle>
      {eventName && <SubTitle>Event: {eventName}</SubTitle>}

      <FlexRow style={{ marginBottom: "16px" }}>
        <Label htmlFor="seatFilter" style={{ marginBottom: 0 }}>
          Filter Status:
        </Label>
        <Select
          id="seatFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="AVAILABLE">AVAILABLE</option>
          <option value="RESERVED">RESERVED</option>
          <option value="BOOKED">BOOKED</option>
        </Select>
      </FlexRow>

      {seats.length === 0 ? (
        <Card>No seats found for this filter</Card>
      ) : (
        <FlexRow gap="10px">
          {seats.map((seat, index) => (
            <SeatCard key={seat.id || index} status={seat.status}>
              <strong>Seat {seat.seatNumber}</strong>
              <span>Status: {seat.status}</span>
            </SeatCard>
          ))}
        </FlexRow>
      )}
    </PageContainer>
  );
}
