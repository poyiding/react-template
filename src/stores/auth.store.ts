import { create, type StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { CurrentUser, LoginResult } from "@/types/auth";

type AuthState = {
  token: string | null;
  user: CurrentUser | null;
  login: (result: LoginResult) => void;
  logout: () => void;
};

const createAuthSlice: StateCreator<AuthState> = (set) => ({
  token: null,
  user: null,
  login: (result) =>
    set({
      token: result.token,
      user: result.user,
    }),
  logout: () =>
    set({
      token: null,
      user: null,
    }),
});

const persistedAuthSlice = persist(createAuthSlice, {
  name: "react-template-auth",
  storage: createJSONStorage<AuthState>(() => localStorage),
}) as StateCreator<AuthState>;

export const useAuthStore = create<AuthState>()(persistedAuthSlice);
