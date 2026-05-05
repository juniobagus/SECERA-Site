import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Briefcase, MapPin, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { getJobs, getCMSContent } from '../utils/api';
import Hero from '../components/Hero';
import SEO from '../components/SEO';
import CTAButton from '../components/CTAButton';

export default function Careers() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cmsContent, setCmsContent] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [jobsData, cmsData] = await Promise.all([
          getJobs(),
          getCMSContent('career_page')
        ]);
        setJobs(jobsData);
        setCmsContent(cmsData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const content = {
    hero: {
      title: cmsContent?.hero?.title || "Bergabung dengan Secera",
      subtitle: cmsContent?.hero?.subtitle || "Wujudkan visi fashion masa depan bersama tim kami yang berdedikasi pada keanggunan dan kualitas.",
      imageUrl: cmsContent?.hero?.imageUrl || "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000&auto=format&fit=crop",
      videoUrl: cmsContent?.hero?.videoUrl || ""
    },
    intro: {
      badge: cmsContent?.intro?.badge || "Career at Secera",
      title: cmsContent?.intro?.title || "Kembangkan Karir Anda dalam Seni Berpakaian",
      description: cmsContent?.intro?.description || "Di Secera, kami percaya bahwa fashion bukan sekadar pakaian, tapi sebuah pernyataan diri. Kami mencari individu kreatif yang memiliki gairah dalam detail, kualitas, dan inovasi."
    },
    values: {
      title: cmsContent?.values?.title || "Mengapa Bekerja di Secera?",
      subtitle: cmsContent?.values?.subtitle || "Budaya kerja yang inklusif, kreatif, dan berorientasi pada kualitas tinggi.",
      items: cmsContent?.values?.items || [
        { title: 'Creative Freedom', description: 'Kami menghargai ide-ide segar dan memberikan ruang bagi tim untuk mengeksplorasi kreativitas mereka tanpa batas.', icon: Briefcase },
        { title: 'Growth Mindset', description: 'Secera berinvestasi pada pengembangan tim melalui pelatihan, mentoring, dan kesempatan karir yang jelas.', icon: MapPin },
        { title: 'Premium Standards', description: 'Bergabunglah dengan tim yang tidak pernah berkompromi pada kualitas dan estetika dalam setiap detail pekerjaan.', icon: Clock }
      ]
    }
  };

  const iconMap: any = { Briefcase, MapPin, Clock };

  return (
    <div className="min-h-screen bg-paper flex flex-col font-sans">
      <SEO 
        title={cmsContent?.seo?.title || "Careers"}
        description={cmsContent?.seo?.description}
        ogImage={cmsContent?.seo?.ogImage}
      />
      <Hero 
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        imageUrl={content.hero.imageUrl}
        videoUrl={content.hero.videoUrl}
        height="min-h-[70vh]"
        alignment="left"
      />

      <section className="py-24 px-4 md:px-10 max-w-[1400px] mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-16 md:gap-32">
          {/* Left Content: Intro */}
          <div className="md:w-1/3">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-[11px] font-bold uppercase tracking-[0.4em] text-muted block mb-8"
            >
              {content.intro.badge}
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-serif text-ink leading-[1.1] mb-10 tracking-tight"
            >
              {content.intro.title}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-ink/70 leading-relaxed mb-8 font-medium max-w-sm"
            >
              {content.intro.description}
            </motion.p>
          </div>

          {/* Right Content: Job List */}
          <div className="flex-1">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-ink mb-8 uppercase tracking-widest border-b border-brand-wine/10 pb-4">Lowongan Tersedia</h3>
              
              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-8 h-8 text-[#722F38] animate-spin" />
                  <p className="text-[10px] text-ink/40 font-bold uppercase tracking-[0.2em]">Memuat lowongan...</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="py-20 text-center border border-ink/5">
                  <p className="text-ink/60 font-medium italic">Saat ini belum ada lowongan yang tersedia.</p>
                  <p className="text-[10px] text-ink/30 mt-4 uppercase tracking-widest">Silakan cek kembali di lain waktu.</p>
                </div>
              ) : (
                <div className="grid gap-0">
                  {jobs.map((job, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={job.id}
                      className="group bg-white p-10 border border-ink/5 border-b-0 last:border-b hover:bg-[#722F38]/[0.02] transition-all duration-500"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-4">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-wine">
                            {job.department}
                          </span>
                          <h4 className="text-3xl font-serif text-ink leading-none group-hover:text-brand-wine transition-colors duration-500">{job.title}</h4>
                          <div className="flex items-center gap-8 text-[11px] text-ink/40 font-bold uppercase tracking-[0.1em]">
                            <span className="flex items-center"><MapPin className="w-3 h-3 mr-2 text-brand-wine" /> {job.location}</span>
                            <span className="flex items-center"><Clock className="w-3 h-3 mr-2 text-brand-wine" /> {job.type}</span>
                          </div>
                        </div>
                        <CTAButton 
                          to={`/karir/${job.slug || job.id}`}
                          variant="wine"
                        >
                          Lihat Detail
                        </CTAButton>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 bg-[#722F38] text-offwhite overflow-hidden relative">
        {/* Subtle texture/pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstripe-dark.png')]"></div>
        
        <div className="max-w-[1400px] mx-auto px-4 md:px-10 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-6xl font-serif text-white mb-6 leading-none">{content.values.title}</h2>
              <p className="text-white/60 text-lg italic serif leading-relaxed">{content.values.subtitle}</p>
            </div>
            <div className="hidden md:block w-32 h-px bg-white/20 mb-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/10 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {content.values.items.map((item: any, idx: number) => {
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  key={idx} 
                  className="p-12 space-y-8 hover:bg-white/[0.03] transition-colors duration-700"
                >
                  <div className="text-white">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 block mb-4">0{idx + 1}</span>
                    <div className="w-px h-12 bg-white/20"></div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xl font-serif text-white leading-tight">{item.title}</h4>
                    <p className="text-sm text-white/70 leading-relaxed font-medium">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
