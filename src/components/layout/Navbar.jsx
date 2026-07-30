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
  box-shadow: ${({ theme }) => theme.shadowSm};
`;

const NavContainer = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  @media (min-width: 640px) {
    padding: 14px 24px;
  }
`;

const BrandLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
`;

const LogoIcon = styled.span`
  background-color: ${({ theme }) => theme.colors.primary};
  color: #ffffff;
  font-weight: 800;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radiusSm};
  letter-spacing: -0.5px;
`;

const BrandTitle = styled.span`
  font-weight: 700;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.3px;
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (min-width: 640px) {
    gap: 16px;
  }
`;

const NavItem = styled(Link)`
  color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.textMuted};
  font-size: 13px;
  font-weight: ${({ active }) => (active ? "600" : "500")};
  text-decoration: none;
  padding: 6px 10px;
  border-radius: ${({ theme }) => theme.radiusSm};
  background-color: ${({ active, theme }) =>
    active ? theme.colors.primaryLight : "transparent"};
  transition: all 0.15s ease-in-out;

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
  border-radius: ${({ theme }) => theme.radiusSm};
  transition: all 0.15s ease-in-out;

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
    logout();
    navigate("/login");
  };

  if (!user) return null;

  const isAdmin = user.role === "ADMIN";

  return (
    <NavHeader>
      <NavContainer>
        <BrandLink to={isAdmin ? "/admin/events" : "/events"}>
          <LogoIcon>TICKET</LogoIcon>
          <BrandTitle>ShowPass</BrandTitle>
          {isAdmin && <Badge status="BOOKED">Admin</Badge>}
        </BrandLink>

        <NavRight>
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
        </NavRight>
      </NavContainer>
    </NavHeader>
  );
}
