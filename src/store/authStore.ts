import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setToken: (token: string, refreshToken?: string) => void;
  getToken: () => string | null;
  getRefreshToken: () => string | null;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      setToken: (token: string, newRefreshToken?: string) =>
        set((state) => ({
          token,
          refreshToken:
            newRefreshToken !== undefined
              ? newRefreshToken
              : state.refreshToken,
          isAuthenticated: true,
        })),
      getToken: () => get().token,
      getRefreshToken: () => get().refreshToken,
      logout: () =>
        set({ token: null, refreshToken: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
