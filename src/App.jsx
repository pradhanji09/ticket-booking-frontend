import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { AuthProvider, useAuth } from "./context/AuthContext";
import theme from "./styles/theme";
import GlobalStyle from "./styles/GlobalStyle";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import Login from "./features/auth/pages/Login";
import Signup from "./features/auth/pages/Signup";
import Wallet from "./features/wallet/pages/Wallet";
import Events from "./features/events/pages/Events";
import SeatSelection from "./features/events/pages/SeatSelection";
import BookingConfirm from "./features/bookings/pages/BookingConfirm";
import Bookings from "./features/bookings/pages/Bookings";
import AdminEvents from "./features/admin/pages/AdminEvents";
import AdminSeatOverview from "./features/admin/pages/AdminSeatOverview";
import AdminBookings from "./features/admin/pages/AdminBookings";
import AdminTransactions from "./features/admin/pages/AdminTransactions";
import Navbar from "./components/layout/Navbar";

function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "ADMIN") return <Navigate to="/admin/events" replace />;
  return <Navigate to="/events" replace />;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

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

            <Route path="/" element={<RootRedirect />} />
            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
