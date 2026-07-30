import { useState, useEffect } from "react";
import API from "../api/axios";

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
      const res = await API.get("/api/wallet/balance");
      if (res.data.success) {
        setBalance(res.data.data.balance);
      }
    } catch (err) {}
  };

  const fetchTransactions = async (p) => {
    try {
      const res = await API.get(`/api/wallet/transactions?page=${p}&limit=20`);
      if (res.data.success) {
        setTransactions(res.data.data.transactions);
        setPagination(res.data.data.pagination);
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
      const res = await API.post(
        "/api/wallet/credit",
        { amount: paise },
        { headers: { "Idempotency-Key": idempotencyKey } },
      );
      if (res.data.success) {
        setBalance(res.data.data.balanceAfter);
        setAmount("");
        setMessage("Money added successfully");
        fetchTransactions(page);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add money");
    }
  };

  return (
    <div>
      <h2>Wallet</h2>
      <p>Balance: ₹{(balance / 100).toFixed(2)}</p>

      <h3>Add Money</h3>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleAddMoney}>
        <input
          type="number"
          step="any"
          min="1"
          placeholder="Amount in ₹"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit">Add Money</button>
      </form>

      <h3>Transactions</h3>
      <table border="1" cellPadding="5" cellSpacing="0">
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
      </table>

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
