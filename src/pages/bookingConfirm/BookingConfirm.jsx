import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { confirmBookingApi } from "./bookingConfirmService";

export default function BookingConfirm() {
  const { reservationGroupId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const amount = location.state?.amount;
  const expiresAt = location.state?.expiresAt;

  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const calculateRemaining = () => {
    if (!expiresAt) return 0;
    const diff = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
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
      <div>
        <p>No active reservation, please select seats again</p>
        <Link to="/events">Back to Events</Link>
      </div>
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
    <div>
      <h2>Booking Confirmation</h2>

      <p>Reservation Group ID: {reservationGroupId}</p>
      <p>Amount to Pay: ₹{(amount / 100).toFixed(2)}</p>

      {remainingSeconds > 0 ? (
        <p>Time Remaining: {formatTime(remainingSeconds)}</p>
      ) : (
        <div>
          <p style={{ color: "red" }}>Reservation expired</p>
          <p>
            <Link to="/events">Back to Events</Link>
          </p>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {errorCode === 402 && (
        <p>
          <Link to="/wallet">Add Money to Wallet</Link>
        </p>
      )}

      {(errorCode === 410 || errorCode === 409) && (
        <p>
          <Link to="/events">Back to Events</Link>
        </p>
      )}

      <button
        disabled={remainingSeconds <= 0 || isSubmitting}
        onClick={handleConfirm}
      >
        {isSubmitting ? "Processing..." : "Confirm & Pay"}
      </button>
    </div>
  );
}
