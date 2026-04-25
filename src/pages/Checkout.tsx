import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Truck, MessageCircle, CreditCard, Loader2, MapPin, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../data/products';
import { ShippingInfo, generateWhatsAppMessage, openWhatsApp } from '../utils/whatsapp';
import { createOrder, searchDestination, getShippingCost, getSettings } from '../utils/api';
import AuthModal from '../components/AuthModal';

type Step = 'cart' | 'shipping' | 'confirm';

interface Suggestion {
  id: number;
  label: string;
  city_name: string;
  district_name: string;
  subdistrict_name: string;
  province_name: string;
  zip_code: string;
}

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user, isLoggedIn } = useAuth();
  const [step, setStep] = useState<Step>('cart');
  const [shipping, setShipping] = useState<ShippingInfo>({
    name: '', phone: '', address: '', city: '', postalCode: '', notes: '',
  });
  const [sent, setSent] = useState(false);
  const [lastMessage, setLastMessage] = useState('');
  const [lastOrderTotal, setLastOrderTotal] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Settings state
  const [storeSettings, setStoreSettings] = useState<any>({});
  
  // Search/Autocomplete state
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDestinationId, setSelectedDestinationId] = useState<number | null>(null);
  
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingServices, setShippingServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState('');
  const [loadingCost, setLoadingCost] = useState(false);
  const [shippingError, setShippingError] = useState('');
  
  const searchRef = useRef<HTMLDivElement>(null);
  const discount = 0;
  const total = subtotal - discount + shippingCost;

  // Fetch Settings
  useEffect(() => {
    getSettings().then(setStoreSettings);
  }, []);

  // Click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Pre-fill from logged-in user
  useEffect(() => {
    if (isLoggedIn && user) {
      setShipping(prev => ({ ...prev, name: prev.name || user.name || '', phone: prev.phone || user.phone || '', address: prev.address || user.address || '' }));
    }
  }, [isLoggedIn, user]);

  // Search logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 3 && !selectedDestinationId) {
        setIsSearching(true);
        const results = await searchDestination(searchQuery);
        setSuggestions(results);
        setShowSuggestions(true);
        setIsSearching(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedDestinationId]);

  const handleSelectSuggestion = (s: Suggestion) => {
    setSearchQuery(s.label);
    setSelectedDestinationId(s.id);
    setShipping(prev => ({ ...prev, city: s.label, postalCode: s.zip_code }));
    setShowSuggestions(false);
    fetchShippingCost(s.id);
  };

  const fetchShippingCost = async (destId: number) => {
    setLoadingCost(true);
    setShippingError('');
    const totalWeight = items.reduce((sum, item) => sum + (item.quantity * 200), 0) || 500;
    const originId = storeSettings.shipping_origin_id || '69220'; // Fallback
    try {
      const data = await getShippingCost(originId, destId, totalWeight);
      if (data && data.length > 0 && data[0].costs) {
        setShippingServices(data[0].costs);
        if (data[0].costs.length > 0) {
          const svc = data[0].costs[0];
          setSelectedService(svc.service);
          setShippingCost(svc.cost[0]?.value || 0);
        } else setShippingError('Layanan J&T tidak tersedia.');
      } else setShippingError('Gagal hitung ongkir.');
    } catch (err) { setShippingError('Koneksi gagal.'); }
    setLoadingCost(false);
  };

  function handleServiceChange(service: string) {
    setSelectedService(service);
    const svc = shippingServices.find((s: any) => s.service === service);
    if (svc) setShippingCost(svc.cost[0]?.value || 0);
  }

  function handleShippingSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDestinationId) {
      setShippingError('Silakan pilih wilayah dari hasil pencarian.');
      return;
    }
    setStep('confirm');
  }

  async function handleSendWhatsApp() {
    try {
      const orderData = {
        total_amount: total, shipping_cost: shippingCost, discount_amount: discount, shipping_name: shipping.name, shipping_phone: shipping.phone, shipping_address: shipping.address, shipping_city: shipping.city, shipping_postal_code: shipping.postalCode, shipping_city_id: selectedDestinationId, notes: shipping.notes, status: 'pending'
      };
      await createOrder(orderData, items);
      const message = generateWhatsAppMessage(items, shipping, subtotal, shippingCost, discount);
      setLastMessage(message); setLastOrderTotal(total); openWhatsApp(message, storeSettings.whatsapp_number); setSent(true); clearCart();
    } catch (err) { alert('Gagal buat pesanan.'); }
  }

  if (items.length === 0 && !sent) {
    return <div className="min-h-screen bg-[#F9F9F9] pt-32 pb-24 px-6 flex flex-col items-center justify-center text-center"><h1 className="text-3xl font-serif text-[#722F38] mb-4">Keranjang Kosong</h1><p className="text-[#3A3A3A]/60 mb-8">Belum ada produk.</p><Link to="/shop" className="bg-[#722F38] text-white px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-[#5a252d] transition-colors">Lihat Koleksi</Link></div>;
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] pt-28 pb-24 px-6 font-sans">
        <div className="max-w-md mx-auto text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-serif text-[#722F38] mb-3">Pesanan Terkirim!</h1>
            <p className="text-[#3A3A3A]/70 text-sm leading-relaxed mb-8">Detail pesanan Anda telah dikirim ke WhatsApp admin.</p>
            
            <button 
              onClick={() => openWhatsApp(lastMessage, storeSettings.whatsapp_number)} 
              className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-4 rounded-2xl uppercase tracking-wider transition-all shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 mb-10"
            >
              <MessageCircle className="w-5 h-5" /> Kirim Pesan Ulang
            </button>
            
            <div className="bg-white rounded-[2rem] p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 text-left mb-8">
              <h3 className="text-[#722F38] font-bold text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Informasi Pembayaran
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Metode Pembayaran</p>
                  <div className="text-sm text-[#3A3A3A] whitespace-pre-wrap leading-relaxed">
                    {storeSettings.bank_account_info || 'Bank BCA\n1234567890\na.n. SECERA OFFICIAL'}
                  </div>
                </div>
                <div className="bg-[#722F38]/5 rounded-xl p-4 flex justify-between items-center">
                  <span className="text-xs font-medium text-[#722F38]">Total Pembayaran:</span>
                  <span className="text-lg font-bold text-[#722F38]">{formatPrice(lastOrderTotal)}</span>
                </div>
              </div>
            </div>
          </motion.div>
          <Link to="/shop" className="text-[#722F38] text-sm font-bold uppercase tracking-widest hover:underline transition-all">← Kembali Belanja</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] pt-28 pb-24 px-4 md:px-6 font-sans">
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onContinueAsGuest={() => setShowAuthModal(false)} />}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-10">
          {[{ key: 'cart', label: 'Keranjang', icon: '1' }, { key: 'shipping', label: 'Pengiriman', icon: '2' }, { key: 'confirm', label: 'Konfirmasi', icon: '3' }].map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              {i > 0 && <div className={`w-8 h-px ${['shipping', 'confirm'].indexOf(step) >= i ? 'bg-[#722F38]' : 'bg-[#722F38]/20'}`} />}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === s.key ? 'bg-[#722F38] text-white' : ['cart', 'shipping', 'confirm'].indexOf(step) > ['cart', 'shipping', 'confirm'].indexOf(s.key as Step) ? 'bg-[#722F38]/20 text-[#722F38]' : 'bg-[#722F38]/10 text-[#722F38]/40'}`}>{s.icon}</div>
              <span className={`text-xs font-medium hidden sm:block ${step === s.key ? 'text-[#722F38]' : 'text-[#3A3A3A]/50'}`}>{s.label}</span>
            </div>
          ))}
        </div>

        {step === 'cart' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-serif text-[#722F38] mb-6">Ringkasan Pesanan</h1>
            {!isLoggedIn && (
              <div className="bg-[#722F38]/5 rounded-2xl p-5 mb-6 flex items-center justify-between">
                <p className="text-sm text-[#722F38]">Masuk untuk checkout lebih cepat</p>
                <button onClick={() => setShowAuthModal(true)} className="text-sm font-bold text-[#722F38] border border-[#722F38]/20 px-4 py-2 rounded-xl hover:bg-[#722F38]/10 transition-colors shrink-0 ml-4">Masuk</button>
              </div>
            )}
            <div className="space-y-3 mb-8">
              {items.map((item) => (
                <div key={item.sku} className="flex gap-4 bg-white rounded-2xl p-4 shadow-sm">
                  <div className="w-16 h-20 rounded-xl overflow-hidden bg-[#F9F9F9] shrink-0">
                    <img src={item.image} alt={item.productName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-[#3A3A3A]">{item.productName}</h3>
                    <p className="text-xs text-[#3A3A3A]/60">{item.color} · {item.option} · x{item.quantity}</p>
                    <p className="text-sm font-semibold text-[#722F38] mt-1">{formatPrice((item.promoPrice ?? item.price) * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3 mb-6">
              <div className="flex justify-between text-sm"><span className="text-[#3A3A3A]/70">Subtotal</span><span className="text-[#3A3A3A]">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[#3A3A3A]/70 flex items-center gap-1"><Truck className="w-4 h-4" /> Ongkir (J&T)</span><span className="text-[#3A3A3A]/50 text-xs italic">Dihitung otomatis</span></div>
            </div>
            <button onClick={() => setStep('shipping')} className="w-full bg-[#722F38] hover:bg-[#5a252d] text-white text-sm font-bold py-4 rounded-xl uppercase tracking-wider transition-colors">Lanjut ke Pengiriman</button>
          </motion.div>
        )}

        {step === 'shipping' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={() => setStep('cart')} className="flex items-center gap-2 text-sm text-[#722F38] mb-6 hover:opacity-70"><ArrowLeft className="w-4 h-4" /> Kembali</button>
            <h1 className="text-2xl font-serif text-[#722F38] mb-6">Informasi Pengiriman</h1>
            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <div><label className="text-xs font-medium text-[#3A3A3A]/70 mb-1 block">Nama Lengkap *</label><input required value={shipping.name} onChange={(e) => setShipping({ ...shipping, name: e.target.value })} className="w-full bg-white rounded-xl px-4 py-3 text-sm text-[#3A3A3A] border border-[#722F38]/10 outline-none" /></div>
              <div><label className="text-xs font-medium text-[#3A3A3A]/70 mb-1 block">No. HP / WhatsApp *</label><input required type="tel" value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} placeholder="08xxxxxxxxxx" className="w-full bg-white rounded-xl px-4 py-3 text-sm text-[#3A3A3A] border border-[#722F38]/10 outline-none" /></div>
              <div><label className="text-xs font-medium text-[#3A3A3A]/70 mb-1 block">Alamat Lengkap *</label><textarea required value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} rows={2} className="w-full bg-white rounded-xl px-4 py-3 text-sm text-[#3A3A3A] border border-[#722F38]/10 outline-none resize-none" /></div>

              {/* Autocomplete Search */}
              <div ref={searchRef} className="relative">
                <label className="text-xs font-medium text-[#3A3A3A]/70 mb-1 block">Cari Wilayah (Kecamatan/Kota) *</label>
                <div className="relative">
                  <input 
                    required 
                    value={searchQuery} 
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedDestinationId(null);
                      setShippingServices([]);
                      setShippingCost(0);
                    }}
                    onFocus={() => searchQuery.length >= 3 && setShowSuggestions(true)}
                    placeholder="Contoh: Kediri, Lakarsantri, atau Surabaya" 
                    className="w-full bg-white rounded-xl pl-10 pr-4 py-3 text-sm text-[#3A3A3A] border border-[#722F38]/10 outline-none focus:border-[#722F38]/40" 
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                  {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#722F38] animate-spin" />}
                </div>
                
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -10 }}
                      onWheel={(e) => e.stopPropagation()}
                      className="absolute z-[100] w-full mt-2 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-slate-100 max-h-[280px] overflow-y-auto overscroll-contain custom-scrollbar"
                    >
                      <style>{`
                        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                        .custom-scrollbar::-webkit-scrollbar-track { background: #f9f9f9; border-radius: 0 16px 16px 0; }
                        .custom-scrollbar::-webkit-scrollbar-thumb { background: #722F38/20; border-radius: 10px; border: 2px solid #f9f9f9; }
                        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #722F38/40; }
                      `}</style>
                      {suggestions.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => handleSelectSuggestion(s)}
                          className="w-full px-5 py-4 text-left hover:bg-[#722F38]/5 flex items-start gap-3 border-b border-slate-50 last:border-0 transition-colors group"
                        >
                          <MapPin className="w-4 h-4 text-[#722F38] mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[#3A3A3A] leading-snug">{s.label}</p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {shippingError && <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-xs text-red-600">{shippingError}</div>}
              
              {shippingServices.length > 0 && !loadingCost && (
                <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
                  <div className="flex items-center gap-2 mb-3"><Truck className="w-4 h-4 text-green-600" /><span className="text-sm font-bold text-green-800">J&T Express</span></div>
                  <div className="space-y-2">
                    {shippingServices.map((svc: any) => (
                      <label key={svc.service} className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${selectedService === svc.service ? 'bg-white shadow-sm border border-green-200' : 'hover:bg-white/50'}`}>
                        <div className="flex items-center gap-3">
                          <input type="radio" name="shipping_service" value={svc.service} checked={selectedService === svc.service} onChange={() => handleServiceChange(svc.service)} />
                          <div>
                            <p className="text-sm font-medium text-[#3A3A3A]">{svc.service} — {svc.description}</p>
                            {svc.cost[0]?.etd && <p className="text-xs text-zinc-400">{svc.cost[0].etd} hari</p>}
                          </div>
                        </div>
                        <span className="text-sm font-bold text-[#722F38]">{formatPrice(svc.cost[0]?.value || 0)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <button type="submit" disabled={!selectedDestinationId || loadingCost || shippingServices.length === 0} className="w-full bg-[#722F38] hover:bg-[#5a252d] disabled:opacity-50 text-white text-sm font-bold py-4 rounded-xl uppercase tracking-wider transition-colors mt-4">
                {loadingCost ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Lanjut ke Konfirmasi'}
              </button>
            </form>
          </motion.div>
        )}

        {step === 'confirm' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={() => setStep('shipping')} className="flex items-center gap-2 text-sm text-[#722F38] mb-6 hover:opacity-70"><ArrowLeft className="w-4 h-4" /> Kembali</button>
            <h1 className="text-2xl font-serif text-[#722F38] mb-6">Konfirmasi Pesanan</h1>
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-4 space-y-2">
              <h3 className="text-sm font-bold text-[#3A3A3A] mb-2">Dikirim ke:</h3>
              <p className="text-sm text-[#3A3A3A]">{shipping.name}</p>
              <p className="text-sm text-[#3A3A3A]/70">{shipping.phone}</p>
              <p className="text-sm text-[#3A3A3A]/70">{shipping.address}, {shipping.city} {shipping.postalCode}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-[#3A3A3A]/70">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[#3A3A3A]/70">Ongkir (J&T {selectedService})</span><span>{formatPrice(shippingCost)}</span></div>
              <div className="flex justify-between pt-1 border-t border-[#722F38]/10"><span className="font-medium">Total</span><span className="font-bold text-[#722F38]">{formatPrice(total)}</span></div>
            </div>
            <button onClick={handleSendWhatsApp} className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-4 rounded-xl uppercase tracking-wider transition-colors flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5" /> Kirim Pesanan via WhatsApp
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
