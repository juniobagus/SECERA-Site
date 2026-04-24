import { useState, useEffect } from 'react';
import { Save, Globe, Home, Info, Plus, Trash2, Video, MessageSquare, Star, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { initialCMSContent } from '../../data/cms';
import { getCMSContent, saveCMSContent, getProducts } from '../../utils/api';
import ImageUpload from '../../components/admin/ImageUpload';
import { formatPrice } from '../../data/products';

const initialAboutContent = {
  hero: {
    title: "Tentang Secera",
    subtitle: "Secera adalah tim desainer, pengrajin, dan visioner yang berdedikasi untuk mendefinisikan ulang gaya modest modern.",
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953eb1b5a4?q=80&w=2000&auto=format&fit=crop"
  },
  inspiration: {
    title: "Inspirasi Kami",
    subtitle: "Dalam keanggunan yang sederhana, Secera menemukan makna dari kecantikan yang tak lekang oleh waktu.",
    description1: "Kami terinspirasi oleh harmoni alam and kelembutan material premium. Secera adalah simbol dari kebangkitan gaya yang mengutamakan kenyamanan tanpa mengorbankan estetika.",
    description2: "Pada akhirnya, kami merancang setiap helai pakaian untuk memberikan rasa percaya diri, ketenangan, dan keindahan bagi setiap wanita yang mengenakannya.",
    imageUrl: "https://images.unsplash.com/photo-1600091166971-7f9faad6c1e2?q=80&w=2000&auto=format&fit=crop"
  },
  mission: {
    title: "Misi Kami",
    subtitle: "Misi kami adalah menetapkan standar baru dalam keanggunan gaya modest modern.",
    description: "Kami mewujudkannya melalui dedikasi pada kualitas material, desain yang tak lekang oleh waktu, dan komitmen untuk memberdayakan setiap wanita agar tampil percaya diri."
  }
};

const initialShopContent = {
  hero: {
    title: "Koleksi Eksklusif Secera",
    subtitle: "Temukan keanggunan dalam setiap helai pakaian kami yang dirancang khusus untuk Anda.",
    imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
  }
};

export default function AdminCMS() {
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'shop' | 'global'>('home');
  const [isSaving, setIsSaving] = useState(false);
  const [homeContent, setHomeContent] = useState(initialCMSContent);
  const [aboutContent, setAboutContent] = useState(initialAboutContent);
  const [shopContent, setShopContent] = useState(initialShopContent);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      setProducts(data);
    }
    loadProducts();
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
              imageUrl: saved.hero?.imageUrl || initialCMSContent.hero.imageUrl,
              videoUrl: saved.hero?.videoUrl || ''
            },
            showcase: {
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
                question: item.question || initialCMSContent.faq.items[i]?.question || '',
                answer: item.answer || initialCMSContent.faq.items[i]?.answer || ''
              }))
            },
            cta: { 
              title: saved.cta?.title || initialCMSContent.cta.title,
              description: saved.cta?.description || initialCMSContent.cta.description,
              buttonText: saved.cta?.buttonText || initialCMSContent.cta.buttonText,
              buttonLink: saved.cta?.buttonLink || initialCMSContent.cta.buttonLink
            },
            footer: { 
              tagline: saved.footer?.tagline || initialCMSContent.footer.tagline,
              email: saved.footer?.email || initialCMSContent.footer.email,
              phone: saved.footer?.phone || initialCMSContent.footer.phone,
              copyright: saved.footer?.copyright || initialCMSContent.footer.copyright
            },
            marquee: {
              items: saved.marquee?.items || initialCMSContent.marquee.items
            },
            global: {
              siteTitle: saved.global?.siteTitle || initialCMSContent.global.siteTitle,
              seoDescription: saved.global?.seoDescription || initialCMSContent.global.seoDescription,
              seoKeywords: saved.global?.seoKeywords || initialCMSContent.global.seoKeywords,
              socialMedia: {
                instagram: saved.global?.socialMedia?.instagram || initialCMSContent.global.socialMedia.instagram,
                linkedin: saved.global?.socialMedia?.linkedin || initialCMSContent.global.socialMedia.linkedin,
                twitter: saved.global?.socialMedia?.twitter || initialCMSContent.global.socialMedia.twitter,
              }
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
              imageUrl: saved.hero?.imageUrl || initialAboutContent.hero.imageUrl,
              videoUrl: saved.hero?.videoUrl || ''
            },
            inspiration: {
              title: saved.inspiration?.title || initialAboutContent.inspiration.title,
              subtitle: saved.inspiration?.subtitle || initialAboutContent.inspiration.subtitle,
              description1: saved.inspiration?.description1 || initialAboutContent.inspiration.description1,
              description2: saved.inspiration?.description2 || initialAboutContent.inspiration.description2,
              imageUrl: saved.inspiration?.imageUrl || initialAboutContent.inspiration.imageUrl
            },
            mission: {
              title: saved.mission?.title || initialAboutContent.mission.title,
              subtitle: saved.mission?.subtitle || initialAboutContent.mission.subtitle,
              description: saved.mission?.description || initialAboutContent.mission.description
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
              imageUrl: saved.hero?.imageUrl || initialShopContent.hero.imageUrl,
              videoUrl: saved.hero?.videoUrl || ''
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
    const keyMap = {
      home: 'main_site',
      global: 'main_site',
      about: 'about_page',
      shop: 'shop_page'
    };
    const contentMap = {
      home: homeContent,
      global: homeContent,
      about: aboutContent,
      shop: shopContent
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
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Content Management System</h1>
          <p className="text-sm text-gray-500">Manage your site text, hero sections, and FAQ.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#722F38] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#5a252d] transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save CMS Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('home')}
          className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === 'home' ? 'text-[#722F38]' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Home Page
          </div>
          {activeTab === 'home' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#722F38]" />}
        </button>
        <button 
          onClick={() => setActiveTab('about')}
          className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === 'about' ? 'text-[#722F38]' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            About Page
          </div>
          {activeTab === 'about' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#722F38]" />}
        </button>
        <button 
          onClick={() => setActiveTab('shop')}
          className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === 'shop' ? 'text-[#722F38]' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Shop Page
          </div>
          {activeTab === 'shop' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#722F38]" />}
        </button>
        <button 
          onClick={() => setActiveTab('global')}
          className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === 'global' ? 'text-[#722F38]' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Global Settings
          </div>
          {activeTab === 'global' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#722F38]" />}
        </button>
      </div>

      <div className="space-y-8">
        {activeTab === 'home' ? (
          <>
            {/* CMS: Hero Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <Globe className="w-5 h-5 text-[#722F38]" />
                <h2 className="text-lg font-bold text-gray-900">Hero Section</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
                  <input 
                    type="text" 
                    value={homeContent.hero.title} 
                    onChange={(e) => setHomeContent({ ...homeContent, hero: { ...homeContent.hero, title: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
                  <textarea 
                    rows={2}
                    value={homeContent.hero.subtitle} 
                    onChange={(e) => setHomeContent({ ...homeContent, hero: { ...homeContent.hero, subtitle: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none resize-none" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                    <input 
                      type="text" 
                      value={homeContent.hero.cta} 
                      onChange={(e) => setHomeContent({ ...homeContent, hero: { ...homeContent.hero, cta: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                    <input 
                      type="text" 
                      value={homeContent.hero.link || ''} 
                      onChange={(e) => setHomeContent({ ...homeContent, hero: { ...homeContent.hero, link: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" 
                      placeholder="/shop or https://..."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ImageUpload 
                    label="Hero Image (Poster)"
                    value={homeContent.hero.imageUrl || ''}
                    onChange={(url) => setHomeContent({ ...homeContent, hero: { ...homeContent.hero, imageUrl: url } })}
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
                    <p className="text-[10px] text-gray-400 mt-2 italic">If provided, the video will play automatically. Image will be used as a placeholder/poster.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CMS: Marquee Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-[#722F38]" />
                <h2 className="text-lg font-bold text-gray-900">Marquee (Scrolling Text)</h2>
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
            <div className="p-6 space-y-4">
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-[#722F38]" />
                  <h2 className="text-lg font-bold text-gray-900">Product Showcase</h2>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                    <textarea 
                      rows={2}
                      value={homeContent.showcase.title} 
                      onChange={(e) => setHomeContent({ ...homeContent, showcase: { ...homeContent.showcase, title: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none resize-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Description</label>
                    <input 
                      type="text" 
                      value={homeContent.showcase.description} 
                      onChange={(e) => setHomeContent({ ...homeContent, showcase: { ...homeContent.showcase, description: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Featured Products</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto p-1">
                    {products.map(product => (
                      <label 
                        key={product.id} 
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                          homeContent.showcase.productIds.includes(product.id) 
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Video className="w-5 h-5 text-[#722F38]" />
                  <h2 className="text-lg font-bold text-gray-900">UGC Section (Video Gallery)</h2>
                </div>
                <button 
                  onClick={() => {
                    const newItems = [...homeContent.ugc.items, { videoUrl: '', productId: '', thumbnailUrl: '' }];
                    setHomeContent({ ...homeContent, ugc: { ...homeContent.ugc, items: newItems } });
                  }}
                  className="text-sm font-bold text-[#722F38] flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-4 h-4" /> Add Video
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                    <input 
                      type="text" 
                      value={homeContent.ugc.title} 
                      onChange={(e) => setHomeContent({ ...homeContent, ugc: { ...homeContent.ugc, title: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
                    <input 
                      type="text" 
                      value={homeContent.ugc.subtitle} 
                      onChange={(e) => setHomeContent({ ...homeContent, ugc: { ...homeContent.ugc, subtitle: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {homeContent.ugc.items.map((item, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl relative group">
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-[#722F38]" />
                  <h2 className="text-lg font-bold text-gray-900">FAQ Section</h2>
                </div>
                <button 
                  onClick={() => {
                    const newItems = [...homeContent.faq.items, { question: '', answer: '' }];
                    setHomeContent({ ...homeContent, faq: { ...homeContent.faq, items: newItems } });
                  }}
                  className="text-sm font-bold text-[#722F38] flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-4 h-4" /> Add FAQ
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                    <input 
                      type="text" 
                      value={homeContent.faq.title} 
                      onChange={(e) => setHomeContent({ ...homeContent, faq: { ...homeContent.faq, title: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Description</label>
                    <input 
                      type="text" 
                      value={homeContent.faq.description} 
                      onChange={(e) => setHomeContent({ ...homeContent, faq: { ...homeContent.faq, description: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" 
                    />
                  </div>
                </div>

                {homeContent.faq.items.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl relative group space-y-3">
                    <button 
                      onClick={() => {
                        const newItems = homeContent.faq.items.filter((_, i) => i !== index);
                        setHomeContent({ ...homeContent, faq: { ...homeContent.faq, items: newItems } });
                      }}
                      className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Question {index + 1}</label>
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
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none bg-white resize-none" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Global CTA */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <Globe className="w-5 h-5 text-[#722F38]" />
                <h2 className="text-lg font-bold text-gray-900">Bottom CTA Banner</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CTA Title</label>
                    <input 
                      type="text" 
                      value={homeContent.cta.title} 
                      onChange={(e) => setHomeContent({ ...homeContent, cta: { ...homeContent.cta, title: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CTA Description</label>
                    <input 
                      type="text" 
                      value={homeContent.cta.description} 
                      onChange={(e) => setHomeContent({ ...homeContent, cta: { ...homeContent.cta, description: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                    <input 
                      type="text" 
                      value={homeContent.cta.buttonText} 
                      onChange={(e) => setHomeContent({ ...homeContent, cta: { ...homeContent.cta, buttonText: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                    <input 
                      type="text" 
                      value={homeContent.cta.buttonLink || ''} 
                      onChange={(e) => setHomeContent({ ...homeContent, cta: { ...homeContent.cta, buttonLink: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" 
                      placeholder="/shop or https://..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : activeTab === 'about' ? (
          <>
            {/* About Page: Hero */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <Globe className="w-5 h-5 text-[#722F38]" />
                <h2 className="text-lg font-bold text-gray-900">Hero Section</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
                  <input 
                    type="text" 
                    value={aboutContent.hero.title} 
                    onChange={(e) => setAboutContent({ ...aboutContent, hero: { ...aboutContent.hero, title: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
                  <textarea 
                    rows={3}
                    value={aboutContent.hero.subtitle} 
                    onChange={(e) => setAboutContent({ ...aboutContent, hero: { ...aboutContent.hero, subtitle: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none resize-none" 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ImageUpload 
                    label="Hero Image (Poster)"
                    value={aboutContent.hero.imageUrl}
                    onChange={(url) => setAboutContent({ ...aboutContent, hero: { ...aboutContent.hero, imageUrl: url } })}
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
                  </div>
                </div>
              </div>
            </div>

            {/* About Page: Inspiration */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <Globe className="w-5 h-5 text-[#722F38]" />
                <h2 className="text-lg font-bold text-gray-900">Inspiration Section</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <textarea 
                    rows={2}
                    value={aboutContent.inspiration.subtitle} 
                    onChange={(e) => setAboutContent({ ...aboutContent, inspiration: { ...aboutContent.inspiration, subtitle: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none resize-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description Paragraph 1</label>
                  <textarea 
                    rows={3}
                    value={aboutContent.inspiration.description1} 
                    onChange={(e) => setAboutContent({ ...aboutContent, inspiration: { ...aboutContent.inspiration, description1: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none resize-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description Paragraph 2</label>
                  <textarea 
                    rows={3}
                    value={aboutContent.inspiration.description2} 
                    onChange={(e) => setAboutContent({ ...aboutContent, inspiration: { ...aboutContent.inspiration, description2: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none resize-none" 
                  />
                </div>
                <ImageUpload 
                  label="Side Image"
                  value={aboutContent.inspiration.imageUrl}
                  onChange={(url) => setAboutContent({ ...aboutContent, inspiration: { ...aboutContent.inspiration, imageUrl: url } })}
                />
              </div>
            </div>

            {/* About Page: Mission */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <Globe className="w-5 h-5 text-[#722F38]" />
                <h2 className="text-lg font-bold text-gray-900">Mission Section</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mission Subtitle</label>
                  <textarea 
                    rows={2}
                    value={aboutContent.mission.subtitle} 
                    onChange={(e) => setAboutContent({ ...aboutContent, mission: { ...aboutContent.mission, subtitle: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none resize-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mission Description</label>
                  <textarea 
                    rows={3}
                    value={aboutContent.mission.description} 
                    onChange={(e) => setAboutContent({ ...aboutContent, mission: { ...aboutContent.mission, description: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none resize-none" 
                  />
                </div>
              </div>
            </div>
          </>
        ) : activeTab === 'shop' ? (
          <>
            {/* Shop Page: Hero */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <Globe className="w-5 h-5 text-[#722F38]" />
                <h2 className="text-lg font-bold text-gray-900">Hero Section</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
                  <input 
                    type="text" 
                    value={shopContent.hero.title} 
                    onChange={(e) => setShopContent({ ...shopContent, hero: { ...shopContent.hero, title: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
                  <textarea 
                    rows={2}
                    value={shopContent.hero.subtitle} 
                    onChange={(e) => setShopContent({ ...shopContent, hero: { ...shopContent.hero, subtitle: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none resize-none" 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ImageUpload 
                    label="Hero Image (Poster)"
                    value={shopContent.hero.imageUrl}
                    onChange={(url) => setShopContent({ ...shopContent, hero: { ...shopContent.hero, imageUrl: url } })}
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
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Global Settings: Site Information & SEO */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <Globe className="w-5 h-5 text-[#722F38]" />
                <h2 className="text-lg font-bold text-gray-900">Site Information & SEO</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site Title</label>
                  <input 
                    type="text" 
                    value={homeContent.global?.siteTitle || ''} 
                    onChange={(e) => setHomeContent({ ...homeContent, global: { ...homeContent.global, siteTitle: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
                  <textarea 
                    rows={2}
                    value={homeContent.global?.seoDescription || ''} 
                    onChange={(e) => setHomeContent({ ...homeContent, global: { ...homeContent.global, seoDescription: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none resize-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SEO Keywords (comma separated)</label>
                  <input 
                    type="text" 
                    value={homeContent.global?.seoKeywords || ''} 
                    onChange={(e) => setHomeContent({ ...homeContent, global: { ...homeContent.global, seoKeywords: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" 
                  />
                </div>
              </div>
            </div>

            {/* Global Settings: Social Media */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <Globe className="w-5 h-5 text-[#722F38]" />
                <h2 className="text-lg font-bold text-gray-900">Social Media Links</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                  <input 
                    type="text" 
                    value={homeContent.global?.socialMedia?.instagram || ''} 
                    onChange={(e) => setHomeContent({ 
                      ...homeContent, 
                      global: { 
                        ...homeContent.global, 
                        socialMedia: { ...homeContent.global.socialMedia, instagram: e.target.value } 
                      } 
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                  <input 
                    type="text" 
                    value={homeContent.global?.socialMedia?.linkedin || ''} 
                    onChange={(e) => setHomeContent({ 
                      ...homeContent, 
                      global: { 
                        ...homeContent.global, 
                        socialMedia: { ...homeContent.global.socialMedia, linkedin: e.target.value } 
                      } 
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Twitter URL</label>
                  <input 
                    type="text" 
                    value={homeContent.global?.socialMedia?.twitter || ''} 
                    onChange={(e) => setHomeContent({ 
                      ...homeContent, 
                      global: { 
                        ...homeContent.global, 
                        socialMedia: { ...homeContent.global.socialMedia, twitter: e.target.value } 
                      } 
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" 
                  />
                </div>
              </div>
            </div>

            {/* Global Settings: Footer */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <Globe className="w-5 h-5 text-[#722F38]" />
                <h2 className="text-lg font-bold text-gray-900">Footer Settings</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                  <input 
                    type="text" 
                    value={homeContent.footer.tagline} 
                    onChange={(e) => setHomeContent({ ...homeContent, footer: { ...homeContent.footer, tagline: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Copyright Text</label>
                  <input 
                    type="text" 
                    value={homeContent.footer.copyright} 
                    onChange={(e) => setHomeContent({ ...homeContent, footer: { ...homeContent.footer, copyright: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      value={homeContent.footer.email} 
                      onChange={(e) => setHomeContent({ ...homeContent, footer: { ...homeContent.footer, email: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone (WhatsApp)</label>
                    <input 
                      type="text" 
                      value={homeContent.footer.phone} 
                      onChange={(e) => setHomeContent({ ...homeContent, footer: { ...homeContent.footer, phone: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
