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

export const updateUserProfile = async (payload: {
  fullName?: string;
  phone?: string;
  gender?: string;
  age?: number;
  region?: string;
}): Promise<User> => {
  const { data } = await api.put<{ data: User }>(apiEndpoint.users.profile, payload);
  return data.data;
};

export const updateUserAvatar = async (file: File): Promise<{ avatar: string }> => {
  const formData = new FormData();
  formData.append("avatar", file);
  const { data } = await api.patch<{ data: { avatar: string } }>(
    apiEndpoint.users.avatar,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data.data;
};

export const updatePassword = async (payload: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<any> => {
  const { data } = await api.patch(apiEndpoint.users.updatePassword, payload);
  return data;
};
