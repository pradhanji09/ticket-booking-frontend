import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import AdminLogin from "./pages/adminLogin/AdminLogin";
import Wallet from "./pages/wallet/Wallet";
import Events from "./pages/events/Events";
import SeatSelection from "./pages/seatSelection/SeatSelection";
import BookingConfirm from "./pages/bookingConfirm/BookingConfirm";
import Bookings from "./pages/bookings/Bookings";
import AdminEvents from "./pages/adminEvents/AdminEvents";
import AdminSeatOverview from "./pages/adminSeatOverview/AdminSeatOverview";
import AdminBookings from "./pages/adminBookings/AdminBookings";
import AdminTransactions from "./pages/adminTransactions/AdminTransactions";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:id"
            element={
              <ProtectedRoute>
                <SeatSelection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking/confirm/:reservationGroupId"
            element={
              <ProtectedRoute>
                <BookingConfirm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <Wallet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/events"
            element={
              <AdminRoute>
                <AdminEvents />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/events/:id/seats"
            element={
              <AdminRoute>
                <AdminSeatOverview />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <AdminRoute>
                <AdminBookings />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/transactions"
            element={
              <AdminRoute>
                <AdminTransactions />
              </AdminRoute>
            }
          />

          <Route path="/" element={<Navigate to="/events" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
