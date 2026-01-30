import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, WishlistItem } from "@/types/api";

interface WishlistStore {
  items: (WishlistItem & { product: Product })[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: number) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product_id === product.id,
          );

          if (existingItem) {
            return state;
          }

          return {
            items: [
              ...state.items,
              {
                id: Date.now(),
                user_id: 0,
                product_id: product.id,
                product,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ],
          };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product_id !== productId),
        }));
      },
      clearWishlist: () => {
        set({ items: [] });
      },
      isInWishlist: (productId) => {
        return get().items.some((item) => item.product_id === productId);
      },
    }),
    {
      name: "wishlist-storage",
    },
  ),
);
