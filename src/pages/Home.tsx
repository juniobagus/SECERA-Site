/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState, useEffect } from 'react';
import { Star, Clock, Layers, Gem, Sparkles, ChevronLeft, ChevronRight, VolumeX, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Apakah bahannya mudah kusut?",
      answer: "Tidak, kami menggunakan material Ceruty Babydoll Premium yang flowy dan tidak mudah kusut, sehingga Anda tetap tampil rapi sepanjang hari."
    },
    {
      question: "Berapa lama waktu pengiriman?",
      answer: "Pengiriman reguler memakan waktu 2-3 hari kerja untuk area Jabodetabek, dan 3-5 hari kerja untuk luar Jabodetabek."
    },
    {
      question: "Apakah bisa dikembalikan jika ukuran tidak pas?",
      answer: "Ya, kami menerima penukaran ukuran maksimal 3 hari setelah barang diterima dengan syarat tag masih terpasang dan belum dicuci."
    },
    {
      question: "Bagaimana cara perawatannya?",
      answer: "Disarankan untuk mencuci dengan tangan menggunakan air dingin dan deterjen lembut. Hindari penggunaan pemutih dan setrika dengan suhu rendah."
    }
  ];

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      
      const maxScroll = scrollWidth - clientWidth;
      const isAtEnd = Math.ceil(scrollLeft) >= maxScroll - 10;
      setCanScrollRight(!isAtEnd && maxScroll > 0);

      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
      setScrollProgress(Math.min(Math.max(progress, 0), 100));
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 324 : 424; // Card width + gap
      carouselRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <>
    <div className="min-h-screen w-full bg-[#F9F9F9] p-3 md:p-5 flex flex-col font-sans">
      <div className="relative flex-1 w-full rounded-[2rem] overflow-hidden flex flex-col min-h-[80vh]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          {/* 
            Note: Please upload your image to the 'public' folder 
            in the file explorer and name it 'hero-image.jpg' 
          */}
          <img
            src="/hero-image.jpg"
            alt="SECERA women wearing maroon scarves"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          {/* Dark overlay for white text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Hero Content */}
        <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 text-center pt-24">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight mb-6 max-w-4xl leading-tight text-white">
            Anggun dalam<br />Sekejap
          </h2>

          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl font-light">
            Tampil berbudaya dan elegan tanpa kompromi. Desain eksklusif yang siap memukau dalam 5 detik.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button className="px-8 py-3.5 rounded-full border border-white/60 bg-transparent hover:bg-white hover:text-black transition-all duration-300 text-sm font-medium w-full sm:w-auto text-white">
              Lihat Koleksi
            </button>
            <button className="px-8 py-3.5 rounded-full border border-white/60 bg-transparent hover:bg-white hover:text-black transition-all duration-300 text-sm font-medium w-full sm:w-auto text-white">
              Keajaiban 5 Detik
            </button>
          </div>
        </main>
      </div>

      {/* Trust & Features Marquee */}
      <div className="w-full py-4 mt-3 md:mt-5 flex items-center overflow-hidden px-4 md:px-8 shrink-0">
        {/* Left side: Rating */}
        <div className="hidden md:flex items-center gap-2 pr-6 md:pr-8 shrink-0 z-10">
          <div className="flex items-center gap-1">
            <Star className="w-6 h-6 fill-[#00b67a] text-[#00b67a]" />
            <span className="font-bold text-xl tracking-tight">Trustpilot</span>
          </div>
          <div className="flex items-center gap-0.5 ml-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-[#00b67a] p-1 rounded-sm">
                <Star className="w-4 h-4 fill-white text-white" />
              </div>
            ))}
          </div>
        </div>

        {/* Right side: Marquee */}
        <div className="flex-1 overflow-hidden relative md:ml-8 flex items-center mask-image-linear">
          {/* 
            We duplicate the content to create a seamless infinite loop.
            The animation translates from 0 to -50%, so the content needs to be twice as wide.
          */}
          <div className="flex items-center gap-12 animate-marquee whitespace-nowrap w-max">
            {/* Group 1 */}
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-zinc-600" strokeWidth={1.5} />
              <span className="text-zinc-800 font-medium">Siap pakai dalam 5 detik</span>
            </div>
            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-zinc-600" strokeWidth={1.5} />
              <span className="text-zinc-800 font-medium">1 Outer untuk 3 Looks</span>
            </div>
            <div className="flex items-center gap-3">
              <Gem className="w-5 h-5 text-zinc-600" strokeWidth={1.5} />
              <span className="text-zinc-800 font-medium">Material Premium Ceruty Babydoll</span>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-zinc-600" strokeWidth={1.5} />
              <span className="text-zinc-800 font-medium">Ketenangan & Keanggunan</span>
            </div>
            
            {/* Group 2 (Duplicate for seamless loop) */}
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-zinc-600" strokeWidth={1.5} />
              <span className="text-zinc-800 font-medium">Siap pakai dalam 5 detik</span>
            </div>
            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-zinc-600" strokeWidth={1.5} />
              <span className="text-zinc-800 font-medium">1 Outer untuk 3 Looks</span>
            </div>
            <div className="flex items-center gap-3">
              <Gem className="w-5 h-5 text-zinc-600" strokeWidth={1.5} />
              <span className="text-zinc-800 font-medium">Material Premium Ceruty Babydoll</span>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-zinc-600" strokeWidth={1.5} />
              <span className="text-zinc-800 font-medium">Ketenangan & Keanggunan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="relative w-full rounded-[2rem] overflow-hidden bg-[#F9F9F9] mt-3 md:mt-5 pt-20 pb-6 px-4 md:px-6 flex flex-col items-center">
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-4 relative z-10">
          KOLEKSI SECERA
        </span>
        <h2 className="text-4xl md:text-6xl font-serif text-[#6E2B30] mb-8 relative z-10">
          Timeless Elegance
        </h2>

        {/* Section Background Image */}
        <div className="absolute top-40 left-0 right-0 bottom-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#F9F9F9] via-transparent to-[#F9F9F9]/50 z-10" />
          <img
            src="https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=2800&auto=format&fit=crop"
            alt="Elegant woman"
            className="w-full h-full object-cover object-top"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Cards Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-6xl mt-[20vh] md:mt-[30vh]">
          {/* Card 1 */}
          <div className="group bg-gradient-to-b from-[#f3e1d5]/60 to-[#e8cbb7]/60 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 flex flex-col h-[450px] md:h-[550px] relative overflow-hidden shadow-lg border border-white/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
            <div className="flex flex-col items-start z-10 relative">
              <div className="pr-4">
                <h3 className="text-2xl md:text-3xl font-medium text-zinc-900 mb-2">Pre-stitched</h3>
                <p className="text-zinc-700 text-sm md:text-base">Siap pakai dalam 5 detik tanpa ribet</p>
              </div>
              <div className="flex flex-wrap gap-2 mt-5">
                <a href="#" target="_blank" rel="noopener noreferrer" className="px-5 py-2 bg-white/80 hover:bg-white text-zinc-900 text-sm font-medium rounded-full backdrop-blur-sm transition-colors border border-white shadow-sm">
                  Shopee
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="px-5 py-2 bg-white/80 hover:bg-white text-zinc-900 text-sm font-medium rounded-full backdrop-blur-sm transition-colors border border-white shadow-sm">
                  TikTok Shop
                </a>
              </div>
            </div>
            <div className="absolute bottom-0 left-8 right-8 h-[55%] rounded-t-2xl overflow-hidden shadow-2xl bg-white border border-white/50">
              <img src="https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?q=80&w=800&auto=format&fit=crop" alt="Pre-stitched scarf detail" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="group bg-gradient-to-b from-[#e8ebe6]/60 to-[#d1d6cc]/60 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 flex flex-col h-[450px] md:h-[550px] relative overflow-hidden shadow-lg border border-white/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
            <div className="flex flex-col items-start z-10 relative">
              <div className="pr-4">
                <h3 className="text-2xl md:text-3xl font-medium text-zinc-900 mb-2">Versatile Styling</h3>
                <p className="text-zinc-700 text-sm md:text-base">Satu item untuk 3 looks berbeda</p>
              </div>
              <div className="flex flex-wrap gap-2 mt-5">
                <a href="#" target="_blank" rel="noopener noreferrer" className="px-5 py-2 bg-white/80 hover:bg-white text-zinc-900 text-sm font-medium rounded-full backdrop-blur-sm transition-colors border border-white shadow-sm">
                  Shopee
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="px-5 py-2 bg-white/80 hover:bg-white text-zinc-900 text-sm font-medium rounded-full backdrop-blur-sm transition-colors border border-white shadow-sm">
                  TikTok Shop
                </a>
              </div>
            </div>
            <div className="absolute bottom-0 left-8 right-8 h-[55%] rounded-t-2xl overflow-hidden shadow-2xl bg-white border border-white/50">
              <img src="https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=800&auto=format&fit=crop" alt="Versatile styling detail" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="w-full bg-[#F9F9F9] py-20 px-4 md:px-12 flex flex-col mt-3 md:mt-5 rounded-[2rem]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#6E2B30] max-w-2xl leading-tight">
            Kualitas premium yang <span className="text-zinc-400">terasa personal, bukan sekadar busana</span>
          </h2>
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => scroll('left')} 
              disabled={!canScrollLeft}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                canScrollLeft ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900' : 'bg-zinc-50 text-zinc-300 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => scroll('right')} 
              disabled={!canScrollRight}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                canScrollRight ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900' : 'bg-zinc-50 text-zinc-300 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div 
          ref={carouselRef} 
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8"
        >
          {/* Card 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="carousel-card min-w-[300px] md:min-w-[400px] flex flex-col gap-6 snap-start cursor-pointer group"
          >
            <div className="bg-[#ffffff] rounded-[2rem] p-8 h-[450px] flex flex-col relative overflow-hidden transition-shadow duration-300 group-hover:shadow-xl">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-800 mb-4">MATERIAL</span>
              <h3 className="text-2xl md:text-3xl font-medium text-zinc-900 leading-snug">
                Ceruty Babydoll Premium
              </h3>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-64 bg-[#6E2B30] rounded-t-lg shadow-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                <span className="text-white font-serif text-2xl -rotate-90 tracking-widest">SECERA</span>
              </div>
            </div>
            <p className="text-zinc-600 text-sm md:text-base leading-relaxed transition-colors duration-300 group-hover:text-zinc-900">
              Material flowy yang jatuh sempurna, memberikan tampilan mewah dan kenyamanan maksimal.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="carousel-card min-w-[300px] md:min-w-[400px] flex flex-col gap-6 snap-start cursor-pointer group"
          >
            <div className="bg-[#ffffff] rounded-[2rem] p-8 h-[450px] flex flex-col relative overflow-hidden transition-shadow duration-300 group-hover:shadow-xl">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-800 mb-4">CRAFTSMANSHIP</span>
              <h3 className="text-2xl md:text-3xl font-medium text-zinc-900 leading-snug">
                Kualitas Butik Presisi
              </h3>
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-64 rounded-3xl overflow-hidden shadow-xl border-4 border-white transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                <img src="https://images.unsplash.com/photo-1589465885855-44224b203439?q=80&w=400&auto=format&fit=crop" alt="Craftsmanship" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
            <p className="text-zinc-600 text-sm md:text-base leading-relaxed transition-colors duration-300 group-hover:text-zinc-900">
              Dikerjakan oleh tangan ahli untuk jahitan rapi, kuat, dan tahan lama di setiap helainya.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            className="carousel-card min-w-[300px] md:min-w-[400px] flex flex-col gap-6 snap-start cursor-pointer group"
          >
            <div className="bg-[#ffffff] rounded-[2rem] p-8 h-[450px] flex flex-col relative overflow-hidden transition-shadow duration-300 group-hover:shadow-xl">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-800 mb-4">VERSATILITY</span>
              <h3 className="text-2xl md:text-3xl font-medium text-zinc-900 leading-snug">
                1 Outer, 3 Looks
              </h3>
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full px-8 flex flex-col gap-3 transition-transform duration-500 group-hover:-translate-y-2">
                <div className="bg-white/80 backdrop-blur-sm rounded-full py-3 px-6 text-center text-sm font-medium text-zinc-800 shadow-sm transition-colors duration-300 group-hover:bg-white">Gaya Formal</div>
                <div className="bg-white/80 backdrop-blur-sm rounded-full py-3 px-6 text-center text-sm font-medium text-zinc-800 shadow-sm transition-colors duration-300 group-hover:bg-white">Gaya Kasual</div>
                <div className="bg-white/80 backdrop-blur-sm rounded-full py-3 px-6 text-center text-sm font-medium text-zinc-800 shadow-sm transition-colors duration-300 group-hover:bg-white">Acara Spesial</div>
              </div>
            </div>
            <p className="text-zinc-600 text-sm md:text-base leading-relaxed transition-colors duration-300 group-hover:text-zinc-900">
              Desain inovatif untuk transformasi gaya instan. Cocok untuk acara formal maupun kasual.
            </p>
          </motion.div>

          {/* Card 4 (Dummy) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
            className="carousel-card min-w-[300px] md:min-w-[400px] flex flex-col gap-6 snap-start cursor-pointer group"
          >
            <div className="bg-[#ffffff] rounded-[2rem] p-8 h-[450px] flex flex-col relative overflow-hidden transition-shadow duration-300 group-hover:shadow-xl">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-800 mb-4">COMFORT</span>
              <h3 className="text-2xl md:text-3xl font-medium text-zinc-900 leading-snug">
                Ringan & Breathable
              </h3>
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-64 rounded-3xl overflow-hidden shadow-xl border-4 border-white transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                <img src="https://images.unsplash.com/photo-1515347619152-14123c126839?q=80&w=400&auto=format&fit=crop" alt="Comfort" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
            <p className="text-zinc-600 text-sm md:text-base leading-relaxed transition-colors duration-300 group-hover:text-zinc-900">
              Tetap segar dan bebas gerak dari pagi hingga malam tanpa rasa gerah.
            </p>
          </motion.div>

          {/* Card 5 (Dummy) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
            className="carousel-card min-w-[300px] md:min-w-[400px] flex flex-col gap-6 snap-start cursor-pointer group"
          >
            <div className="bg-[#ffffff] rounded-[2rem] p-8 h-[450px] flex flex-col relative overflow-hidden transition-shadow duration-300 group-hover:shadow-xl">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-800 mb-4">ELEGANCE</span>
              <h3 className="text-2xl md:text-3xl font-medium text-zinc-900 leading-snug">
                Timeless Elegance
              </h3>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-64 bg-[#6E2B30] rounded-t-lg shadow-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                <span className="text-white font-serif text-2xl -rotate-90 tracking-widest">TIMELESS</span>
              </div>
            </div>
            <p className="text-zinc-600 text-sm md:text-base leading-relaxed transition-colors duration-300 group-hover:text-zinc-900">
              Siluet klasik dengan sentuhan modern. Gaya anggun yang selalu relevan di setiap momen.
            </p>
          </motion.div>
        </div>

        {/* Progress Slider */}
        <div className="w-full max-w-md mx-auto mt-8 bg-zinc-200 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-[#6E2B30] h-full transition-all duration-300 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>
    </div>

    {/* Product Grid Section */}
    <section className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto bg-[#F9F9F9]">
      <div className="max-w-5xl mx-auto text-center mb-24">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-2xl md:text-4xl lg:text-[40px] font-serif text-[#6E2B30] leading-snug md:leading-relaxed"
        >
          Secera adalah merek yang menggabungkan keanggunan dan kepraktisan. Terinspirasi oleh kebutuhan wanita modern, kami percaya bahwa tampil memukau tidak harus rumit. Setiap helai dirancang untuk menyelaraskan kenyamanan dan gaya, menghadirkan <span className="italic">timeless elegance</span> dalam setiap detik berharga Anda.
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
        {[
          {
            name: "Secera Outer - Midnight Black",
            category: "(SIGNATURE COLLECTION)",
            price: "Rp 249.000",
            image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop"
          },
          {
            name: "Secera Outer - Broken White",
            category: "(SIGNATURE COLLECTION)",
            price: "Rp 249.000",
            image: "https://images.unsplash.com/photo-1604004215402-e0be233f39be?q=80&w=800&auto=format&fit=crop"
          },
          {
            name: "Secera Outer - Dusty Rose",
            category: "(SIGNATURE COLLECTION)",
            price: "Rp 249.000",
            image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=800&auto=format&fit=crop"
          },
          {
            name: "Secera Outer - Sage Green",
            category: "(SIGNATURE COLLECTION)",
            price: "Rp 249.000",
            image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=800&auto=format&fit=crop"
          }
        ].map((product, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            className="group flex flex-col cursor-pointer"
          >
            <div className="bg-[#F1F2E9] aspect-[4/5] mb-6 overflow-hidden relative">
              <img 
                src={product.image} 
                alt={product.name} 
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col flex-grow px-2">
              <span className="text-[11px] font-medium tracking-widest text-zinc-500 mb-3 uppercase">{product.category}</span>
              <h3 className="text-lg font-serif text-zinc-900 mb-2">{product.name}</h3>
              <p className="text-zinc-600 mb-6 text-sm">{product.price}</p>
            </div>
            <button className="w-full py-4 px-2 border-t border-zinc-200 text-xs font-medium tracking-widest uppercase text-zinc-900 hover:bg-zinc-50 transition-colors text-left flex justify-between items-center group-hover:border-zinc-400">
              BELI SEKARANG
              <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
            </button>
          </motion.div>
        ))}
      </div>
    </section>

    {/* UGC Video Section */}
    <section className="py-12 px-6 md:px-12 max-w-[1600px] mx-auto bg-[#F9F9F9]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            videoThumb: "https://images.unsplash.com/photo-1512413914594-887411624896?q=80&w=600&auto=format&fit=crop",
            productImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=200&auto=format&fit=crop",
            category: "(SIGNATURE COLLECTION)",
            name: "Midnight Black",
            price: "Rp 249.000"
          },
          {
            videoThumb: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?q=80&w=600&auto=format&fit=crop",
            productImage: "https://images.unsplash.com/photo-1604004215402-e0be233f39be?q=80&w=200&auto=format&fit=crop",
            category: "(SIGNATURE COLLECTION)",
            name: "Broken White",
            price: "Rp 249.000"
          },
          {
            videoThumb: "https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=600&auto=format&fit=crop",
            productImage: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=200&auto=format&fit=crop",
            category: "(SIGNATURE COLLECTION)",
            name: "Dusty Rose",
            price: "Rp 249.000"
          },
          {
            videoThumb: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=600&auto=format&fit=crop",
            productImage: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=200&auto=format&fit=crop",
            category: "(SIGNATURE COLLECTION)",
            name: "Sage Green",
            price: "Rp 249.000"
          }
        ].map((item, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            className="flex flex-col"
          >
            {/* Video Thumbnail */}
            <div className="relative aspect-[4/5] bg-zinc-200 mb-2 overflow-hidden group cursor-pointer">
              <img src={item.videoThumb} alt="UGC" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
              <div className="absolute top-4 right-4 w-8 h-8 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors hover:bg-black/60">
                <VolumeX className="w-4 h-4" />
              </div>
            </div>
            {/* Product Card */}
            <div className="bg-[#ffffff] flex relative group cursor-pointer h-28">
              <div className="w-28 h-full shrink-0 bg-[#F1F2E9] p-3">
                <img src={item.productImage} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" referrerPolicy="no-referrer" />
              </div>
              <div className="flex flex-col justify-center py-3 px-4 flex-grow">
                <span className="text-[10px] font-medium tracking-widest text-zinc-500 mb-1 uppercase">{item.category}</span>
                <h4 className="text-sm font-serif text-zinc-900 mb-1">{item.name}</h4>
                <p className="text-xs text-zinc-600 mt-auto">{item.price}</p>
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#6E2B30] text-white flex items-center justify-center hover:bg-[#7b5455] transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* FAQ Section */}
    <section className="py-24 px-6 md:px-12 max-w-3xl mx-auto w-full">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-4xl md:text-5xl font-serif text-[#6E2B30] text-center mb-16"
      >
        FAQ
      </motion.h2>
      <div className="flex flex-col border-t border-zinc-900">
        {faqs.map((faq, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            className="border-b border-zinc-900"
          >
            <button 
              onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
              className="w-full py-6 flex items-center justify-between text-left focus:outline-none group cursor-pointer"
            >
              <span className="text-lg font-medium text-zinc-900 group-hover:text-zinc-600 transition-colors">{faq.question}</span>
              {openFaqIndex === index ? (
                <ChevronUp className="w-5 h-5 text-zinc-500 font-light shrink-0 ml-4" strokeWidth={1} />
              ) : (
                <ChevronDown className="w-5 h-5 text-zinc-500 font-light shrink-0 ml-4" strokeWidth={1} />
              )}
            </button>
            <motion.div 
              initial={false}
              animate={{ height: openFaqIndex === index ? 'auto' : 0, opacity: openFaqIndex === index ? 1 : 0 }}
              className="overflow-hidden"
            >
              <p className="pb-6 text-zinc-600 leading-relaxed pr-8">
                {faq.answer}
              </p>
            </motion.div>
          </motion.div>
        ))}
      </div>
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center mt-12"
      >
        <a href="#" className="text-sm text-zinc-900 underline underline-offset-4 hover:text-zinc-600 transition-colors">See more</a>
      </motion.div>
    </section>
    </>
  );
}
