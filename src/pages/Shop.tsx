import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CATEGORIES } from '../data/products';
import ProductCard from '../components/ProductCard';
import { getProducts, getCMSContent, getCategories } from '../utils/api';
import { Loader2 } from 'lucide-react';

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [cmsContent, setCmsContent] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [productsData, categoriesData, shopCms] = await Promise.all([
          getProducts(),
          getCategories(),
          getCMSContent('shop_page')
        ]);
        setProducts(productsData);
        setCategories([{ id: 'all', name: 'Semua' }, ...categoriesData]);
        if (shopCms) setCmsContent(shopCms);
      } catch (error) {
        console.error('Failed to load shop data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    async function loadCMS() {
      const global = await getCMSContent('main_site');
      if (global?.global?.siteTitle) {
        document.title = `${global.global.siteTitle} | Shop`;
        
        // Update meta description if exists
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && global.global.seoDescription) {
          metaDesc.setAttribute('content', global.global.seoDescription);
        }
      }
    }
    loadCMS();
  }, []);

  const filtered = activeCategory === 'Semua'
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen w-full bg-[#F9F9F9] p-3 md:p-5 flex flex-col font-sans">
      <div className="relative flex-1 w-full rounded-[2rem] overflow-hidden flex flex-col min-h-[70vh]">
        {/* Background Media (Image or Video) */}
        <div className="absolute inset-0 z-0 scale-105">
          {cmsContent?.hero?.videoUrl ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-center"
              poster={cmsContent.hero.imageUrl}
            >
              <source src={cmsContent.hero.videoUrl} type="video/mp4" />
            </video>
          ) : (
            <img 
              src={cmsContent?.hero?.imageUrl || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"} 
              alt="Shop Hero" 
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          )}
          {/* Dark overlay for white text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 text-center pt-24">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight mb-6 max-w-4xl leading-tight text-white"
          >
            {cmsContent?.hero?.title || 'Koleksi Eksklusif Secera'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl font-light"
          >
            {cmsContent?.hero?.subtitle || 'Temukan keanggunan dalam setiap helai pakaian kami yang dirancang khusus untuk Anda.'}
          </motion.p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 pt-16">

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.name
                  ? 'bg-[#722F38] text-white shadow-md'
                  : 'bg-white/60 text-[#3A3A3A]/70 hover:bg-white hover:text-[#722F38]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-10 h-10 text-[#722F38] animate-spin" />
              <p className="text-[#3A3A3A]/60">Memuat produk...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-14">
              {filtered.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
          
          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[#3A3A3A]/60 text-lg">Tidak ada produk dalam kategori ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
