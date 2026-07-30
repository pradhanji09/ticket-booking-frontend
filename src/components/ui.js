import styled from "styled-components";

export const PageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 16px;

  @media (min-width: 640px) {
    padding: 24px;
  }
`;

export const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: ${({ theme }) => theme.shadowSm};

  @media (min-width: 640px) {
    padding: 20px;
  }
`;

export const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: #ffffff;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius};
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s ease-in-out;
  outline: none;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryHover};
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

export const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  padding: 8px 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.surface};
  outline: none;
  width: 100%;
  transition: border-color 0.15s ease-in-out;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Select = styled.select`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  padding: 8px 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.surface};
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

export const FormGroup = styled.div`
  margin-bottom: 14px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: ${({ theme }) => theme.radius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: 8px;
  margin-bottom: 16px;
  background-color: ${({ theme }) => theme.colors.surface};
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;

  th,
  td {
    padding: 10px 12px;
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
  padding: 2px 6px;
  border-radius: 2px;
  font-size: 11px;
  font-weight: 600;
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
          return "rgba(21, 128, 61, 0.2)";
        case "CANCELLED":
        case "DEBIT":
          return "rgba(220, 38, 38, 0.2)";
        case "RESERVED":
        case "BOOKED":
          return "rgba(180, 83, 9, 0.2)";
        default:
          return theme.colors.border;
      }
    }};
`;

export const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 12px;
  display: block;
  margin-bottom: 8px;
`;

export const SuccessText = styled.span`
  color: ${({ theme }) => theme.colors.success};
  font-size: 12px;
  display: block;
  margin-bottom: 8px;
`;

export const FlexRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ gap }) => (gap ? gap : "8px")};
  flex-wrap: wrap;
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;
