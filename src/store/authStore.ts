import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthResponse } from "../pages/auth/auth.interface";

type User = AuthResponse['data']['user'];

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setToken: (token: string, refreshToken?: string, user?: User) => void;
  setUser: (user: User) => void;
  getToken: () => string | null;
  getRefreshToken: () => string | null;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      setToken: (token: string, newRefreshToken?: string, user?: User) =>
        set((state) => ({
          token,
          refreshToken:
            newRefreshToken !== undefined
              ? newRefreshToken
              : state.refreshToken,
          ...(user && { user }),
          isAuthenticated: true,
        })),
      setUser: (user: User) => set({ user }),
      getToken: () => get().token,
      getRefreshToken: () => get().refreshToken,
      logout: () =>
        set({ token: null, refreshToken: null, user: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
