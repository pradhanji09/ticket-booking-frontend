import httpService from "../../../api/httpService";

export const loginApi = (email, password) => {
  return httpService.post("/api/auth/login", { email, password });
};
