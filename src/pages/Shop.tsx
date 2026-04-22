import { useState } from 'react';
import { motion } from 'motion/react';
import { products, CATEGORIES } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState('Semua');

  const filtered = activeCategory === 'Semua'
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen w-full bg-[#F9F9F9] pt-32 pb-24 px-6 md:px-12 font-sans">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#722F38] leading-tight mb-4"
          >
            Koleksi Kami
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base md:text-lg text-[#3A3A3A]/70 max-w-2xl mx-auto"
          >
            Anggun dalam Sekejap — busana modest premium yang dirancang untuk wanita modern.
          </motion.p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-[#722F38] text-white shadow-md'
                  : 'bg-white/60 text-[#3A3A3A]/70 hover:bg-white hover:text-[#722F38]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-14">
          {filtered.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
