import { useState, useEffect } from 'react';
import { Save, Globe, Home, Info, Plus, Trash2, Video, MessageSquare, Star, Search, GripVertical, Briefcase, MapPin, Clock } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { initialCMSContent } from '../../data/cms';
import { getCMSContent, saveCMSContent, getProducts, uploadVideo, getSettings } from '../../utils/api';
import ImageUpload from '../../components/admin/ImageUpload';
import SEOFields from '../../components/admin/SEOFields';
import { formatPrice } from '../../data/products';

const initialAboutContent = {
  hero: {
    title: 'Tentang Secera',
    subtitle: 'Secera adalah tim desainer, pengrajin, dan visioner yang berdedikasi untuk mendefinisikan ulang gaya modest modern.',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953eb1b5a4?q=80&w=2000&auto=format&fit=crop'
  },
  inspiration: {
    title: 'Inspirasi Kami',
    subtitle: 'Dalam keanggunan yang sederhana, Secera menemukan makna dari kecantikan yang tak lekang oleh waktu.',
    description1: 'Kami terinspirasi oleh harmoni alam and kelembutan material premium. Secera adalah simbol dari kebangkitan gaya yang mengutamakan kenyamanan tanpa mengorbankan estetika.',
    description2: 'Pada akhirnya, kami merancang setiap helai pakaian untuk memberikan rasa percaya diri, ketenangan, dan keindahan bagi setiap wanita yang mengenakannya.',
    imageUrl: 'https://images.unsplash.com/photo-1600091166971-7f9faad6c1e2?q=80&w=2000&auto=format&fit=crop'
  },
  mission: {
    title: 'Misi Kami',
    subtitle: 'Misi kami adalah menetapkan standar baru dalam keanggunan gaya modest modern.',
    description: 'Kami mewujudkannya melalui dedikasi pada kualitas material, desain yang tak lekang oleh waktu, dan komitmen untuk memberdayakan setiap wanita agar tampil percaya diri.'
  },
  seo: {
    title: '',
    description: '',
    ogImage: '',
    slug: 'about'
  }
};
const initialShopContent = {
  hero: {
    title: "Koleksi Eksklusif Secera",
    subtitle: "Temukan keanggunan dalam setiap helai pakaian kami yang dirancang khusus untuk Anda.",
    imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
  },
  seo: {
    title: '',
    description: '',
    ogImage: '',
    slug: 'shop'
  }
};
const initialCareerContent = {
  hero: {
    title: 'Bergabung dengan Secera',
    subtitle: 'Wujudkan visi fashion masa depan bersama tim kami yang berdedikasi pada keanggunan dan kualitas.',
    imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000&auto=format&fit=crop',
    videoUrl: ''
  },
  intro: {
    badge: 'Career at Secera',
    title: 'Kembangkan Karir Anda dalam Seni Berpakaian',
    description: 'Di Secera, kami percaya bahwa fashion bukan sekadar pakaian, tapi sebuah pernyataan diri. Kami mencari individu kreatif yang memiliki gairah dalam detail, kualitas, dan inovasi.'
  },
  values: {
    title: 'Mengapa Bekerja di Secera?',
    subtitle: 'Budaya kerja yang inklusif, kreatif, dan berorientasi pada kualitas tinggi.',
    items: [
      {
        title: 'Creative Freedom',
        description: 'Kami menghargai ide-ide segar dan memberikan ruang bagi tim untuk mengeksplorasi kreativitas mereka tanpa batas.',
        icon: 'Briefcase'
      },
      {
        title: 'Growth Mindset',
        description: 'Secera berinvestasi pada pengembangan tim melalui pelatihan, mentoring, dan kesempatan karir yang jelas.',
        icon: 'MapPin'
      },
      {
        title: 'Premium Standards',
        description: 'Bergabunglah dengan tim yang tidak pernah berkompromi pada kualitas dan estetika dalam setiap detail pekerjaan.',
        icon: 'Clock'
      }
    ]
  },
  seo: {
    title: '',
    description: '',
    ogImage: '',
    slug: 'careers'
  }
};

export default function AdminCMS() {
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'shop' | 'career' | 'global'>('home');
  const [isSaving, setIsSaving] = useState(false);
  const [homeContent, setHomeContent] = useState(initialCMSContent);
  const [aboutContent, setAboutContent] = useState(initialAboutContent);
  const [shopContent, setShopContent] = useState(initialShopContent);
  const [careerContent, setCareerContent] = useState(initialCareerContent);
  const [products, setProducts] = useState<any[]>([]);
  const [heroImageSlot, setHeroImageSlot] = useState<'hero_16x9' | 'hero_original'>('hero_16x9');

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      setProducts(data);
    }
    loadProducts();
  }, []);

  useEffect(() => {
    async function loadMediaSettings() {
      const settings = await getSettings();
      const mode = String(settings?.hero_image_mode || 'compressed').toLowerCase();
      setHeroImageSlot(mode === 'original' ? 'hero_original' : 'hero_16x9');
    }
    loadMediaSettings();
  }, []);

  useEffect(() => {
    async function loadContent() {
      if (activeTab === 'home' || activeTab === 'global') {
        const saved = await getCMSContent('main_site');
        if (saved) {
          setHomeContent({
            hero: {
              title: saved.hero?.title || initialCMSContent.hero.title,
              subtitle: saved.hero?.subtitle || initialCMSContent.hero.subtitle,
              cta: saved.hero?.cta || initialCMSContent.hero.cta,
              link: saved.hero?.link || initialCMSContent.hero.link || '',
              imageUrl: saved.hero?.imageUrl ?? initialCMSContent.hero.imageUrl,
              videoUrl: saved.hero?.videoUrl || ''
            },
            showcase: {
              label: saved.showcase?.label || initialCMSContent.showcase.label,
              title: saved.showcase?.title || initialCMSContent.showcase.title,
              description: saved.showcase?.description || initialCMSContent.showcase.description,
              productIds: saved.showcase?.productIds || initialCMSContent.showcase.productIds
            },
            features: {
              title: saved.features?.title || initialCMSContent.features.title,
              description: saved.features?.description || initialCMSContent.features.description,
              items: (saved.features?.items || initialCMSContent.features.items).map((item: any, i: number) => ({
                title: item.title || initialCMSContent.features.items[i]?.title || '',
                description: item.description || initialCMSContent.features.items[i]?.description || '',
                icon: item.icon || initialCMSContent.features.items[i]?.icon || ''
              }))
            },
            testimonials: {
              title: saved.testimonials?.title || initialCMSContent.testimonials.title,
              subtitle: saved.testimonials?.subtitle || initialCMSContent.testimonials.subtitle,
              items: (saved.testimonials?.items || initialCMSContent.testimonials.items).map((item: any, i: number) => ({
                name: item.name || '',
                role: item.role || '',
                content: item.content || '',
                avatar: item.avatar || ''
              }))
            },
            ugc: {
              title: saved.ugc?.title || initialCMSContent.ugc.title,
              subtitle: saved.ugc?.subtitle || initialCMSContent.ugc.subtitle,
              items: (saved.ugc?.items || initialCMSContent.ugc.items).map((item: any, i: number) => ({
                videoUrl: item.videoUrl || '',
                productId: item.productId || '',
                thumbnailUrl: item.thumbnailUrl || ''
              }))
            },
            faq: {
              title: saved.faq?.title || initialCMSContent.faq.title,
              description: saved.faq?.description || initialCMSContent.faq.description,
              items: (saved.faq?.items || initialCMSContent.faq.items).map((item: any, i: number) => ({
                id: item.id || `faq-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
                question: item.question || initialCMSContent.faq.items[i]?.question || '',
                answer: item.answer || initialCMSContent.faq.items[i]?.answer || ''
              }))
            },
            cta: {
              title: saved.cta?.title || initialCMSContent.cta.title,
              description: saved.cta?.description || initialCMSContent.cta.description,
              buttonText: saved.cta?.buttonText || initialCMSContent.cta.buttonText,
              buttonLink: saved.cta?.buttonLink || initialCMSContent.cta.buttonLink,
              backgroundImageUrl: saved.cta?.backgroundImageUrl || initialCMSContent.cta.backgroundImageUrl || '',
              backgroundVideoUrl: saved.cta?.backgroundVideoUrl || initialCMSContent.cta.backgroundVideoUrl || ''
            },
            footer: {
              tagline: saved.footer?.tagline || initialCMSContent.footer.tagline,
              email: saved.footer?.email || initialCMSContent.footer.email,
              phone: saved.footer?.phone || initialCMSContent.footer.phone,
              copyright: saved.footer?.copyright || initialCMSContent.footer.copyright,
              links: saved.footer?.links || initialCMSContent.footer.links
            },
            marquee: {
              items: saved.marquee?.items || initialCMSContent.marquee.items
            },
            global: {
              siteTitle: saved.global?.siteTitle || initialCMSContent.global.siteTitle,
              seoDescription: saved.global?.seoDescription || initialCMSContent.global.seoDescription,
              seoKeywords: saved.global?.seoKeywords || initialCMSContent.global.seoKeywords,
            },
            stylePreference: {
              title: saved.stylePreference?.title || initialCMSContent.stylePreference.title,
              items: (saved.stylePreference?.items || initialCMSContent.stylePreference.items).map((item: any, i: number) => ({
                title: item.title || initialCMSContent.stylePreference.items[i]?.title || '',
                subtitle: item.subtitle || initialCMSContent.stylePreference.items[i]?.subtitle || '',
                cta: item.cta || initialCMSContent.stylePreference.items[i]?.cta || '',
                link: item.link || initialCMSContent.stylePreference.items[i]?.link || '',
                imageUrl: item.imageUrl ?? initialCMSContent.stylePreference.items[i]?.imageUrl ?? '',
                videoUrl: item.videoUrl || ''
              }))
            },
            seo: {
              title: saved.seo?.title || saved.global?.siteTitle || '',
              description: saved.seo?.description || saved.global?.seoDescription || '',
              ogImage: saved.seo?.ogImage || '',
              slug: saved.seo?.slug || 'home'
            }
          });
        }
      } else if (activeTab === 'about') {
        const saved = await getCMSContent('about_page');
        if (saved) {
          setAboutContent({
            hero: {
              title: saved.hero?.title || initialAboutContent.hero.title,
              subtitle: saved.hero?.subtitle || initialAboutContent.hero.subtitle,
              imageUrl: saved.hero?.imageUrl ?? initialAboutContent.hero.imageUrl,
              videoUrl: saved.hero?.videoUrl || ''
            },
            inspiration: {
              title: saved.inspiration?.title || initialAboutContent.inspiration.title,
              subtitle: saved.inspiration?.subtitle || initialAboutContent.inspiration.subtitle,
              description1: saved.inspiration?.description1 || initialAboutContent.inspiration.description1,
              description2: saved.inspiration?.description2 || initialAboutContent.inspiration.description2,
              imageUrl: saved.inspiration?.imageUrl ?? initialAboutContent.inspiration.imageUrl
            },
            mission: {
              title: saved.mission?.title || initialAboutContent.mission.title,
              subtitle: saved.mission?.subtitle || initialAboutContent.mission.subtitle,
              description: saved.mission?.description || initialAboutContent.mission.description
            },
            seo: {
              title: saved.seo?.title || '',
              description: saved.seo?.description || '',
              ogImage: saved.seo?.ogImage || '',
              slug: saved.seo?.slug || 'about'
            }
          });
        }
      } else if (activeTab === 'shop') {
        const saved = await getCMSContent('shop_page');
        if (saved) {
          setShopContent({
            hero: {
              title: saved.hero?.title || initialShopContent.hero.title,
              subtitle: saved.hero?.subtitle || initialShopContent.hero.subtitle,
              imageUrl: saved.hero?.imageUrl ?? initialShopContent.hero.imageUrl,
              videoUrl: saved.hero?.videoUrl || ''
            },
            seo: {
              title: saved.seo?.title || '',
              description: saved.seo?.description || '',
              ogImage: saved.seo?.ogImage || '',
              slug: saved.seo?.slug || 'shop'
            }
          });
        }
      } else if (activeTab === 'career') {
        const saved = await getCMSContent('career_page');
        if (saved) {
          setCareerContent({
            hero: {
              title: saved.hero?.title || initialCareerContent.hero.title,
              subtitle: saved.hero?.subtitle || initialCareerContent.hero.subtitle,
              imageUrl: saved.hero?.imageUrl ?? initialCareerContent.hero.imageUrl,
              videoUrl: saved.hero?.videoUrl || ''
            },
            intro: {
              badge: saved.intro?.badge || initialCareerContent.intro.badge,
              title: saved.intro?.title || initialCareerContent.intro.title,
              description: saved.intro?.description || initialCareerContent.intro.description
            },
            values: {
              title: saved.values?.title || initialCareerContent.values.title,
              subtitle: saved.values?.subtitle || initialCareerContent.values.subtitle,
              items: (saved.values?.items || initialCareerContent.values.items).map((item: any, i: number) => ({
                title: item.title || initialCareerContent.values.items[i]?.title || '',
                description: item.description || initialCareerContent.values.items[i]?.description || '',
                icon: item.icon || initialCareerContent.values.items[i]?.icon || ''
              }))
            },
            seo: {
              title: saved.seo?.title || '',
              description: saved.seo?.description || '',
              ogImage: saved.seo?.ogImage || '',
              slug: saved.seo?.slug || 'careers'
            }
          });
        }
      }
    }
    loadContent();
  }, [activeTab]);

  const handleSave = async () => {
    setIsSaving(true);
    const loadingToast = toast.loading('Saving CMS changes...');
    const contentMap = {
      home: homeContent,
      global: homeContent,
      about: aboutContent,
      shop: shopContent,
      career: careerContent
    };
    const keyMap = {
      home: 'main_site',
      global: 'main_site',
      about: 'about_page',
      shop: 'shop_page',
      career: 'career_page'
    };
    const key = keyMap[activeTab];
    const content = contentMap[activeTab];

    const success = await saveCMSContent(key, content);
    setIsSaving(false);
    if (success) {
      toast.success('CMS Content saved successfully!', { id: loadingToast });
    } else {
      toast.error('Failed to save CMS content.', { id: loadingToast });
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Sticky Header Bar */}
      <div className="sticky top-0 z-20 mb-6 flex flex-col items-start gap-4 border-b border-gray-200/70 bg-gray-50/95 px-4 py-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Content Management System</h1>
          <p className="text-sm text-gray-500 font-medium">Manage your site text, hero sections, and FAQ.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={isSaving}
          className="hidden lg:flex items-center justify-center gap-2 rounded-xl bg-[#722F38] px-7 py-3 font-bold text-white shadow-lg shadow-[#722F38]/20 transition-all hover:bg-[#5a252d] disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save CMS Changes'}
        </motion.button>
      </div>

      <div className="pb-32 lg:pb-20">


        {/* Modern Tabs */}
        <div className="mb-8 -mx-1 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="inline-flex min-w-full gap-1 rounded-2xl bg-gray-100 p-1 sm:min-w-0">
            {[
              { id: 'home', label: 'Home Page', icon: Home },
              { id: 'about', label: 'About Page', icon: Info },
              { id: 'shop', label: 'Shop Page', icon: Search },
              { id: 'career', label: 'Career Page', icon: Briefcase },
              { id: 'global', label: 'Global Settings', icon: Globe },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`shrink-0 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition-all sm:px-6 ${activeTab === tab.id
                  ? 'bg-white text-[#722F38] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                <span className="flex items-center gap-2">
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8 px-1 sm:px-0">
          {activeTab === 'home' ? (
          <>
              {/* CMS: Hero Section */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="p-10 pb-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#722F38]/10 flex items-center justify-center text-[#722F38]">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Hero Section</h2>
                </div>
                <div className="p-10 pt-6 space-y-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
                    <input
                      type="text"
                      value={homeContent.hero.title}
                      onChange={(e) => setHomeContent({ ...homeContent, hero: { ...homeContent.hero, title: e.target.value } })}
                      className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
                    <textarea
                      rows={2}
                      value={homeContent.hero.subtitle}
                      onChange={(e) => setHomeContent({ ...homeContent, hero: { ...homeContent.hero, subtitle: e.target.value } })}
                      className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900 resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                      <input
                        type="text"
                        value={homeContent.hero.cta}
                        onChange={(e) => setHomeContent({ ...homeContent, hero: { ...homeContent.hero, cta: e.target.value } })}
                        className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                      <input
                        type="text"
                        value={homeContent.hero.link || ''}
                        onChange={(e) => setHomeContent({ ...homeContent, hero: { ...homeContent.hero, link: e.target.value } })}
                        className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900"
                        placeholder="/shop or https://..."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ImageUpload
                      label="Hero Image (Poster)"
                      value={homeContent.hero.imageUrl || ''}
                      onChange={(url) => setHomeContent({ ...homeContent, hero: { ...homeContent.hero, imageUrl: url } })}
                      slot={heroImageSlot}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hero Video URL (Optional)</label>
                      <div className="relative">
                        <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={homeContent.hero.videoUrl || ''}
                          onChange={(e) => setHomeContent({ ...homeContent, hero: { ...homeContent.hero, videoUrl: e.target.value } })}
                          placeholder="https://.../video.mp4"
                          className="w-full pl-11 pr-4 py-3 border border-gray-100 rounded-2xl outline-none bg-gray-50 focus:bg-white focus:border-[#722F38] text-sm"
                        />
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <label className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[#722F38] text-white text-xs font-bold cursor-pointer hover:bg-[#5a252d] transition-colors">
                          Upload Hero Video
                          <input
                            type="file"
                            accept="video/mp4,video/webm,video/ogg"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              e.currentTarget.value = '';
                              if (!file) return;
                              const loadingToast = toast.loading('Uploading video...');
                              const url = await uploadVideo(file);
                              if (url) {
                                setHomeContent({ ...homeContent, hero: { ...homeContent.hero, videoUrl: url } });
                                toast.success('Video uploaded!', { id: loadingToast });
                              } else {
                                toast.error('Failed to upload video.', { id: loadingToast });
                              }
                            }}
                          />
                        </label>
                        <p className="text-[10px] text-gray-400 italic">MP4/WebM/Ogg. Served from your `/uploads`.</p>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-2 italic">If provided, the video will play automatically. Image will be used as a placeholder/poster.</p>
                    </div>
                  </div>
                </div>
              </div>


        {/* CMS: Style Preference Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="p-10 pb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#722F38]/10 flex items-center justify-center text-[#722F38]">
              <Home className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Style Preference Section</h2>
          </div>
          <div className="p-10 pt-6 space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
              <input
                type="text"
                value={homeContent.stylePreference.title}
                onChange={(e) => setHomeContent({ ...homeContent, stylePreference: { ...homeContent.stylePreference, title: e.target.value } })}
                className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {homeContent.stylePreference.items.map((item, index) => (
                <div key={index} className="p-6 bg-gray-50/50 border border-gray-100 rounded-[2rem] space-y-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#722F38] text-white text-[10px] flex items-center justify-center">
                      {index + 1}
                    </span>
                    Panel: {item.title || `Item ${index + 1}`}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const newItems = [...homeContent.stylePreference.items];
                          newItems[index].title = e.target.value;
                          setHomeContent({ ...homeContent, stylePreference: { ...homeContent.stylePreference, items: newItems } });
                        }}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={item.subtitle}
                        onChange={(e) => {
                          const newItems = [...homeContent.stylePreference.items];
                          newItems[index].subtitle = e.target.value;
                          setHomeContent({ ...homeContent, stylePreference: { ...homeContent.stylePreference, items: newItems } });
                        }}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CTA Text</label>
                        <input
                          type="text"
                          value={item.cta}
                          onChange={(e) => {
                            const newItems = [...homeContent.stylePreference.items];
                            newItems[index].cta = e.target.value;
                            setHomeContent({ ...homeContent, stylePreference: { ...homeContent.stylePreference, items: newItems } });
                          }}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Link</label>
                        <input
                          type="text"
                          value={item.link}
                          onChange={(e) => {
                            const newItems = [...homeContent.stylePreference.items];
                            newItems[index].link = e.target.value;
                            setHomeContent({ ...homeContent, stylePreference: { ...homeContent.stylePreference, items: newItems } });
                          }}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none bg-white"
                        />
                      </div>
                    </div>

                    <ImageUpload
                      label="Panel Image"
                      value={item.imageUrl}
                      onChange={(url) => {
                        const newItems = [...homeContent.stylePreference.items];
                        newItems[index].imageUrl = url;
                        setHomeContent({ ...homeContent, stylePreference: { ...homeContent.stylePreference, items: newItems } });
                      }}
                    />

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Panel Video URL (Optional)</label>
                      <div className="relative">
                        <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={item.videoUrl || ''}
                          onChange={(e) => {
                            const newItems = [...homeContent.stylePreference.items];
                            newItems[index].videoUrl = e.target.value;
                            setHomeContent({ ...homeContent, stylePreference: { ...homeContent.stylePreference, items: newItems } });
                          }}
                          placeholder="https://..."
                          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl outline-none bg-white focus:border-[#722F38] text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CMS: Marquee Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="p-10 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#722F38]/10 flex items-center justify-center text-[#722F38]">
                <Globe className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Marquee (Scrolling Text)</h2>
            </div>
            <button
              onClick={() => {
                const newItems = [...homeContent.marquee.items, ''];
                setHomeContent({ ...homeContent, marquee: { ...homeContent.marquee, items: newItems } });
              }}
              className="text-sm font-bold text-[#722F38] flex items-center gap-1 hover:underline"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>
          <div className="p-10 pt-6 space-y-6">
            <p className="text-xs text-gray-500 mb-2">These items will scroll horizontally across the home page.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {homeContent.marquee.items.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newItems = [...homeContent.marquee.items];
                      newItems[index] = e.target.value;
                      setHomeContent({ ...homeContent, marquee: { ...homeContent.marquee, items: newItems } });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none"
                    placeholder="e.g. Material Premium"
                  />
                  <button
                    onClick={() => {
                      const newItems = homeContent.marquee.items.filter((_, i) => i !== index);
                      setHomeContent({ ...homeContent, marquee: { ...homeContent.marquee, items: newItems } });
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CMS: Product Showcase */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="p-10 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#722F38]/10 flex items-center justify-center text-[#722F38]">
                <Star className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Product Showcase</h2>
            </div>
          </div>
          <div className="p-10 pt-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Label</label>
                <input
                  type="text"
                  value={homeContent.showcase.label}
                  onChange={(e) => setHomeContent({ ...homeContent, showcase: { ...homeContent.showcase, label: e.target.value } })}
                  className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900"
                  placeholder="Pilihan Kurasi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                <textarea
                  rows={2}
                  value={homeContent.showcase.title}
                  onChange={(e) => setHomeContent({ ...homeContent, showcase: { ...homeContent.showcase, title: e.target.value } })}
                  className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Description</label>
                <input
                  type="text"
                  value={homeContent.showcase.description}
                  onChange={(e) => setHomeContent({ ...homeContent, showcase: { ...homeContent.showcase, description: e.target.value } })}
                  className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Featured Products</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto p-1">
                {products.map(product => (
                  <label
                    key={product.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${homeContent.showcase.productIds.includes(product.id)
                      ? 'border-[#722F38] bg-[#722F38]/5 ring-1 ring-[#722F38]'
                      : 'border-gray-100 hover:border-gray-200'
                      }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={homeContent.showcase.productIds.includes(product.id)}
                      onChange={(e) => {
                        const ids = [...homeContent.showcase.productIds];
                        if (e.target.checked) {
                          ids.push(product.id);
                        } else {
                          const index = ids.indexOf(product.id);
                          if (index > -1) ids.splice(index, 1);
                        }
                        setHomeContent({ ...homeContent, showcase: { ...homeContent.showcase, productIds: ids } });
                      }}
                    />
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
                      <img src={product.thumbnail_url} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{product.short_name}</p>
                      <p className="text-xs text-gray-500">{formatPrice(product.product_variants?.[0]?.price || 0)}</p>
                    </div>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2 italic">* Select 4-8 products for best layout.</p>
            </div>
          </div>
        </div>

        {/* CMS: UGC Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="p-10 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#722F38]/10 flex items-center justify-center text-[#722F38]">
                <Video className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">UGC Section (Video Gallery)</h2>
            </div>
            <button
              onClick={() => {
                const newItems = [...homeContent.ugc.items, { videoUrl: '', productId: '', thumbnailUrl: '' }];
                setHomeContent({ ...homeContent, ugc: { ...homeContent.ugc, items: newItems } });
              }}
              className="text-sm font-bold text-[#722F38] flex items-center gap-2 px-4 py-2 bg-[#722F38]/5 rounded-xl hover:bg-[#722F38]/10 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Video
            </button>
          </div>
          <div className="p-10 pt-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                <input
                  type="text"
                  value={homeContent.ugc.title}
                  onChange={(e) => setHomeContent({ ...homeContent, ugc: { ...homeContent.ugc, title: e.target.value } })}
                  className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
                <input
                  type="text"
                  value={homeContent.ugc.subtitle}
                  onChange={(e) => setHomeContent({ ...homeContent, ugc: { ...homeContent.ugc, subtitle: e.target.value } })}
                  className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {homeContent.ugc.items.map((item, index) => (
                <div key={index} className="p-6 bg-gray-50/50 border border-gray-100 rounded-[2rem] relative group">
                  <button
                    onClick={() => {
                      const newItems = homeContent.ugc.items.filter((_, i) => i !== index);
                      setHomeContent({ ...homeContent, ugc: { ...homeContent.ugc, items: newItems } });
                    }}
                    className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Video URL (Shopee/TikTok/Direct)</label>
                      <input
                        type="text"
                        value={item.videoUrl}
                        onChange={(e) => {
                          const newItems = [...homeContent.ugc.items];
                          newItems[index].videoUrl = e.target.value;
                          setHomeContent({ ...homeContent, ugc: { ...homeContent.ugc, items: newItems } });
                        }}
                        placeholder="https://..."
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Linked Product</label>
                      <select
                        value={item.productId}
                        onChange={(e) => {
                          const newItems = [...homeContent.ugc.items];
                          newItems[index].productId = e.target.value;
                          setHomeContent({ ...homeContent, ugc: { ...homeContent.ugc, items: newItems } });
                        }}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none bg-white"
                      >
                        <option value="">No Linked Product</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.short_name}</option>
                        ))}
                      </select>
                    </div>
                    <ImageUpload
                      label="Video Thumbnail"
                      value={item.thumbnailUrl || ''}
                      onChange={(url) => {
                        const newItems = [...homeContent.ugc.items];
                        newItems[index].thumbnailUrl = url;
                        setHomeContent({ ...homeContent, ugc: { ...homeContent.ugc, items: newItems } });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CMS: FAQ Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="p-10 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#722F38]/10 flex items-center justify-center text-[#722F38]">
                <Globe className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">FAQ Section</h2>
            </div>
            <button
              onClick={() => {
                const newItems = [...homeContent.faq.items, { id: `faq-${Date.now()}`, question: '', answer: '' }];
                setHomeContent({ ...homeContent, faq: { ...homeContent.faq, items: newItems } });
              }}
              className="text-sm font-bold text-[#722F38] flex items-center gap-2 px-4 py-2 bg-[#722F38]/5 rounded-xl hover:bg-[#722F38]/10 transition-all"
            >
              <Plus className="w-4 h-4" /> Add FAQ
            </button>
          </div>
          <div className="p-10 pt-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                <input
                  type="text"
                  value={homeContent.faq.title}
                  onChange={(e) => setHomeContent({ ...homeContent, faq: { ...homeContent.faq, title: e.target.value } })}
                  className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Description</label>
                <input
                  type="text"
                  value={homeContent.faq.description}
                  onChange={(e) => setHomeContent({ ...homeContent, faq: { ...homeContent.faq, description: e.target.value } })}
                  className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900"
                />
              </div>
            </div>

            <Reorder.Group
              axis="y"
              values={homeContent.faq.items}
              onReorder={(newItems) => setHomeContent({ ...homeContent, faq: { ...homeContent.faq, items: newItems } })}
              className="space-y-4"
            >
              {homeContent.faq.items.map((item, index) => (
                <Reorder.Item
                  key={item.id || `faq-${index}`}
                  value={item}
                  className="p-6 bg-gray-50/50 border border-gray-100 rounded-[2rem] relative group flex gap-6 items-start shadow-sm"
                >
                  <div className="mt-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-start">
                      <label className="block text-xs font-bold text-gray-500 uppercase">Question {index + 1}</label>
                      <button
                        onClick={() => {
                          const newItems = homeContent.faq.items.filter((_, i) => i !== index);
                          setHomeContent({ ...homeContent, faq: { ...homeContent.faq, items: newItems } });
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={item.question}
                        onChange={(e) => {
                          const newItems = [...homeContent.faq.items];
                          newItems[index].question = e.target.value;
                          setHomeContent({ ...homeContent, faq: { ...homeContent.faq, items: newItems } });
                        }}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Answer</label>
                      <textarea
                        rows={2}
                        value={item.answer}
                        onChange={(e) => {
                          const newItems = [...homeContent.faq.items];
                          newItems[index].answer = e.target.value;
                          setHomeContent({ ...homeContent, faq: { ...homeContent.faq, items: newItems } });
                        }}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#722F38] outline-none bg-white resize-none font-medium text-sm"
                      />
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-10">
          <SEOFields
            slug={homeContent.seo?.slug || 'home'}
            setSlug={(slug) => setHomeContent({ ...homeContent, seo: { ...homeContent.seo, slug } })}
            seoTitle={homeContent.seo?.title || ''}
            setSeoTitle={(title) => setHomeContent({ ...homeContent, seo: { ...homeContent.seo, title } })}
            seoDescription={homeContent.seo?.description || ''}
            setSeoDescription={(description) => setHomeContent({ ...homeContent, seo: { ...homeContent.seo, description } })}
            ogImage={homeContent.seo?.ogImage || ''}
            setOgImage={(ogImage) => setHomeContent({ ...homeContent, seo: { ...homeContent.seo, ogImage } })}
            titlePlaceholder="Home - SECERA"
          />
        </div>
          </>
        ) : activeTab === 'about' ? (
          <>
            {/* About Page: Hero */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="p-10 pb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#722F38]/10 flex items-center justify-center text-[#722F38]">
              <Globe className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Hero Section</h2>
          </div>
          <div className="p-10 pt-6 space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
              <input
                type="text"
                value={aboutContent.hero.title}
                onChange={(e) => setAboutContent({ ...aboutContent, hero: { ...aboutContent.hero, title: e.target.value } })}
                className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
              <textarea
                rows={3}
                value={aboutContent.hero.subtitle}
                onChange={(e) => setAboutContent({ ...aboutContent, hero: { ...aboutContent.hero, subtitle: e.target.value } })}
                className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900 resize-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUpload
                label="Hero Image (Poster)"
                value={aboutContent.hero.imageUrl}
                onChange={(url) => setAboutContent({ ...aboutContent, hero: { ...aboutContent.hero, imageUrl: url } })}
                slot={heroImageSlot}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Video URL (Optional)</label>
                <div className="relative">
                  <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={aboutContent.hero.videoUrl || ''}
                    onChange={(e) => setAboutContent({ ...aboutContent, hero: { ...aboutContent.hero, videoUrl: e.target.value } })}
                    placeholder="https://.../video.mp4"
                    className="w-full pl-11 pr-4 py-3 border border-gray-100 rounded-2xl outline-none bg-gray-50 focus:bg-white focus:border-[#722F38] text-sm"
                  />
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <label className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[#722F38] text-white text-xs font-bold cursor-pointer hover:bg-[#5a252d] transition-colors">
                    Upload Hero Video
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/ogg"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        e.currentTarget.value = '';
                        if (!file) return;
                        const loadingToast = toast.loading('Uploading video...');
                        const url = await uploadVideo(file);
                        if (url) {
                          setAboutContent({ ...aboutContent, hero: { ...aboutContent.hero, videoUrl: url } });
                          toast.success('Video uploaded!', { id: loadingToast });
                        } else {
                          toast.error('Failed to upload video.', { id: loadingToast });
                        }
                      }}
                    />
                  </label>
                  <p className="text-[10px] text-gray-400 italic">MP4/WebM/Ogg. Served from your `/uploads`.</p>
                </div>
              </div>
            </div>
          </div>
        </div>


      {/* About Page: Inspiration */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-10 pb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#722F38]/10 flex items-center justify-center text-[#722F38]">
            <Globe className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Inspiration Section</h2>
        </div>
        <div className="p-10 pt-6 space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <textarea
              rows={2}
              value={aboutContent.inspiration.subtitle}
              onChange={(e) => setAboutContent({ ...aboutContent, inspiration: { ...aboutContent.inspiration, subtitle: e.target.value } })}
              className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description Paragraph 1</label>
            <textarea
              rows={3}
              value={aboutContent.inspiration.description1}
              onChange={(e) => setAboutContent({ ...aboutContent, inspiration: { ...aboutContent.inspiration, description1: e.target.value } })}
              className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description Paragraph 2</label>
            <textarea
              rows={3}
              value={aboutContent.inspiration.description2}
              onChange={(e) => setAboutContent({ ...aboutContent, inspiration: { ...aboutContent.inspiration, description2: e.target.value } })}
              className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900 resize-none"
            />
          </div>
          <ImageUpload
            label="Side Image"
            value={aboutContent.inspiration.imageUrl}
            onChange={(url) => setAboutContent({ ...aboutContent, inspiration: { ...aboutContent.inspiration, imageUrl: url } })}
          />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200/80 bg-gray-50/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 backdrop-blur-md lg:hidden">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={isSaving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#722F38] px-5 py-3 font-bold text-white shadow-lg shadow-[#722F38]/20 transition-all hover:bg-[#5a252d] disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save CMS Changes'}
        </motion.button>
      </div>

      {/* About Page: Mission */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-10 pb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#722F38]/10 flex items-center justify-center text-[#722F38]">
            <Globe className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Mission Section</h2>
        </div>
        <div className="p-10 pt-6 space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mission Subtitle</label>
            <textarea
              rows={2}
              value={aboutContent.mission.subtitle}
              onChange={(e) => setAboutContent({ ...aboutContent, mission: { ...aboutContent.mission, subtitle: e.target.value } })}
              className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mission Description</label>
            <textarea
              rows={3}
              value={aboutContent.mission.description}
              onChange={(e) => setAboutContent({ ...aboutContent, mission: { ...aboutContent.mission, description: e.target.value } })}
              className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900 resize-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-10">
        <SEOFields
          slug={aboutContent.seo?.slug || 'about'}
          setSlug={(slug) => setAboutContent({ ...aboutContent, seo: { ...aboutContent.seo, slug } })}
          seoTitle={aboutContent.seo?.title || ''}
          setSeoTitle={(title) => setAboutContent({ ...aboutContent, seo: { ...aboutContent.seo, title } })}
          seoDescription={aboutContent.seo?.description || ''}
          setSeoDescription={(description) => setAboutContent({ ...aboutContent, seo: { ...aboutContent.seo, description } })}
          ogImage={aboutContent.seo?.ogImage || ''}
          setOgImage={(ogImage) => setAboutContent({ ...aboutContent, seo: { ...aboutContent.seo, ogImage } })}
          titlePlaceholder="About Us - SECERA"
        />
      </div>
          </>
        ) : activeTab === 'shop' ? (
          <>
            {/* Shop Page: Hero */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="p-10 pb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#722F38]/10 flex items-center justify-center text-[#722F38]">
                  <Globe className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Hero Section</h2>
              </div>
              <div className="p-10 pt-6 space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
                  <input 
                    type="text" 
                    value={shopContent.hero.title} 
                    onChange={(e) => setShopContent({ ...shopContent, hero: { ...shopContent.hero, title: e.target.value } })}
                    className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
                  <textarea 
                    rows={2}
                    value={shopContent.hero.subtitle} 
                    onChange={(e) => setShopContent({ ...shopContent, hero: { ...shopContent.hero, subtitle: e.target.value } })}
                    className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900 resize-none" 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ImageUpload 
                    label="Hero Image (Poster)"
                    value={shopContent.hero.imageUrl}
                    onChange={(url) => setShopContent({ ...shopContent, hero: { ...shopContent.hero, imageUrl: url } })}
                    slot={heroImageSlot}
                  />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hero Video URL (Optional)</label>
                      <div className="relative">
                        <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="text" 
                          value={shopContent.hero.videoUrl || ''} 
                          onChange={(e) => setShopContent({ ...shopContent, hero: { ...shopContent.hero, videoUrl: e.target.value } })}
                          placeholder="https://.../video.mp4"
                          className="w-full pl-11 pr-4 py-3 border border-gray-100 rounded-2xl outline-none bg-gray-50 focus:bg-white focus:border-[#722F38] text-sm" 
                        />
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <label className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[#722F38] text-white text-xs font-bold cursor-pointer hover:bg-[#5a252d] transition-colors">
                          Upload Hero Video
                          <input
                            type="file"
                            accept="video/mp4,video/webm,video/ogg"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              e.currentTarget.value = '';
                              if (!file) return;
                              const loadingToast = toast.loading('Uploading video...');
                              const url = await uploadVideo(file);
                              if (url) {
                                setShopContent({ ...shopContent, hero: { ...shopContent.hero, videoUrl: url } });
                                toast.success('Video uploaded!', { id: loadingToast });
                              } else {
                                toast.error('Failed to upload video.', { id: loadingToast });
                              }
                            }}
                          />
                        </label>
                        <p className="text-[10px] text-gray-400 italic">MP4/WebM/Ogg. Served from your `/uploads`.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>



            <div className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-10">
              <SEOFields
                slug={shopContent.seo?.slug || 'shop'}
                setSlug={(slug) => setShopContent({ ...shopContent, seo: { ...shopContent.seo, slug } })}
                seoTitle={shopContent.seo?.title || ''}
                setSeoTitle={(title) => setShopContent({ ...shopContent, seo: { ...shopContent.seo, title } })}
                seoDescription={shopContent.seo?.description || ''}
                setSeoDescription={(description) => setShopContent({ ...shopContent, seo: { ...shopContent.seo, description } })}
                ogImage={shopContent.seo?.ogImage || ''}
                setOgImage={(ogImage) => setShopContent({ ...shopContent, seo: { ...shopContent.seo, ogImage } })}
                titlePlaceholder="Shop - SECERA"
              />
            </div>
          </>
        ) : activeTab === 'career' ? (
          <>
            {/* Career Page: Hero */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-10 pb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#722F38]/10 flex items-center justify-center text-[#722F38]">
            <Briefcase className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Hero Section</h2>
        </div>
        <div className="p-10 pt-6 space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
            <input
              type="text"
              value={careerContent.hero.title}
              onChange={(e) => setCareerContent({ ...careerContent, hero: { ...careerContent.hero, title: e.target.value } })}
              className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
            <textarea
              rows={2}
              value={careerContent.hero.subtitle}
              onChange={(e) => setCareerContent({ ...careerContent, hero: { ...careerContent.hero, subtitle: e.target.value } })}
              className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900 resize-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUpload
              label="Hero Image (Poster)"
              value={careerContent.hero.imageUrl}
              onChange={(url) => setCareerContent({ ...careerContent, hero: { ...careerContent.hero, imageUrl: url } })}
              slot={heroImageSlot}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Video URL (Optional)</label>
              <div className="relative">
                <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={careerContent.hero.videoUrl || ''}
                  onChange={(e) => setCareerContent({ ...careerContent, hero: { ...careerContent.hero, videoUrl: e.target.value } })}
                  placeholder="https://.../video.mp4"
                  className="w-full pl-11 pr-4 py-3 border border-gray-100 rounded-2xl outline-none bg-gray-50 focus:bg-white focus:border-[#722F38] text-sm"
                />
              </div>
              <div className="mt-3 flex items-center gap-3">
                <label className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[#722F38] text-white text-xs font-bold cursor-pointer hover:bg-[#5a252d] transition-colors">
                  Upload Hero Video
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/ogg"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      e.currentTarget.value = '';
                      if (!file) return;
                      const loadingToast = toast.loading('Uploading video...');
                      const url = await uploadVideo(file);
                      if (url) {
                        setCareerContent({ ...careerContent, hero: { ...careerContent.hero, videoUrl: url } });
                        toast.success('Video uploaded!', { id: loadingToast });
                      } else {
                        toast.error('Failed to upload video.', { id: loadingToast });
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>


            {/* Career Page: Intro */ }
  <div className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
    <div className="p-10 pb-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-2xl bg-[#722F38]/10 flex items-center justify-center text-[#722F38]">
        <MessageSquare className="w-5 h-5" />
      </div>
      <h2 className="text-xl font-bold text-gray-900">Intro Section</h2>
    </div>
    <div className="p-10 pt-6 space-y-8">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Badge Text</label>
        <input
          type="text"
          value={careerContent.intro.badge}
          onChange={(e) => setCareerContent({ ...careerContent, intro: { ...careerContent.intro, badge: e.target.value } })}
          className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Intro Title</label>
        <input
          type="text"
          value={careerContent.intro.title}
          onChange={(e) => setCareerContent({ ...careerContent, intro: { ...careerContent.intro, title: e.target.value } })}
          className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Intro Description</label>
        <textarea
          rows={4}
          value={careerContent.intro.description}
          onChange={(e) => setCareerContent({ ...careerContent, intro: { ...careerContent.intro, description: e.target.value } })}
          className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900 resize-none"
        />
      </div>
    </div>
  </div>


  {/* Career Page: Values */ }
            <div className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="p-10 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#722F38]/10 flex items-center justify-center text-[#722F38]">
                    <Star className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Values Section</h2>
                </div>
              </div>
              <div className="p-10 pt-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                    <input 
                      type="text" 
                      value={careerContent.values.title} 
                      onChange={(e) => setCareerContent({ ...careerContent, values: { ...careerContent.values, title: e.target.value } })}
                      className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
                    <input 
                      type="text" 
                      value={careerContent.values.subtitle} 
                      onChange={(e) => setCareerContent({ ...careerContent, values: { ...careerContent.values, subtitle: e.target.value } })}
                      className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {careerContent.values.items.map((item, index) => (
                    <div key={index} className="p-6 bg-gray-50/50 border border-gray-100 rounded-[2rem] space-y-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#722F38] text-white text-[10px] flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm">Value Card {index + 1}</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Title</label>
                          <input 
                            type="text" 
                            value={item.title} 
                            onChange={(e) => {
                              const newItems = [...careerContent.values.items];
                              newItems[index].title = e.target.value;
                              setCareerContent({ ...careerContent, values: { ...careerContent.values, items: newItems } });
                            }}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none bg-white text-sm" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Description</label>
                          <textarea 
                            rows={3}
                            value={item.description} 
                            onChange={(e) => {
                              const newItems = [...careerContent.values.items];
                              newItems[index].description = e.target.value;
                              setCareerContent({ ...careerContent, values: { ...careerContent.values, items: newItems } });
                            }}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none bg-white text-sm resize-none" 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>


            <div className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-10">
              <SEOFields
                slug={careerContent.seo?.slug || 'careers'}
                setSlug={(slug) => setCareerContent({ ...careerContent, seo: { ...careerContent.seo, slug } })}
                seoTitle={careerContent.seo?.title || ''}
                setSeoTitle={(title) => setCareerContent({ ...careerContent, seo: { ...careerContent.seo, title } })}
                seoDescription={careerContent.seo?.description || ''}
                setSeoDescription={(description) => setCareerContent({ ...careerContent, seo: { ...careerContent.seo, description } })}
                ogImage={careerContent.seo?.ogImage || ''}
                setOgImage={(ogImage) => setCareerContent({ ...careerContent, seo: { ...careerContent.seo, ogImage } })}
                titlePlaceholder="Careers - SECERA"
              />
            </div>
          </>
        ) : (
          <>
            {/* Global Settings: Site Information & SEO */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-10 pb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#722F38]/10 flex items-center justify-center text-[#722F38]">
            <Globe className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Site Information & SEO</h2>
        </div>
        <div className="p-10 pt-6 space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site Title</label>
            <input
              type="text"
              value={homeContent.global?.siteTitle || ''}
              onChange={(e) => setHomeContent({ ...homeContent, global: { ...homeContent.global, siteTitle: e.target.value } })}
              className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
            <textarea
              rows={2}
              value={homeContent.global?.seoDescription || ''}
              onChange={(e) => setHomeContent({ ...homeContent, global: { ...homeContent.global, seoDescription: e.target.value } })}
              className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO Keywords (comma separated)</label>
            <input
              type="text"
              value={homeContent.global?.seoKeywords || ''}
              onChange={(e) => setHomeContent({ ...homeContent, global: { ...homeContent.global, seoKeywords: e.target.value } })}
              className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Global Settings: Footer */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-10 pb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#722F38]/10 flex items-center justify-center text-[#722F38]">
            <Globe className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Footer Settings</h2>
        </div>
        <div className="p-10 pt-6 space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
            <input
              type="text"
              value={homeContent.footer.tagline}
              onChange={(e) => setHomeContent({ ...homeContent, footer: { ...homeContent.footer, tagline: e.target.value } })}
              className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Copyright Text</label>
            <input
              type="text"
              value={homeContent.footer.copyright}
              onChange={(e) => setHomeContent({ ...homeContent, footer: { ...homeContent.footer, copyright: e.target.value } })}
              className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={homeContent.footer.email}
                onChange={(e) => setHomeContent({ ...homeContent, footer: { ...homeContent.footer, email: e.target.value } })}
                className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone (WhatsApp)</label>
              <input
                type="text"
                value={homeContent.footer.phone}
                onChange={(e) => setHomeContent({ ...homeContent, footer: { ...homeContent.footer, phone: e.target.value } })}
                className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Link Groups</h3>
              <button
                onClick={() => {
                  const newLinks = [...homeContent.footer.links, { title: 'New Group', items: [] }];
                  setHomeContent({ ...homeContent, footer: { ...homeContent.footer, links: newLinks } });
                }}
                className="text-xs font-bold text-[#722F38] flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3 h-3" /> Add Group
              </button>
            </div>

            <div className="space-y-6">
              {homeContent.footer.links.map((group, groupIdx) => (
                <div key={groupIdx} className="bg-gray-50/50 border border-gray-100 rounded-[2rem] p-6 relative group/item shadow-sm">
                  <button
                    onClick={() => {
                      const newLinks = homeContent.footer.links.filter((_, i) => i !== groupIdx);
                      setHomeContent({ ...homeContent, footer: { ...homeContent.footer, links: newLinks } });
                    }}
                    className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Group Title</label>
                      <input
                        type="text"
                        value={group.title}
                        onChange={(e) => {
                          const newLinks = [...homeContent.footer.links];
                          newLinks[groupIdx].title = e.target.value;
                          setHomeContent({ ...homeContent, footer: { ...homeContent.footer, links: newLinks } });
                        }}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#722F38] outline-none bg-white font-bold"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-gray-400 uppercase">Links</label>
                        <button
                          onClick={() => {
                            const newLinks = [...homeContent.footer.links];
                            newLinks[groupIdx].items = [...newLinks[groupIdx].items, { label: '', url: '#' }];
                            setHomeContent({ ...homeContent, footer: { ...homeContent.footer, links: newLinks } });
                          }}
                          className="text-[10px] font-bold text-[#722F38] hover:underline"
                        >
                          + Add Link
                        </button>
                      </div>

                      {group.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Label"
                            value={item.label}
                            onChange={(e) => {
                              const newLinks = [...homeContent.footer.links];
                              newLinks[groupIdx].items[itemIdx].label = e.target.value;
                              setHomeContent({ ...homeContent, footer: { ...homeContent.footer, links: newLinks } });
                            }}
                            className="flex-1 px-4 py-2 border border-gray-100 rounded-xl text-xs outline-none focus:border-[#722F38] bg-white font-medium shadow-sm"
                          />
                          <input
                            type="text"
                            placeholder="URL"
                            value={item.url}
                            onChange={(e) => {
                              const newLinks = [...homeContent.footer.links];
                              newLinks[groupIdx].items[itemIdx].url = e.target.value;
                              setHomeContent({ ...homeContent, footer: { ...homeContent.footer, links: newLinks } });
                            }}
                            className="flex-1 px-4 py-2 border border-gray-100 rounded-xl text-xs outline-none focus:border-[#722F38] bg-white font-medium shadow-sm"
                          />
                          <button
                            onClick={() => {
                              const newLinks = [...homeContent.footer.links];
                              newLinks[groupIdx].items = newLinks[groupIdx].items.filter((_, i) => i !== itemIdx);
                              setHomeContent({ ...homeContent, footer: { ...homeContent.footer, links: newLinks } });
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
                  </div>
                </div>
              </div>
            </div>

      {/* Global Settings: Global CTA Banner */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-10 pb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#722F38]/10 flex items-center justify-center text-[#722F38]">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Global CTA Banner</h2>
        </div>
        <div className="p-10 pt-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CTA Title</label>
              <input
                type="text"
                value={homeContent.cta.title}
                onChange={(e) => setHomeContent({ ...homeContent, cta: { ...homeContent.cta, title: e.target.value } })}
                className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CTA Description</label>
              <input
                type="text"
                value={homeContent.cta.description}
                onChange={(e) => setHomeContent({ ...homeContent, cta: { ...homeContent.cta, description: e.target.value } })}
                className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
              <input
                type="text"
                value={homeContent.cta.buttonText}
                onChange={(e) => setHomeContent({ ...homeContent, cta: { ...homeContent.cta, buttonText: e.target.value } })}
                className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
              <input
                type="text"
                value={homeContent.cta.buttonLink || ''}
                onChange={(e) => setHomeContent({ ...homeContent, cta: { ...homeContent.cta, buttonLink: e.target.value } })}
                className="w-full px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all font-medium text-gray-900"
                placeholder="/shop or https://..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUpload
              label="CTA Background Image (Fallback/Poster)"
              value={homeContent.cta.backgroundImageUrl || ''}
              onChange={(url) => setHomeContent({ ...homeContent, cta: { ...homeContent.cta, backgroundImageUrl: url } })}
              slot={heroImageSlot}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CTA Background Video URL (Optional)</label>
              <div className="relative">
                <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={homeContent.cta.backgroundVideoUrl || ''}
                  onChange={(e) => setHomeContent({ ...homeContent, cta: { ...homeContent.cta, backgroundVideoUrl: e.target.value } })}
                  placeholder="/uploads/your-video.mp4 or https://.../video.mp4"
                  className="w-full pl-11 pr-4 py-3 border border-gray-100 rounded-2xl outline-none bg-gray-50 focus:bg-white focus:border-[#722F38] text-sm"
                />
              </div>
              <div className="mt-3 flex items-center gap-3">
                <label className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[#722F38] text-white text-xs font-bold cursor-pointer hover:bg-[#5a252d] transition-colors">
                  Upload CTA Video
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/ogg"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      e.currentTarget.value = '';
                      if (!file) return;
                      const loadingToast = toast.loading('Uploading video...');
                      const url = await uploadVideo(file);
                      if (url) {
                        setHomeContent({ ...homeContent, cta: { ...homeContent.cta, backgroundVideoUrl: url } });
                        toast.success('Video uploaded!', { id: loadingToast });
                      } else {
                        toast.error('Failed to upload video.', { id: loadingToast });
                      }
                    }}
                  />
                </label>
                <p className="text-[10px] text-gray-400 italic">MP4/WebM/Ogg. Autoplay + loop in Global CTA.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
          </>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200/80 bg-gray-50/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 backdrop-blur-md lg:hidden">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={isSaving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#722F38] px-5 py-3 font-bold text-white shadow-lg shadow-[#722F38]/20 transition-all hover:bg-[#5a252d] disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save CMS Changes'}
        </motion.button>
      </div>
    </div>
  </div>
);
}
