import React, { createContext, useState, useContext } from "react";

const SlotContext = createContext();

export const useSelectedSlotContext = () => useContext(SlotContext);

export const SlotProvider = ({ children }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);

  const clearSlotDataContext = () => {
    setSelectedSlot(null); // Reset the context data to null
  };

  return (
    <SlotContext.Provider
      value={{
        selectedSlot,
        setSelectedSlot,
        clearSlotDataContext,
      }}
    >
      {children}
    </SlotContext.Provider>
  );
};
