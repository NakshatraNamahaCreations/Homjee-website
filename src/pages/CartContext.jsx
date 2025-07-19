import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = sessionStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const updateCartItem = (name, price, delta, service) => {
    // Validate inputs
    if (!name || typeof price !== "number" || !service) {
      console.warn("Invalid input for updateCartItem:", {
        name,
        price,
        delta,
        service,
      });
      return;
    }

    // Extract package prefix (e.g., "1 BHK Cleaning" from "1 BHK Cleaning - Premium")
    const prefix = name.split(" - ")[0];

    setCartItems((prevCart) => {
      // Find existing item with the exact same name AND service
      const exactMatch = prevCart.find(
        (item) => item.name === name && item.service === service
      );

      // Find any item with the same prefix AND service
      const prefixMatch = prevCart.find(
        (item) =>
          item.name.split(" - ")[0] === prefix && item.service === service
      );

      if (exactMatch) {
        // If exact same item exists, update quantity
        const updatedQuantity = Math.max(exactMatch.quantity + delta, 0);
        if (updatedQuantity === 0) {
          console.log(`Removing item: ${name} for service: ${service}`);
          return prevCart.filter(
            (item) => !(item.name === name && item.service === service)
          );
        }
        console.log(
          `Updating quantity for ${name} (${service}) to ${updatedQuantity}`
        );
        return prevCart.map((item) =>
          item.name === name && item.service === service
            ? { ...item, quantity: updatedQuantity }
            : item
        );
      } else if (prefixMatch && delta > 0) {
        // If a different item with the same prefix exists, replace it
        console.log(
          `Replacing item with prefix: ${prefix} for service: ${service} with ${name} (₹${price})`
        );
        return [
          ...prevCart.filter(
            (item) =>
              !(
                item.name.split(" - ")[0] === prefix && item.service === service
              )
          ),
          { name, price, quantity: 1, service },
        ];
      } else if (delta > 0) {
        // Add new item if no item with this prefix exists
        console.log(`Adding new item: ${name} for service: ${service}`);
        return [...prevCart, { name, price, quantity: 1, service }];
      }
      // Return unchanged cart if no updates needed
      console.log("No cart update needed");
      return prevCart;
    });
  };

  const getQuantity = (name, service) => {
    if (!name || !service) {
      console.warn("Invalid input for getQuantity:", { name, service });
      return 0;
    }
    const quantity =
      cartItems.find((item) => item.name === name && item.service === service)
        ?.quantity || 0;
    return quantity;
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ cartItems, updateCartItem, getQuantity, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};
