import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartState, CartItem, Product } from '../types';

const TAX_RATE = 0.19;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product) => {
        const items = get().items;
        const existing = items.find(i => i.product.id === product.id);
        if (existing) {
          set({
            items: items.map(i =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...items, { product, quantity: 1 }] });
        }
      },

      removeItem: (productId: number) => {
        set({ items: get().items.filter(i => i.product.id !== productId) });
      },

      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map(i =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () =>
        get().items.reduce((acc, i) => acc + i.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((acc, i) => acc + i.product.price * i.quantity, 0),

      getTax: () => get().getSubtotal() * TAX_RATE,

      getTotal: () => get().getSubtotal() + get().getTax(),
    }),
    {
      name: 'intercommerce-cart',
    }
  )
);