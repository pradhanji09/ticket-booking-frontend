import { useState, useEffect } from "react";
import styled from "styled-components";
import { getAdminTransactions } from "../api/adminTransactionsService";
import {
  PageContainer,
  Card,
  Table,
  Input,
  Select,
  Label,
  Button,
  SecondaryButton,
  FlexRow,
  PaginationContainer,
} from "../../../components/ui";

const PageTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
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

      <Card>
        <form onSubmit={handleApplyFilters}>
          <FlexRow gap="12px" style={{ alignItems: "flex-end" }}>
            <div>
              <Label htmlFor="txUserId">User ID</Label>
              <Input
                id="txUserId"
                type="text"
                value={userIdInput}
                onChange={(e) => setUserIdInput(e.target.value)}
                placeholder="User ID"
              />
            </div>
            <div>
              <Label htmlFor="txType">Type</Label>
              <Select
                id="txType"
                value={typeInput}
                onChange={(e) => setTypeInput(e.target.value)}
              >
                <option value="">All</option>
                <option value="CREDIT">CREDIT</option>
                <option value="DEBIT">DEBIT</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="txReason">Reason</Label>
              <Select
                id="txReason"
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
              >
                <option value="">All</option>
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
        <Card>No transactions found</Card>
      ) : (
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
                <td>{tx.user?.name}</td>
                <td>{tx.user?.email}</td>
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
