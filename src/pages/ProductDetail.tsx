import React, { useState } from 'react';
import { Star, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams } from 'react-router-dom';

// Mock data
const product = {
  id: 1,
  name: 'Signature Ceruty Outer',
  price: 'Rp 349.000',
  rating: 5.0,
  reviews: 33,
  description: 'Outer berbahan Ceruty Babydoll Premium yang flowy dan elegan. Cocok untuk acara formal maupun kasual. Diformulasikan dengan material yang breathable, memberikan kenyamanan sepanjang hari tanpa mengorbankan gaya. Dikemas dengan rapi dan aman untuk pengiriman.',
  images: [
    'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550614000-4b95d466f21c?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1621112904887-419379ce6824?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1580651315530-69c8e0026377?q=80&w=1200&auto=format&fit=crop',
  ],
  details: [
    { title: 'MENGAPA SPESIAL', content: 'Material premium yang tidak mudah kusut dan sangat jatuh saat dikenakan. Memberikan siluet yang ramping dan elegan untuk berbagai bentuk tubuh.' },
    { title: 'CARA PERAWATAN', content: 'Cuci dengan tangan menggunakan air dingin. Jangan gunakan pemutih. Setrika dengan suhu rendah atau gunakan steamer untuk hasil terbaik.' },
    { title: 'PANDUAN UKURAN', content: 'All Size fit to XL. Lingkar Dada: 110cm, Panjang Baju: 115cm, Panjang Lengan: 55cm.' },
    { title: 'PENGIRIMAN & PENGEMBALIAN', content: 'Pengiriman gratis untuk pesanan di atas Rp 500.000. Pengembalian diterima dalam 7 hari setelah barang diterima dengan syarat tag masih terpasang.' },
  ]
};

export default function ProductDetail() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div className="min-h-screen w-full bg-[#F9F9F9] pt-28 pb-24 px-4 md:px-6 lg:px-8 font-sans">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          
          {/* Left: Images */}
          <div className="w-full lg:w-[55%] flex gap-3 lg:gap-4 h-[60vh] lg:h-[85vh] lg:sticky lg:top-28">
            {/* Thumbnails */}
            <div className="flex flex-col gap-3 overflow-y-auto no-scrollbar w-16 md:w-20 shrink-0 py-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-[3/4] w-full rounded-xl overflow-hidden transition-all duration-300 ${
                    selectedImage === idx 
                      ? 'ring-1 ring-[#6E2B30] opacity-100 scale-100' 
                      : 'opacity-40 hover:opacity-80 scale-95'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                </button>
              ))}
            </div>
            
            {/* Main Image */}
            <div 
              className="flex-1 relative rounded-[2rem] overflow-hidden bg-[#F1F2E9] cursor-zoom-in"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full"
              >
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-200 ease-out" 
                  style={{
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                    transform: isZoomed ? 'scale(2.5)' : 'scale(1)'
                  }}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </motion.div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="w-full lg:w-[45%] bg-[#F1F2E9] rounded-[2rem] p-6 md:p-10 lg:p-12 flex flex-col">
            
            {/* Rating */}
            <div className="flex items-center gap-1 text-[#6E2B30] mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
              </div>
              <span className="text-xs font-bold tracking-widest ml-2 uppercase">
                {product.rating.toFixed(1)} STARS ({product.reviews} REVIEWS)
              </span>
            </div>

            {/* Title & Desc */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#6E2B30] mb-6 leading-tight">
              {product.name}
            </h1>
            <p className="text-[#6E2B30]/80 leading-relaxed mb-6 text-sm md:text-base">
              {product.description}
            </p>

            {/* Price & Shipping */}
            <div className="text-base font-medium text-[#6E2B30] mb-2">
              {product.price} | All Size
            </div>
            <div className="text-sm text-[#6E2B30]/60 mb-8">
              Gratis ongkir ke seluruh Indonesia untuk pesanan di atas Rp 500.000
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between border border-[#6E2B30]/20 rounded-full w-32 px-4 py-2.5 mb-8 bg-transparent">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                className="text-[#6E2B30] hover:opacity-70 transition-opacity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-[#6E2B30] font-medium text-sm">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)} 
                className="text-[#6E2B30] hover:opacity-70 transition-opacity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 mb-12">
              <div className="flex gap-3">
                <button className="flex-1 bg-white hover:bg-white/80 text-[#6E2B30] text-xs font-bold py-4 px-4 rounded-xl uppercase tracking-wider transition-colors border border-[#6E2B30]/10 shadow-sm cursor-pointer">
                  Beli di Shopee
                </button>
                <button className="flex-1 bg-white hover:bg-white/80 text-[#6E2B30] text-xs font-bold py-4 px-4 rounded-xl uppercase tracking-wider transition-colors border border-[#6E2B30]/10 shadow-sm cursor-pointer">
                  Beli di TikTok
                </button>
              </div>
              <div className="relative w-full group p-[2px] rounded-xl">
                {/* Outer Glow (Blurred) */}
                <div className="absolute inset-0 rounded-xl overflow-hidden blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#FFFFFF_50%,transparent_100%)]"></span>
                </div>

                {/* Inner Border (Sharp) */}
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                  <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#FFFFFF_50%,transparent_100%)]"></span>
                </div>

                <button className="w-full relative overflow-hidden rounded-[10px] shadow-md hover:shadow-lg transition-all bg-white cursor-pointer">
                  <div className="absolute inset-0 z-0 pointer-events-none">
                    <video 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                    >
                      <source src="https://cdn.joinvoy.com/voyage/video/voytex-MIX-homepage-desktop.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-[#F1F2E9]/20 mix-blend-overlay pointer-events-none"></div>
                  </div>

                  {/* Shimmer Sweep Effect */}
                  <div className="absolute top-0 left-0 w-full h-full -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/80 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none z-10"></div>

                  {/* Ribbon Label */}
                  <div className="absolute top-0 right-0 z-10 bg-[#6E2B30] text-[#F9F9F9] text-[10px] font-bold px-3 py-1.5 rounded-bl-[10px] shadow-sm flex items-center gap-1.5 pointer-events-none">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    UP TO 15% OFF
                  </div>

                  <div className="relative z-10 flex flex-col items-center justify-center py-4 px-4 text-[#6E2B30] min-h-[56px] pointer-events-none">
                    <span className="text-sm font-bold uppercase tracking-wider mt-1">Beli di WhatsApp</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Accordion */}
            <div className="mt-auto border-t border-[#6E2B30]/20">
              {product.details.map((detail, idx) => (
                <div key={idx} className="border-b border-[#6E2B30]/20">
                  <button 
                    onClick={() => setOpenAccordion(openAccordion === idx ? null : idx)}
                    className="w-full py-5 flex items-center justify-between text-left group"
                  >
                    <span className="text-sm font-bold tracking-wider text-[#6E2B30] group-hover:opacity-80 transition-opacity">
                      {detail.title}
                    </span>
                    <motion.div
                      animate={{ rotate: openAccordion === idx ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Plus className="w-5 h-5 text-[#6E2B30]" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openAccordion === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 text-sm text-[#6E2B30]/75 leading-relaxed pr-8">
                          {detail.content}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
