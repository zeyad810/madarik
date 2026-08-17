import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AccountState {
  activeAccountId: string; // "parent" or child id
  setActiveAccountId: (id: string) => void;
  resetAccount: () => void;
}

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      activeAccountId: "parent",
      setActiveAccountId: (id: string) =>
        set({ activeAccountId: id || "parent" }),
      resetAccount: () => set({ activeAccountId: "parent" }),
    }),
    {
      name: "madarik_active_account",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
