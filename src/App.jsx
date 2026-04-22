import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { CartProvider } from "./pages/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Deepcleaning from "./pages/Deepcleaning";
import Homeinterior from "./pages/Homeinterior";
import Packersmovers from "./pages/Packersmovers";
import TermsAndConditions from "./pages/Terms";
import PrivacyPolicy from "./pages/privacypolicy";
import About from "./pages/About";
import Checkout from "./pages/Checkout";
import DeepCleaningPackages from "./pages/DeepCleaningPackages";
import Checkoutdeepcleaning from "./pages/Checkoutdeepcleaning";
import Interiorcheckout from "./pages/Interiorcheckout";

import { useEffect } from "react";
import PaymentCheckout from "./pages/PaymentCheckout";
import CheckoutPaymentRouter from "./pages/CheckoutPaymentRouter";
import VendorRatings from "./pages/VendorRatings";
import VendorPayment from "./pages/VendorPayment";
import WalletRechargeLanding from "./pages/WalletRechargeLanding";
import AdminCleaningCatalogEditor from "./components/AdminCleaningCatalogEditor";

const AppRoutes = () => {
  const location = useLocation();

  // List of paths where Footer should be hidden
  const hideFooterRoutes = ["/checkout", "/vendor-ratings", "/wallet-recharge"];
  const hideRating = ["/vendor-ratings", "/wallet-recharge"];

  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);
  const shouldHideHeaderOnRatings = hideRating.includes(location.pathname);

  return (
    <>
      {!shouldHideHeaderOnRatings && <Header />}
      <div style={{ marginTop: !hideRating ? "20px" : 0 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/deepcleaning" element={<Deepcleaning />} />
          <Route path="/home-interior" element={<Homeinterior />} />
          <Route path="/packers-movers" element={<Packersmovers />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/aboutus" element={<About />} />
          <Route path="/checkout" element={<Checkout />} />
          {/* <Route
            path="/checkout/payment/:bookingId/:date/:pay_type"
            element={<PaymentCheckout />}
          /> */}
          <Route
            path="/checkout/payment/:bookingId/:date/:pay_type"
            element={<CheckoutPaymentRouter />}
          />

          <Route path="/vendor-ratings" element={<VendorRatings />} />
          <Route path="/wallet-recharge" element={<WalletRechargeLanding />} />
          <Route
            path="/deep-cleaning-packages"
            element={<DeepCleaningPackages />}
          />
          <Route path="/checkoutcleaning" element={<Checkoutdeepcleaning />} />
          <Route path="/interiorcheckout" element={<Interiorcheckout />} />
          <Route
            path="/admincleaningcatalogeditor"
            element={<AdminCleaningCatalogEditor />}
          />
        </Routes>
      </div>
      {!shouldHideFooter && <Footer />}
    </>
  );
};

function App() {
  return (
    <CartProvider>
      <Router>
        <AppRoutes />
      </Router>
    </CartProvider>
  );
}

export default App;
