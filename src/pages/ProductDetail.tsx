import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingBag, Minus, Plus, Truck, Shield, Star, Loader2, Package, Layers, Gem, Sparkles, Heart } from 'lucide-react';
import { formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';
import { getProductById } from '../utils/api';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      const data = await getProductById(id);
      setProduct(data);
      setIsLoading(false);
    }
    loadProduct();
  }, [id]);

  // Normalize variants
  const variants = useMemo(() => {
    if (!product) return [];
    return product.product_variants || product.variants || [];
  }, [product]);

  const colors = useMemo(() => {
    return [...new Set(variants.map((v: any) => v.color))];
  }, [variants]);

  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Set default color when product loads
  useEffect(() => {
    if (colors.length > 0 && !selectedColor) {
      setSelectedColor(colors[0]);
    }
  }, [colors, selectedColor]);

  const colorVariants = useMemo(() => {
    return variants.filter((v: any) => v.color === selectedColor);
  }, [variants, selectedColor]);

  const options = useMemo(() => [...new Set(colorVariants.map((v: any) => v.option_name || v.option))], [colorVariants]);
  const [selectedOption, setSelectedOption] = useState('');

  // Set default option when color changes
  useEffect(() => {
    if (options.length > 0 && !selectedOption) {
      setSelectedOption(options[0]);
    }
  }, [options, selectedOption]);

  const activeVariant = useMemo(
    () => colorVariants.find((v: any) => (v.option_name || v.option) === selectedOption) || colorVariants[0],
    [colorVariants, selectedOption]
  );

  const shortName = product?.short_name || product?.shortName || '';
  const productName = product?.name || '';

  // Reset option when color changes
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const opts = variants.filter((v: any) => v.color === color);
    setSelectedOption(opts[0]?.option_name || opts[0]?.option || '');
    setQuantity(1);
  };

  const allImages = useMemo(() => {
    const imgs = colorVariants.map((v: any) => v.image_url || v.image).filter(Boolean);
    if (product?.thumbnail_url && !imgs.includes(product.thumbnail_url)) {
      imgs.unshift(product.thumbnail_url);
    }
    return imgs;
  }, [colorVariants, product?.thumbnail_url]);

  const [activeImg, setActiveImg] = useState(0);

  const productDetails = useMemo(() => {
    if (!product) return [];
    return [
      { title: 'Material & Perawatan', content: `Dibuat dari ${product.material || 'Ceruty Babydoll Premium'}. Disarankan cuci dengan tangan (hand wash) atau dry clean untuk menjaga kualitas serat kain.` },
      { title: 'Spesifikasi Produk', content: `Berat: ${product.weight || 100}g. ${product.description || ''}` },
      { title: 'Informasi Pengiriman', content: 'Pengiriman dilakukan setiap hari Senin-Sabtu. Estimasi pengiriman 2-4 hari kerja tergantung lokasi.' },
    ];
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#722F38] animate-spin" />
      </div>
    );
  }

  function handleAddToCart() {
    if (!activeVariant) return;
    addItem({
      sku: activeVariant.sku,
      productId: product.id,
      productName: shortName,
      color: activeVariant.color,
      option: activeVariant.option_name || activeVariant.option,
      price: activeVariant.price,
      promoPrice: activeVariant.promo_price || activeVariant.promoPrice,
      quantity,
      image: activeVariant.image_url || activeVariant.image,
    });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  }

  return (
    <div className="min-h-screen font-sans bg-white">
      {/* Basic Information Section */}
      <section className="bg-[#F9F9F9] pt-28 pb-24 px-4 md:px-8 border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-[#722F38] mb-8 hover:opacity-70 transition-opacity">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Koleksi
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-white mb-4 shadow-sm">
              <img
                src={allImages[activeImg] || activeVariant?.image_url || activeVariant?.image}
                alt={shortName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-16 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImg === i ? 'border-[#722F38] scale-105 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <span className="text-label text-[#722F38]/50">{product.category}</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#722F38] mt-2 mb-3 leading-tight">{productName}</h1>

            <div className="flex items-center gap-3 mb-4">
              {(activeVariant?.promo_price || activeVariant?.promoPrice) && (
                <span className="text-base text-[#3A3A3A]/40 line-through">{formatPrice(activeVariant.price)}</span>
              )}
              <span className="text-2xl font-bold text-[#722F38]">
                {formatPrice((activeVariant?.promo_price || activeVariant?.promoPrice) ?? activeVariant?.price ?? 0)}
              </span>
              {(activeVariant?.promo_price || activeVariant?.promoPrice) && (
                <span className="bg-[#722F38]/10 text-[#722F38] text-xs font-bold px-2.5 py-1 rounded-full">
                  {Math.round((1 - (activeVariant.promo_price || activeVariant.promoPrice) / activeVariant.price) * 100)}% OFF
                </span>
              )}
            </div>

            <p className="text-sm text-[#3A3A3A]/70 leading-relaxed mb-6">{product.description}</p>

            {/* Color Selector */}
            <div className="mb-5">
              <p className="text-xs font-medium text-[#3A3A3A]/70 mb-2">Warna: <span className="text-[#722F38] font-bold">{selectedColor}</span></p>
              <div className="flex flex-wrap gap-2">
                {colors.map((color: any) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                      selectedColor === color
                        ? 'bg-[#722F38] text-white shadow-md'
                        : 'bg-white text-[#3A3A3A]/70 hover:bg-[#722F38]/10 border border-transparent hover:border-[#722F38]/20'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Option Selector */}
            {options.length > 1 && (
              <div className="mb-5">
                <p className="text-xs font-medium text-[#3A3A3A]/70 mb-2">Pilihan:</p>
                <div className="flex flex-wrap gap-2">
                  {options.map((opt: any) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedOption(opt)}
                      className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                        selectedOption === opt
                          ? 'bg-[#722F38] text-white shadow-md'
                          : 'bg-white text-[#3A3A3A]/70 hover:bg-[#722F38]/10 border border-transparent hover:border-[#722F38]/20'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock */}
            <p className="text-xs text-[#3A3A3A]/50 mb-5 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${(activeVariant?.stock ?? 0) <= 3 ? 'bg-red-500 animate-pulse' : 'bg-green-600'}`}></span>
              Stok: <span className={`font-medium ${(activeVariant?.stock ?? 0) <= 3 ? 'text-red-500' : 'text-green-600'}`}>
                {activeVariant?.stock ?? 0} tersisa
              </span>
            </p>

            {/* Quantity + Add */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
              <div className="flex items-center justify-between sm:justify-start gap-3 border border-[#722F38]/15 rounded-xl px-4 py-2.5 bg-white">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-[#722F38] p-1 hover:bg-gray-100 rounded-lg transition-colors"><Minus className="w-4 h-4" /></button>
                <span className="text-sm font-bold w-8 text-center text-[#3A3A3A]">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-[#722F38] p-1 hover:bg-gray-100 rounded-lg transition-colors"><Plus className="w-4 h-4" /></button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={(activeVariant?.stock ?? 0) === 0}
                className={`flex-1 text-white text-sm font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 uppercase tracking-wider transition-all shadow-sm ${
                  addedFeedback ? 'bg-green-600' : 'bg-[#722F38] hover:bg-[#5a252d] active:scale-[0.98]'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                <ShoppingBag className="w-4 h-4" />
                {addedFeedback ? 'Ditambahkan ✓' : 'Tambah ke Keranjang'}
              </button>
            </div>

            {/* Marketplace Links */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {product.shopee_link && (
                <a 
                  href={product.shopee_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[#EE4D2D] text-[#EE4D2D] text-xs font-bold hover:bg-[#EE4D2D]/5 transition-colors"
                >
                  Beli di Shopee
                </a>
              )}
              {product.tiktok_link && (
                <a 
                  href={product.tiktok_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-black text-black text-xs font-bold hover:bg-black/5 transition-colors"
                >
                  Beli di TikTok
                </a>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { icon: Truck, label: 'Gratis Ongkir >200K' },
                { icon: Shield, label: 'Premium Quality' },
                { icon: Star, label: 'Original SECERA' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 bg-white/70 rounded-xl p-3 text-center border border-gray-100 shadow-sm">
                  <Icon className="w-4 h-4 text-[#722F38]/60" />
                  <span className="text-[10px] text-[#3A3A3A]/60 font-medium">{label}</span>
                </div>
              ))}
            </div>

            {/* Details Accordion */}
            <div className="space-y-0 border-t border-[#722F38]/10">
              {productDetails.map((detail) => (
                <details key={detail.title} className="border-b border-[#722F38]/10 group">
                  <summary className="py-4 text-sm font-medium text-[#3A3A3A] cursor-pointer flex justify-between items-center hover:text-[#722F38] transition-colors">
                    {detail.title}
                    <span className="text-[#722F38]/40 group-open:rotate-45 transition-transform text-lg">+</span>
                  </summary>
                  <p className="text-sm text-[#3A3A3A]/60 pb-4 leading-relaxed">{detail.content}</p>
                </details>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>

      {/* CMS Rich Content Section */}
      {product.cms_content && (
        <section className="w-full bg-white py-24 md:py-32">
          <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-32">
              {/* Features Grid */}
              {product.cms_content.features && product.cms_content.features.items?.length > 0 && (
                <section>
                  <div className="text-center mb-16">
                    <motion.span 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="text-[10px] font-bold text-[#722F38]/40 uppercase tracking-[0.3em] mb-4 block"
                    >
                      Specifications & Details
                    </motion.span>
                    <motion.h2 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                      className="text-3xl md:text-4xl font-serif text-[#722F38]"
                    >
                      {product.cms_content.features.title || "What's in the box"}
                    </motion.h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {product.cms_content.features.items.map((item: any, idx: number) => {
                      const IconMap: any = { Package, Truck, Shield, Star, Layers, Gem, Sparkles, Heart };
                      const Icon = IconMap[item.icon] || Package;
                      return (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.05 }}
                          className="group p-8 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-[#722F38]/20 hover:bg-white hover:shadow-xl hover:shadow-[#722F38]/5 transition-all duration-500 text-center"
                        >
                          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                            <Icon className="w-6 h-6 text-[#722F38]" />
                          </div>
                          <h3 className="text-sm font-bold text-[#722F38] mb-3 uppercase tracking-wide">{item.title}</h3>
                          <p className="text-xs text-[#3A3A3A]/60 leading-relaxed font-medium">{item.description}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Editorial Sections */}
              {product.cms_content.editorial && product.cms_content.editorial.sections?.length > 0 && (
                <div className="space-y-48 lg:space-y-64 pt-12">
                  {product.cms_content.editorial.sections.map((section: any, idx: number) => (
                    <section key={idx} className={`flex flex-col ${section.imagePosition === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 lg:gap-32`}>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="flex-1 w-full"
                      >
                        <div className="aspect-[4/3] overflow-hidden bg-gray-50 rounded-2xl">
                          {section.videoUrl ? (
                            <video
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-full h-full object-cover"
                              poster={section.imageUrl}
                            >
                              <source src={section.videoUrl} type="video/mp4" />
                            </video>
                          ) : (
                            <img 
                              src={section.imageUrl} 
                              alt={section.title} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          )}
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex-1 flex flex-col justify-center space-y-6"
                      >
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-[#3A3A3A] uppercase tracking-[0.2em]">
                            Product Showcase
                          </span>
                          <h2 className="text-4xl lg:text-5xl font-serif text-[#722F38] leading-tight">
                            {section.title}
                          </h2>
                        </div>
                        <p className="text-base lg:text-lg text-[#3A3A3A]/70 leading-relaxed max-w-lg">
                          {section.description}
                        </p>
                      </motion.div>
                    </section>
                  ))}
                </div>
              )}
            </div>
        </section>
      )}
    </div>
  );
}
