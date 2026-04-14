export default function About() {
  return (
    <div className="min-h-screen w-full bg-[#F9F9F9] p-3 md:p-5 flex flex-col font-sans gap-3 md:gap-5">
      {/* Hero Section */}
      <div className="relative w-full rounded-[2rem] overflow-hidden flex flex-col md:flex-row min-h-[calc(100dvh-1.5rem)] md:min-h-[calc(100dvh-2.5rem)]">
        <div className="w-full md:w-1/2 bg-[#F1F2E9] p-8 pt-32 md:p-16 lg:p-24 flex items-center justify-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#6E2B30] leading-snug max-w-2xl">
            Secera adalah tim desainer, pengrajin, dan visioner yang berdedikasi untuk mendefinisikan ulang gaya modest modern.
          </h2>
        </div>
        <div className="w-full md:w-1/2 relative min-h-[40vh] md:min-h-full">
          <img 
            src="https://images.unsplash.com/photo-1529156069898-49953eb1b5a4?q=80&w=2000&auto=format&fit=crop" 
            alt="Secera Team" 
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Our Inspiration Section */}
      <div className="w-full flex flex-col md:flex-row gap-3 md:gap-5">
        <div className="w-full md:w-[40%] relative min-h-[40vh] md:min-h-[60vh] rounded-[2rem] overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1600091166971-7f9faad6c1e2?q=80&w=2000&auto=format&fit=crop" 
            alt="Inspiration Texture" 
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="w-full md:w-[60%] bg-[#6E2B30] rounded-[2rem] p-8 md:p-16 lg:p-24 flex flex-col justify-center text-[#F9F9F9]">
          <h3 className="text-sm font-bold tracking-wide mb-8">
            Inspirasi Kami
          </h3>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-snug mb-8 max-w-3xl">
            Dalam keanggunan yang sederhana, Secera menemukan makna dari kecantikan yang tak lekang oleh waktu.
          </h2>
          <div className="space-y-6 text-[#F9F9F9]/90 max-w-3xl leading-relaxed md:text-lg">
            <p>
              Kami terinspirasi oleh harmoni alam dan kelembutan material premium. Secera adalah simbol dari kebangkitan gaya yang mengutamakan kenyamanan tanpa mengorbankan estetika.
            </p>
            <p>
              Pada akhirnya, kami merancang setiap helai pakaian untuk memberikan rasa percaya diri, ketenangan, dan keindahan bagi setiap wanita yang mengenakannya.
            </p>
          </div>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="w-full bg-white rounded-[2rem] py-24 md:py-32 px-6 md:px-12 flex flex-col items-center justify-center text-center">
        <h3 className="text-sm font-bold tracking-wide mb-8 text-[#6E2B30]">
          Misi Kami
        </h3>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#6E2B30] leading-tight max-w-4xl mb-8">
          Misi kami adalah menetapkan <span className="italic">standar</span> baru dalam keanggunan gaya modest modern.
        </h2>
        <p className="text-lg md:text-xl text-[#6E2B30]/80 max-w-3xl leading-relaxed">
          Kami mewujudkannya melalui dedikasi pada kualitas material, desain yang tak lekang oleh waktu, dan komitmen untuk memberdayakan setiap wanita agar tampil percaya diri.
        </p>
      </div>
    </div>
  );
}
