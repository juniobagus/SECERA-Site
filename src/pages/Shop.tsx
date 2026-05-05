import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts, getCMSContent, getCategories, getSettings } from '../utils/api';
import { Loader2 } from 'lucide-react';
import Hero from '../components/Hero';
import SEO from '../components/SEO';
import { applyCdn } from '../utils/mediaUrl';

export default function Shop() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'Semua';
  const initialTag = searchParams.get('tag') || searchParams.get('style') || 'Semua';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeTag, setActiveTag] = useState(initialTag);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [cmsContent, setCmsContent] = useState<any>(null);
  const [cdnBaseUrl, setCdnBaseUrl] = useState('');

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [productsData, categoriesData, shopCms, globalCms, settingsData] = await Promise.all([
          getProducts('active'),
          getCategories(),
          getCMSContent('shop_page'),
          getCMSContent('main_site'),
          getSettings()
        ]);

        setProducts(productsData);
        setCategories([{ id: 'all', name: 'Semua' }, ...categoriesData]);
        if (shopCms) setCmsContent(shopCms);
        setCdnBaseUrl(settingsData?.cdn_base_url || '');
      } catch (error) {
        console.error('Failed to load shop data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Update filters when URL parameters change
  useEffect(() => {
    const category = searchParams.get('category');
    const tag = searchParams.get('tag') || searchParams.get('style');
    if (category) setActiveCategory(category);
    if (tag) setActiveTag(tag);
  }, [searchParams]);

  const allTags = useMemo(() => {
    const tags = products.flatMap(p => p.tags || []);
    return Array.from(new Set(tags)).sort();
  }, [products]);

  const filtered = products.filter((p) => {
    const matchesCategory = activeCategory === 'Semua' || 
      (p.category && p.category.toLowerCase() === activeCategory.toLowerCase());
    const matchesTag = activeTag === 'Semua' || 
      (p.tags && p.tags.some((t: string) => t.toLowerCase() === activeTag.toLowerCase()));
    return matchesCategory && matchesTag;
  });

  return (
    <div className="min-h-screen w-full bg-paper flex flex-col font-sans">
      <SEO 
        title={cmsContent?.seo?.title || "Shop"}
        description={cmsContent?.seo?.description}
        ogImage={cmsContent?.seo?.ogImage}
      />
      <Hero
        title={cmsContent?.hero?.title || 'Koleksi Eksklusif Secera'}
        subtitle={cmsContent?.hero?.subtitle || 'Temukan keanggunan dalam setiap helai pakaian kami yang dirancang khusus untuk Anda.'}
        imageUrl={applyCdn(cmsContent?.hero?.imageUrl || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop", cdnBaseUrl)}
        videoUrl={cmsContent?.hero?.videoUrl}
        alignment="bottom"
        height="min-h-[60vh] md:min-h-[70vh]"
      />

      <div id="koleksi" className="scroll-mt-20">
        {/* Unified Sticky Filter Row */}
        <div className="sticky top-[64px] md:top-[56px] z-30 w-full bg-paper/95 backdrop-blur-xl border-b border-brand-wine/10 overflow-x-auto no-scrollbar">
          <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-4 md:py-6 flex items-center gap-6 min-w-max">
            {/* Categories */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-ink/45 mr-1 whitespace-nowrap">
                Pilih kategori
              </span>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-5 py-2 text-label transition-all whitespace-nowrap rounded-none ${activeCategory.toLowerCase() === cat.name.toLowerCase()
                    ? 'bg-brand-wine text-white shadow-none'
                    : 'bg-white/50 text-ink/50 hover:bg-white hover:text-brand-wine border border-brand-wine/5'
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Separator */}
            {allTags.length > 0 && (
              <div className="w-px h-6 bg-brand-wine/10 shrink-0" />
            )}

            {/* Tags (Styles) */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-ink/45 mr-1 whitespace-nowrap">
                Pilih gaya
              </span>
              {allTags.length > 0 && (
                <button
                  onClick={() => setActiveTag('Semua')}
                  className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all rounded-none border whitespace-nowrap ${activeTag === 'Semua'
                    ? 'bg-ink text-white border-ink'
                    : 'bg-white text-ink/40 border-ink/10 hover:border-ink/30 hover:text-ink'
                    }`}
                >
                  Semua Gaya
                </button>
              )}
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag === activeTag ? 'Semua' : tag)}
                  className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all rounded-none border whitespace-nowrap ${activeTag.toLowerCase() === tag.toLowerCase()
                    ? 'bg-ink text-white border-ink'
                    : 'bg-white text-ink/40 border-ink/10 hover:border-ink/30 hover:text-ink'
                    }`}
                >
                  {tag}
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
                <p className="text-ink/60 text-label">Memuat koleksi pilihanmu...</p>
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
                <p className="text-ink/60 text-title font-serif">Belum ada koleksi yang cocok dengan pilihanmu.</p>
                <p className="mt-2 text-ink/50 text-sm">Coba ganti kategori atau gaya.</p>
                <button 
                  onClick={() => { setActiveCategory('Semua'); setActiveTag('Semua'); }}
                  className="mt-4 text-brand-wine text-label border-b border-brand-wine/20 pb-0.5 hover:border-brand-wine transition-all"
                >
                  Lihat Semua Koleksi
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
