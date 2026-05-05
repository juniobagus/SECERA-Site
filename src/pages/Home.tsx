/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState, useEffect, useMemo, type MouseEvent } from 'react';
import { Volume2, VolumeX, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { products, formatPrice } from '../data/products';
import { initialCMSContent } from '../data/cms';
import { getCMSContent, getProducts, getSettings } from '../utils/api';
import { getGoogleDrivePreviewUrl, normalizeVideoUrl } from '../utils/media';
import { applyCdn } from '../utils/mediaUrl';
import ProductCard from '../components/ProductCard';
import CTAButton from '../components/CTAButton';
import UGCPlayer from '../components/UGCPlayer';
import UGCProductCard from '../components/UGCProductCard';
import Hero from '../components/Hero';
import SEO from '../components/SEO';


export default function Home() {
  const ugcRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeUgcIndex, setActiveUgcIndex] = useState(0);
  const [cms, setCms] = useState(initialCMSContent);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [cdnBaseUrl, setCdnBaseUrl] = useState('');

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
    async function loadAllData() {
      try {
        const [cmsData, productsData, settingsData] = await Promise.all([
          getCMSContent('main_site'),
          getProducts('active'),
          getSettings()
        ]);
        setCdnBaseUrl(settingsData?.cdn_base_url || '');

        // Process CMS
        if (cmsData) {
          const newCms = {
            ...initialCMSContent,
            ...cmsData,
            hero: { ...initialCMSContent.hero, ...cmsData.hero },
            showcase: { ...initialCMSContent.showcase, ...cmsData.showcase },
            testimonials: { ...initialCMSContent.testimonials, ...cmsData.testimonials },
            ugc: { ...initialCMSContent.ugc, ...cmsData.ugc },
            faq: { ...initialCMSContent.faq, ...cmsData.faq },
            cta: { ...initialCMSContent.cta, ...cmsData.cta },
            features: { ...initialCMSContent.features, ...cmsData.features },
            footer: { ...initialCMSContent.footer, ...cmsData.footer },
            global: { ...initialCMSContent.global, ...cmsData.global },
            stylePreference: { ...initialCMSContent.stylePreference, ...cmsData.stylePreference }
          };
          setCms(newCms);
        }

        // Process Products
        if (productsData && productsData.length > 0) {
          setProductsList(productsData);
        } else {
          setProductsList(products); // Fallback to static data if API is empty
        }
      } catch (error) {
        console.error('Failed to load home data:', error);
      }
    }

    loadAllData();
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

  return (
    <>
      <SEO 
        title={cms.seo?.title || cms.global.siteTitle}
        description={cms.seo?.description || cms.global.seoDescription}
        ogImage={cms.seo?.ogImage}
      />
      <div className="min-h-screen w-full bg-[#F9F9F9] flex flex-col font-sans">
        <Hero
          title={cms.hero.title}
          subtitle={cms.hero.subtitle}
          cta={{
            text: cms.hero.cta,
            link: cms.hero.link || '/shop'
          }}
          imageUrl={applyCdn(cms.hero.imageUrl, cdnBaseUrl)}
          videoUrl={cms.hero.videoUrl}
          alignment="center"
        />

        {/* Style Preference Section */}
        <section className="w-full bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {(cms.stylePreference?.items || []).map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="group relative h-[70vh] md:h-[85vh] overflow-hidden flex flex-col justify-end p-8 md:p-12"
              >
                {/* Background Image with Shimmer */}
                <div className="absolute inset-0 z-0 bg-paper">
                  <motion.img
                    src={item.imageUrl}
                    alt={item.title}
                    initial={{ scale: 1.15, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                  />
                  {/* Overlays */}
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
                    className="text-label text-white/80 mb-2 uppercase tracking-widest text-xs md:text-sm"
                  >
                    {item.subtitle}
                  </motion.p>
                  <motion.h3
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.35, ease: [0.25, 1, 0.5, 1] }}
                    className="text-5xl md:text-7xl font-serif text-white mb-8"
                  >
                    {item.title}
                  </motion.h3>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5, ease: [0.25, 1, 0.5, 1] }}
                  >
                    <CTAButton 
                      as="div"
                      variant="transparent"
                    >
                      {item.cta}
                    </CTAButton>
                  </motion.div>
                </div>

                {/* Border line between items */}
                {index === 0 && (
                  <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[1px] bg-white/10 z-20" />
                )}
              </Link>
            ))}
          </div>
        </section>


      </div>

      {/* Product Grid Section */}
      <section className="pt-20 pb-24 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="max-w-4xl mr-auto mb-16 md:mb-20">
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
            className="text-label text-[#722F38]/55 mb-4"
          >
            {cms.showcase.label}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#6E2B30] leading-tight max-w-3xl"
          >
            {cms.showcase.title.includes(' yang ') ? (
              <>
                {cms.showcase.title.split(' yang ')[0]} yang <span className="text-zinc-400">{cms.showcase.title.split(' yang ')[1]}</span>
              </>
            ) : (
              cms.showcase.title
            )}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, delay: 0.25, ease: [0.25, 1, 0.5, 1] }}
            className="text-[#3A3A3A]/70 mt-5 max-w-2xl"
          >
            {cms.showcase.description}
          </motion.p>
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
      <section className="py-20 overflow-hidden bg-white">
        <div className="px-6 md:px-12 max-w-[1600px] mx-auto mb-12 flex items-end justify-between">
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
              className="text-3xl md:text-5xl font-serif text-brand-wine mb-4"
            >
              {cms.ugc.title}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
              className="text-muted max-w-xl"
            >
              {cms.ugc.subtitle}
            </motion.p>
          </div>
        </div>

        <div className="relative">
          {/* Focal Carousel Container */}
          <div
            ref={ugcRef}
            className="flex gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory px-[calc(50%-140px-8px)] md:px-[calc(50%-160px-8px)] py-10"
            onScroll={handleUgcScroll}
          >
            {(cms.ugc.items?.length > 0 ? cms.ugc.items : []).map((ugcItem, index) => {
              const product = productsList.find((p) => p.id === ugcItem.productId);
              const variants = product?.product_variants || product?.variants || [];
              const firstVariant = variants[0];
              const thumbnail = ugcItem.thumbnailUrl || product?.thumbnail_url || firstVariant?.image_url;
              const isActive = activeUgcIndex === index;

              return (
                <motion.div
                  key={index}
                  animate={{
                    scale: isActive ? 1.1 : 0.92,
                    opacity: isActive ? 1 : 0.6,
                  }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col shrink-0 w-[280px] md:w-[320px] snap-center"
                >
                  <UGCPlayer
                    videoUrl={ugcItem.videoUrl}
                    thumbnail={thumbnail}
                    isActive={isActive}
                  />

                  <UGCProductCard
                    product={product}
                    thumbnail={thumbnail}
                    isActive={isActive}
                  />
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
                aria-label={`Lihat video pelanggan ke-${i + 1}`}
                className={`w-2 h-2 transition-all ${activeUgcIndex === i ? 'w-8 bg-brand-wine' : 'bg-zinc-200'} rounded-none`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 md:px-12 max-w-3xl mx-auto w-full">
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
          className="text-4xl md:text-5xl font-serif text-[#6E2B30] text-center mb-4"
        >
          {cms.faq.title}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
          className="text-zinc-600 text-center mb-12"
        >
          {cms.faq.description}
        </motion.p>
        <div className="flex flex-col border-t border-zinc-900">
          {cms.faq.items.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.12, ease: [0.25, 1, 0.5, 1] }}
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
        </motion.div>
      </section>

    </>
  );
}
