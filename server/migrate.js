const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
  });

  console.log('Connecting to database...');

  try {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    console.log('Applying schema...');
    await connection.query(schema);
    console.log('Schema applied successfully.');

    // Seed CMS initial content if missing
    console.log('Checking CMS seed data...');
    
    const initialContent = {
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
        phone: "6285750990000",
        copyright: "©Copyright 2026 Secera"
      },
      global: {
        siteTitle: "SECERA | Modern Modest Fashion",
        seoDescription: "Secera menghadirkan koleksi modest fashion modern dengan kualitas premium.",
        seoKeywords: "fashion, modest, hijab, busana muslim, premium",
        socialMedia: {
          instagram: "https://instagram.com/secera.id",
          linkedin: "https://linkedin.com/company/secera",
          twitter: "https://twitter.com/seceraid"
        }
      }
    };

    const aboutPageContent = {
      hero: {
        title: "Secera adalah tim desainer, pengrajin, dan visioner yang berdedikasi untuk mendefinisikan ulang gaya modest modern.",
        imageUrl: "https://images.unsplash.com/photo-1529156069898-49953eb1b5a4?q=80&w=2000&auto=format&fit=crop"
      },
      inspiration: {
        title: "Inspirasi Kami",
        subtitle: "Dalam keanggunan yang sederhana, Secera menemukan makna dari kecantikan yang tak lekang oleh waktu.",
        description1: "Kami terinspirasi oleh harmoni alam dan kelembutan material premium. Secera adalah simbol dari kebangkitan gaya yang mengutamakan kenyamanan tanpa mengorbankan estetika.",
        description2: "Pada akhirnya, kami merancang setiap helai pakaian untuk memberikan rasa percaya diri, ketenangan, dan keindahan bagi setiap wanita yang mengenakannya.",
        imageUrl: "https://images.unsplash.com/photo-1600091166971-7f9faad6c1e2?q=80&w=2000&auto=format&fit=crop"
      },
      mission: {
        title: "Misi Kami",
        subtitle: "Misi kami adalah menetapkan standar baru dalam keanggunan gaya modest modern.",
        description: "Kami mewujudkannya melalui dedikasi pada kualitas material, desain yang tak lekang oleh waktu, dan komitmen untuk memberdayakan setiap wanita agar tampil percaya diri."
      }
    };

    await connection.query(
      'INSERT IGNORE INTO cms_settings (key_name, value_data) VALUES (?, ?)',
      ['main_site', JSON.stringify(initialContent)]
    );
    await connection.query(
      'INSERT IGNORE INTO cms_settings (key_name, value_data) VALUES (?, ?)',
      ['about_page', JSON.stringify(aboutPageContent)]
    );
    console.log('Seed check completed.');

    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
