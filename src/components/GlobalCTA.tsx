import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { initialCMSContent } from '../data/cms';
import { getCMSContent } from '../utils/api';

export default function GlobalCTA() {
  const [cms, setCms] = useState(initialCMSContent);

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
    <section className="w-full px-4 md:px-6 lg:px-8 py-12 md:py-24 bg-[#F9F9F9]">
      <div className="max-w-[1600px] mx-auto">
        <div className="relative w-full rounded-[2rem] overflow-hidden py-24 md:py-32 px-6 flex flex-col items-center justify-center text-center">
          {/* Background Video */}
          <div className="absolute inset-0 bg-[#F4F5F0]"></div>
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover opacity-90 pointer-events-none"
            >
              <source src="https://cdn.joinvoy.com/voyage/video/voytex-MIX-homepage-desktop.mp4" type="video/mp4" />
            </video>
            {/* Optional tint to blend with Secera's brand colors */}
            <div className="absolute inset-0 bg-[#F1F2E9]/10 mix-blend-overlay"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#722F38] leading-tight mb-6"
            >
              {cms.cta.title}
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg md:text-xl text-[#722F38]/80 mb-10"
            >
              {cms.cta.description}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative group inline-block p-[2px] rounded-full"
            >
              {/* Outer Glow (Blurred) */}
              <div className="absolute inset-0 rounded-full overflow-hidden blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#FFFFFF_50%,transparent_100%)]"></span>
              </div>

              {/* Inner Border (Sharp) */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#FFFFFF_50%,transparent_100%)]"></span>
              </div>

              <button 
                onClick={() => window.location.href = '/shop'}
                className="relative w-full h-full overflow-hidden px-10 py-5 rounded-full bg-[#F9F9F9] text-[#722F38] font-medium transition-all cursor-pointer"
              >
                {/* Shimmer Sweep Effect */}
                <div className="absolute top-0 left-0 w-full h-full -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-[#722F38]/10 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none z-10"></div>

                <span className="relative z-10 text-lg pointer-events-none">{cms.cta.buttonText}</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
