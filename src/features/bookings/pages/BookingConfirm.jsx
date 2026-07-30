import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { confirmBookingApi } from "../api/bookingConfirmService";
import {
  PageContainer,
  Card,
  Button,
  ErrorText,
  Badge,
  FormGroup,
} from "../../../components/ui";

const TicketCard = styled(Card)`
  max-width: 480px;
  margin: 20px auto;
  padding: 28px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const PageTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;
  text-align: center;
`;

const TicketRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px dashed ${({ theme }) => theme.colors.border};
  font-size: 14px;

  span:first-child {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  span:last-child {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const TimerBox = styled.div`
  background-color: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius};
  padding: 12px;
  text-align: center;
  font-size: 15px;
  font-weight: 700;
  margin: 20px 0;
`;

export default function BookingConfirm() {
  const { reservationGroupId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const amount = location.state?.amount;
  const expiresAt = location.state?.expiresAt;

  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const calculateRemaining = () => {
    if (!expiresAt) return 0;
    const diff = Math.floor(
      (new Date(expiresAt).getTime() - Date.now()) / 1000,
    );
    return diff > 0 ? diff : 0;
  };

  const [remainingSeconds, setRemainingSeconds] = useState(calculateRemaining);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState(null);

  useEffect(() => {
    if (!expiresAt || remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const [isAlreadyConfirmed, setIsAlreadyConfirmed] = useState(() => {
    return sessionStorage.getItem(`confirmed_${reservationGroupId}`) === "true";
  });

  if (isAlreadyConfirmed) {
    return (
      <PageContainer>
        <TicketCard style={{ textAlign: "center" }}>
          <Badge status="CONFIRMED" style={{ marginBottom: "12px" }}>
            CONFIRMED
          </Badge>
          <PageTitle>Reservation Confirmed</PageTitle>
          <p style={{ color: "#64748b", marginBottom: "20px" }}>
            This reservation has already been confirmed and paid.
          </p>
          <Link to="/bookings">
            <Button style={{ width: "100%" }}>View My Bookings</Button>
          </Link>
        </TicketCard>
      </PageContainer>
    );
  }

  if (!amount || !expiresAt) {
    return (
      <PageContainer>
        <TicketCard style={{ textAlign: "center" }}>
          <p style={{ color: "#64748b", marginBottom: "20px" }}>
            No active reservation found.
          </p>
          <Link to="/events">
            <Button style={{ width: "100%" }}>Browse Events</Button>
          </Link>
        </TicketCard>
      </PageContainer>
    );
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleConfirm = async () => {
    if (remainingSeconds <= 0 || isSubmitting) return;

    setIsSubmitting(true);
    setError("");
    setErrorCode(null);

    try {
      const res = await confirmBookingApi(reservationGroupId, idempotencyKey);
      if (res.success) {
        sessionStorage.setItem(`confirmed_${reservationGroupId}`, "true");
        setIsAlreadyConfirmed(true);
        navigate("/bookings", { replace: true });
      }
    } catch (err) {
      const status = err.status;
      setErrorCode(status);
      setError(err.error || err.message || "Booking confirmation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <TicketCard>
        <PageTitle>Confirm Reservation</PageTitle>

        <TicketRow>
          <span>Reservation Group</span>
          <span style={{ fontSize: "12px", fontFamily: "monospace" }}>
            {reservationGroupId?.slice(0, 12)}...
          </span>
        </TicketRow>

        <TicketRow>
          <span>Amount Due</span>
          <span style={{ fontSize: "18px", color: "#e23744" }}>
            ₹{(amount / 100).toFixed(2)}
          </span>
        </TicketRow>

        {remainingSeconds > 0 ? (
          <TimerBox>⏱ Reservation expires in {formatTime(remainingSeconds)}</TimerBox>
        ) : (
          <ErrorText style={{ textAlign: "center", margin: "16px 0" }}>
            Reservation has expired
          </ErrorText>
        )}

        {error && <ErrorText>{error}</ErrorText>}

        {errorCode === 402 && (
          <FormGroup style={{ textAlign: "center", marginTop: "12px" }}>
            <Link to="/wallet" style={{ color: "#e23744", fontWeight: 600 }}>
              Insufficient Funds — Top Up Wallet
            </Link>
          </FormGroup>
        )}

        {(errorCode === 410 || errorCode === 409 || remainingSeconds <= 0) && (
          <FormGroup style={{ textAlign: "center", marginTop: "12px" }}>
            <Link to="/events" style={{ color: "#64748b" }}>
              Return to Events Catalog
            </Link>
          </FormGroup>
        )}

        <Button
          style={{ width: "100%", marginTop: "16px" }}
          disabled={remainingSeconds <= 0 || isSubmitting}
          onClick={handleConfirm}
        >
          {isSubmitting ? "Processing Payment..." : "Confirm & Pay Now"}
        </Button>
      </TicketCard>
    </PageContainer>
  );
}
