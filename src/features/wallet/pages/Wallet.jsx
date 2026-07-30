import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  getBalance,
  creditWallet,
  getWalletTransactions,
} from "../api/walletService";
import {
  PageContainer,
  Card,
  TableWrapper,
  Table,
  Input,
  Button,
  Badge,
  ErrorText,
  SuccessText,
  FlexRow,
  SecondaryButton,
  PaginationContainer,
} from "../../../components/ui";

const PageTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const BalanceCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

const BalanceLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
`;

const BalanceAmount = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.5px;
  margin-top: 2px;
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  margin-top: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text};
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
      if (res?.success || res?.balance !== undefined || res?.data?.balance !== undefined) {
        const bal = res.balance ?? res.data?.balance ?? 0;
        setBalance(bal);
      }
    } catch (err) {}
  };

  const fetchTransactions = async (p) => {
    try {
      const res = await getWalletTransactions(p, 20);
      if (res?.success || res?.transactions || res?.data?.transactions) {
        const txList = res.transactions ?? res.data?.transactions ?? [];
        const pag = res.pagination ?? res.data?.pagination;
        setTransactions(txList);
        if (pag) {
          setPagination({
            page: Number(pag.page),
            limit: Number(pag.limit),
            total: Number(pag.total),
            totalPages: Number(pag.totalPages),
          });
        }
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
      if (res?.success || res?.balanceAfter !== undefined || res?.data?.balanceAfter !== undefined) {
        const newBal = res.balanceAfter ?? res.balance ?? res.data?.balanceAfter ?? res.data?.balance;
        if (newBal !== undefined) {
          setBalance(newBal);
        } else {
          fetchBalance();
        }
        setAmount("");
        setMessage("Money added to wallet successfully");
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
          <BalanceLabel>Available Balance</BalanceLabel>
          <BalanceAmount>₹{(balance / 100).toFixed(2)}</BalanceAmount>
        </div>
      </BalanceCard>

      <Card>
        <SectionTitle style={{ marginTop: 0 }}>Add Funds</SectionTitle>
        {message && <SuccessText>{message}</SuccessText>}
        {error && <ErrorText>{error}</ErrorText>}

        <form onSubmit={handleAddMoney}>
          <FlexRow gap="8px">
            <Input
              type="number"
              step="any"
              min="1"
              placeholder="Enter amount in ₹"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              style={{ maxWidth: "260px" }}
            />
            <Button type="submit">Add Money</Button>
          </FlexRow>
        </form>
      </Card>

      <SectionTitle>Transaction History</SectionTitle>
      {transactions.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "30px 20px" }}>
          <p style={{ color: "#71717a" }}>No transactions recorded yet.</p>
        </Card>
      ) : (
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount (₹)</th>
                <th>Reason</th>
                <th>Balance After</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id || tx.id}>
                  <td>
                    <Badge status={tx.type}>{tx.type}</Badge>
                  </td>
                  <td style={{ fontWeight: 600, color: tx.type === "CREDIT" ? "#15803d" : "#18181b" }}>
                    {tx.type === "CREDIT" ? "+" : "-"}₹{(tx.amount / 100).toFixed(2)}
                  </td>
                  <td>{tx.reason}</td>
                  <td>₹{((tx.balanceAfter ?? 0) / 100).toFixed(2)}</td>
                  <td>{new Date(tx.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
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
