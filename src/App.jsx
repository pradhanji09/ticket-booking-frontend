import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { AuthProvider, useAuth } from "./context/AuthContext";
import theme from "./styles/theme";
import GlobalStyle from "./styles/GlobalStyle";
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
import Navbar from "./components/Navbar";

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

            <Route path="/" element={<RootRedirect />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
