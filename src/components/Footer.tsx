import { useState, useEffect } from 'react';
import { Instagram, Linkedin, Twitter, ArrowRight, MessageCircle } from 'lucide-react';
import { initialCMSContent } from '../data/cms';
import { getCMSContent } from '../utils/api';

export default function Footer() {
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
    <footer className="bg-[#722F38] text-[#F9F9F9] pt-20 relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-12">
          <img src="/Logo/LogoType-light.svg" alt={cms.global.siteTitle} className="h-10 md:h-12 w-auto object-contain" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="font-bold text-lg mb-2">Belanja</h4>
            <a href="#" className="text-sm text-[#F9F9F9]/80 hover:text-white transition-colors">Koleksi Baru</a>
            <a href="#" className="text-sm text-[#F9F9F9]/80 hover:text-white transition-colors">Signature Outer</a>
            <a href="#" className="text-sm text-[#F9F9F9]/80 hover:text-white transition-colors">Aksesoris</a>
            <a href="#" className="text-sm text-[#F9F9F9]/80 hover:text-white transition-colors">Ulasan Pelanggan</a>
            <a href="#" className="text-sm text-[#F9F9F9]/80 hover:text-white transition-colors">Panduan Ukuran</a>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="font-bold text-lg mb-2">Tentang</h4>
            <a href="#" className="text-sm text-[#F9F9F9]/80 hover:text-white transition-colors">Tentang Kami</a>
            <a href="#" className="text-sm text-[#F9F9F9]/80 hover:text-white transition-colors">Jurnal</a>
            <a href="#" className="text-sm text-[#F9F9F9]/80 hover:text-white transition-colors">Karir</a>
            <a href="#" className="text-sm text-[#F9F9F9]/80 hover:text-white transition-colors">Syarat & Ketentuan</a>
          </div>

          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="font-bold text-lg mb-2">Hubungi Kami</h4>
            <a href={`https://wa.me/${cms.footer.phone}`} target="_blank" rel="noopener noreferrer" className="text-sm text-[#F9F9F9]/80 hover:text-white transition-colors mb-1 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> +{cms.footer.phone}
            </a>
            <a href={`mailto:${cms.footer.email}`} className="text-sm text-[#F9F9F9]/80 hover:text-white transition-colors mb-4">{cms.footer.email}</a>
            <div className="flex items-center gap-4">
              <a href={cms.global.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href={cms.global.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href={cms.global.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-[#7b5455] rounded-2xl p-8 lg:p-10 shadow-xl">
              <h3 className="text-2xl md:text-3xl font-serif mb-8 leading-snug">Dapatkan berita dan penawaran terbaru dari kami</h3>
              <div className="relative border-b border-[#F9F9F9]/30 pb-2 flex items-center">
                <input
                  type="email"
                  placeholder="Email"
                  className="bg-transparent w-full outline-none text-[#F9F9F9] placeholder:text-[#F9F9F9]/50 pr-8 text-lg"
                />
                <button className="absolute right-0 hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-6 h-6 text-[#F9F9F9]/70" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 text-xs text-[#F9F9F9]/70 mb-8">
          <span>{cms.footer.tagline}</span>
          <span className="hidden md:inline">|</span>
          <span>{cms.footer.copyright}</span>
          <span className="hidden md:inline">|</span>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        </div>

        <div className="h-px bg-[#F9F9F9]/20 w-full mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-[10px] text-[#F9F9F9]/60 mb-16">
          <div className="md:col-span-7 flex flex-col gap-3">
            <p className="flex gap-2">
              <span>*</span>
              <span>Penawaran waktu terbatas untuk pelanggan baru. Gunakan kode saat checkout. Syarat dan ketentuan berlaku. Tidak dapat digabungkan dengan penawaran lain.</span>
            </p>
            <p className="flex gap-2">
              <span>**</span>
              <span>Studi Material Secera: Hasil dilaporkan dalam uji kenyamanan 2025. Material terbukti memberikan sirkulasi udara optimal dan kenyamanan sepanjang hari.</span>
            </p>
          </div>
          <div className="md:col-span-5 border border-[#F9F9F9]/20 rounded-xl p-5">
            <p>*Pernyataan ini belum dievaluasi oleh lembaga terkait. Produk ini tidak dimaksudkan untuk mendiagnosis, merawat, menyembuhkan, atau mencegah penyakit apa pun.</p>
          </div>
        </div>
      </div>

      <div className="w-full overflow-hidden leading-none pt-4 flex justify-center items-end">
        <h1 className="text-[24vw] font-bold text-[#F9F9F9] leading-[0.72] tracking-tighter select-none">
          {cms.global.siteTitle.split('|')[0].trim().toLowerCase()}
        </h1>
      </div>
    </footer>
  );
}
