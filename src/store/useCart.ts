import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  cartItemId: string; // Unique ID for the item in cart
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  modifications: string[]; // e.g. ["No Onion", "Extra Cheese"]
  specialInstructions?: string;
  image?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'cartItemId'>) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          // Check if identical item exists (same ID and modifications and instructions)
          const existingItemIndex = state.items.findIndex(
            (i) =>
              i.menuItemId === item.menuItemId &&
              JSON.stringify(i.modifications) === JSON.stringify(item.modifications) &&
              i.specialInstructions === item.specialInstructions
          );

          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += item.quantity;
            return { items: newItems };
          }

          return {
            items: [
              ...state.items,
              { ...item, cartItemId: Math.random().toString(36).substr(2, 9) },
            ],
          };
        });
      },
      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.cartItemId !== cartItemId),
        }));
      },
      updateQuantity: (cartItemId, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, quantity } : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'mfood-cart',
    }
  )
);
