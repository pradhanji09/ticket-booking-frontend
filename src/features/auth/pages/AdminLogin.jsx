import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { adminLoginApi } from "../api/adminLoginService";
import { useAuth } from "../../../context/AuthContext";
import {
  PageContainer,
  Card,
  FormGroup,
  Label,
  Input,
  Button,
  ErrorText,
} from "../../../components/ui";

const AuthWrapper = styled(PageContainer)`
  max-width: 420px;
  margin-top: 40px;
`;

const AuthHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;

  h2 {
    font-size: 22px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
  }

  p {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-top: 4px;
  }
`;

const AdminBadge = styled.span`
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.text};
  color: #ffffff;
  font-weight: 800;
  font-size: 12px;
  padding: 3px 8px;
  border-radius: ${({ theme }) => theme.radiusSm};
  margin-bottom: 12px;
`;

const FooterText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.md};
  font-size: 13px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "ADMIN") {
      navigate("/admin/events", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await adminLoginApi(email, password);
      if (res.success) {
        login(res.token);
        navigate("/admin/events", { replace: true });
      }
    } catch (err) {
      setError(err.error || err.message || "Admin login failed");
    }
  };

  return (
    <AuthWrapper>
      <Card style={{ padding: "28px" }}>
        <AuthHeader>
          <AdminBadge>ADMIN CONSOLE</AdminBadge>
          <h2>Admin Authentication</h2>
          <p>Access management controls for events and bookings</p>
        </AuthHeader>

        {error && <ErrorText>{error}</ErrorText>}

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="admin-email">Admin Email</Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </FormGroup>
          <Button type="submit" style={{ width: "100%", marginTop: "8px" }}>
            Sign In to Console
          </Button>
        </form>

        <FooterText>
          Looking for user portal? <Link to="/login">User Login</Link>
        </FooterText>
      </Card>
    </AuthWrapper>
  );
}
