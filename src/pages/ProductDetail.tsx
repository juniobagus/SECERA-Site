import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingBag, Minus, Plus, Truck, Shield, Star } from 'lucide-react';
import { getProductById, formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || '');
  const { addItem } = useCart();

  const colors = useMemo(() => {
    if (!product) return [];
    return [...new Set(product.variants.map((v) => v.color))];
  }, [product]);

  const [selectedColor, setSelectedColor] = useState(colors[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const colorVariants = useMemo(() => {
    if (!product) return [];
    return product.variants.filter((v) => v.color === selectedColor);
  }, [product, selectedColor]);

  const options = useMemo(() => [...new Set(colorVariants.map((v) => v.option))], [colorVariants]);
  const [selectedOption, setSelectedOption] = useState(options[0] || '');

  const activeVariant = useMemo(
    () => colorVariants.find((v) => v.option === selectedOption) || colorVariants[0],
    [colorVariants, selectedOption]
  );

  // Reset option when color changes
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const opts = product!.variants.filter((v) => v.color === color);
    setSelectedOption(opts[0]?.option || '');
    setQuantity(1);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] pt-32 pb-24 px-6 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-serif text-[#722F38] mb-4">Produk tidak ditemukan</h1>
        <Link to="/shop" className="text-sm text-[#722F38] underline">Kembali ke Shop</Link>
      </div>
    );
  }

  function handleAddToCart() {
    if (!activeVariant) return;
    addItem({
      sku: activeVariant.sku,
      productId: product!.id,
      productName: product!.shortName,
      color: activeVariant.color,
      option: activeVariant.option,
      price: activeVariant.price,
      promoPrice: activeVariant.promoPrice,
      quantity,
      image: activeVariant.image,
    });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  }

  const allImages = colorVariants.map((v) => v.image);
  const [activeImg, setActiveImg] = useState(0);

  return (
    <div className="min-h-screen bg-[#F9F9F9] pt-28 pb-24 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-[#722F38] mb-8 hover:opacity-70 transition-opacity">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Koleksi
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-white mb-4">
              <img
                src={allImages[activeImg] || activeVariant?.image}
                alt={product.shortName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-16 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-colors ${
                      activeImg === i ? 'border-[#722F38]' : 'border-transparent'
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
            <span className="text-xs font-medium tracking-widest text-[#722F38]/50 uppercase">{product.category}</span>
            <h1 className="text-2xl md:text-3xl font-serif text-[#722F38] mt-2 mb-3 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              {activeVariant?.promoPrice && (
                <span className="text-base text-[#3A3A3A]/40 line-through">{formatPrice(activeVariant.price)}</span>
              )}
              <span className="text-2xl font-bold text-[#722F38]">
                {formatPrice(activeVariant?.promoPrice ?? activeVariant?.price ?? 0)}
              </span>
              {activeVariant?.promoPrice && (
                <span className="bg-[#722F38]/10 text-[#722F38] text-xs font-bold px-2.5 py-1 rounded-full">
                  {Math.round((1 - activeVariant.promoPrice / activeVariant.price) * 100)}% OFF
                </span>
              )}
            </div>

            <p className="text-sm text-[#3A3A3A]/70 leading-relaxed mb-6">{product.description}</p>

            {/* Color Selector */}
            <div className="mb-5">
              <p className="text-xs font-medium text-[#3A3A3A]/70 mb-2">Warna: <span className="text-[#722F38]">{selectedColor}</span></p>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                      selectedColor === color
                        ? 'bg-[#722F38] text-white'
                        : 'bg-white text-[#3A3A3A]/70 hover:bg-[#722F38]/10'
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
                  {options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedOption(opt)}
                      className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                        selectedOption === opt
                          ? 'bg-[#722F38] text-white'
                          : 'bg-white text-[#3A3A3A]/70 hover:bg-[#722F38]/10'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock */}
            <p className="text-xs text-[#3A3A3A]/50 mb-5">
              Stok: <span className={`font-medium ${(activeVariant?.stock ?? 0) <= 3 ? 'text-red-500' : 'text-green-600'}`}>
                {activeVariant?.stock ?? 0} tersisa
              </span>
            </p>

            {/* Quantity + Add */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3 border border-[#722F38]/15 rounded-xl px-4 py-2.5">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-[#722F38]"><Minus className="w-4 h-4" /></button>
                <span className="text-sm font-medium w-6 text-center text-[#3A3A3A]">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-[#722F38]"><Plus className="w-4 h-4" /></button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={(activeVariant?.stock ?? 0) === 0}
                className={`flex-1 text-white text-sm font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 uppercase tracking-wider transition-all ${
                  addedFeedback ? 'bg-green-600' : 'bg-[#722F38] hover:bg-[#5a252d]'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                <ShoppingBag className="w-4 h-4" />
                {addedFeedback ? 'Ditambahkan ✓' : 'Tambah ke Keranjang'}
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { icon: Truck, label: 'Gratis Ongkir >200K' },
                { icon: Shield, label: 'Premium Quality' },
                { icon: Star, label: 'Original SECERA' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 bg-white/70 rounded-xl p-3 text-center">
                  <Icon className="w-4 h-4 text-[#722F38]/60" />
                  <span className="text-[10px] text-[#3A3A3A]/60 font-medium">{label}</span>
                </div>
              ))}
            </div>

            {/* Details Accordion */}
            <div className="space-y-0 border-t border-[#722F38]/10">
              {product.details.map((detail) => (
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
    </div>
  );
}
