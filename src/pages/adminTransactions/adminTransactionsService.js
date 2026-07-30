import httpService from "../../api/httpService";

export const getAdminTransactions = (
  page = 1,
  limit = 20,
  currentFilters = {},
) => {
  let url = `/api/wallet/admin/transactions?page=${page}&limit=${limit}`;
  if (currentFilters.userId)
    url += `&userId=${encodeURIComponent(currentFilters.userId)}`;
  if (currentFilters.type)
    url += `&type=${encodeURIComponent(currentFilters.type)}`;
  if (currentFilters.reason)
    url += `&reason=${encodeURIComponent(currentFilters.reason)}`;

  return httpService.get(url);
};
