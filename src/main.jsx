import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { AddressProvider } from "./utils/AddressContext.jsx";
import { SlotProvider } from "./utils/SlotContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AddressProvider>
      <SlotProvider>
        <App />
      </SlotProvider>
    </AddressProvider>
  </StrictMode>
);
