export interface CMSContent {
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    imageUrl?: string;
    link?: string;
    videoUrl?: string;
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
      id?: string;
      question: string;
      answer: string;
    }>;
  };
  cta: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink?: string;
    backgroundImageUrl?: string;
    backgroundVideoUrl?: string;
  };
  footer: {
    tagline: string;
    email: string;
    phone: string;
    copyright: string;
    links: Array<{
      title: string;
      items: Array<{ label: string; url: string }>;
    }>;
  };
  marquee: {
    items: string[];
  };
  stylePreference: {
    title: string;
    items: Array<{
      title: string;
      subtitle: string;
      cta: string;
      link: string;
      imageUrl: string;
      videoUrl?: string;
    }>;
  };
  global: {
    siteTitle: string;
    seoDescription: string;
    seoKeywords: string;
  };
}

export const initialCMSContent: CMSContent = {
  hero: {
    title: "Timeless Elegance in Every Thread",
    subtitle: "Mendefinisikan ulang gaya modest dengan sentuhan modern dan kualitas premium.",
    cta: "Lihat Koleksi",
    link: "/shop",
    imageUrl: "/hero-image.jpg",
    videoUrl: ""
  },
  showcase: {
    title: "Kualitas premium yang terasa personal, bukan sekadar busana",
    description: "Pilihan terbaik untuk melengkapi gaya modest modern Anda hari ini.",
    productIds: []
  },
  marquee: {
    items: [
      "Material Premium",
      "Desain Eksklusif",
      "Mudah Dibentuk",
      "Kualitas Terjamin",
      "Pengiriman Cepat"
    ]
  },
  features: {
    title: "Mengapa Memilih Secera?",
    description: "Kami mengutamakan kualitas material dan kenyamanan dalam setiap desain.",
    items: [
      {
        title: "Material Premium",
        description: "Menggunakan bahan Ceruty Babydoll kualitas terbaik yang flowy and nyaman.",
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
    buttonLink: "/shop",
    backgroundImageUrl: "",
    backgroundVideoUrl: ""
  },
  stylePreference: {
    title: "Temukan Gaya Anda",
    items: [
      {
        title: "Modern",
        subtitle: "Minimalist & Kontemporer",
        cta: "Lihat Koleksi",
        link: "/shop?style=modern",
        imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
      },
      {
        title: "Etnik",
        subtitle: "Sentuhan Budaya & Warisan",
        cta: "Lihat Koleksi",
        link: "/shop?style=etnik",
        imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=2070&auto=format&fit=crop"
      }
    ]
  },
  footer: {
    tagline: "Mendefinisikan ulang gaya modest",
    email: "care@secera.id",
    phone: "6285750990000",
    copyright: "©Copyright 2026 Secera",
    links: [
      {
        title: "Belanja",
        items: [
          { label: "Koleksi Baru", url: "/shop" },
          { label: "Cek Status Pesanan", url: "/my-orders" },
          { label: "Signature Outer", url: "#" },
          { label: "Ulasan Pelanggan", url: "#" },
          { label: "Panduan Ukuran", url: "#" }
        ]
      },
      {
        title: "Tentang",
        items: [
          { label: "Tentang Kami", url: "#" },
          { label: "Jurnal", url: "#" },
          { label: "Karir", url: "#" },
          { label: "Syarat & Ketentuan", url: "#" }
        ]
      }
    ]
  },
  global: {
    siteTitle: "SECERA | Modern Modest Fashion",
    seoDescription: "Secera menghadirkan koleksi modest fashion modern dengan kualitas premium dan desain eksklusif.",
    seoKeywords: "fashion, modest, hijab, busana muslim, premium",
  }
};
