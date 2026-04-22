import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { products, CATEGORIES, formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const { addItem } = useCart();

  const filtered = activeCategory === 'Semua'
    ? products
    : products.filter((p) => p.category === activeCategory);

  function handleQuickAdd(product: typeof products[0]) {
    const v = product.variants[0];
    if (!v) return;
    addItem({
      sku: v.sku,
      productId: product.id,
      productName: product.shortName,
      color: v.color,
      option: v.option,
      price: v.price,
      promoPrice: v.promoPrice,
      quantity: 1,
      image: v.image,
    });
  }

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
          {filtered.map((product, index) => {
            const firstVariant = product.variants[0];
            const hasPromo = firstVariant?.promoPrice;
            const colors = [...new Set(product.variants.map((v) => v.color))];

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="flex flex-col group"
              >
                {/* Image */}
                <Link
                  to={`/product/${product.id}`}
                  className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-white mb-4 block"
                >
                  {hasPromo && (
                    <div className="absolute top-3 left-3 z-10 bg-[#722F38] text-white text-[10px] font-bold px-3 py-1 rounded-full">
                      PROMO
                    </div>
                  )}
                  <img
                    src={firstVariant?.image}
                    alt={product.shortName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  {/* Quick Add overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleQuickAdd(product);
                      }}
                      className="w-full bg-white/90 backdrop-blur-sm hover:bg-white text-[#722F38] text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Tambah ke Keranjang
                    </button>
                  </div>
                </Link>

                {/* Info */}
                <Link to={`/product/${product.id}`} className="flex flex-col flex-1">
                  <span className="text-[10px] font-medium tracking-widest text-[#722F38]/50 mb-1 uppercase">
                    {product.category}
                  </span>
                  <h3 className="text-sm md:text-base font-serif text-[#722F38] mb-1.5 hover:opacity-80 transition-opacity leading-snug">
                    {product.shortName}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    {hasPromo && (
                      <span className="text-xs text-[#3A3A3A]/40 line-through">
                        {formatPrice(firstVariant.price)}
                      </span>
                    )}
                    <span className="text-sm font-semibold text-[#722F38]">
                      {formatPrice(hasPromo ? firstVariant.promoPrice! : firstVariant?.price ?? 0)}
                    </span>
                  </div>
                  {/* Color dots */}
                  <div className="flex items-center gap-1.5 mt-auto">
                    {colors.slice(0, 5).map((color) => (
                      <span
                        key={color}
                        title={color}
                        className="w-3 h-3 rounded-full border border-[#722F38]/15"
                        style={{ backgroundColor: getColorHex(color) }}
                      />
                    ))}
                    {colors.length > 5 && (
                      <span className="text-[10px] text-[#3A3A3A]/50">+{colors.length - 5}</span>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getColorHex(name: string): string {
  const map: Record<string, string> = {
    'Maroon': '#722F38',
    'Navy': '#1a2744',
    'Black': '#1a1a1a',
    'Cream': '#F5E6D3',
    'Broken White': '#F5F0E8',
    'Burgundy': '#6B1D2A',
    'Mahogany': '#4E1609',
    'Dusty': '#C4A5A0',
    'Rose': '#D4A5A5',
    'Coco Milk': '#C8A98A',
    'Baby Pink': '#F4C2C2',
    'Denim': '#5B7FA0',
    'Bone': '#E3DAC9',
    'Bata': '#B5651D',
    'Soft Yellow': '#F9E4B7',
    'Hitam': '#1a1a1a',
    'Choco Milk': '#A0785A',
  };
  return map[name] || '#C4B5A8';
}
