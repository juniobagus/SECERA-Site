import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Outlet, 
  useParams, 
  useSearchParams, 
  Navigate, 
  useLocation 
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import SmoothScroll from './components/SmoothScroll';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GlobalCTA from './components/GlobalCTA';
import ScrollToTop from './components/ScrollToTop';
import CartDrawer from './components/CartDrawer';
import { Loader2 } from 'lucide-react';
import { getProductBySlug, getJobBySlug, getCMSContent } from './utils/api';

// Storefront Pages
import Home from './pages/Home';
import About from './pages/About';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import JobDetail from './pages/JobDetail';
import Careers from './pages/Careers';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminCMS from './pages/admin/AdminCMS';
import AdminSettings from './pages/admin/AdminSettings';
import AdminLogin from './pages/admin/AdminLogin';
import AdminJobs from './pages/admin/AdminJobs';
import AdminApplications from './pages/admin/AdminApplications';
import AdminLayout from './pages/admin/AdminLayout';

function StorefrontLayout() {
  const location = useLocation();
  const path = location.pathname;

  // SOLID background pages (need pt-16)
  const isSolidPage = path.startsWith('/product/') || 
                      path.startsWith('/karir/') ||
                      (path.startsWith('/careers/') && path !== '/careers') ||
                      ['/my-orders', '/profile', '/checkout'].includes(path) ||
                      path.startsWith('/admin');

  const isTransparentPage = !isSolidPage;

  return (
    <SmoothScroll>
      <div className="flex flex-col min-h-screen">
        <ScrollToTop />
        <Navbar />
        <CartDrawer />
        <div className={`flex-grow ${isTransparentPage ? 'pt-0' : 'pt-16'}`}>
          <Outlet />
        </div>
        <GlobalCTA />
        <Footer />
        <Toaster position="bottom-right" />
      </div>
    </SmoothScroll>
  );
}

function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-[#722F38] animate-spin" />
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AdminAuthProvider>
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="cms" element={<AdminCMS />} />
                <Route path="jobs" element={<AdminJobs />} />
                <Route path="applications" element={<AdminApplications />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Storefront Routes */}
              <Route element={<StorefrontLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/karir/:identifier" element={<JobDetail />} />
                <Route path="/careers/:id" element={<JobDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/my-orders" element={<MyOrders />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/:slug" element={<DynamicSlugRedirect />} />
              </Route>
            </Routes>
          </AdminAuthProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

/**
 * Handles redirects for short slugs like /kala (product), /editor (job), or /modern (tag)
 */
function DynamicSlugRedirect() {
  const { slug } = useParams();
  const [destination, setDestination] = useState<string | null>(null);

  useEffect(() => {
    async function determineDestination() {
      if (!slug) return;
      
      try {
        const lowerSlug = slug.toLowerCase();

        // 0. Check for custom page slugs (About, Shop, Careers)
        const [shopData, aboutData, careerData] = await Promise.all([
          getCMSContent('shop_page'),
          getCMSContent('about_page'),
          getCMSContent('career_page')
        ]);

        if (aboutData?.seo?.slug?.toLowerCase() === lowerSlug) {
          setDestination('/about');
          return;
        }
        if (shopData?.seo?.slug?.toLowerCase() === lowerSlug) {
          setDestination('/shop');
          return;
        }
        if (careerData?.seo?.slug?.toLowerCase() === lowerSlug) {
          setDestination('/careers');
          return;
        }

        // 1 & 2. Check Product and Job in parallel
        const [product, job] = await Promise.all([
          getProductBySlug(slug),
          getJobBySlug(slug)
        ]);

        if (product) {
          setDestination(`/product/${product.id}`);
          return;
        }

        if (job) {
          setDestination(`/careers/${job.id}`);
          return;
        }

        // Default: Treat as a shop tag filter
        setDestination(`/shop?tag=${slug}`);
      } catch (error) {
        console.error('Error resolving slug:', error);
        setDestination('/shop'); // Fallback
      }
    }

    determineDestination();
  }, [slug]);

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-[#722F38] animate-spin" />
      </div>
    );
  }

  if (destination === '/about') return <About />;
  if (destination === '/shop') return <Shop />;
  if (destination === '/careers') return <Careers />;
  if (destination?.startsWith('/careers/')) return <JobDetail />;
  if (destination?.startsWith('/product/')) return <ProductDetail />;

  return <Navigate to={destination} replace />;
}
