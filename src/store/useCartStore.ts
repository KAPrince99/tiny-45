import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItemProps } from "@/types/types";

interface CartState {
  // State
  bagClicked: boolean;
  isSheetOpen: boolean;
  sizeError: string | null;
  localCart: CartItemProps[];
  sumOfCartItems: number | null;

  // Actions
  setBagClicked: (clicked: boolean) => void;
  setIsSheetOpen: (open: boolean) => void;
  setSizeError: (error: string | null) => void;
  setSumOfCartItems: (sum: number | null) => void;

  addToCart: (item: Omit<CartItemProps, "quantity">) => void;
  removeFromCart: (itemId: string, itemSize: string) => void;
  updateQuantity: (itemId: string, itemSize: string, quantity: number) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial State
      bagClicked: false,
      isSheetOpen: false,
      sizeError: null,
      localCart: [],
      sumOfCartItems: null,

      // Simple Setters
      setBagClicked: (bagClicked) => set({ bagClicked }),
      setIsSheetOpen: (isSheetOpen) => set({ isSheetOpen }),
      setSizeError: (sizeError) => set({ sizeError }),
      setSumOfCartItems: (sumOfCartItems) => set({ sumOfCartItems }),

      // Cart Logic
      addToCart: (newItem) => {
        const { localCart } = get();
        const existingItem = localCart.find(
          (item) => item.id === newItem.id && item.size === newItem.size,
        );

        if (existingItem) {
          set({
            localCart: localCart.map((item) =>
              item.id === newItem.id && item.size === newItem.size
                ? { ...item, quantity: (item.quantity || 1) + 1 }
                : item,
            ),
          });
        } else {
          set({
            localCart: [
              ...localCart,
              { ...newItem, quantity: 1 } as CartItemProps,
            ],
          });
        }
      },

      removeFromCart: (itemId, itemSize) => {
        set({
          localCart: get().localCart.filter(
            (item) => !(item.id === itemId && item.size === itemSize),
          ),
        });
      },

      updateQuantity: (itemId, itemSize, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(itemId, itemSize);
        } else {
          set({
            localCart: get().localCart.map((item) =>
              item.id === itemId && item.size === itemSize
                ? { ...item, quantity }
                : item,
            ),
          });
        }
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist the cart, not the UI states like errors or open sheets
      partialize: (state) => ({ localCart: state.localCart }),
    },
  ),
);
