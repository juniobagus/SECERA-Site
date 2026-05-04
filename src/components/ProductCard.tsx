import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';
import { useEffect, useMemo, useState } from 'react';

export default function ProductCard({ product, index }: any) {
  const { addItem } = useCart();
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Normalize data from API or static source
  const variants = useMemo(() => product.product_variants || product.variants || [], [product]);
  const firstVariant = variants[0];
  const shortName = product.short_name || product.shortName || '';
  const thumbnail = product.thumbnail_url || firstVariant?.image_url || firstVariant?.image;

  const hasPromo = useMemo(() => variants.some((v: any) => v.promo_price || v.promoPrice), [variants]);
  const colors = useMemo(() => [...new Set(variants.map((v: any) => v.color).filter(Boolean))], [variants]);
  const hasMultipleVariants = variants.length > 1;

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string>('');

  useEffect(() => {
    if (!isPickerOpen) return;
    if (!colors.length) return;
    if (!selectedColor) setSelectedColor(colors[0]);
  }, [colors, isPickerOpen, selectedColor]);

  const colorVariants = useMemo(
    () => variants.filter((v: any) => v.color === selectedColor),
    [variants, selectedColor]
  );

  const options = useMemo(
    () =>
      [...new Set(colorVariants.map((v: any) => v.option_name || v.option).filter(Boolean))],
    [colorVariants]
  );

  useEffect(() => {
    if (!isPickerOpen) return;
    if (!options.length) return;
    if (!selectedOption) setSelectedOption(options[0]);
  }, [isPickerOpen, options, selectedOption]);

  const activeVariant = useMemo(() => {
    if (!isPickerOpen) return firstVariant;
    return (
      colorVariants.find((v: any) => (v.option_name || v.option) === selectedOption) ||
      colorVariants[0] ||
      firstVariant
    );
  }, [colorVariants, firstVariant, isPickerOpen, selectedOption]);

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

  const commitAdd = (variant: any) => {
    if (!variant) return;
    addItem({
      sku: variant.sku,
      productId: product.id,
      productName: shortName,
      color: variant.color,
      option: variant.option_name || variant.option,
      price: variant.price,
      promoPrice: variant.promo_price || variant.promoPrice,
      quantity: 1,
      image: variant.image_url || variant.image,
    });
  };

  const handleQuickAdd = () => {
    if (!firstVariant) return;
    if (hasMultipleVariants) {
      setIsPickerOpen(true);
      return;
    }
    commitAdd(firstVariant);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 1, delay: index * 0.1, ease: [0.25, 1, 0.5, 1] }}
        className="flex flex-col group"
      >
        {/* Image */}
        <Link
          to={`/product/${product.id}`}
          className="relative aspect-square w-full overflow-hidden bg-white mb-4 block"
        >
          {hasPromo && (
            <div className="absolute top-4 left-4 z-10 bg-white/95 text-[#722F38] text-label px-3 py-1.5 shadow-sm border border-white/70">
              Promo
            </div>
          )}
          <img
            src={thumbnail}
            alt={shortName}
            className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 grayscale-[10%] group-hover:grayscale-0"
            referrerPolicy="no-referrer"
            loading="lazy"
          />

          {/* Quick Add overlay: always visible on touch, hover-reveal on desktop */}
          <div className="absolute inset-x-0 bottom-0 p-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.preventDefault();
                handleQuickAdd();
              }}
              className="w-full bg-white/95 hover:bg-white text-[#722F38] text-label py-3 flex items-center justify-center gap-2 transition-colors shadow-lg"
              aria-label={hasMultipleVariants ? 'Pilih varian lalu tambah ke keranjang' : 'Tambah ke keranjang'}
            >
              <ShoppingBag className="w-4 h-4" />
              {hasMultipleVariants ? 'Pilih Varian' : 'Tambah ke Keranjang'}
            </button>
          </div>
        </Link>

        {/* Info */}
        <Link to={`/product/${product.id}`} className="flex flex-col flex-1">
          <span className="text-label text-[#722F38]/50 mb-1">
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
                className="w-3 h-3 border border-[#722F38]/15"
                style={{ backgroundColor: getColorHex(color) }}
                role="img"
                aria-label={`Warna ${color}`}
              />
            ))}
            {colors.length > 5 && (
              <span className="text-[10px] text-[#3A3A3A]/50">+{colors.length - 5}</span>
            )}
          </div>
        </Link>
      </motion.div>

      <AnimatePresence>
        {isPickerOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] bg-[#5A252D]/35 backdrop-blur-sm"
              onClick={() => setIsPickerOpen(false)}
              aria-label="Tutup pilih varian"
            />
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed left-1/2 top-1/2 z-[90] w-[calc(100%-24px)] max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white shadow-2xl border border-[#722F38]/10 overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Pilih varian"
            >
              <div className="p-5 md:p-6">
                <p className="text-label text-[#722F38]/55">
                  Pilih varian
                </p>
                <h4 className="mt-2 text-headline text-[#722F38]">
                  {shortName}
                </h4>

                <div className="mt-5 space-y-4">
                  {!!colors.length && (
                    <div>
                      <p className="text-xs font-medium text-[#3A3A3A]/70 mb-2">
                        Warna: <span className="text-[#722F38] font-bold">{selectedColor}</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {colors.map((color: any) => (
                          <button
                            type="button"
                            key={color}
                            onClick={() => {
                              setSelectedColor(color);
                              const next = variants.filter((v: any) => v.color === color);
                              const firstOpt = next[0]?.option_name || next[0]?.option || '';
                              setSelectedOption(firstOpt);
                            }}
                            className={`px-4 py-2 text-label transition-all ${
                              selectedColor === color
                                ? 'bg-[#722F38] text-white shadow-md'
                                : 'bg-[#F9F9F9] text-[#3A3A3A]/75 hover:bg-white border border-[#722F38]/10'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {options.length > 1 && (
                    <div>
                      <p className="text-xs font-medium text-[#3A3A3A]/70 mb-2">Pilihan:</p>
                      <div className="flex flex-wrap gap-2">
                        {options.map((opt: any) => (
                          <button
                            type="button"
                            key={opt}
                            onClick={() => setSelectedOption(opt)}
                            className={`px-4 py-2 text-label transition-all ${
                              selectedOption === opt
                                ? 'bg-[#722F38] text-white shadow-md'
                                : 'bg-[#F9F9F9] text-[#3A3A3A]/75 hover:bg-white border border-[#722F38]/10'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPickerOpen(false)}
                    className="flex-1 border border-[#722F38]/15 bg-white hover:bg-[#F9F9F9] text-[#722F38] text-label py-3 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      commitAdd(activeVariant);
                      setIsPickerOpen(false);
                    }}
                    className="flex-1 bg-[#722F38] hover:bg-[#5a252d] text-white text-label py-3 transition-colors"
                  >
                    Tambah
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
