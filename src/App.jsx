
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './pages/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Deepcleaning from './pages/Deepcleaning';
import Homeinterior from './pages/Homeinterior';
import Packersmovers from './pages/Packersmovers';
import TermsAndConditions from './pages/Terms';
import PrivacyPolicy from './pages/privacypolicy';
import About from './pages/About';
import Checkout from './pages/Checkout';
import DeepCleaningPackages from './pages/DeepCleaningPackages';
import Checkoutdeepcleaning from './pages/Checkoutdeepcleaning';
import Interiorcheckout from './pages/Interiorcheckout';

function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <div style={{ marginTop: '20px' }}>
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
            <Route path="/deep-cleaning-packages" element={<DeepCleaningPackages />} />
            <Route path="/checkoutcleaning" element={<Checkoutdeepcleaning />} />
            <Route path="/interiorcheckout" element={<Interiorcheckout/>} />

          </Routes>
        </div>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;
