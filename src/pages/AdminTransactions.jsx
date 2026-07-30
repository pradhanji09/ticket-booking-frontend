import { useState, useEffect } from "react";
import API from "../api/axios";

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
      let url = `/api/admin/transactions?page=${p}&limit=20`;
      if (currentFilters.userId)
        url += `&userId=${encodeURIComponent(currentFilters.userId)}`;
      if (currentFilters.type)
        url += `&type=${encodeURIComponent(currentFilters.type)}`;
      if (currentFilters.reason)
        url += `&reason=${encodeURIComponent(currentFilters.reason)}`;

      const res = await API.get(url);
      if (res.data.success) {
        setTransactions(res.data.data.transactions);
        setPagination(res.data.data.pagination);
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
    <div>
      <h2>Admin Transactions Dashboard</h2>

      <form onSubmit={handleApplyFilters} style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div>
            <label>User ID: </label>
            <input
              type="text"
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
              placeholder="User ID"
            />
          </div>
          <div>
            <label>Type: </label>
            <select
              value={typeInput}
              onChange={(e) => setTypeInput(e.target.value)}
            >
              <option value="">All</option>
              <option value="CREDIT">CREDIT</option>
              <option value="DEBIT">DEBIT</option>
            </select>
          </div>
          <div>
            <label>Reason: </label>
            <select
              value={reasonInput}
              onChange={(e) => setReasonInput(e.target.value)}
            >
              <option value="">All</option>
              <option value="WALLET_TOPUP">WALLET_TOPUP</option>
              <option value="BOOKING_PAYMENT">BOOKING_PAYMENT</option>
              <option value="BOOKING_REFUND">BOOKING_REFUND</option>
              <option value="ADMIN_ADJUSTMENT">ADMIN_ADJUSTMENT</option>
            </select>
          </div>
          <button type="submit">Apply Filters</button>
        </div>
      </form>

      {transactions.length === 0 ? (
        <p>No transactions found</p>
      ) : (
        <table border="1" cellPadding="5" cellSpacing="0">
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
              <tr key={tx.id}>
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
        </table>
      )}

      <div style={{ marginTop: "10px" }}>
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          disabled={page >= pagination.totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
