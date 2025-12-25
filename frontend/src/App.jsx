import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';

// Import your page components
import Homepage from './pages/homepage';
import ProductCollectionGrid from './pages/product-collection-grid';
import ProductDetailPage from './pages/product-detail-page';
import ShoppingCart from './pages/shopping-cart';
import CheckoutProcess from './pages/checkout-process';
import UserAuth from './pages/user-auth';
import ForgotPassword from './pages/user-auth/ForgotPassword';
import UserAccountDashboard from './pages/user-account-dashboard';
import AdminLogin from './pages/admin-login';
import AdminPanel from './pages/admin-panel';
import AdminDashboard from './pages/admin-dashboard';
import BannerPreview from './pages/BannerPreview';
import AboutPage from './pages/about';
import ContactPage from './pages/contact';
import CategoriesPage from './pages/categories';
import NotFound from './pages/NotFound';

// Protected Route Component
const ProtectedAdminRoute = ({ children }) => {
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || 'null');
  const sessionData = localStorage.getItem('neenu_auth_session');
  
  let isValidAdmin = false;
  
  // Trust backend-issued admin role persisted at login
  if (adminUser && (adminUser.role || '').toLowerCase() === 'admin') {
    isValidAdmin = true;
  } else if (sessionData) {
    try {
      const session = JSON.parse(sessionData);
      // Minimal fallback; main trust is adminUser role
      isValidAdmin = !!session?.userId;
    } catch (error) {
      console.error('Invalid session data:', error);
    }
  }
  
  if (!isValidAdmin) {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('neenu_auth_session');
    return <Navigate to="/admin-login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <div className="App">
              <ErrorBoundary>
                <ScrollToTop />
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/homepage" element={<Homepage />} />
                <Route path="/banner-preview" element={<BannerPreview />} />
                <Route path="/product-collection-grid" element={<ProductCollectionGrid />} />
                <Route path="/product-detail-page/:id" element={<ProductDetailPage />} />
                <Route path="/product-detail-page" element={<ProductDetailPage />} />
                <Route path="/shopping-cart" element={<ShoppingCart />} />
                <Route path="/checkout-process" element={<CheckoutProcess />} />
                <Route path="/user-login" element={<UserAuth />} />
                <Route path="/user-register" element={<UserAuth />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ForgotPassword />} />
                <Route path="/user-account-dashboard" element={<UserAccountDashboard />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route 
                  path="/admin-dashboard" 
                  element={
                    <ProtectedAdminRoute>
                      <AdminDashboard />
                    </ProtectedAdminRoute>
                  } 
                />
                <Route 
                  path="/admin-panel" 
                  element={
                    <ProtectedAdminRoute>
                      <AdminPanel />
                    </ProtectedAdminRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
