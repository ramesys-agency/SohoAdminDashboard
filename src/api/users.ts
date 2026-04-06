import api from "../lib/axios";
import { apiEndpoint } from "../lib/route";

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  gender?: string;
  age?: number;
  region?: string;
  role: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface UsersMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UsersResponse {
  message: string;
  data: AdminUser[];
  meta: UsersMeta;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const getAllUsers = async (
  params: GetUsersParams = {}
): Promise<UsersResponse> => {
  const { data } = await api.get<UsersResponse>(apiEndpoint.users.adminAll, {
    params,
  });
  return data;
};
