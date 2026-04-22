import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const { items, isOpen, setCartOpen, removeItem, updateQuantity, totalItems, subtotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            onClick={() => setCartOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#F9F4ED] z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#722F38]/10">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[#722F38]" />
                <h2 className="text-lg font-serif text-[#722F38]">
                  Keranjang ({totalItems})
                </h2>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#722F38]/10 transition-colors"
              >
                <X className="w-5 h-5 text-[#3A3A3A]" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                  <ShoppingBag className="w-16 h-16 text-[#722F38]/20" />
                  <p className="text-[#3A3A3A]/60 font-medium">Keranjang Anda kosong</p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="text-sm text-[#722F38] underline underline-offset-4 hover:opacity-70"
                  >
                    Lanjutkan Belanja
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.sku}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="flex gap-4 bg-white rounded-2xl p-3 shadow-sm"
                    >
                      <div className="w-20 h-24 rounded-xl overflow-hidden bg-[#F9F4ED] shrink-0">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 flex flex-col min-w-0">
                        <h3 className="text-sm font-medium text-[#3A3A3A] truncate">
                          {item.productName}
                        </h3>
                        <p className="text-xs text-[#3A3A3A]/60 mt-0.5">
                          {item.color} · {item.option}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {item.promoPrice && (
                            <span className="text-xs text-[#3A3A3A]/40 line-through">
                              {formatPrice(item.price)}
                            </span>
                          )}
                          <span className="text-sm font-semibold text-[#722F38]">
                            {formatPrice(item.promoPrice ?? item.price)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-2">
                          <div className="flex items-center gap-2 border border-[#722F38]/15 rounded-full px-2 py-1">
                            <button
                              onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                              className="text-[#722F38] hover:opacity-70"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-medium text-[#3A3A3A] w-5 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                              className="text-[#722F38] hover:opacity-70"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.sku)}
                            className="text-xs text-[#3A3A3A]/40 hover:text-red-500 transition-colors"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-[#722F38]/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#3A3A3A]/70">Subtotal</span>
                  <span className="text-lg font-serif font-semibold text-[#722F38]">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p className="text-xs text-[#3A3A3A]/50">
                  Ongkir dihitung saat checkout. Gratis ongkir untuk pesanan di atas Rp 200.000.
                </p>
                <Link
                  to="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="block w-full bg-[#722F38] hover:bg-[#5a252d] text-white text-sm font-bold py-4 px-6 rounded-xl uppercase tracking-wider transition-colors text-center"
                >
                  Checkout via WhatsApp
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
