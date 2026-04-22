import { ShoppingBag, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;
  const { totalItems, toggleCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/about', label: 'About' },
  ];

  return (
    <>
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-4xl">
        <nav className="bg-white/95 backdrop-blur-md rounded-full px-6 py-4 flex items-center justify-between shadow-lg border border-white/50">
          <Link
            to="/"
            className="text-xl md:text-2xl font-bold tracking-[0.25em] text-[#722F38] cursor-pointer"
          >
            SECERA
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  path === link.to
                    ? 'text-[#722F38]'
                    : 'text-[#3A3A3A]/70 hover:text-[#722F38]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative text-[#722F38] hover:opacity-70 transition-opacity"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-[#722F38] text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] min-h-[18px]">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-[#722F38] hover:opacity-70 transition-opacity"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </div>

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
                  className={`text-base font-medium transition-colors py-2 ${
                    path === link.to
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
