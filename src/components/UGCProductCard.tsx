import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { formatPrice } from '../data/products';

interface UGCProductCardProps {
  product: any;
  thumbnail?: string;
  isActive: boolean;
}

export default function UGCProductCard({ product, thumbnail, isActive }: UGCProductCardProps) {
  if (!product) return null;

  const variants = product.product_variants || product.variants || [];
  const firstVariant = variants[0];
  const price = firstVariant?.price ?? 0;

  return (
    <motion.div
      animate={{
        opacity: 1, // Always visible as per user request
        y: 0,
        scale: isActive ? 1 : 0.98
      }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Link
        to={`/product/${product.id}`}
        className={`group flex items-center gap-3 p-2 bg-paper hover:shadow-md transition-all ${isActive ? 'border-brand-wine/20' : 'opacity-70'
          }`}
      >
        <div className="w-14 h-14 overflow-hidden bg-paper shrink-0">
          <img
            src={thumbnail}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text font-bold text-brand-wine uppercase tracking-wider truncate mb-0.5">
            {product.short_name || product.name}
          </h4>
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-brand-wine tabular-nums">
              {formatPrice(price)}
            </span>
            <div className="w-6 h-6 bg-brand-wine text-white flex items-center justify-center shadow-sm">
              <Plus className="w-3 h-3" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
