import { useState, useEffect } from 'react';
import { Instagram, Linkedin, Twitter, ArrowRight, MessageCircle, Facebook } from 'lucide-react';
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
          footer: { ...initialCMSContent.footer, ...data.footer },
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
            <p className="text-label text-[#F9F9F9]/60 mb-2">Dapatkan komisi eksklusif dengan berbagi keanggunan</p>
            <h3 className="font-serif text-2xl md:text-3xl text-white mb-6 max-w-md leading-tight">BERGABUNG SEBAGAI AFFILIATOR SECERA</h3>
            <div className="flex mb-8">
              <a 
                href={`https://wa.me/${settings.whatsapp_number || cms.footer.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 px-8 bg-[#F9F9F9] text-[#5A252D] text-label hover:bg-white transition-all inline-flex items-center justify-center gap-3 group"
              >
                HUBUNGI WHATSAPP
                <MessageCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
              </a>
            </div>
            <div className="flex items-center gap-4 text-[#F9F9F9]/85">
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
              )}
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Facebook"><Facebook className="w-5 h-5" /></a>
              )}
              {settings.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Twitter"><Twitter className="w-5 h-5" /></a>
              )}
              {settings.tiktok_url && (
                <a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="TikTok">
                  <i className="fa-brands fa-tiktok text-lg"></i>
                </a>
              )}
              <a href={`https://wa.me/${settings.whatsapp_number || cms.footer.phone}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="WhatsApp">
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
