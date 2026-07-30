import styled from "styled-components";

export const PageContainer = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;

export const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: none;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

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
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const DangerButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.danger};

  &:hover {
    background-color: #8e2e2e;
  }
`;

export const SecondaryButton = styled(Button)`
  background-color: #ffffff;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    background-color: ${({ theme }) => theme.colors.surface};
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

export const Select = styled.select`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  padding: ${({ theme }) => theme.spacing.sm};
  font-size: 14px;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  th,
  td {
    border: 1px solid ${({ theme }) => theme.colors.border};
    padding: ${({ theme }) => theme.spacing.sm};
    text-align: left;
    font-size: 13px;
  }

  th {
    background-color: ${({ theme }) => theme.colors.surface};
    font-weight: 600;
  }
`;

export const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const SuccessText = styled.span`
  color: ${({ theme }) => theme.colors.success};
  font-size: 13px;
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const FlexRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ gap, theme }) => (gap ? gap : theme.spacing.sm)};
  flex-wrap: wrap;
`;

export const PaginationContainer = styled(FlexRow)`
  margin-top: ${({ theme }) => theme.spacing.md};
  justify-content: flex-start;
`;
