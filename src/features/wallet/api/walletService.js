import httpService from "../../../api/httpService";

export const getBalance = () => {
  return httpService.get("/api/wallet/balance");
};

export const creditWallet = (amount, idempotencyKey) => {
  return httpService.post(
    "/api/wallet/credit",
    { amount },
    { headers: { "Idempotency-Key": idempotencyKey } }
  );
};

export const getWalletTransactions = (page = 1, limit = 20) => {
  return httpService.get(`/api/wallet/transactions?page=${page}&limit=${limit}`);
};
