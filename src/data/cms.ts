export interface CMSContent {
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    imageUrl?: string;
  };
  showcase: {
    title: string;
    description: string;
    productIds: string[];
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
  testimonials: {
    title: string;
    subtitle: string;
    items: Array<{
      name: string;
      role: string;
      content: string;
      avatar: string;
    }>;
  };
  ugc: {
    title: string;
    subtitle: string;
    items: Array<{
      videoUrl: string;
      productId?: string;
      thumbnailUrl?: string;
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
    buttonLink?: string;
  };
  footer: {
    tagline: string;
    email: string;
    phone: string;
    copyright: string;
  };
  global: {
    siteTitle: string;
    seoDescription: string;
    seoKeywords: string;
    socialMedia: {
      instagram: string;
      linkedin: string;
      twitter: string;
    };
  };
}

export const initialCMSContent: CMSContent = {
  hero: {
    title: "Timeless Elegance in Every Thread",
    subtitle: "Mendefinisikan ulang gaya modest dengan sentuhan modern dan kualitas premium.",
    cta: "Lihat Koleksi",
    imageUrl: "/hero-image.jpg"
  },
  showcase: {
    title: "Koleksi Terpopuler",
    description: "Pilihan terbaik untuk melengkapi gaya modest modern Anda hari ini.",
    productIds: []
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
  testimonials: {
    title: "Apa Kata Mereka?",
    subtitle: "Ribuan wanita telah mempercayakan gaya modest mereka pada Secera.",
    items: [
      {
        name: "Sarah Amanda",
        role: "Fashion Enthusiast",
        content: "Bahannya bener-bener premium, flowy banget dan gampang dibentuk. Suka banget sama koleksi warnanya!",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
      }
    ]
  },
  ugc: {
    title: "Gaya Secera Anda",
    subtitle: "Inspirasi dari komunitas kami. Tag @secera.id untuk kesempatan tampil di sini.",
    items: []
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
    buttonText: "Mulai Belanja Sekarang",
    buttonLink: "/shop"
  },
  footer: {
    tagline: "Mendefinisikan ulang gaya modest",
    email: "care@secera.id",
    phone: "6285750990000",
    copyright: "©Copyright 2026 Secera"
  },
  global: {
    siteTitle: "SECERA | Modern Modest Fashion",
    seoDescription: "Secera menghadirkan koleksi modest fashion modern dengan kualitas premium dan desain eksklusif.",
    seoKeywords: "fashion, modest, hijab, busana muslim, premium",
    socialMedia: {
      instagram: "https://instagram.com/secera.id",
      linkedin: "https://linkedin.com/company/secera",
      twitter: "https://twitter.com/seceraid"
    }
  }
};
