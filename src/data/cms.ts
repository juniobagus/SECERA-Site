export interface CMSContent {
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  features: {
    title: string;
    description: string;
    items: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  faq: {
    title: string;
    description: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
  cta: {
    title: string;
    description: string;
    buttonText: string;
  };
  footer: {
    tagline: string;
    email: string;
    phone: string;
  };
}

export const initialCMSContent: CMSContent = {
  hero: {
    title: "Timeless Elegance in Every Thread",
    subtitle: "Mendefinisikan ulang gaya modest dengan sentuhan modern dan kualitas premium.",
    cta: "Lihat Koleksi"
  },
  features: {
    title: "Mengapa Memilih Secera?",
    description: "Kami mengutamakan kualitas material dan kenyamanan dalam setiap desain.",
    items: [
      {
        title: "Material Premium",
        description: "Menggunakan bahan Ceruty Babydoll kualitas terbaik yang flowy dan nyaman.",
        icon: "Layers"
      },
      {
        title: "Desain Eksklusif",
        description: "Setiap koleksi dirancang dengan detail unik yang tidak akan Anda temukan di tempat lain.",
        icon: "Gem"
      },
      {
        title: "Mudah Dibentuk",
        description: "Karakter bahan yang tegak di dahi dan mudah diatur untuk berbagai gaya.",
        icon: "Sparkles"
      }
    ]
  },
  faq: {
    title: "Pertanyaan Populer",
    description: "Temukan jawaban untuk pertanyaan yang sering diajukan seputar produk dan layanan kami.",
    items: [
      {
        question: "Apakah bahannya mudah kusut?",
        answer: "Tidak, kami menggunakan material Ceruty Babydoll Premium yang flowy dan tidak mudah kusut."
      },
      {
        question: "Berapa lama waktu pengiriman?",
        answer: "Pengiriman reguler memakan waktu 2-3 hari kerja untuk area Jabodetabek."
      }
    ]
  },
  cta: {
    title: "Penawaran Eksklusif Website",
    description: "Dapatkan potongan harga hingga 15% untuk setiap pembelian langsung melalui website kami hari ini.",
    buttonText: "Mulai Belanja Sekarang"
  },
  footer: {
    tagline: "Mendefinisikan ulang gaya modest",
    email: "care@secera.id",
    phone: "6285750990000"
  }
};
