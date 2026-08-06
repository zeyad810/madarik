export interface AuthStore {
  token: string | null;
}

export const initialAuthState: AuthStore = {
  token: null,
};
