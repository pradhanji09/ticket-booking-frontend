import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { signupApi } from "../api/signupService";
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

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await signupApi(name, email, password);
      if (res.success) {
        login(res.token);
        navigate("/events");
      }
    } catch (err) {
      setError(err.error || err.message || "Signup failed");
    }
  };

  return (
    <AuthWrapper>
      <Card>
        <AuthHeader>Sign Up</AuthHeader>
        {error && <ErrorText>{error}</ErrorText>}
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
            />
          </FormGroup>
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
            Sign Up
          </Button>
        </form>
        <FooterText>
          Already have an account? <Link to="/login">Login</Link>
        </FooterText>
      </Card>
    </AuthWrapper>
  );
}
