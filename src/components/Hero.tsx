import { useState, useMemo, useEffect } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import { normalizeVideoUrl, getGoogleDrivePreviewUrl } from '../utils/media';
import CTAButton from './CTAButton';

interface HeroProps {
  title: React.ReactNode;
  subtitle?: string;
  cta?: {
    text: string;
    link: string;
    type?: 'button' | 'link';
  };
  imageUrl?: string;
  videoUrl?: string;
  alignment?: 'center' | 'bottom';
  height?: string;
  className?: string;
}

export default function Hero({
  title,
  subtitle,
  cta,
  imageUrl,
  videoUrl,
  alignment = 'center',
  height = 'min-h-screen',
  className = ''
}: HeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const [videoFailed, setVideoFailed] = useState(false);
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);

  const normalizedUrl = useMemo(() => normalizeVideoUrl(videoUrl || ''), [videoUrl]);
  const drivePreviewUrl = useMemo(() => getGoogleDrivePreviewUrl(normalizedUrl), [normalizedUrl]);

  useEffect(() => {
    setVideoFailed(false);
  }, [videoUrl]);

  const videoMimeType = useMemo(() => {
    if (!normalizedUrl) return undefined;
    const clean = normalizedUrl.split('?')[0].toLowerCase();
    if (clean.endsWith('.mp4')) return 'video/mp4';
    if (clean.endsWith('.webm')) return 'video/webm';
    if (clean.endsWith('.ogv') || clean.endsWith('.ogg')) return 'video/ogg';
    return undefined;
  }, [normalizedUrl]);

  useEffect(() => {
    setIsMediaLoaded(false);
  }, [videoUrl, imageUrl]);

  return (
    <div className={`relative w-full overflow-hidden flex flex-col ${height} ${className}`}>
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence>
          {!isMediaLoaded && (
            <motion.div
              key="hero-skeleton"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 bg-paper"
            >
              <motion.div
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ 
            opacity: isMediaLoaded ? 1 : 0,
            scale: isMediaLoaded ? 1 : 1.1
          }}
          transition={{ 
            opacity: { duration: 1.4, ease: [0.25, 1, 0.5, 1] },
            scale: { duration: 2.5, ease: [0.16, 1, 0.3, 1] }
          }}
          className="w-full h-full"
        >
          {drivePreviewUrl && !shouldReduceMotion ? (
            <iframe
              src={drivePreviewUrl}
              onLoad={() => setIsMediaLoaded(true)}
              className="w-full h-full object-cover object-center"
              allow="autoplay"
              referrerPolicy="no-referrer"
              title="Hero video"
            />
          ) : normalizedUrl && !videoFailed && !shouldReduceMotion ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              onLoadedData={() => setIsMediaLoaded(true)}
              className="w-full h-full object-cover object-center"
              preload="auto"
              onError={() => setVideoFailed(true)}
              key={normalizedUrl}
            >
              <source src={normalizedUrl} {...(videoMimeType ? { type: videoMimeType } : {})} />
            </video>
          ) : (
            <img
              src={imageUrl}
              alt="Hero Background"
              onLoad={() => setIsMediaLoaded(true)}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          )}
        </motion.div>
        
        {/* Editorial Overlays */}
        <div className="absolute inset-0 bg-[#3A3A3A]/35" />
        <div className="absolute inset-0 bg-[#722F38]/10" />
        {alignment === 'bottom' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#5A252D]/65 via-[#5A252D]/35 to-[#3A3A3A]/15" />
        )}
      </div>

      {/* Content Container */}
      <div className={`relative z-10 flex flex-col flex-1 w-full max-w-[1400px] mx-auto px-6 md:px-12 ${
        alignment === 'center' ? 'items-center justify-center text-center' : 'justify-end pb-12 md:pb-20'
      }`}>
        <div className={alignment === 'center' ? 'max-w-4xl' : 'max-w-3xl'}>
          {subtitle && (
            <motion.p
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              animate={isMediaLoaded ? { opacity: 1, y: 0 } : {}}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 1, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
              className={`text-label text-white/70 mb-4 uppercase tracking-widest ${alignment === 'center' ? 'text-center' : ''}`}
            >
              {subtitle}
            </motion.p>
          )}

          <motion.h1
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            animate={isMediaLoaded ? { opacity: 1, y: 0 } : {}}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 1.2, delay: 0.55, ease: [0.25, 1, 0.5, 1] }}
            className={`${alignment === 'center' ? 'text-5xl md:text-7xl lg:text-8xl' : 'text-display'} font-serif mb-10 leading-tight text-white`}
          >
            {title}
          </motion.h1>

          {cta && (
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              animate={isMediaLoaded ? { opacity: 1, y: 0 } : {}}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 1, delay: 0.75, ease: [0.25, 1, 0.5, 1] }}
              className={`flex flex-wrap items-center gap-6 ${alignment === 'center' ? 'justify-center' : ''}`}
            >
              {cta.type === 'link' ? (
                <a
                  href={cta.link}
                  className="inline-flex items-center justify-center bg-white text-brand-wine-deep text-label py-4 px-10 transition-all shadow-xl hover:translate-y-[-2px] active:translate-y-0"
                >
                  {cta.text}
                </a>
              ) : (
                <CTAButton to={cta.link} className="w-full sm:w-auto">
                  {cta.text}
                </CTAButton>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
