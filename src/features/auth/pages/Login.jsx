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
      <Card>
        <AuthHeader>Login</AuthHeader>
        {error && <ErrorText>{error}</ErrorText>}
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
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
              placeholder="Enter your password"
            />
          </FormGroup>
          <Button type="submit" style={{ width: "100%" }}>
            Login
          </Button>
        </form>
        <FooterText>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </FooterText>
      </Card>
    </AuthWrapper>
  );
}
