export interface CartItem {
  id: string;
  quantity: number;
}

export interface CartStore {
  items: CartItem[];
}

export const initialCartState: CartStore = {
  items: [],
};
