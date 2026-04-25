import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, Search, ChevronDown, ChevronUp, Truck, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyOrders, lookupGuestOrder } from '../utils/api';
import { formatPrice } from '../data/products';
import AuthModal from '../components/AuthModal';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Menunggu Pembayaran', color: 'bg-amber-100 text-amber-700', icon: Clock },
  paid: { label: 'Sudah Dibayar', color: 'bg-indigo-100 text-indigo-700 border border-indigo-200/50', icon: CheckCircle2 },
  processing: { label: 'Diproses', color: 'bg-blue-100 text-blue-700', icon: Package },
  shipped: { label: 'Dikirim', color: 'bg-purple-100 text-purple-700', icon: Truck },
  completed: { label: 'Selesai', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function MyOrders() {
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Guest lookup
  const [guestPhone, setGuestPhone] = useState('');
  const [guestOrderId, setGuestOrderId] = useState('');
  const [guestOrders, setGuestOrders] = useState<any[]>([]);
  const [guestError, setGuestError] = useState('');
  const [guestLoading, setGuestLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (isLoggedIn) {
      setLoading(true);
      getMyOrders().then(data => { setOrders(data); setLoading(false); });
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, authLoading]);

  async function handleGuestLookup(e: React.FormEvent) {
    e.preventDefault();
    setGuestError('');
    setGuestOrders([]);
    setGuestLoading(true);
    
    try {
      const result = await lookupGuestOrder(guestOrderId, guestPhone);
      if (result.success) {
        setGuestOrders(result.orders || []);
      } else {
        setGuestError(result.message || 'Pesanan tidak ditemukan');
      }
    } catch (err: any) {
      setGuestError(err.message || 'Terjadi kesalahan saat mencari pesanan');
    } finally {
      setGuestLoading(false);
    }
  }

  function renderStatus(status: string) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${config.color}`}>
        <Icon className="w-3 h-3" /> {config.label}
      </span>
    );
  }

  function renderOrderCard(order: any) {
    const isExpanded = expandedId === order.id;
    return (
      <motion.div
        key={order.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-100/50 overflow-hidden"
      >
        <button onClick={() => setExpandedId(isExpanded ? null : order.id)} className="w-full p-5 flex items-center justify-between text-left">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              {renderStatus(order.status)}
              <span className="text-[10px] text-zinc-400 font-mono">{order.id.slice(0, 8)}...</span>
            </div>
            <p className="text-sm text-[#3A3A3A] font-medium">{order.shipping_name}</p>
            <p className="text-xs text-zinc-400">{new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="text-right ml-4">
            <p className="text-sm font-bold text-[#722F38] tabular-nums">{formatPrice(order.total_amount)}</p>
            {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-300 mt-1 ml-auto" /> : <ChevronDown className="w-4 h-4 text-zinc-300 mt-1 ml-auto" />}
          </div>
        </button>

        {isExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="border-t border-slate-50 px-5 pb-5">
            <div className="pt-4 space-y-3">
              {order.items?.map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-[#3A3A3A]/70">{item.product_name || item.variant_sku} x{item.quantity}</span>
                  <span className="text-[#3A3A3A] tabular-nums">{formatPrice((item.promo_price ?? item.price) * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-slate-50 pt-3 space-y-1">
                <div className="flex justify-between text-xs text-zinc-400"><span>Ongkir</span><span>{formatPrice(order.shipping_cost)}</span></div>
                <div className="flex justify-between text-sm font-bold"><span>Total</span><span className="text-[#722F38]">{formatPrice(order.total_amount)}</span></div>
              </div>
              <div className="pt-3 border-t border-slate-50">
                <p className="text-xs text-zinc-400 mb-1">Alamat pengiriman:</p>
                <p className="text-xs text-[#3A3A3A]">{order.shipping_address}, {order.shipping_city} {order.shipping_postal_code}</p>
              </div>
              {order.tracking_number && (
                <div className="bg-purple-50 rounded-xl p-3 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-purple-600 shrink-0" />
                  <div>
                    <p className="text-xs text-purple-600 font-bold">No. Resi</p>
                    <p className="text-sm font-mono text-purple-800">{order.tracking_number}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] pt-28 pb-24 px-4 md:px-6 font-sans">
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-serif text-[#722F38] mb-2">Pesanan Saya</h1>
        <p className="text-sm text-zinc-400 mb-8">Lihat status dan riwayat pesanan Anda</p>

        {/* Logged in — show orders list */}
        {isLoggedIn && (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-[#722F38] animate-spin" /></div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20">
                <Package className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
                <p className="text-zinc-400 mb-6">Belum ada pesanan</p>
                <Link to="/shop" className="bg-[#722F38] text-white px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-[#5a252d] transition-colors">Mulai Belanja</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map(order => renderOrderCard(order))}
              </div>
            )}
          </>
        )}

        {/* Not logged in — show guest lookup + login prompt */}
        {!isLoggedIn && !authLoading && (
          <div className="space-y-6">
            {/* Login prompt */}
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <p className="text-sm text-[#3A3A3A]/70 mb-4">Masuk ke akun Anda untuk melihat seluruh riwayat pesanan</p>
              <button onClick={() => setShowAuthModal(true)} className="bg-[#722F38] text-white px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-[#5a252d] transition-colors">Masuk / Daftar</button>
            </div>

            {/* Guest lookup */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-[#3A3A3A] mb-4 flex items-center gap-2"><Search className="w-4 h-4" /> Riwayat Pesanan (Tamu)</h3>
              <form onSubmit={handleGuestLookup} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#722F38] uppercase tracking-widest ml-1">Nomor WhatsApp *</label>
                  <input type="tel" placeholder="08xxxxxxxxxx" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} required className="w-full bg-zinc-50 rounded-xl px-4 py-3 text-sm border border-transparent focus:border-[#722F38]/20 focus:bg-white outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Order ID (Opsional)</label>
                  <input type="text" placeholder="Masukkan jika ingin mencari pesanan spesifik" value={guestOrderId} onChange={(e) => setGuestOrderId(e.target.value)} className="w-full bg-zinc-50 rounded-xl px-4 py-3 text-sm border border-transparent focus:border-[#722F38]/20 focus:bg-white outline-none transition-all" />
                </div>
                {guestError && <p className="text-red-500 text-xs bg-red-50 rounded-xl py-2 px-4">{guestError}</p>}
                <button type="submit" disabled={guestLoading} className="w-full bg-[#722F38] hover:bg-[#5a252d] disabled:opacity-50 text-white text-sm font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                  {guestLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} Lihat Riwayat Pesanan
                </button>
              </form>
            </div>

            {/* Guest order results */}
            {guestOrders.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#3A3A3A] px-2 flex items-center justify-between">
                  Hasil Pencarian
                  <span className="text-xs font-normal text-zinc-400">{guestOrders.length} Pesanan</span>
                </h3>
                <div className="space-y-3">
                  {guestOrders.map(order => renderOrderCard(order))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
