import { useState, useEffect } from 'react';
import { getCMSContent } from '../utils/api';
import Hero from '../components/Hero';
import SEO from '../components/SEO';

const initialAboutContent = {
  hero: {
    title: "Tentang Secera",
    subtitle: "Secera adalah tim desainer, pengrajin, dan visioner yang berdedikasi untuk mendefinisikan ulang gaya modest modern.",
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953eb1b5a4?q=80&w=2000&auto=format&fit=crop",
    videoUrl: ""
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
    }
    loadContent();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#F9F9F9] flex flex-col font-sans">
      <SEO 
        title={(content as any).seo?.title || "About Us"}
        description={(content as any).seo?.description}
        ogImage={(content as any).seo?.ogImage}
      />
      <Hero
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        imageUrl={content.hero.imageUrl}
        videoUrl={content.hero.videoUrl}
        alignment="center"
      />

      <div className="flex flex-col">

        {/* Our Inspiration Section */}
        <div className="w-full flex flex-col md:flex-row">
          <div className="w-full md:w-[40%] relative min-h-[40vh] md:min-h-[60vh] rounded-[2rem] overflow-hidden">
            <img
              src={content.inspiration.imageUrl}
              alt="Inspiration Texture"
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="w-full md:w-[60%] bg-[#6E2B30] rounded-[2rem] p-8 md:p-16 lg:p-24 flex flex-col justify-center text-[#F9F9F9]">
            <span className="text-[10px] font-medium tracking-widest mb-1 uppercase">
              {content.inspiration.title}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-snug mb-8 max-w-3xl">
              {content.inspiration.subtitle}
            </h2>
            <div className="space-y-6 leading-relaxed text-lg md:text-xl text-white/90 mb-10 max-w-2xl font-light">
              <p>{content.inspiration.description1}</p>
              <p>{content.inspiration.description2}</p>
            </div>
          </div>
        </div>

        {/* Our Mission Section */}
        <div className="w-full bg-white rounded-[2rem] py-24 md:py-32 px-6 md:px-12 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] text-[#6E2B30] font-medium tracking-widest mb-1 uppercase">
            {content.mission.title}
          </span>
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
