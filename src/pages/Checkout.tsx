import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Truck, MessageCircle, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import { ShippingInfo, generateWhatsAppMessage, openWhatsApp, calculateShipping } from '../utils/whatsapp';
import { createOrder } from '../utils/api';

type Step = 'cart' | 'shipping' | 'confirm';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const [step, setStep] = useState<Step>('cart');
  const [shipping, setShipping] = useState<ShippingInfo>({
    name: '', phone: '', address: '', city: '', postalCode: '', notes: '',
  });
  const [sent, setSent] = useState(false);

  const shippingCost = calculateShipping(subtotal);
  const discount = 0;
  const total = subtotal - discount + shippingCost;

  function handleShippingSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep('confirm');
  }

  async function handleSendWhatsApp() {
    try {
      // 1. Save order to DB first
      const orderData = {
        total_amount: total,
        shipping_cost: shippingCost,
        discount_amount: discount,
        shipping_name: shipping.name,
        shipping_phone: shipping.phone,
        shipping_address: shipping.address,
        shipping_city: shipping.city,
        shipping_postal_code: shipping.postalCode,
        notes: shipping.notes,
        status: 'pending'
      };

      await createOrder(orderData, items);

      // 2. Open WhatsApp
      const message = generateWhatsAppMessage(items, shipping, subtotal, shippingCost, discount);
      openWhatsApp(message);
      
      setSent(true);
      clearCart();
    } catch (err) {
      console.error('Failed to create order in DB:', err);
      alert('Gagal membuat pesanan. Silakan coba lagi.');
    }
  }

  if (items.length === 0 && !sent) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] pt-32 pb-24 px-6 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-serif text-[#722F38] mb-4">Keranjang Kosong</h1>
        <p className="text-[#3A3A3A]/60 mb-8">Belum ada produk di keranjang Anda.</p>
        <Link to="/shop" className="bg-[#722F38] text-white px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-[#5a252d] transition-colors">
          Lihat Koleksi
        </Link>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] pt-32 pb-24 px-6 flex flex-col items-center justify-center text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-serif text-[#722F38] mb-3">Pesanan Terkirim!</h1>
          <p className="text-[#3A3A3A]/70 max-w-md">
            Detail pesanan Anda telah dikirim ke WhatsApp admin SECERA. Silakan lanjutkan pembayaran via Transfer Bank atau QRIS sesuai instruksi admin.
          </p>
        </motion.div>
        <Link to="/shop" className="bg-[#722F38] text-white px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-[#5a252d] transition-colors">
          Belanja Lagi
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] pt-28 pb-24 px-4 md:px-6 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[
            { key: 'cart', label: 'Keranjang', icon: '1' },
            { key: 'shipping', label: 'Pengiriman', icon: '2' },
            { key: 'confirm', label: 'Konfirmasi', icon: '3' },
          ].map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              {i > 0 && <div className={`w-8 h-px ${['shipping', 'confirm'].indexOf(step) >= i ? 'bg-[#722F38]' : 'bg-[#722F38]/20'}`} />}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step === s.key ? 'bg-[#722F38] text-white' :
                ['cart', 'shipping', 'confirm'].indexOf(step) > ['cart', 'shipping', 'confirm'].indexOf(s.key as Step) ? 'bg-[#722F38]/20 text-[#722F38]' : 'bg-[#722F38]/10 text-[#722F38]/40'
              }`}>
                {s.icon}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${step === s.key ? 'text-[#722F38]' : 'text-[#3A3A3A]/50'}`}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Step 1: Cart Review */}
        {step === 'cart' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-serif text-[#722F38] mb-6">Ringkasan Pesanan</h1>
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
              <div className="flex justify-between text-sm">
                <span className="text-[#3A3A3A]/70 flex items-center gap-1"><Truck className="w-4 h-4" /> Ongkir (J&T)</span>
                <span className={shippingCost === 0 ? 'text-green-600 font-medium' : 'text-[#3A3A3A]'}>{shippingCost === 0 ? 'GRATIS' : formatPrice(shippingCost)}</span>
              </div>
              <div className="border-t border-[#722F38]/10 pt-3 flex justify-between"><span className="font-medium text-[#3A3A3A]">Total</span><span className="text-lg font-serif font-bold text-[#722F38]">{formatPrice(total)}</span></div>
            </div>

            <button onClick={() => setStep('shipping')} className="w-full bg-[#722F38] hover:bg-[#5a252d] text-white text-sm font-bold py-4 rounded-xl uppercase tracking-wider transition-colors">
              Lanjut ke Pengiriman
            </button>
          </motion.div>
        )}

        {/* Step 2: Shipping */}
        {step === 'shipping' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={() => setStep('cart')} className="flex items-center gap-2 text-sm text-[#722F38] mb-6 hover:opacity-70"><ArrowLeft className="w-4 h-4" /> Kembali</button>
            <h1 className="text-2xl font-serif text-[#722F38] mb-6">Informasi Pengiriman</h1>
            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <div><label className="text-xs font-medium text-[#3A3A3A]/70 mb-1 block">Nama Lengkap *</label><input required value={shipping.name} onChange={(e) => setShipping({ ...shipping, name: e.target.value })} className="w-full bg-white rounded-xl px-4 py-3 text-sm text-[#3A3A3A] border border-[#722F38]/10 focus:border-[#722F38]/40 outline-none transition-colors" /></div>
              <div><label className="text-xs font-medium text-[#3A3A3A]/70 mb-1 block">No. HP / WhatsApp *</label><input required type="tel" value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} placeholder="08xxxxxxxxxx" className="w-full bg-white rounded-xl px-4 py-3 text-sm text-[#3A3A3A] border border-[#722F38]/10 focus:border-[#722F38]/40 outline-none transition-colors" /></div>
              <div><label className="text-xs font-medium text-[#3A3A3A]/70 mb-1 block">Alamat Lengkap *</label><textarea required value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} rows={3} className="w-full bg-white rounded-xl px-4 py-3 text-sm text-[#3A3A3A] border border-[#722F38]/10 focus:border-[#722F38]/40 outline-none transition-colors resize-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-medium text-[#3A3A3A]/70 mb-1 block">Kota *</label><input required value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} className="w-full bg-white rounded-xl px-4 py-3 text-sm text-[#3A3A3A] border border-[#722F38]/10 focus:border-[#722F38]/40 outline-none transition-colors" /></div>
                <div><label className="text-xs font-medium text-[#3A3A3A]/70 mb-1 block">Kode Pos *</label><input required value={shipping.postalCode} onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })} className="w-full bg-white rounded-xl px-4 py-3 text-sm text-[#3A3A3A] border border-[#722F38]/10 focus:border-[#722F38]/40 outline-none transition-colors" /></div>
              </div>
              <div><label className="text-xs font-medium text-[#3A3A3A]/70 mb-1 block">Catatan (opsional)</label><input value={shipping.notes} onChange={(e) => setShipping({ ...shipping, notes: e.target.value })} className="w-full bg-white rounded-xl px-4 py-3 text-sm text-[#3A3A3A] border border-[#722F38]/10 focus:border-[#722F38]/40 outline-none transition-colors" /></div>
              <button type="submit" className="w-full bg-[#722F38] hover:bg-[#5a252d] text-white text-sm font-bold py-4 rounded-xl uppercase tracking-wider transition-colors mt-4">
                Lanjut ke Konfirmasi
              </button>
            </form>
          </motion.div>
        )}

        {/* Step 3: Confirm & Send */}
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
              <h3 className="text-sm font-bold text-[#3A3A3A] mb-2">{items.length} item</h3>
              {items.map((item) => (
                <div key={item.sku} className="flex justify-between text-sm">
                  <span className="text-[#3A3A3A]/70">{item.productName} ({item.color}) x{item.quantity}</span>
                  <span className="text-[#3A3A3A]">{formatPrice((item.promoPrice ?? item.price) * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-[#722F38]/10 pt-2 mt-2 flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-bold text-[#722F38]">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Pembayaran Manual</p>
                  <p className="text-xs text-amber-700 mt-1">Setelah pesanan terkirim ke WhatsApp, admin akan mengirimkan detail pembayaran (Transfer Bank / QRIS).</p>
                </div>
              </div>
            </div>

            <button onClick={handleSendWhatsApp} className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-4 rounded-xl uppercase tracking-wider transition-colors flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Kirim Pesanan via WhatsApp
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
