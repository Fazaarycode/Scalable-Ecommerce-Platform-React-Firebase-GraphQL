import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set) => ({
      cart: [],
      isCartOpen: false,

      addToCart: (product) => 
        set((state) => ({
          cart: [...state.cart, product]
        })),

      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId)
        })),

      clearCart: () => set({ cart: [] }),

      toggleCart: () => 
        set((state) => ({ 
          isCartOpen: !state.isCartOpen 
        })),
    }),
    {
      name: 'cart-store',
      partialize: (state) => ({ 
        cart: state.cart
      }),
    }
  )
)