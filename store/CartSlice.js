import { create } from "zustand";

const useCartStore = create((set, get) => ({
  cart: [],
  databaseCache: [],

  //----------------------add to cache
  addToCache: (product) => {
    const cache = get().databaseCache;
    const exists = cache.find((item) => item.$id === product.$id);

    if (!exists) {
      set({ databaseCache: [...cache, product] });
    }
  },

  //-----------------add to cart

  addToCart: (product) => {
    const cart = get().cart;
    const existingProduct = cart.find((item) => item.$id === product.$id);
    if (existingProduct) {
      set({
        cart: cart.map((item) =>
          item.$id === product.$id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      });
    } else {
      set({ cart: [...cart, { ...product, quantity: 1 }] });
    }
  },

  //--------------------------remove from cart

  removeFromCart: (productId) => {
    set({ cart: get().cart.filter((item) => item.$id !== productId) });
  },

  //------------------------increase quantity

  increaseQuantity: (productId) => {
    set({
      cart: get().cart.map((item) =>
        item.$id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    });
  },

  //---------------------decrease quantity

  decreaseQuantity: (productId) => {
    set({
      cart: get()
        .cart.map((item) =>
          item.$id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    });
  },

  //---------get total quantity

  getTotalQuantity: () => {
    return get().cart.reduce((total, product) => total + product.quantity, 0);
  },

  //--------------get total price

  getTotalPrice: () => {
    return get().cart.reduce(
      (total, product) => total + product.price * product.quantity,
      0,
    );
  },

  //-----------------clean cart

  clearCart: () => set({ cart: [] }),
}));

export default useCartStore;
