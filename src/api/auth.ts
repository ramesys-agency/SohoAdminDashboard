import api from "../lib/axios";
import { apiEndpoint } from "../lib/route";
import { type LoginCredentials } from "../pages/auth/auth.dto";
import { type AuthResponse } from "../pages/auth/auth.interface";

export const loginUser = async (
  credentials: LoginCredentials,
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>(
    apiEndpoint.auth.login,
    credentials,
  );
  return data;
};

export const refreshAccessToken = async (
  refreshToken: string,
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>(
    apiEndpoint.auth.refresh,
    refreshToken,
  );
  return data;
};
