import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import MyPurchases from './pages/MyPurchases';
import Success from './pages/Success';
import Cancel from './pages/Cancel';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';

export default function App() {
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar onAuthClick={setAuthModal} />

        <Routes>
          <Route path="/" element={<Home onAuthRequired={() => setAuthModal('login')} />} />
          <Route path="/purchases" element={<MyPurchases />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/refund" element={<RefundPolicy />} />
        </Routes>

        {authModal && (
          <AuthModal
            mode={authModal}
            onClose={() => setAuthModal(null)}
            onSwitch={setAuthModal}
          />
        )}
      </BrowserRouter>
    </AuthProvider>
  );
}
