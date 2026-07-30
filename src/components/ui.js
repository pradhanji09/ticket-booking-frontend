import styled from "styled-components";

export const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: #ffffff;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-size: 14px;
  font-family: inherit;
  font-weight: 500;
  cursor: pointer;
  box-shadow: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s ease-in-out;

  &:hover {
    background-color: #1a1a1a;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const DangerButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.danger};

  &:hover {
    background-color: #8e2e2e;
  }
`;

export const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  padding: ${({ theme }) => theme.spacing.sm};
  font-size: 14px;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: none;
  outline: none;
  width: 100%;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: none;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    border: 1px solid ${({ theme }) => theme.colors.border};
    padding: ${({ theme }) => theme.spacing.sm};
    text-align: left;
  }

  th {
    background-color: ${({ theme }) => theme.colors.surface};
    font-weight: 600;
  }
`;

export const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 12px;
  display: block;
`;

export const PageContainer = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;
