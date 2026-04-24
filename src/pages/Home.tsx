/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState, useEffect } from 'react';
import { Star, Clock, Layers, Gem, Sparkles, ChevronLeft, ChevronRight, VolumeX, Plus, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { products, formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';
import { initialCMSContent } from '../data/cms';
import { getCMSContent, getProducts } from '../utils/api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const { addItem } = useCart();
  const carouselRef = useRef<HTMLDivElement>(null);
  const ugcRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeUgcIndex, setActiveUgcIndex] = useState(0);
  const [cms, setCms] = useState(initialCMSContent);
  const [productsList, setProductsList] = useState<any[]>([]);

  const handleUgcScroll = () => {
    if (ugcRef.current) {
      const scrollLeft = ugcRef.current.scrollLeft;
      const itemWidth = window.innerWidth < 768 ? 280 + 12 : 320 + 12; // width + gap (gap-3 = 12px)
      const index = Math.round(scrollLeft / itemWidth);
      if (index !== activeUgcIndex) {
        setActiveUgcIndex(index);
      }
    }
  };

  const scrollToUgc = (index: number) => {
    if (ugcRef.current) {
      const itemWidth = window.innerWidth < 768 ? 280 + 12 : 320 + 12;
      ugcRef.current.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    async function loadCMS() {
      const data = await getCMSContent('main_site');
      if (data) {
        const newCms = {
          ...initialCMSContent,
          ...data,
          hero: { ...initialCMSContent.hero, ...data.hero },
          showcase: { ...initialCMSContent.showcase, ...data.showcase },
          testimonials: { ...initialCMSContent.testimonials, ...data.testimonials },
          ugc: { ...initialCMSContent.ugc, ...data.ugc },
          faq: { ...initialCMSContent.faq, ...data.faq },
          cta: { ...initialCMSContent.cta, ...data.cta },
          features: { ...initialCMSContent.features, ...data.features },
          footer: { ...initialCMSContent.footer, ...data.footer },
          global: { ...initialCMSContent.global, ...data.global }
        };
        setCms(newCms);

        // SEO Update
        if (newCms.global.siteTitle) document.title = newCms.global.siteTitle;

        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.setAttribute('name', 'description');
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', newCms.global.seoDescription);

        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
          metaKeywords = document.createElement('meta');
          metaKeywords.setAttribute('name', 'keywords');
          document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute('content', newCms.global.seoKeywords);
      }
    }

    async function loadProducts() {
      const data = await getProducts();
      if (data && data.length > 0) {
        setProductsList(data);
      } else {
        setProductsList(products); // Fallback to static data if API is empty
      }
    }

    loadCMS();
    loadProducts();
  }, []);

  // Center UGC on load
  useEffect(() => {
    if (cms.ugc.items.length > 0) {
      const middleIndex = Math.floor(cms.ugc.items.length / 2);
      // Wait for layout to be ready
      const timer = setTimeout(() => {
        scrollToUgc(middleIndex);
        setActiveUgcIndex(middleIndex);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [cms.ugc.items]);

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);

      const maxScroll = scrollWidth - clientWidth;
      const isAtEnd = Math.ceil(scrollLeft) >= maxScroll - 10;
      setCanScrollRight(!isAtEnd && maxScroll > 0);

      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
      setScrollProgress(Math.min(Math.max(progress, 0), 100));
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 324 : 424; // Card width + gap
      carouselRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="min-h-screen w-full bg-[#F9F9F9] p-3 md:p-5 flex flex-col font-sans">
        <div className="relative flex-1 w-full rounded-[2rem] overflow-hidden flex flex-col min-h-[80vh]">
          {/* Background Media (Image or Video) */}
          <div className="absolute inset-0 z-0">
            {cms.hero.videoUrl ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover object-center"
                poster={cms.hero.imageUrl}
              >
                <source src={cms.hero.videoUrl} type="video/mp4" />
              </video>
            ) : (
              <img
                src={cms.hero.imageUrl}
                alt={cms.hero.title}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            )}
            {/* Dark overlay for white text readability */}
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Hero Content */}
          <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 text-center pt-24">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight mb-6 max-w-4xl leading-tight text-white"
            >
              {cms.hero.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl font-light"
            >
              {cms.hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Link to="/shop" className="px-8 py-3.5 rounded-full border border-white/60 bg-transparent hover:bg-white hover:text-black transition-all duration-300 text-sm font-medium w-full sm:w-auto text-white">
                {cms.hero.cta}
              </Link>
            </motion.div>
          </main>
        </div>

        {/* Trust & Features Marquee */}
        <div className="w-full py-4 mt-3 md:mt-5 flex items-center overflow-hidden px-4 md:px-8 shrink-0">
          {/* Left side: Rating */}
          <div className="hidden md:flex items-center gap-2 pr-6 md:pr-8 shrink-0 z-10">
            {/* <div className="flex items-center gap-1">
              <Star className="w-6 h-6 fill-[#00b67a] text-[#00b67a]" />
              <span className="font-bold text-xl tracking-tight">5 Stars</span>
            </div> */}
            <div className="flex items-center gap-0.5 ml-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-[#00b67a] p-1 rounded-sm">
                  <Star className="w-4 h-4 fill-white text-white" />
                </div>
              ))}
            </div>
          </div>

          {/* Right side: Marquee */}
          <div className="flex-1 overflow-hidden relative md:ml-8 flex items-center mask-image-linear">
            {/* 
            We duplicate the content to create a seamless infinite loop.
            The animation translates from 0 to -50%, so the content needs to be twice as wide.
          */}
            <div className="flex items-center gap-12 animate-marquee whitespace-nowrap w-max">
              {/* Group 1 */}
              {cms.marquee?.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-zinc-800 font-medium">{item}</span>
                </div>
              ))}

              {/* Group 2 (Duplicate for seamless loop) */}
              {cms.marquee?.items?.map((item, i) => (
                <div key={`dup-${i}`} className="flex items-center gap-3">
                  <span className="text-zinc-800 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>



        {/* Carousel Section */}
        <div className="w-full bg-[#F9F9F9] py-20 px-4 md:px-12 flex flex-col mt-3 md:mt-5 rounded-[2rem]">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#6E2B30] max-w-2xl leading-tight">
              Kualitas premium yang <span className="text-zinc-400">terasa personal, bukan sekadar busana</span>
            </h2>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${canScrollLeft ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900' : 'bg-zinc-50 text-zinc-300 cursor-not-allowed'
                  }`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${canScrollRight ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900' : 'bg-zinc-50 text-zinc-300 cursor-not-allowed'
                  }`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8"
          >
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="carousel-card min-w-[300px] md:min-w-[400px] flex flex-col gap-6 snap-start cursor-pointer group"
            >
              <div className="bg-[#ffffff] rounded-[2rem] p-8 h-[450px] flex flex-col relative overflow-hidden transition-shadow duration-300 group-hover:shadow-xl">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-800 mb-4">MATERIAL</span>
                <h3 className="text-2xl md:text-3xl font-medium text-zinc-900 leading-snug">
                  Ceruty Babydoll Premium
                </h3>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-64 bg-[#6E2B30] rounded-t-lg shadow-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                  <span className="text-white font-serif text-2xl -rotate-90 tracking-widest">SECERA</span>
                </div>
              </div>
              <p className="text-zinc-600 text-sm md:text-base leading-relaxed transition-colors duration-300 group-hover:text-zinc-900">
                Material flowy yang jatuh sempurna, memberikan tampilan mewah dan kenyamanan maksimal.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="carousel-card min-w-[300px] md:min-w-[400px] flex flex-col gap-6 snap-start cursor-pointer group"
            >
              <div className="bg-[#ffffff] rounded-[2rem] p-8 h-[450px] flex flex-col relative overflow-hidden transition-shadow duration-300 group-hover:shadow-xl">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-800 mb-4">CRAFTSMANSHIP</span>
                <h3 className="text-2xl md:text-3xl font-medium text-zinc-900 leading-snug">
                  Kualitas Butik Presisi
                </h3>
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-64 rounded-3xl overflow-hidden shadow-xl border-4 border-white transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                  <img src="https://images.unsplash.com/photo-1589465885855-44224b203439?q=80&w=400&auto=format&fit=crop" alt="Craftsmanship" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>
              <p className="text-zinc-600 text-sm md:text-base leading-relaxed transition-colors duration-300 group-hover:text-zinc-900">
                Dikerjakan oleh tangan ahli untuk jahitan rapi, kuat, dan tahan lama di setiap helainya.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              className="carousel-card min-w-[300px] md:min-w-[400px] flex flex-col gap-6 snap-start cursor-pointer group"
            >
              <div className="bg-[#ffffff] rounded-[2rem] p-8 h-[450px] flex flex-col relative overflow-hidden transition-shadow duration-300 group-hover:shadow-xl">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-800 mb-4">VERSATILITY</span>
                <h3 className="text-2xl md:text-3xl font-medium text-zinc-900 leading-snug">
                  1 Outer, 3 Looks
                </h3>
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full px-8 flex flex-col gap-3 transition-transform duration-500 group-hover:-translate-y-2">
                  <div className="bg-white/80 backdrop-blur-sm rounded-full py-3 px-6 text-center text-sm font-medium text-zinc-800 shadow-sm transition-colors duration-300 group-hover:bg-white">Gaya Formal</div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-full py-3 px-6 text-center text-sm font-medium text-zinc-800 shadow-sm transition-colors duration-300 group-hover:bg-white">Gaya Kasual</div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-full py-3 px-6 text-center text-sm font-medium text-zinc-800 shadow-sm transition-colors duration-300 group-hover:bg-white">Acara Spesial</div>
                </div>
              </div>
              <p className="text-zinc-600 text-sm md:text-base leading-relaxed transition-colors duration-300 group-hover:text-zinc-900">
                Desain inovatif untuk transformasi gaya instan. Cocok untuk acara formal maupun kasual.
              </p>
            </motion.div>

            {/* Card 4 (Dummy) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
              className="carousel-card min-w-[300px] md:min-w-[400px] flex flex-col gap-6 snap-start cursor-pointer group"
            >
              <div className="bg-[#ffffff] rounded-[2rem] p-8 h-[450px] flex flex-col relative overflow-hidden transition-shadow duration-300 group-hover:shadow-xl">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-800 mb-4">COMFORT</span>
                <h3 className="text-2xl md:text-3xl font-medium text-zinc-900 leading-snug">
                  Ringan & Breathable
                </h3>
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-64 rounded-3xl overflow-hidden shadow-xl border-4 border-white transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                  <img src="https://images.unsplash.com/photo-1515347619152-14123c126839?q=80&w=400&auto=format&fit=crop" alt="Comfort" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>
              <p className="text-zinc-600 text-sm md:text-base leading-relaxed transition-colors duration-300 group-hover:text-zinc-900">
                Tetap segar dan bebas gerak dari pagi hingga malam tanpa rasa gerah.
              </p>
            </motion.div>

            {/* Card 5 (Dummy) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
              className="carousel-card min-w-[300px] md:min-w-[400px] flex flex-col gap-6 snap-start cursor-pointer group"
            >
              <div className="bg-[#ffffff] rounded-[2rem] p-8 h-[450px] flex flex-col relative overflow-hidden transition-shadow duration-300 group-hover:shadow-xl">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-800 mb-4">ELEGANCE</span>
                <h3 className="text-2xl md:text-3xl font-medium text-zinc-900 leading-snug">
                  Timeless Elegance
                </h3>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-64 bg-[#6E2B30] rounded-t-lg shadow-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                  <span className="text-white font-serif text-2xl -rotate-90 tracking-widest">TIMELESS</span>
                </div>
              </div>
              <p className="text-zinc-600 text-sm md:text-base leading-relaxed transition-colors duration-300 group-hover:text-zinc-900">
                Siluet klasik dengan sentuhan modern. Gaya anggun yang selalu relevan di setiap momen.
              </p>
            </motion.div>
          </div>

          {/* Progress Slider */}
          <div className="w-full max-w-md mx-auto mt-8 bg-zinc-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#6E2B30] h-full transition-all duration-300 ease-out"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Product Grid Section */}
      <section className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="max-w-5xl mx-auto text-center mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-2xl md:text-4xl lg:text-[40px] font-serif text-[#6E2B30] leading-snug md:leading-relaxed"
          >
            Secera adalah merek yang menggabungkan keanggunan dan kepraktisan. Terinspirasi oleh kebutuhan wanita modern, kami percaya bahwa tampil memukau tidak harus rumit. Setiap helai dirancang untuk menyelaraskan kenyamanan dan gaya, menghadirkan <span className="italic">timeless elegance</span> dalam setiap detik berharga Anda.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
          {(cms.showcase.productIds?.length > 0
            ? productsList.filter(p => cms.showcase.productIds.includes(p.id))
            : productsList.slice(0, 4)
          ).map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </section>


      {/* UGC Video Section - Infinite Scrolling Carousel */}
      <section className="py-24 overflow-hidden bg-white">
        <div className="px-6 md:px-12 max-w-[1600px] mx-auto mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-3xl md:text-5xl font-serif text-[#6E2B30] mb-4">Our Community</h2>
            <p className="text-zinc-500 max-w-xl">Lihat bagaimana para pelanggan kami tampil memukau dengan koleksi Secera. Tandai kami di media sosial untuk kesempatan ditampilkan di sini.</p>
          </div>
        </div>

        <div className="relative">
          {/* Focal Carousel Container */}
          <div
            ref={ugcRef}
            className="flex gap-3 overflow-x-auto hide-scrollbar snap-x snap-mandatory px-[calc(50%-140px-6px)] md:px-[calc(50%-160px-6px)] py-10"
            onScroll={handleUgcScroll}
          >
            {(cms.ugc.items?.length > 0 ? cms.ugc.items : []).map((ugcItem, index) => {
              const product = productsList.find(p => p.id === ugcItem.productId);
              const variants = product?.product_variants || product?.variants || [];
              const firstVariant = variants[0];
              const thumbnail = ugcItem.thumbnailUrl || product?.thumbnail_url || firstVariant?.image_url;
              const isActive = activeUgcIndex === index;

              return (
                <motion.div
                  key={index}
                  onClick={() => scrollToUgc(index)}
                  animate={{
                    scale: isActive ? 1.1 : 0.9,
                    opacity: isActive ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col shrink-0 w-[280px] md:w-[320px] snap-center cursor-pointer"
                >
                  <div className="relative aspect-square bg-[#F1F2E9] mb-4 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                      poster={thumbnail}
                    >
                      <source src={ugcItem.videoUrl} type="video/mp4" />
                    </video>
                    <div className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white z-10 border border-white/30 opacity-0 group-hover:opacity-100">
                      <VolumeX className="w-5 h-5" />
                    </div>
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none opacity-40">
                      <h3 className="text-2xl font-bold text-white tracking-tighter">secera</h3>
                    </div>
                  </div>

                  <motion.div
                    animate={{
                      opacity: isActive ? 1 : 0,
                      y: isActive ? 0 : 10
                    }}
                  >
                    {product && (
                      <Link to={`/product/${product.id}`} className="flex items-center gap-4 px-2">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#F1F2E9] shrink-0">
                          <img src={thumbnail} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] text-[#6E2B30]/50 uppercase tracking-widest font-bold truncate">({product.category})</span>
                          <h4 className="text-sm font-medium text-[#6E2B30] truncate">{product.short_name}</h4>
                          <div className="flex items-center justify-between gap-4 mt-1">
                            <span className="text-sm font-bold text-[#6E2B30]">{formatPrice(firstVariant?.price ?? 0)}</span>
                            <div className="w-6 h-6 rounded-full bg-[#6E2B30] text-white flex items-center justify-center">
                              <Plus className="w-3 h-3" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {cms.ugc.items.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToUgc(i)}
                className={`w-2 h-2 rounded-full transition-all ${activeUgcIndex === i ? 'w-8 bg-[#6E2B30]' : 'bg-zinc-200'}`}
              />
            ))}
          </div>
        </div>

        <style>{`
          .mask-image-linear {
            mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 md:px-12 max-w-3xl mx-auto w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-serif text-[#6E2B30] text-center mb-4"
        >
          {cms.faq.title}
        </motion.h2>
        <p className="text-zinc-600 text-center mb-16">{cms.faq.description}</p>
        <div className="flex flex-col border-t border-zinc-900">
          {cms.faq.items.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              className="border-b border-zinc-900"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                className="w-full py-6 flex items-center justify-between text-left focus:outline-none group cursor-pointer"
              >
                <span className="text-lg font-medium text-zinc-900 group-hover:text-zinc-600 transition-colors">{faq.question}</span>
                {openFaqIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-zinc-500 font-light shrink-0 ml-4" strokeWidth={1} />
                ) : (
                  <ChevronDown className="w-5 h-5 text-zinc-500 font-light shrink-0 ml-4" strokeWidth={1} />
                )}
              </button>
              <motion.div
                initial={false}
                animate={{ height: openFaqIndex === index ? 'auto' : 0, opacity: openFaqIndex === index ? 1 : 0 }}
                className="overflow-hidden"
              >
                <p className="pb-6 text-zinc-600 leading-relaxed pr-8">
                  {faq.answer}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12"
        >
          <a href="#" className="text-sm text-zinc-900 underline underline-offset-4 hover:text-zinc-600 transition-colors">See more</a>
        </motion.div>
      </section>

    </>
  );
}
