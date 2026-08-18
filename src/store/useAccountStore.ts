import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AccountState {
  activeAccountId: string; // "parent" or child id
  user_type: string; // "parent", "child", "student", "free_customer", etc.
  setActiveAccountId: (id: string, user_type?: string) => void;
  resetAccount: () => void;
}

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      activeAccountId: "parent",
      user_type: "parent",
      setActiveAccountId: (id: string, user_type?: string) =>
        set({
          activeAccountId: id || "parent",
          user_type: user_type || (id === "parent" || !id ? "parent" : "child"),
        }),
      resetAccount: () =>
        set({ activeAccountId: "parent", user_type: "parent" }),
    }),
    {
      name: "madarik_active_account",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
