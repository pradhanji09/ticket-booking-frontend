import styled from "styled-components";

export const PageContainer = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.md};

  @media (min-width: 640px) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

export const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadowSm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  transition: border-color 0.15s ease-in-out;
`;

export const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: #ffffff;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius};
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease-in-out;
  outline: none;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.surfaceAlt};
    border-color: ${({ theme }) => theme.colors.borderDark};
  }
`;

export const DangerButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.danger};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.dangerHover};
  }
`;

export const OutlineButton = styled(Button)`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryLight};
  }
`;

export const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  padding: 10px 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.surface};
  outline: none;
  width: 100%;
  transition: border-color 0.15s ease-in-out;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

export const Select = styled.select`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  padding: 10px 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.surface};
  outline: none;
  transition: border-color 0.15s ease-in-out;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight};
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};

  &:last-child {
    margin-bottom: 0;
  }
`;

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: ${({ theme }) => theme.radius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.surface};
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;

  th,
  td {
    padding: 12px 14px;
    text-align: left;
    font-size: 13px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  th {
    background-color: ${({ theme }) => theme.colors.surfaceAlt};
    color: ${({ theme }) => theme.colors.textMuted};
    font-weight: 600;
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.5px;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr:hover {
    background-color: #f8fafc;
  }
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radiusSm};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  background-color: ${({ status, theme }) => {
    switch (status) {
      case "ACTIVE":
      case "AVAILABLE":
      case "CONFIRMED":
      case "CREDIT":
        return theme.colors.successLight;
      case "CANCELLED":
      case "DEBIT":
        return theme.colors.dangerLight;
      case "RESERVED":
      case "BOOKED":
        return theme.colors.warningLight;
      default:
        return theme.colors.surfaceAlt;
    }
  }};
  color: ${({ status, theme }) => {
    switch (status) {
      case "ACTIVE":
      case "AVAILABLE":
      case "CONFIRMED":
      case "CREDIT":
        return theme.colors.success;
      case "CANCELLED":
      case "DEBIT":
        return theme.colors.danger;
      case "RESERVED":
      case "BOOKED":
        return theme.colors.warning;
      default:
        return theme.colors.textMuted;
    }
  }};
  border: 1px solid
    ${({ status, theme }) => {
      switch (status) {
        case "ACTIVE":
        case "AVAILABLE":
        case "CONFIRMED":
        case "CREDIT":
          return "rgba(22, 163, 74, 0.2)";
        case "CANCELLED":
        case "DEBIT":
          return "rgba(220, 38, 38, 0.2)";
        case "RESERVED":
        case "BOOKED":
          return "rgba(217, 119, 6, 0.2)";
        default:
          return theme.colors.border;
      }
    }};
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

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const PaginationContainer = styled(FlexRow)`
  margin-top: ${({ theme }) => theme.spacing.md};
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;
