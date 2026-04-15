import { motion } from 'motion/react';

export default function GlobalCTA() {
  return (
    <section className="w-full px-4 md:px-6 lg:px-8 py-12 md:py-24 bg-[#F9F9F9]">
      <div className="max-w-[1600px] mx-auto">
        <div className="relative w-full rounded-[2rem] overflow-hidden py-24 md:py-32 px-6 flex flex-col items-center justify-center text-center">
          {/* Background Video */}
          <div className="absolute inset-0 bg-[#F4F5F0]"></div>
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover opacity-90 pointer-events-none"
            >
              <source src="https://cdn.joinvoy.com/voyage/video/voytex-MIX-homepage-desktop.mp4" type="video/mp4" />
            </video>
            {/* Optional tint to blend with Secera's brand colors */}
            <div className="absolute inset-0 bg-[#F1F2E9]/10 mix-blend-overlay"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#6E2B30] leading-tight mb-6"
            >
              Belanja Lebih Hemat
              <br />
              via WhatsApp
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg md:text-xl text-[#6E2B30]/80 mb-10"
            >
              Selesaikan pesanan Anda melalui WhatsApp dan nikmati potongan harga eksklusif hingga 15%.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative group inline-block p-[2px] rounded-full"
            >
              {/* Outer Glow (Blurred) */}
              <div className="absolute inset-0 rounded-full overflow-hidden blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#FFFFFF_50%,transparent_100%)]"></span>
              </div>

              {/* Inner Border (Sharp) */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#FFFFFF_50%,transparent_100%)]"></span>
              </div>

              <button className="relative w-full h-full overflow-hidden px-10 py-5 rounded-full bg-[#F9F9F9] text-[#6E2B30] font-medium transition-all cursor-pointer">
                {/* Shimmer Sweep Effect */}
                <div className="absolute top-0 left-0 w-full h-full -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-[#6E2B30]/10 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none z-10"></div>

                {/* Ribbon Label */}
                <div className="absolute top-0 right-0 z-10 bg-[#6E2B30] text-[#F9F9F9] text-[10px] font-bold px-3 py-1.5 rounded-bl-[1rem] shadow-sm flex items-center gap-1.5 pointer-events-none">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  UP TO 15% OFF
                </div>

                <span className="relative z-10 text-lg pointer-events-none">Hubungi Kami di WhatsApp</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
