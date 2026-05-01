import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Heart, Loader2, Plus, ShoppingBag } from 'lucide-react';
import { formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';
import { getProductById } from '../utils/api';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeInfo, setActiveInfo] = useState<string | null>(null);
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  const variants = useMemo(() => {
    if (!product) return [];
    return product.product_variants || product.variants || [];
  }, [product]);

  const colors = useMemo(() => {
    return [...new Set(variants.map((variant: any) => variant.color).filter(Boolean))];
  }, [variants]);

  useEffect(() => {
    if (!colors.length) return;
    if (!selectedColor) setSelectedColor(colors[0]);
  }, [colors, selectedColor]);

  const colorVariants = useMemo(() => {
    return variants.filter((variant: any) => variant.color === selectedColor);
  }, [variants, selectedColor]);

  const options = useMemo(() => {
    return [...new Set(colorVariants.map((variant: any) => variant.option_name || variant.option).filter(Boolean))];
  }, [colorVariants]);

  useEffect(() => {
    if (!options.length) return;
    if (!selectedOption) setSelectedOption(options[0]);
  }, [options, selectedOption]);

  const activeVariant = useMemo(() => {
    return colorVariants.find((variant: any) => (variant.option_name || variant.option) === selectedOption) || colorVariants[0];
  }, [colorVariants, selectedOption]);

  const allImages = useMemo(() => {
    const images = colorVariants.map((variant: any) => variant.image_url || variant.image).filter(Boolean);
    if (product?.thumbnail_url && !images.includes(product.thumbnail_url)) {
      images.unshift(product.thumbnail_url);
    }
    return images;
  }, [colorVariants, product?.thumbnail_url]);

  useEffect(() => {
    setActiveImg(0);
  }, [selectedColor]);

  const shortName = product?.short_name || product?.shortName || product?.name || '';
  const productName = product?.name || '';

  const detailRows = useMemo(() => {
    if (!product) return [];
    const cmsAccordions = product.cms_content?.accordions;
    return [
      {
        key: 'details',
        label: 'Rincian',
        content:
          cmsAccordions?.specs ||
          `${product.description || 'Potongan siluet santai dengan drape halus dan detail akhir yang elegan.'}`,
      },
      {
        key: 'material',
        label: 'Bahan',
        content: cmsAccordions?.material || `Bahan: ${product.material || 'Campuran tekstil premium'}`,
      },
      {
        key: 'shipping',
        label: 'Pengiriman & Pengembalian',
        content:
          cmsAccordions?.shipping ||
          'Pesanan diproses Senin hingga Sabtu. Estimasi pengiriman 2-4 hari kerja tergantung tujuan.',
      },
    ];
  }, [product]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const nextVariants = variants.filter((variant: any) => variant.color === color);
    setSelectedOption(nextVariants[0]?.option_name || nextVariants[0]?.option || '');
  };

  const handleAddToCart = () => {
    if (!activeVariant) return;

    addItem({
      sku: activeVariant.sku,
      productId: product.id,
      productName: shortName,
      color: activeVariant.color,
      option: activeVariant.option_name || activeVariant.option,
      price: activeVariant.price,
      promoPrice: activeVariant.promo_price || activeVariant.promoPrice,
      quantity: 1,
      image: activeVariant.image_url || activeVariant.image,
    });

    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#722F38] animate-spin" />
      </div>
    );
  }

  const ImageWithSkeleton = ({ src, alt, className }: { src: string, alt: string, className?: string, id: string }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    // Reset loading state when src changes
    useEffect(() => {
      setIsLoaded(false);
    }, [src]);

    return (
      <div className={`relative overflow-hidden bg-paper/40 ${className}`}>
        <AnimatePresence mode="wait">
          {!isLoaded && (
            <motion.div
              key={`skeleton-${src}`}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10"
            >
              <div className="w-full h-full bg-paper relative overflow-hidden">
                <motion.div
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.img
          key={`img-${src}`}
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{
            opacity: isLoaded ? 1 : 0,
            scale: isLoaded ? 1 : 1.05,
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-auto object-cover relative z-0"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  };

  const ThumbnailImage = ({ src }: { src: string }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => { setIsLoaded(false); }, [src]);
    return (
      <div className="relative w-full h-full">
        {!isLoaded && <div className="absolute inset-0 bg-paper animate-pulse z-10" />}
        <img
          src={src}
          alt=""
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-paper font-sans w-full max-w-full pt-[72px] pb-24 md:pb-0">
      <section className="border-b border-ink/5 px-4 md:px-8 lg:px-10 py-4 bg-white/30">
        <div className="max-w-[1900px] mx-auto">
          <div className="hidden md:flex items-center gap-3 text-label text-muted/80">
            <Link to="/shop" className="inline-flex items-center gap-1 hover:text-brand-wine transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Beranda
            </Link>
            <span>/</span>
            <span>Semua Koleksi</span>
            <span>/</span>
            <span className="truncate text-brand-wine font-bold">{productName}</span>
          </div>
          <div className="md:hidden flex items-center gap-2 text-label text-muted/80">
            <Link to="/shop" className="inline-flex items-center gap-1 hover:text-brand-wine transition-colors shrink-0">
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
            <span className="truncate">{productName}</span>
          </div>
        </div>
      </section>

      <section className="max-w-[1900px] mx-auto grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-6 bg-paper/50">
          <div className="hidden lg:flex flex-col gap-[2px]">
            {allImages.map((image: string, index: number) => (
              <div key={`${image}-${index}`} className="relative w-full bg-white/20">
                {index === 0 && (
                  <span className="absolute top-0 left-0 bg-brand-wine text-white px-4 py-1.5 text-label z-20">
                    Sale
                  </span>
                )}
                <ImageWithSkeleton
                  src={image}
                  alt={productName}
                  id={`desktop-${index}-${image}`}
                />
              </div>
            ))}
          </div>

          <div className="lg:hidden">
            <div className="overflow-x-auto snap-x snap-mandatory flex bg-paper/50 hide-scrollbar">
              {allImages.map((image: string, index: number) => (
                <div key={`${image}-mobile-${index}`} className="w-full shrink-0 snap-start">
                  <ImageWithSkeleton
                    src={image}
                    alt={productName}
                    id={`mobile-${index}-${image}`}
                  />
                </div>
              ))}
            </div>
            {allImages.length > 1 && (
              <div className="px-4 py-3 flex gap-2 overflow-x-auto bg-paper/30 border-y border-ink/5">
                {allImages.map((image: string, index: number) => (
                  <button
                    key={`${image}-thumb-${index}`}
                    type="button"
                    onClick={() => setActiveImg(index)}
                    className={`w-14 h-16 shrink-0 border transition-all relative overflow-hidden ${activeImg === index ? 'border-brand-wine ring-1 ring-brand-wine' : 'border-ink/10'
                      }`}
                  >
                    <ThumbnailImage src={image} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-6 px-4 md:px-8 lg:px-14 py-8 md:py-12 bg-white/20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:sticky lg:top-[100px] h-fit max-w-[760px]"
          >
            <p className="text-label text-muted mb-4">
              {product.category || 'Collection'}
            </p>
            <h1 className="text-headline text-ink mb-4">
              {productName}
            </h1>

            <div className="flex items-center gap-4 text-xl md:text-2xl mb-10">
              <span className="text-brand-wine font-bold">
                {formatPrice((activeVariant?.promo_price || activeVariant?.promoPrice) ?? activeVariant?.price ?? 0)}
              </span>
              {(activeVariant?.promo_price || activeVariant?.promoPrice) && (
                <span className="text-muted line-through text-lg opacity-60">
                  {formatPrice(activeVariant?.price ?? 0)}
                </span>
              )}
            </div>

            <div className="border-t border-ink/5 pt-10 space-y-8">
              <div>
                <p className="text-label text-muted mb-4">
                  Warna: <span className="text-ink">{selectedColor || '-'}</span>
                </p>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color: any) => {
                    const isActive = selectedColor === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleColorChange(color)}
                        className={`h-11 px-4 border text-label transition-all flex items-center gap-3 ${isActive ? 'border-brand-wine bg-brand-wine/5 ring-1 ring-brand-wine' : 'border-ink/10 hover:border-brand-wine/30'
                          }`}
                      >
                        <span
                          className="w-3.5 h-3.5 border border-ink/20"
                          style={{
                            backgroundColor:
                              color?.toLowerCase() === 'orange'
                                ? '#E98841'
                                : color?.toLowerCase() === 'black'
                                  ? '#1E1E1E'
                                  : color?.toLowerCase() === 'white'
                                    ? '#F2F2F2'
                                    : '#CFCFCF',
                          }}
                          aria-hidden="true"
                        />
                        <span>{color}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {options.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-label text-muted">
                      Ukuran: <span className="text-ink">{selectedOption || '-'}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowSizeGuide(true)}
                      className="text-label text-brand-wine hover:text-brand-wine-deep transition-colors inline-flex items-center gap-1.5"
                    >
                      Panduan Ukuran <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {options.map((option: any) => {
                      const isActive = selectedOption === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setSelectedOption(option)}
                          className={`h-11 min-w-11 px-4 border text-sm font-bold tracking-wider transition-all ${isActive
                              ? 'border-brand-wine bg-brand-wine text-white shadow-lg shadow-brand-wine/10'
                              : 'border-ink/10 bg-white/50 text-ink hover:border-brand-wine/40'
                            }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-stretch gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!activeVariant || (activeVariant?.stock ?? 1) === 0}
                  className="flex-1 h-14 bg-brand-wine text-white text-label hover:bg-brand-wine-deep transition-all shadow-xl shadow-brand-wine/15 disabled:opacity-40 disabled:grayscale"
                >
                  {addedFeedback ? 'Berhasil' : 'Masukkan ke Keranjang'}
                </button>
                <button
                  type="button"
                  className="w-14 h-14 border border-ink/10 flex items-center justify-center hover:border-brand-wine hover:bg-brand-wine/5 transition-all"
                  aria-label="Add to wishlist"
                >
                  <Heart className="w-5 h-5 text-brand-wine" />
                </button>
              </div>

              <p className="text-label text-muted/60 pt-4">Ketersediaan: Stok Tersedia</p>

              <div className="border-t border-ink/5 pt-8 space-y-4">
                {detailRows.map((row) => {
                  const isOpen = activeInfo === row.key;
                  return (
                    <div key={row.key} className="border-b border-ink/5 pb-4">
                      <button
                        type="button"
                        onClick={() => setActiveInfo(isOpen ? null : row.key)}
                        className="w-full text-left flex items-center justify-between text-label text-ink hover:text-brand-wine transition-colors"
                      >
                        {row.label}
                        <Plus className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-45 text-brand-wine' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <p className="mt-4 text-sm text-muted/90 leading-relaxed max-w-prose">
                              {row.content}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-xl border-t border-ink/5 p-4 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-16 bg-paper shrink-0 overflow-hidden">
            <img
              src={allImages[activeImg] || activeVariant?.image_url || activeVariant?.image}
              alt={productName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-ink truncate">{productName}</p>
            <p className="text-sm text-brand-wine font-black">
              {formatPrice((activeVariant?.promo_price || activeVariant?.promoPrice) ?? activeVariant?.price ?? 0)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!activeVariant || (activeVariant?.stock ?? 1) === 0}
            className="h-12 px-6 bg-brand-wine text-white text-label shadow-lg shadow-brand-wine/20 disabled:opacity-45 inline-flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> Beli Sekarang
          </button>
        </div>
      </div>

      {showSizeGuide && (
        <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[1px] flex items-center justify-center px-4" onClick={() => setShowSizeGuide(false)}>
          <div className="w-full max-w-lg bg-white border border-[#0000001e] p-5 md:p-7" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-2xl text-[#111]">Panduan Ukuran</h3>
              <button
                type="button"
                onClick={() => setShowSizeGuide(false)}
                className="text-xs uppercase tracking-[0.14em] text-[#444] hover:opacity-70"
              >
                Tutup
              </button>
            </div>
            <p className="text-sm text-[#4D4D4D] leading-relaxed mb-4">
              Bandingkan dengan pakaian serupa yang Anda miliki. Ukur lebar dada, lebar bahu, dan panjang lengan di permukaan datar untuk mendapatkan ukuran terbaik.
            </p>
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-y border-[#0000001f]">
                  <th className="text-left py-2 font-medium">Ukuran</th>
                  <th className="text-left py-2 font-medium">Dada</th>
                  <th className="text-left py-2 font-medium">Panjang</th>
                </tr>
              </thead>
              <tbody>
                {(options.length ? options : ['S', 'M', 'L']).map((size: any, index: number) => (
                  <tr key={size} className="border-b border-[#00000012] text-[#3C3C3C]">
                    <td className="py-2">{size}</td>
                    <td className="py-2">{88 + index * 4} cm</td>
                    <td className="py-2">{66 + index * 2} cm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
