import { useState, useEffect } from 'react';
import { Save, Globe, Home, Info } from 'lucide-react';
import { initialCMSContent } from '../../data/cms';
import { getCMSContent, saveCMSContent } from '../../utils/api';
import ImageUpload from '../../components/admin/ImageUpload';

const initialAboutContent = {
  hero: {
    title: "Secera adalah tim desainer, pengrajin, dan visioner yang berdedikasi untuk mendefinisikan ulang gaya modest modern.",
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

export default function AdminCMS() {
  const [activeTab, setActiveTab] = useState<'home' | 'about'>('home');
  const [isSaving, setIsSaving] = useState(false);
  const [homeContent, setHomeContent] = useState(initialCMSContent);
  const [aboutContent, setAboutContent] = useState(initialAboutContent);

  useEffect(() => {
    async function loadContent() {
      if (activeTab === 'home' || activeTab === 'global') {
        const saved = await getCMSContent('main_site');
        if (saved) {
          setHomeContent({
            ...initialCMSContent,
            ...saved,
            hero: { ...initialCMSContent.hero, ...saved.hero },
            faq: { ...initialCMSContent.faq, ...saved.faq },
            cta: { ...initialCMSContent.cta, ...saved.cta },
            features: { ...initialCMSContent.features, ...saved.features },
            footer: { ...initialCMSContent.footer, ...saved.footer },
            global: { ...initialCMSContent.global, ...saved.global }
          });
        }
      } else if (activeTab === 'about') {
        const saved = await getCMSContent('about_page');
        if (saved) {
          setAboutContent({
            ...initialAboutContent,
            ...saved,
            hero: { ...initialAboutContent.hero, ...saved.hero },
            inspiration: { ...initialAboutContent.inspiration, ...saved.inspiration },
            mission: { ...initialAboutContent.mission, ...saved.mission }
          });
        }
      }
    }
    loadContent();
  }, [activeTab]);

  const handleSave = async () => {
    setIsSaving(true);
    const key = (activeTab === 'home' || activeTab === 'global') ? 'main_site' : 'about_page';
    const content = (activeTab === 'home' || activeTab === 'global') ? homeContent : aboutContent;
    
    const success = await saveCMSContent(key, content);
    setIsSaving(false);
    if (success) {
      alert('CMS Content saved successfully!');
    } else {
      alert('Failed to save CMS content.');
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
                <ImageUpload 
                  label="Hero Image"
                  value={homeContent.hero.imageUrl}
                  onChange={(url) => setHomeContent({ ...homeContent, hero: { ...homeContent.hero, imageUrl: url } })}
                />
              </div>
            </div>

            {/* CMS: FAQ Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <Globe className="w-5 h-5 text-[#722F38]" />
                <h2 className="text-lg font-bold text-gray-900">FAQ Section</h2>
              </div>
              <div className="p-6 space-y-6">
                {homeContent.faq.items.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl space-y-3">
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
                <h2 className="text-lg font-bold text-gray-900">Global CTA (WhatsApp Promo)</h2>
              </div>
              <div className="p-6 space-y-4">
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
                  <textarea 
                    rows={2}
                    value={homeContent.cta.description} 
                    onChange={(e) => setHomeContent({ ...homeContent, cta: { ...homeContent.cta, description: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none resize-none" 
                  />
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
                  <textarea 
                    rows={3}
                    value={aboutContent.hero.title} 
                    onChange={(e) => setAboutContent({ ...aboutContent, hero: { ...aboutContent.hero, title: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none resize-none" 
                  />
                </div>
                <ImageUpload 
                  label="Hero Image"
                  value={aboutContent.hero.imageUrl}
                  onChange={(url) => setAboutContent({ ...aboutContent, hero: { ...aboutContent.hero, imageUrl: url } })}
                />
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
