import { useState, useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { initialCMSContent } from '../data/cms';
import { getCMSContent } from '../utils/api';
import { getGoogleDrivePreviewUrl, normalizeVideoUrl } from '../utils/media';
import CTAButton from './CTAButton';

export default function GlobalCTA() {
  const [cms, setCms] = useState(initialCMSContent);
  const shouldReduceMotion = useReducedMotion();
  const [heroVideoFailed, setHeroVideoFailed] = useState(false);

  const heroVideoUrl = normalizeVideoUrl(cms.cta.backgroundVideoUrl || '');
  const heroDrivePreviewUrl = useMemo(() => getGoogleDrivePreviewUrl(heroVideoUrl), [heroVideoUrl]);
  useEffect(() => {
    setHeroVideoFailed(false);
  }, [heroVideoUrl]);

  const heroVideoMimeType = useMemo(() => {
    if (!heroVideoUrl) return undefined;
    const clean = heroVideoUrl.split('?')[0].toLowerCase();
    if (clean.endsWith('.mp4')) return 'video/mp4';
    if (clean.endsWith('.webm')) return 'video/webm';
    if (clean.endsWith('.ogv') || clean.endsWith('.ogg')) return 'video/ogg';
    return undefined;
  }, [heroVideoUrl]);

  useEffect(() => {
    async function loadCMS() {
      const data = await getCMSContent('main_site');
      if (data) {
        setCms({
          ...initialCMSContent,
          ...data,
          hero: { ...initialCMSContent.hero, ...data.hero },
          faq: { ...initialCMSContent.faq, ...data.faq },
          cta: { ...initialCMSContent.cta, ...data.cta },
          features: { ...initialCMSContent.features, ...data.features },
          footer: { ...initialCMSContent.footer, ...data.footer }
        });
      }
    }
    loadCMS();
  }, []);

  return (
    <section className="w-full min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-[#3A3A3A]" />
      {heroDrivePreviewUrl && !shouldReduceMotion ? (
        <iframe
          src={heroDrivePreviewUrl}
          className="absolute inset-0 w-full h-full object-cover"
          allow="autoplay"
          referrerPolicy="no-referrer"
          title="Hero video"
        />
      ) : heroVideoUrl && !heroVideoFailed && !shouldReduceMotion ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onError={() => setHeroVideoFailed(true)}
          className="absolute inset-0 w-full h-full object-cover"
          key={heroVideoUrl}
        >
          <source src={heroVideoUrl} {...(heroVideoMimeType ? { type: heroVideoMimeType } : {})} />
        </video>
      ) : (
        <img
          src={
            cms.cta.backgroundImageUrl ||
            cms.hero.imageUrl ||
            'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop'
          }
          alt={cms.cta.title}
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      )}
      <div className="absolute inset-0 bg-[#3A3A3A]/30" />
      <div className="absolute inset-0 bg-[#722F38]/12" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 py-24">
        <motion.h2
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.7, ease: 'easeOut' }}
          className="text-[#F9F9F9] text-4xl md:text-6xl lg:text-7xl font-serif leading-tight max-w-5xl"
        >
          {cms.cta.title}
        </motion.h2>

        <motion.p
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.7, delay: 0.08, ease: 'easeOut' }}
          className="text-[#F9F9F9]/88 text-sm md:text-lg mt-6 mb-10 max-w-4xl"
        >
          {cms.cta.description}
        </motion.p>

        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.65, delay: 0.14, ease: 'easeOut' }}
        >
          <CTAButton 
            to={cms.cta.buttonLink || '/shop'}
            variant="transparent"
          >
            {cms.cta.buttonText}
          </CTAButton>
        </motion.div>
      </div>
    </section>
  );
}
