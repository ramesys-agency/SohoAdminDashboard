import api from "../lib/axios";
import { apiEndpoint } from "../lib/route";
import type { AuthResponse } from "../pages/auth/auth.interface";

type User = AuthResponse['data']['user'];

export const getUserProfile = async (): Promise<User> => {
  const { data } = await api.get<{ data: User }>(apiEndpoint.users.profile);
  return data.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const { data } = await api.get<{ data: User }>(apiEndpoint.users.byId(id));
  return data.data;
};
