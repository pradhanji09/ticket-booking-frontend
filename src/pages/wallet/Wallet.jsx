import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  getBalance,
  creditWallet,
  getWalletTransactions,
} from "./walletService";
import {
  PageContainer,
  Card,
  Table,
  Input,
  Button,
  ErrorText,
  SuccessText,
  FlexRow,
  SecondaryButton,
  PaginationContainer,
} from "../../components/ui";

const PageTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const BalanceCard = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BalanceAmount = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  margin-top: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });
  const [page, setPage] = useState(1);

  const fetchBalance = async () => {
    try {
      const res = await getBalance();
      if (res.success) {
        setBalance(res.data.balance);
      }
    } catch (err) {}
  };

  const fetchTransactions = async (p) => {
    try {
      const res = await getWalletTransactions(p, 20);
      if (res.success) {
        setTransactions(res.data.transactions);
        setPagination(res.data.pagination);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  useEffect(() => {
    fetchTransactions(page);
  }, [page]);

  const handleAddMoney = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    const paise = Math.round(parseFloat(amount) * 100);
    const idempotencyKey = crypto.randomUUID();

    try {
      const res = await creditWallet(paise, idempotencyKey);
      if (res.success) {
        setBalance(res.data.balanceAfter);
        setAmount("");
        setMessage("Money added successfully");
        fetchTransactions(page);
      }
    } catch (err) {
      setError(err.error || err.message || "Failed to add money");
    }
  };

  return (
    <PageContainer>
      <PageTitle>Wallet</PageTitle>

      <BalanceCard>
        <div>
          <span style={{ fontSize: "13px", color: "#666" }}>
            Current Balance
          </span>
          <br />
          <BalanceAmount>₹{(balance / 100).toFixed(2)}</BalanceAmount>
        </div>
      </BalanceCard>

      <Card>
        <SectionTitle style={{ marginTop: 0 }}>Add Money</SectionTitle>
        {message && <SuccessText>{message}</SuccessText>}
        {error && <ErrorText>{error}</ErrorText>}
        <form onSubmit={handleAddMoney}>
          <FlexRow gap="8px">
            <Input
              type="number"
              step="any"
              min="1"
              placeholder="Amount in ₹"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              style={{ maxWidth: "250px" }}
            />
            <Button type="submit">Add Money</Button>
          </FlexRow>
        </form>
      </Card>

      <SectionTitle>Transactions</SectionTitle>
      {transactions.length === 0 ? (
        <Card>No transactions found</Card>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount (₹)</th>
              <th>Reason</th>
              <th>Balance After (₹)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.type}</td>
                <td>₹{(tx.amount / 100).toFixed(2)}</td>
                <td>{tx.reason}</td>
                <td>₹{(tx.balanceAfter / 100).toFixed(2)}</td>
                <td>{new Date(tx.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <PaginationContainer>
        <SecondaryButton
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </SecondaryButton>
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <SecondaryButton
          disabled={page >= pagination.totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </SecondaryButton>
      </PaginationContainer>
    </PageContainer>
  );
}
