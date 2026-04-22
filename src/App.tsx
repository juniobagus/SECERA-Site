import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GlobalCTA from './components/GlobalCTA';
import ScrollToTop from './components/ScrollToTop';
import CartDrawer from './components/CartDrawer';
import { getSession } from './utils/auth';
import { useState, useEffect } from 'react';

// Storefront Pages
import Home from './pages/Home';
import About from './pages/About';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminPromos from './pages/admin/AdminPromos';
import AdminOrders from './pages/admin/AdminOrders';
import AdminSettings from './pages/admin/AdminSettings';
import AdminLogin from './pages/admin/AdminLogin';
import AdminRegister from './pages/admin/AdminRegister';

function StorefrontLayout() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <Outlet />
      <GlobalCTA />
      <Footer />
    </>
  );
}

// Real auth guard
function RequireAuth({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#722F38]"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <CartProvider>
        <ScrollToTop />
        <Routes>
          {/* Admin Public Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/forgot-password" element={<div className="p-8 text-center">Forgot Password (Coming Soon)</div>} />

          {/* Admin Protected Routes */}
          <Route path="/admin" element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductForm />} />
            <Route path="products/:id/edit" element={<AdminProductForm />} />
            <Route path="promos" element={<AdminPromos />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Storefront Routes */}
          <Route element={<StorefrontLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>
        </Routes>
      </CartProvider>
    </Router>
  );
}
