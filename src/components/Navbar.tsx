import { ShoppingBag, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { getCMSContent } from '../utils/api';

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;
  const { totalItems, toggleCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [siteTitle, setSiteTitle] = useState('SECERA');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function loadCMS() {
      const data = await getCMSContent('main_site');
      if (data?.global?.siteTitle) {
        // Use short version if possible or just the first word
        const title = data.global.siteTitle.split('|')[0].trim();
        setSiteTitle(title);
      }
    }
    loadCMS();
  }, []);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/about', label: 'About' },
  ];

  return (
    <>
      <motion.div
        initial={{ y: -100, x: '-50%', opacity: 0 }}
        animate={{ y: 0, x: '-50%', opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-8 left-1/2 z-50 w-[94%] max-w-5xl"
      >
        <motion.nav
          animate={{
            backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.80)',
            boxShadow: scrolled ? '0 25px 50px -12px rgba(114, 47, 56, 0.15)' : '0 10px 30px -5px rgba(114, 47, 56, 0.05)',
            paddingTop: scrolled ? '10px' : '14px',
            paddingBottom: scrolled ? '10px' : '14px',
            scale: scrolled ? 0.99 : 1
          }}
          className="backdrop-blur-sm rounded-full px-8 flex items-center justify-between border border-white/40 relative overflow-hidden shadow-2xl"
        >
          {/* Subtle reflection effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent pointer-events-none" />

          <Link to="/" className="relative z-10 block">
            <img src="/Logo/LogoType-dark.svg" alt={siteTitle} className="h-5 md:h-4 w-auto object-contain" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10 relative z-10">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-label transition-all hover:opacity-70 ${path === link.to
                  ? 'text-[#722F38]'
                  : 'text-[#722F38]/50 hover:text-[#722F38]'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-5 relative z-10">
            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative text-[#722F38] hover:scale-110 transition-transform p-2.5 bg-[#722F38]/5 rounded-full hover:bg-[#722F38]/10 border border-[#722F38]/5"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#722F38] text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-lg">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-[#722F38] hover:opacity-70 transition-opacity p-2"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
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
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-4xl bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6 md:hidden border border-white/50"
          >
            <div className="flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`text-base font-medium transition-colors py-2 ${path === link.to
                    ? 'text-[#722F38]'
                    : 'text-[#3A3A3A]/70 hover:text-[#722F38]'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
