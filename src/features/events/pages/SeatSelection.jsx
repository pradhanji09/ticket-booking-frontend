import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getEventDetails,
  getEventSeats,
  reserveSeatsApi,
} from "../api/seatSelectionService";
import {
  PageContainer,
  Card,
  Button,
  ErrorText,
  Badge,
  FlexRow,
} from "../../../components/ui";

const ScreenBar = styled.div`
  background: linear-gradient(180deg, #e2878f 0%, #cbd5e1 100%);
  height: 8px;
  border-radius: 4px;
  margin: 16px auto 24px auto;
  max-width: 80%;
  box-shadow: 0 4px 12px rgba(226, 55, 68, 0.15);
  position: relative;

  &::after {
    content: "SCREEN THIS WAY";
    display: block;
    text-align: center;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-top: 12px;
  }
`;

const LegendContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const LegendDot = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid
    ${({ type, theme }) =>
      type === "selected"
        ? theme.colors.primary
        : type === "available"
          ? theme.colors.borderDark
          : theme.colors.border};
  background-color: ${({ type, theme }) =>
    type === "selected"
      ? theme.colors.primary
      : type === "available"
        ? theme.colors.surface
        : theme.colors.surfaceAlt};
`;

const SeatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(44px, 1fr));
  gap: 8px;
  margin-bottom: 24px;
`;

const SeatButton = styled.button`
  height: 40px;
  border-radius: ${({ theme }) => theme.radiusSm};
  font-size: 12px;
  font-weight: 600;
  border: 1px solid
    ${({ isSelected, isAvailable, theme }) =>
      isSelected
        ? theme.colors.primary
        : isAvailable
          ? theme.colors.borderDark
          : theme.colors.border};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  background-color: ${({ isSelected, isAvailable, theme }) =>
    isSelected
      ? theme.colors.primary
      : isAvailable
        ? theme.colors.surface
        : theme.colors.surfaceAlt};
  color: ${({ isSelected, isAvailable, theme }) =>
    isSelected
      ? "#ffffff"
      : isAvailable
        ? theme.colors.text
        : theme.colors.textLight};
  opacity: ${({ isAvailable, isSelected }) =>
    isAvailable || isSelected ? 1 : 0.5};
  transition: all 0.15s ease-in-out;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
  }
`;

const SummaryBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  flex-wrap: wrap;
  gap: 12px;
`;

export default function SeatSelection() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [error, setError] = useState("");

  const fetchEvent = async () => {
    try {
      const res = await getEventDetails(id);
      if (res.success) {
        setEvent(res.event);
      }
    } catch (err) {}
  };

  const fetchSeats = async () => {
    try {
      const res = await getEventSeats(id);
      if (res.success) {
        setSeats(res.seats);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchEvent();
    fetchSeats();
  }, [id]);

  const toggleSeat = (seatId) => {
    if (selectedSeatIds.includes(seatId)) {
      setSelectedSeatIds(selectedSeatIds.filter((sId) => sId !== seatId));
    } else {
      setSelectedSeatIds([...selectedSeatIds, seatId]);
    }
  };

  const handleReserve = async () => {
    setError("");
    try {
      const res = await reserveSeatsApi(id, selectedSeatIds);
      if (res.success) {
        const { reservationGroupId, amount, expiresAt } = res.data;
        navigate(`/booking/confirm/${reservationGroupId}`, {
          state: { amount, expiresAt },
        });
      }
    } catch (err) {
      setError(err.error || err.message || "Failed to reserve seats");
    }
  };

  const totalPrice = selectedSeatIds.length * (event?.pricePerSeat || 0);

  return (
    <PageContainer>
      {error && <ErrorText>{error}</ErrorText>}

      {event && (
        <Card style={{ marginBottom: "20px" }}>
          <FlexRow style={{ justifyContent: "space-between", marginBottom: "8px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700 }}>{event.name}</h2>
            <Badge status={event.status}>{event.status}</Badge>
          </FlexRow>
          <p style={{ fontSize: "13px", color: "#64748b" }}>
            Date: {new Date(event.eventDate).toLocaleDateString()} | Price: ₹{(event.pricePerSeat / 100).toFixed(2)} / seat
          </p>
        </Card>
      )}

      <Card>
        <ScreenBar />

        <LegendContainer>
          <LegendItem>
            <LegendDot type="available" />
            <span>Available</span>
          </LegendItem>
          <LegendItem>
            <LegendDot type="selected" />
            <span>Selected ({selectedSeatIds.length})</span>
          </LegendItem>
          <LegendItem>
            <LegendDot type="booked" />
            <span>Booked / Reserved</span>
          </LegendItem>
        </LegendContainer>

        <SeatGrid>
          {seats.map((seat) => {
            const isAvailable =
              seat.status === "AVAILABLE" && event?.status !== "CANCELLED";
            const isSelected = selectedSeatIds.includes(seat._id);
            return (
              <SeatButton
                key={seat.id || seat._id}
                disabled={!isAvailable}
                isSelected={isSelected}
                isAvailable={isAvailable}
                onClick={() => toggleSeat(seat._id)}
              >
                {seat.seatNumber}
              </SeatButton>
            );
          })}
        </SeatGrid>

        <SummaryBar>
          <div>
            <span style={{ fontSize: "12px", color: "#64748b" }}>Total Price</span>
            <div style={{ fontSize: "20px", fontWeight: 800, color: "#e23744" }}>
              ₹{(totalPrice / 100).toFixed(2)}
            </div>
          </div>

          <Button
            disabled={selectedSeatIds.length === 0}
            onClick={handleReserve}
          >
            Reserve {selectedSeatIds.length > 0 ? `(${selectedSeatIds.length})` : ""} Seats
          </Button>
        </SummaryBar>
      </Card>
    </PageContainer>
  );
}
