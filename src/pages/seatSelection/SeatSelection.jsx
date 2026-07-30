import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getEventDetails,
  getEventSeats,
  reserveSeatsApi,
} from "./seatSelectionService";
import {
  PageContainer,
  Card,
  Button,
  ErrorText,
  FlexRow,
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

const DetailText = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SeatGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SeatButton = styled.button`
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radius};
  font-size: 13px;
  font-family: inherit;
  font-weight: 500;
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  background-color: ${({ isSelected, isAvailable, theme }) =>
    isSelected
      ? theme.colors.primary
      : isAvailable
        ? theme.colors.background
        : theme.colors.surface};
  color: ${({ isSelected, isAvailable, theme }) =>
    isSelected
      ? "#ffffff"
      : isAvailable
        ? theme.colors.text
        : theme.colors.textMuted};
  opacity: ${({ isAvailable, isSelected }) =>
    isAvailable || isSelected ? 1 : 0.6};
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
        setEvent(res.data);
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
      <PageTitle>Seat Selection</PageTitle>
      {error && <ErrorText>{error}</ErrorText>}

      {event && (
        <Card>
          <SectionTitle>{event.name}</SectionTitle>
          {event.venue && <DetailText>Venue: {event.venue}</DetailText>}
          <DetailText>
            Date: {new Date(event.eventDate).toLocaleDateString()}
          </DetailText>
          <DetailText>
            Price per seat: ₹{(event.pricePerSeat / 100).toFixed(2)}
          </DetailText>
        </Card>
      )}

      <Card>
        <SectionTitle>Select Seats</SectionTitle>
        <SeatGrid>
          {seats.map((seat) => {
            const isAvailable = seat.status === "AVAILABLE";
            const isSelected = selectedSeatIds.includes(seat.id);
            return (
              <SeatButton
                key={seat.id}
                disabled={!isAvailable}
                isSelected={isSelected}
                isAvailable={isAvailable}
                onClick={() => toggleSeat(seat.id)}
              >
                {seat.seatNumber}
              </SeatButton>
            );
          })}
        </SeatGrid>

        <FlexRow style={{ justifyContent: "space-between" }}>
          <div>
            <strong>Total Price: </strong>
            <span>₹{(totalPrice / 100).toFixed(2)}</span>
          </div>
          <Button
            disabled={selectedSeatIds.length === 0}
            onClick={handleReserve}
          >
            Reserve Seats
          </Button>
        </FlexRow>
      </Card>
    </PageContainer>
  );
}
