import { ShoppingBag, Menu, X, User, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { getCMSContent } from '../utils/api';
import AuthModal from './AuthModal';

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;
  const { totalItems, toggleCart } = useCart();
  const { user, isLoggedIn, setShowAuthModal, showAuthModal, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [siteTitle, setSiteTitle] = useState('SECERA');
  const [scrolled, setScrolled] = useState(false);
  const [footerInfo, setFooterInfo] = useState({
    email: 'care@secera.id',
    phone: '6285750990000',
    copyright: '©Copyright 2026 Secera'
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileOpen]);

  const [slugs, setSlugs] = useState({
    shop: '/shop',
    about: '/about'
  });

  const isSolidPage = path.startsWith('/product/') || 
                      path.startsWith('/karir/') ||
                      (path.startsWith('/careers/') && path !== '/careers') ||
                      (path.split('/').length === 3 && path.split('/')[1] !== 'admin') || // Catch-all for detail pages like /shop/slug
                      ['/my-orders', '/profile', '/checkout'].includes(path);

  useEffect(() => {
    async function loadCMS() {
      // Fetch main site data for title/footer
      const mainData = await getCMSContent('main_site');
      if (mainData?.global?.siteTitle) {
        const title = mainData.global.siteTitle.split('|')[0].trim();
        setSiteTitle(title);
      }
      if (mainData?.footer) {
        setFooterInfo({
          email: mainData.footer.email || 'care@secera.id',
          phone: mainData.footer.phone || '6285750990000',
          copyright: mainData.footer.copyright || '©Copyright 2026 Secera'
        });
      }

      // Fetch individual page slugs
      const [shopData, aboutData] = await Promise.all([
        getCMSContent('shop_page'),
        getCMSContent('about_page')
      ]);

      setSlugs({
        shop: shopData?.seo?.slug ? `/${shopData.seo.slug}` : '/shop',
        about: aboutData?.seo?.slug ? `/${aboutData.seo.slug}` : '/about'
      });
    }
    loadCMS();
  }, []);

  const links = [
    { to: '/', label: 'Beranda' },
    { to: slugs.shop, label: 'Koleksi' },
    { to: '/my-orders', label: 'Pesanan Saya' },
    { to: slugs.about, label: 'Tentang' },
    ...(isLoggedIn ? [{ to: '/profile', label: 'Profil' }] : [])
  ];

  return (
    <>
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <motion.nav
          animate={{
            backgroundColor: scrolled || isSolidPage ? 'rgba(244, 244, 244, 0.98)' : 'rgba(0, 0, 0, 0)',
            borderColor: scrolled || isSolidPage ? 'rgba(38, 31, 31, 0.16)' : 'rgba(0, 0, 0, 0)',
            paddingTop: scrolled || isSolidPage ? '12px' : '16px',
            paddingBottom: scrolled || isSolidPage ? '12px' : '16px'
          }}
          className="px-[clamp(1.5rem,5vw,6rem)] flex items-center justify-between border-b relative"
        >
          <Link to="/" className="relative z-10 block">
            <img
              src={scrolled || isSolidPage ? "/Logo/LogoType-dark.svg" : "/Logo/LogoType-light.svg"}
              alt={siteTitle}
              className="h-5 md:h-6 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10 relative z-10">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-label transition-all ${path === link.to
                  ? (scrolled || isSolidPage ? 'text-[#5A252D]' : 'text-[#F9F9F9]')
                  : (scrolled || isSolidPage ? 'text-[#5A252D]/55 hover:text-[#5A252D]' : 'text-[#F9F9F9]/70 hover:text-[#F9F9F9]')
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6 relative z-10">

            <div className="flex items-center gap-3">
              {/* Cart */}
              <button
                onClick={toggleCart}
                className={`relative ${scrolled || isSolidPage ? 'text-[#5A252D] border-[#5A252D]/20 hover:bg-[#5A252D]/5' : 'text-[#F9F9F9] border-[#F9F9F9]/35 hover:bg-[#F9F9F9]/10'} transition-colors p-2.5 border`}
              >
                <ShoppingBag className="w-4 h-4" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#5A252D] text-white text-[8px] font-black flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* User / Logout */}
              {isLoggedIn ? (
                <button
                  onClick={logout}
                  className={`hidden md:flex items-center gap-2 text-label px-3 py-2 transition-all ${scrolled || isSolidPage ? 'text-[#5A252D]/60 hover:text-[#5A252D]' : 'text-[#F9F9F9]/60 hover:text-[#F9F9F9]'
                    }`}
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              ) : (
                <button onClick={() => setShowAuthModal(true)} className={`${scrolled || isSolidPage ? 'text-[#5A252D] border-[#5A252D]/20 hover:bg-[#5A252D]/5' : 'text-[#F9F9F9] border-[#F9F9F9]/35 hover:bg-[#F9F9F9]/10'} transition-colors p-2.5 border`}>
                  <User className="w-4 h-4" />
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`md:hidden ${scrolled || isSolidPage ? 'text-[#5A252D]' : 'text-[#F9F9F9]'} hover:opacity-70 transition-opacity p-2`}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </motion.nav>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-[60] bg-[#F4F4F4] md:hidden"
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#261f1f]/12">
                <span className="text-label text-[#5A252D]/70">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-[#5A252D] hover:opacity-70 transition-opacity p-2 -mr-2"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="flex flex-col gap-4">
                  {links.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={`text-label py-2 ${path === link.to
                        ? 'text-[#722F38]'
                        : 'text-[#3A3A3A]/70 hover:text-[#722F38]'
                        }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {isLoggedIn && (
                    <button
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className="text-label text-red-500 hover:text-red-600 py-2 flex items-center gap-2 border-t border-gray-100 pt-4"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile Sidebar Footer */}
              <div className="px-6 py-8 border-t border-[#261f1f]/12 bg-white/50 space-y-4">
                <div className="space-y-2">
                  <p className="text-label text-[#5A252D]/40">Hubungi Kami</p>
                  <div className="space-y-1">
                    <a href={`mailto:${footerInfo.email}`} className="block text-sm text-[#5A252D] hover:text-[#722F38] transition-colors">{footerInfo.email}</a>
                    <a href={`https://wa.me/${footerInfo.phone}`} target="_blank" rel="noopener noreferrer" className="block text-sm text-[#5A252D] hover:text-[#722F38] transition-colors">+{footerInfo.phone}</a>
                  </div>
                </div>
                <p className="text-label text-[#5A252D]/25 pt-2">{footerInfo.copyright}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
}
