import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { adminLoginApi } from "./adminLoginService";
import { useAuth } from "../../context/AuthContext";
import {
  PageContainer,
  Card,
  FormGroup,
  Label,
  Input,
  Button,
  ErrorText,
} from "../../components/ui";

const AuthWrapper = styled(PageContainer)`
  max-width: 400px;
  margin-top: 40px;
`;

const AuthHeader = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: 18px;
  font-weight: 600;
`;

const FooterText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.md};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};

  a {
    color: ${({ theme }) => theme.colors.text};
    text-decoration: underline;
  }
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
      <Card>
        <AuthHeader>Admin Login</AuthHeader>
        {error && <ErrorText>{error}</ErrorText>}
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Admin Email"
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
              placeholder="Admin Password"
            />
          </FormGroup>
          <Button type="submit" style={{ width: "100%" }}>
            Login as Admin
          </Button>
        </form>
        <FooterText>
          User login? <Link to="/login">User Login</Link>
        </FooterText>
      </Card>
    </AuthWrapper>
  );
}
