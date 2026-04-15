import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const products = [
  {
    id: 1,
    name: 'SIGNATURE CERUTY OUTER',
    price: 'Rp 349.000',
    description: 'Outer berbahan Ceruty Babydoll Premium yang flowy dan elegan. Cocok untuk acara formal maupun kasual.',
    image: 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?q=80&w=800&auto=format&fit=crop',
    badge: 'NEW',
  },
  {
    id: 2,
    name: 'ESSENTIAL PLEATED SKIRT',
    price: 'Rp 289.000',
    description: 'Rok plisket premium dengan potongan A-line yang memberikan siluet ramping dan nyaman dipakai seharian.',
    image: 'https://images.unsplash.com/photo-1550614000-4b95d466f21c?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'EVERYDAY INNER DRESS',
    price: 'Rp 259.000',
    originalPrice: 'Rp 299.000',
    description: 'Inner dress tanpa lengan berbahan katun rayon yang menyerap keringat. Solusi tepat untuk layering.',
    image: 'https://images.unsplash.com/photo-1621112904887-419379ce6824?q=80&w=800&auto=format&fit=crop',
    badge: '15% OFF',
  },
  {
    id: 4,
    name: 'PREMIUM SILK HIJAB',
    price: 'Rp 149.000',
    description: 'Hijab segi empat berbahan premium silk yang mudah dibentuk, tidak licin, dan memberikan kesan mewah.',
    image: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?q=80&w=800&auto=format&fit=crop',
  }
];

export default function Shop() {
  return (
    <div className="min-h-screen w-full bg-[#F9F9F9] pt-32 pb-24 px-6 md:px-12 font-sans">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#6E2B30] leading-tight mb-6"
          >
            Koleksi Kami
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-[#6E2B30]/80 max-w-3xl mx-auto leading-relaxed"
          >
            Pakaian modest yang dirancang untuk harmoni alam dan kelembutan.
            <br className="hidden md:block" />
            Kenyamanan tanpa mengorbankan estetika untuk gaya Anda setiap hari.
          </motion.p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {products.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col group"
            >
              {/* Image Container */}
              <Link to={`/product/${product.id}`} className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[#F1F2E9] mb-6 block">
                {product.badge && (
                  <div className="absolute top-4 left-4 z-10 bg-[#F9F9F9]/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold tracking-wider text-[#6E2B30]">
                    {product.badge}
                  </div>
                )}
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </Link>

              {/* Product Info */}
              <div className="flex flex-col flex-1">
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-xl font-serif text-[#6E2B30] mb-2 hover:opacity-80 transition-opacity">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-3 mb-4">
                  {product.originalPrice && (
                    <span className="text-sm text-[#6E2B30]/50 line-through">
                      {product.originalPrice}
                    </span>
                  )}
                  <span className="text-base font-medium text-[#6E2B30]">
                    {product.price}
                  </span>
                </div>
                <p className="text-sm text-[#6E2B30]/70 leading-relaxed mb-8 flex-1">
                  {product.description}
                </p>

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-auto">
                  <button className="w-full bg-[#F1F2E9] hover:bg-[#e4e6d9] text-[#6E2B30] text-xs font-bold py-3 px-4 rounded-xl uppercase tracking-wider transition-colors cursor-pointer">
                    Beli di Shopee
                  </button>
                  <button className="w-full bg-[#F1F2E9] hover:bg-[#e4e6d9] text-[#6E2B30] text-xs font-bold py-3 px-4 rounded-xl uppercase tracking-wider transition-colors cursor-pointer">
                    Beli di TikTok Shop
                  </button>
                  <div className="relative w-full group p-[2px] rounded-xl">
                    {/* Outer Glow (Blurred) */}
                    <div className="absolute inset-0 rounded-xl overflow-hidden blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                      <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#FFFFFF_50%,transparent_100%)]"></span>
                    </div>

                    {/* Inner Border (Sharp) */}
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#FFFFFF_50%,transparent_100%)]"></span>
                    </div>

                    <button className="w-full relative overflow-hidden rounded-[10px] shadow-sm hover:shadow-md transition-all bg-white cursor-pointer">
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
                      <div className="absolute top-0 right-0 z-10 bg-[#6E2B30] text-[#F9F9F9] text-[9px] font-bold px-2.5 py-1 rounded-bl-[10px] shadow-sm flex items-center gap-1.5 pointer-events-none">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                        </span>
                        UP TO 15% OFF
                      </div>

                      <div className="relative z-10 flex flex-col items-center justify-center py-3 px-4 text-[#6E2B30] min-h-[48px] pointer-events-none">
                        <span className="text-xs font-bold uppercase tracking-wider mt-1">Beli di WhatsApp</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
