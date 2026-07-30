import httpService from "../../api/httpService";

export const signupApi = (name, email, password) => {
  return httpService.post("/api/auth/signup", { name, email, password });
};
