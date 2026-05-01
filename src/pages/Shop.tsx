import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { getProducts, getCMSContent, getCategories } from '../utils/api';
import { Loader2 } from 'lucide-react';
import Hero from '../components/Hero';

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
        const [productsData, categoriesData, shopCms, globalCms] = await Promise.all([
          getProducts('active'),
          getCategories(),
          getCMSContent('shop_page'),
          getCMSContent('main_site')
        ]);

        setProducts(productsData);
        setCategories([{ id: 'all', name: 'Semua' }, ...categoriesData]);
        if (shopCms) setCmsContent(shopCms);

        // Handle global CMS (site title/SEO)
        if (globalCms?.global?.siteTitle) {
          document.title = `${globalCms.global.siteTitle} | Shop`;
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc && globalCms.global.seoDescription) {
            metaDesc.setAttribute('content', globalCms.global.seoDescription);
          }
        }
      } catch (error) {
        console.error('Failed to load shop data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = activeCategory === 'Semua'
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen w-full bg-paper flex flex-col font-sans">
      <Hero
        title={cmsContent?.hero?.title || 'Koleksi Eksklusif Secera'}
        subtitle={cmsContent?.hero?.subtitle || 'Temukan keanggunan dalam setiap helai pakaian kami yang dirancang khusus untuk Anda.'}
        cta={{
          text: 'Lihat Koleksi',
          link: '#koleksi',
          type: 'link'
        }}
        imageUrl={cmsContent?.hero?.imageUrl || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"}
        videoUrl={cmsContent?.hero?.videoUrl}
        alignment="bottom"
        height="min-h-[60vh] md:min-h-[70vh]"
      />

      <div id="koleksi" className="scroll-mt-20">
        {/* Full-width Sticky Category Filter */}
        <div className="sticky top-[64px] md:top-[56px] z-30 w-full bg-paper/95 backdrop-blur-xl border-b border-brand-wine/10">
          <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-4 md:py-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-6 py-2 text-label transition-all ${activeCategory === cat.name
                    ? 'bg-brand-wine text-white shadow-md'
                    : 'bg-white/50 text-ink/50 hover:bg-white hover:text-brand-wine border border-brand-wine/5'
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-10 pt-10 md:py-20">
          {/* Product Grid */}
          <div className="min-h-[400px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="w-10 h-10 text-brand-wine animate-spin" />
                <p className="text-ink/60 text-label">Memuat produk...</p>
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
                <p className="text-ink/60 text-title">Tidak ada produk dalam kategori ini.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
