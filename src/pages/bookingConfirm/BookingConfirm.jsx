import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { confirmBookingApi } from "./bookingConfirmService";
import {
  PageContainer,
  Card,
  Button,
  ErrorText,
  FormGroup,
} from "../../components/ui";

const PageTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const DetailText = styled.p`
  font-size: 14px;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text};
`;

const TimerText = styled.p`
  font-size: 14px;
  font-weight: 600;
  margin-top: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
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

  if (!amount || !expiresAt) {
    return (
      <PageContainer>
        <Card>
          <DetailText>No active reservation found.</DetailText>
          <Link
            to="/events"
            style={{ textDecoration: "underline", color: "#1a1a1a" }}
          >
            Back to Events
          </Link>
        </Card>
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
        navigate("/bookings");
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
      <PageTitle>Booking Confirmation</PageTitle>

      <Card>
        <FormGroup>
          <DetailText>
            <strong>Reservation Group ID:</strong> {reservationGroupId}
          </DetailText>
          <DetailText>
            <strong>Amount to Pay:</strong> ₹{(amount / 100).toFixed(2)}
          </DetailText>
        </FormGroup>

        {remainingSeconds > 0 ? (
          <TimerText>Time Remaining: {formatTime(remainingSeconds)}</TimerText>
        ) : (
          <ErrorText>Reservation expired</ErrorText>
        )}

        {error && <ErrorText>{error}</ErrorText>}

        {errorCode === 402 && (
          <FormGroup>
            <Link
              to="/wallet"
              style={{ color: "#2c2c2c", textDecoration: "underline" }}
            >
              Add Money to Wallet
            </Link>
          </FormGroup>
        )}

        {(errorCode === 410 || errorCode === 409 || remainingSeconds <= 0) && (
          <FormGroup>
            <Link
              to="/events"
              style={{ color: "#2c2c2c", textDecoration: "underline" }}
            >
              Back to Events
            </Link>
          </FormGroup>
        )}

        <Button
          disabled={remainingSeconds <= 0 || isSubmitting}
          onClick={handleConfirm}
        >
          {isSubmitting ? "Processing..." : "Confirm & Pay"}
        </Button>
      </Card>
    </PageContainer>
  );
}
