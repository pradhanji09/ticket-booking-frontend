import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";
import { Badge } from "../ui";

const NavHeader = styled.header`
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 10px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 520px) {
    padding: 10px 12px;
  }
`;

const BrandLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
`;

const LogoText = styled.span`
  font-weight: 800;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.3px;
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;

  @media (min-width: 640px) {
    gap: 8px;
  }
`;

const NavItem = styled(Link)`
  color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.textMuted};
  font-size: 13px;
  font-weight: ${({ active }) => (active ? "600" : "500")};
  text-decoration: none;
  padding: 6px 10px;
  border-radius: ${({ theme }) => theme.radius};
  background-color: ${({ active, theme }) =>
    active ? theme.colors.primaryLight : "transparent"};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.surfaceAlt};
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: ${({ theme }) => theme.radius};

  &:hover {
    color: ${({ theme }) => theme.colors.danger};
    background-color: ${({ theme }) => theme.colors.dangerLight};
  }
`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      navigate("/login");
    }
  };

  if (!user) return null;

  const isAdmin = user.role === "ADMIN";

  return (
    <NavHeader>
      <NavContainer>
        <BrandLink to={isAdmin ? "/admin/events" : "/events"}>
          <LogoText>Ticket Booking</LogoText>
          {isAdmin && <Badge status="BOOKED">Admin</Badge>}
        </BrandLink>

        <NavLinks>
          {isAdmin ? (
            <>
              <NavItem
                to="/admin/events"
                active={location.pathname.startsWith("/admin/events") ? 1 : 0}
              >
                Events
              </NavItem>
              <NavItem
                to="/admin/bookings"
                active={location.pathname === "/admin/bookings" ? 1 : 0}
              >
                Bookings
              </NavItem>
              <NavItem
                to="/admin/transactions"
                active={location.pathname === "/admin/transactions" ? 1 : 0}
              >
                Transactions
              </NavItem>
            </>
          ) : (
            <>
              <NavItem
                to="/events"
                active={location.pathname.startsWith("/events") ? 1 : 0}
              >
                Events
              </NavItem>
              <NavItem
                to="/bookings"
                active={location.pathname === "/bookings" ? 1 : 0}
              >
                Bookings
              </NavItem>
              <NavItem
                to="/wallet"
                active={location.pathname === "/wallet" ? 1 : 0}
              >
                Wallet
              </NavItem>
            </>
          )}
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </NavLinks>
      </NavContainer>
    </NavHeader>
  );
}
