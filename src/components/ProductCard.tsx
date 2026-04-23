import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Product, formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const { addItem } = useCart();
  
  // Normalize data from API or static source
  const variants = product.product_variants || product.variants || [];
  const firstVariant = variants[0];
  const shortName = product.short_name || product.shortName || '';
  const thumbnail = product.thumbnail_url || firstVariant?.image_url || firstVariant?.image;
  
  const hasPromo = variants.some((v: any) => v.promo_price || v.promoPrice);
  const colors = [...new Set(variants.map((v: any) => v.color))];

  const getColorHex = (colorName: string) => {
    const colors_map: Record<string, string> = {
      'Hitam': '#000000',
      'Black': '#000000',
      'Broken White': '#F5F5DC',
      'Navy': '#000080',
      'Maroon': '#800000',
      'Cream': '#F5F5DC',
      'Burgundy': '#800020',
      'Emerald': '#50C878',
      'Mocca': '#A38068',
      'Silver': '#C0C0C0',
      'Gold': '#FFD700',
      'Rose': '#FF007F',
      'Dusty': '#C5A3A3',
    };
    return colors_map[colorName] || '#E5E7EB';
  };

  const handleQuickAdd = () => {
    if (!firstVariant) return;
    addItem({
      sku: firstVariant.sku,
      productId: product.id,
      productName: shortName,
      color: firstVariant.color,
      option: firstVariant.option_name || firstVariant.option,
      price: firstVariant.price,
      promoPrice: firstVariant.promo_price || firstVariant.promoPrice,
      quantity: 1,
      image: firstVariant.image_url || firstVariant.image,
    });
  };

  return (
    <motion.div
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
          src={thumbnail}
          alt={shortName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        {/* Quick Add overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.preventDefault();
              handleQuickAdd();
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
          {shortName}
        </h3>
        <div className="flex items-center gap-2 mb-2">
          {hasPromo && (
            <span className="text-xs text-[#3A3A3A]/40 line-through">
              {formatPrice(firstVariant.price)}
            </span>
          )}
          <span className="text-sm font-semibold text-[#722F38]">
            {formatPrice((hasPromo ? (firstVariant.promo_price || firstVariant.promoPrice) : firstVariant?.price) ?? 0)}
          </span>
        </div>
        {/* Color dots */}
        <div className="flex items-center gap-1.5 mt-auto">
          {colors.slice(0, 5).map((color: any) => (
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
}
