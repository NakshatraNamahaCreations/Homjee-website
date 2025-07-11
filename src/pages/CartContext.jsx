
import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const updateCartItem = (name, price, delta) => {
    setCartItems((prevCart) => {
      const existing = prevCart.find((item) => item.name === name);
      if (existing) {
        const updatedQty = Math.max(existing.quantity + delta, 0);
        if (updatedQty === 0) {
          return prevCart.filter((item) => item.name !== name);
        }
        return prevCart.map((item) =>
          item.name === name ? { ...item, quantity: updatedQty } : item
        );
      } else if (delta > 0) {
        return [...prevCart, { name, quantity: 1, price }];
      }
      return prevCart;
    });
  };

  const getQuantity = (name) =>
    cartItems.find((item) => item.name === name)?.quantity || 0;

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider value={{ cartItems, updateCartItem, getQuantity, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};