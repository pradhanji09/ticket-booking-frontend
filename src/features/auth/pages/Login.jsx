import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { loginApi } from "../api/loginService";
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

const BrandBadge = styled.span`
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.primary};
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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") {
        navigate("/admin/events", { replace: true });
      } else {
        navigate("/events", { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await loginApi(email, password);
      if (res.success) {
        const userData = login(res.token);
        if (userData?.role === "ADMIN") {
          navigate("/admin/events", { replace: true });
        } else {
          navigate("/events", { replace: true });
        }
      }
    } catch (err) {
      setError(err.error || err.message || "Login failed");
    }
  };

  return (
    <AuthWrapper>
      <Card style={{ padding: "28px" }}>
        <AuthHeader>
          <BrandBadge>SHOWPASS</BrandBadge>
          <h2>Welcome Back</h2>
        </AuthHeader>

        {error && <ErrorText>{error}</ErrorText>}

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@example.com"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </FormGroup>
          <Button type="submit" style={{ width: "100%", marginTop: "8px" }}>
            Sign In
          </Button>
        </form>

        <FooterText>
          Don't have an account? <Link to="/signup">Sign up now</Link>
        </FooterText>
      </Card>
    </AuthWrapper>
  );
}
