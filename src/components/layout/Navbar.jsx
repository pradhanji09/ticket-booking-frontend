import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";

const NavHeader = styled.header`
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
`;

const NavContainer = styled.div`
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Brand = styled(Link)`
  font-weight: 700;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;

  a {
    color: ${({ theme }) => theme.colors.text};
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  const isAdmin = user.role === "ADMIN";

  return (
    <NavHeader>
      <NavContainer>
        <Brand to={isAdmin ? "/admin/events" : "/events"}>
          Ticket Booking {isAdmin ? "(Admin)" : ""}
        </Brand>
        <NavLinks>
          {isAdmin ? (
            <>
              <Link to="/admin/events">Events</Link>
              <Link to="/admin/bookings">Bookings</Link>
              <Link to="/admin/transactions">Transactions</Link>
            </>
          ) : (
            <>
              <Link to="/events">Events</Link>
              <Link to="/bookings">Bookings</Link>
              <Link to="/wallet">Wallet</Link>
            </>
          )}
          <NavButton onClick={handleLogout}>Logout</NavButton>
        </NavLinks>
      </NavContainer>
    </NavHeader>
  );
}
