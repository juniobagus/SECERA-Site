import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getCMSContent } from '../utils/api';

const initialAboutContent = {
  hero: {
    title: "Secera adalah tim desainer, pengrajin, dan visioner yang berdedikasi untuk mendefinisikan ulang gaya modest modern.",
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953eb1b5a4?q=80&w=2000&auto=format&fit=crop"
  },
  inspiration: {
    title: "Inspirasi Kami",
    subtitle: "Dalam keanggunan yang sederhana, Secera menemukan makna dari kecantikan yang tak lekang oleh waktu.",
    description1: "Kami terinspirasi oleh harmoni alam dan kelembutan material premium. Secera adalah simbol dari kebangkitan gaya yang mengutamakan kenyamanan tanpa mengorbankan estetika.",
    description2: "Pada akhirnya, kami merancang setiap helai pakaian untuk memberikan rasa percaya diri, ketenangan, dan keindahan bagi setiap wanita yang mengenakannya.",
    imageUrl: "https://images.unsplash.com/photo-1600091166971-7f9faad6c1e2?q=80&w=2000&auto=format&fit=crop"
  },
  mission: {
    title: "Misi Kami",
    subtitle: "Misi kami adalah menetapkan standar baru dalam keanggunan gaya modest modern.",
    description: "Kami mewujudkannya melalui dedikasi pada kualitas material, desain yang tak lekang oleh waktu, dan komitmen untuk memberdayakan setiap wanita agar tampil percaya diri."
  }
};

export default function About() {
  const [content, setContent] = useState(initialAboutContent);

  useEffect(() => {
    async function loadContent() {
      const data = await getCMSContent('about_page');
      if (data) {
        setContent({
          ...initialAboutContent,
          ...data,
          hero: { ...initialAboutContent.hero, ...data.hero },
          inspiration: { ...initialAboutContent.inspiration, ...data.inspiration },
          mission: { ...initialAboutContent.mission, ...data.mission }
        });
      }

      // Also fetch global settings for title
      const globalData = await getCMSContent('main_site');
      if (globalData && globalData.global?.siteTitle) {
        document.title = `${globalData.global.siteTitle} | About`;
      }
    }
    loadContent();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#F9F9F9] p-3 md:p-5 flex flex-col font-sans">
      <div className="relative flex-1 w-full rounded-[2rem] overflow-hidden flex flex-col min-h-[70vh]">
        {/* Background Media (Image or Video) */}
        <div className="absolute inset-0 z-0 scale-105">
          {content.hero.videoUrl ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-center"
              poster={content.hero.imageUrl}
            >
              <source src={content.hero.videoUrl} type="video/mp4" />
            </video>
          ) : (
            <img
              src={content.hero.imageUrl}
              alt="About Secera"
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
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-light tracking-tight mb-6 max-w-5xl leading-tight text-white"
          >
            {content.hero.title}
          </motion.h1>
        </div>
      </div>

      <div className="p-3 md:p-5 flex flex-col gap-3 md:gap-5">

        {/* Our Inspiration Section */}
        <div className="w-full flex flex-col md:flex-row gap-3 md:gap-5">
          <div className="w-full md:w-[40%] relative min-h-[40vh] md:min-h-[60vh] rounded-[2rem] overflow-hidden">
            <img
              src={content.inspiration.imageUrl}
              alt="Inspiration Texture"
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="w-full md:w-[60%] bg-[#6E2B30] rounded-[2rem] p-8 md:p-16 lg:p-24 flex flex-col justify-center text-[#F9F9F9]">
            <h3 className="text-sm font-bold tracking-wide mb-8">
              {content.inspiration.title}
            </h3>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-snug mb-8 max-w-3xl">
              {content.inspiration.subtitle}
            </h2>
            <div className="space-y-6 text-[#F9F9F9]/90 max-w-3xl leading-relaxed md:text-lg">
              <p>{content.inspiration.description1}</p>
              <p>{content.inspiration.description2}</p>
            </div>
          </div>
        </div>

        {/* Our Mission Section */}
        <div className="w-full bg-white rounded-[2rem] py-24 md:py-32 px-6 md:px-12 flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-bold tracking-wide mb-8 text-[#6E2B30]">
            {content.mission.title}
          </h3>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#6E2B30] leading-tight max-w-4xl mb-8">
            {content.mission.subtitle.split('standar').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && <span className="italic">standar</span>}
              </span>
            ))}
          </h2>
          <p className="text-lg md:text-xl text-[#6E2B30]/80 max-w-3xl leading-relaxed">
            {content.mission.description}
          </p>
        </div>
      </div>
    </div>
  );
}
