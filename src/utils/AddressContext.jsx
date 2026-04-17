import React, { createContext, useState, useContext } from "react";

const AddressContext = createContext();

export const useAddressContext = () => useContext(AddressContext);

export const AddressProvider = ({ children }) => {
  const [addressDataContext, setAddressDataContextState] = useState(() => {
    const stored = sessionStorage.getItem("selectedAddress");
    return stored ? JSON.parse(stored) : null;
  });

  const setAddressDataContext = (data) => {
    setAddressDataContextState(data);
    sessionStorage.setItem("selectedAddress", JSON.stringify(data)); // Save to sessionStorage
  };

  const clearAddressDataContext = () => {
    setAddressDataContextState(null);
    sessionStorage.removeItem("selectedAddress");
  };

  return (
    <AddressContext.Provider
      value={{
        addressDataContext,
        setAddressDataContext,
        clearAddressDataContext,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};
