import { useState, useEffect } from 'react';
import { Instagram, Linkedin, Twitter, ArrowRight, MessageCircle } from 'lucide-react';
import { initialCMSContent } from '../data/cms';
import { getCMSContent, getSettings } from '../utils/api';

export default function Footer() {
  const [cms, setCms] = useState(initialCMSContent);
  const [settings, setSettings] = useState<any>({});

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
    async function loadSettings() {
      const data = await getSettings();
      if (data) setSettings(data);
    }
    loadCMS();
    loadSettings();
  }, []);

  const groupedLinks = cms.footer.links || [];

  return (
    <footer className="bg-[#722F38] text-[#F9F9F9] border-t border-[#F9F9F9]/12">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-10 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-10 lg:gap-16">
          <div>
            <p className="text-label text-[#F9F9F9]/60 mb-6">Jadi yang pertama tahu koleksi baru SECERA</p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 max-w-xl mb-6">
              <input
                type="email"
                placeholder="Alamat email"
                aria-label="Masukkan email untuk menerima update koleksi"
                className="w-full h-12 px-4 bg-[#F9F9F9] text-[#5A252D] placeholder:text-[#5A252D]/50 outline-none"
              />
              <button
                aria-label="Kirim email untuk berlangganan update"
                className="h-12 px-6 bg-[#F9F9F9] text-[#5A252D] text-label hover:bg-white transition-colors inline-flex items-center justify-center gap-2"
              >
                Berlangganan
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-4 text-[#F9F9F9]/85">
              <a href={cms.global.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
              <a href={cms.global.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn"><Linkedin className="w-5 h-5" /></a>
              <a href={cms.global.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Twitter"><Twitter className="w-5 h-5" /></a>
              <a href={`https://wa.me/${cms.footer.phone}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="WhatsApp">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {groupedLinks.slice(0, 4).map((group, idx) => (
              <div key={idx} className="space-y-3">
                <p className="text-label text-[#F9F9F9]/50">{group.title}</p>
                {group.items.slice(0, 4).map((item, itemIdx) => (
                  <a key={itemIdx} href={item.url} className="block text-sm text-[#F9F9F9]/88 hover:text-white transition-colors">
                    {item.label}
                  </a>
                ))}
              </div>
            ))}
            <div className="space-y-3">
              <p className="text-label text-[#F9F9F9]/50">Perusahaan</p>
              <div className="space-y-2">
                <p className="text-sm font-bold text-white">{settings.company_name || 'SECERA'}</p>
                <p className="text-xs text-[#F9F9F9]/60 whitespace-pre-wrap">
                  {settings.company_address || 'Indonesia'}
                </p>
                <div className="pt-2">
                  <p className="text-[10px] text-[#F9F9F9]/40 uppercase tracking-widest">Kontak</p>
                  <p className="text-xs text-[#F9F9F9]/60">{cms.footer.email}</p>
                  <p className="text-xs text-[#F9F9F9]/60">{cms.footer.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#F9F9F9]/10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-[#F9F9F9]/60">
          <p>{cms.footer.copyright}</p>
          <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
        </div>
      </div>
    </footer>
  );
}
