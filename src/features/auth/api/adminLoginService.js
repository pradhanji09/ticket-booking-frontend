import httpService from "../../../api/httpService";

export const adminLoginApi = (email, password) => {
  return httpService.post("/api/auth/admin/login", { email, password });
};
