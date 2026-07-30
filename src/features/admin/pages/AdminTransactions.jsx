import { useState, useEffect } from "react";
import styled from "styled-components";
import { getAdminTransactions } from "../api/adminTransactionsService";
import {
  PageContainer,
  Card,
  TableWrapper,
  Table,
  Input,
  Select,
  Label,
  Button,
  SecondaryButton,
  Badge,
  FlexRow,
  PaginationContainer,
} from "../../../components/ui";

const PageTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });
  const [page, setPage] = useState(1);

  const [userIdInput, setUserIdInput] = useState("");
  const [typeInput, setTypeInput] = useState("");
  const [reasonInput, setReasonInput] = useState("");

  const [filters, setFilters] = useState({ userId: "", type: "", reason: "" });

  const fetchTransactions = async (p, currentFilters) => {
    try {
      const res = await getAdminTransactions(p, 20, currentFilters);
      if (res.success) {
        setTransactions(res.data.transactions);
        setPagination(res.data.pagination);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchTransactions(page, filters);
  }, [page, filters]);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setFilters({
      userId: userIdInput.trim(),
      type: typeInput,
      reason: reasonInput,
    });
    setPage(1);
  };

  return (
    <PageContainer>
      <PageTitle>Admin Transactions Dashboard</PageTitle>

      <Card style={{ marginBottom: "20px" }}>
        <form onSubmit={handleApplyFilters}>
          <FlexRow gap="12px" style={{ alignItems: "flex-end" }}>
            <div style={{ flex: 1, minWidth: "140px" }}>
              <Label htmlFor="txUserId">User ID</Label>
              <Input
                id="txUserId"
                type="text"
                value={userIdInput}
                onChange={(e) => setUserIdInput(e.target.value)}
                placeholder="User ID"
              />
            </div>
            <div style={{ flex: 1, minWidth: "140px" }}>
              <Label htmlFor="txType">Type</Label>
              <Select
                id="txType"
                value={typeInput}
                onChange={(e) => setTypeInput(e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="">All Types</option>
                <option value="CREDIT">CREDIT</option>
                <option value="DEBIT">DEBIT</option>
              </Select>
            </div>
            <div style={{ flex: 1, minWidth: "140px" }}>
              <Label htmlFor="txReason">Reason</Label>
              <Select
                id="txReason"
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="">All Reasons</option>
                <option value="TOPUP">TOPUP</option>
                <option value="BOOKING">BOOKING</option>
                <option value="REFUND">REFUND</option>
              </Select>
            </div>
            <Button type="submit">Apply Filters</Button>
          </FlexRow>
        </form>
      </Card>

      {transactions.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "30px 20px" }}>
          <p style={{ color: "#64748b" }}>No transactions found.</p>
        </Card>
      ) : (
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>User Name</th>
                <th>User Email</th>
                <th>Type</th>
                <th>Amount (₹)</th>
                <th>Reason</th>
                <th>Balance After (₹)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id || tx._id}>
                  <td style={{ fontWeight: 600 }}>{tx.user?.name}</td>
                  <td>{tx.user?.email}</td>
                  <td>
                    <Badge status={tx.type}>{tx.type}</Badge>
                  </td>
                  <td style={{ fontWeight: 700, color: tx.type === "CREDIT" ? "#16a34a" : "#dc2626" }}>
                    {tx.type === "CREDIT" ? "+" : "-"}₹{(tx.amount / 100).toFixed(2)}
                  </td>
                  <td>{tx.reason}</td>
                  <td>₹{(tx.balanceAfter / 100).toFixed(2)}</td>
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
