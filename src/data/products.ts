export interface ProductVariant {
  sku: string;
  color: string;
  option: string; // e.g., "Dengan Bross", "Tanpa Bross", "M", "L"
  price: number;
  promoPrice?: number;
  stock: number;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  shortName: string;
  category: string;
  description: string;
  material: string;
  weight: number;
  variants: ProductVariant[];
  details: { title: string; content: string }[];
  shopeeLink: string;
  tiktokLink: string;
}

export const CATEGORIES = [
  'Semua',
  'Selendang Kebaya',
  'Outer & Set',
  'Rok',
  'Kebaya',
  'Hijab',
  'Aksesoris',
] as const;

export const products: Product[] = [
  {
    id: 'sltr',
    name: 'SECERA Selendang Kebaya Layer Instant Premium dengan Bros',
    shortName: 'Selendang Layer',
    category: 'Selendang Kebaya',
    description: 'Selendang kebaya layer instant premium yang tampil anggun dalam hitungan detik. Cocok untuk bridesmaid, wisuda, kondangan, dan lebaran.',
    material: 'Ceruty Babydoll Premium',
    weight: 50,
    shopeeLink: 'https://shopee.co.id/secerascarves',
    tiktokLink: 'https://vt.tiktok.com/ZS9Nda34epcAt-0AK4n/',
    details: [
      { title: 'MENGAPA SPESIAL', content: 'Desain layer yang memberikan dimensi dan kesan mewah. Material Ceruty Babydoll yang flowy dan tidak mudah kusut.' },
      { title: 'CARA PERAWATAN', content: 'Cuci dengan tangan menggunakan air dingin. Jangan gunakan pemutih. Setrika dengan suhu rendah atau gunakan steamer.' },
      { title: 'PENGIRIMAN', content: 'Dikirim via J&T Express. Gratis ongkir untuk pesanan di atas Rp 200.000.' },
    ],
    variants: [
      { sku: 'SLTR-BROS-MRN', color: 'Maroon', option: 'Dengan Bross', price: 92699, promoPrice: 56546, stock: 2, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/048816_1763852623389.jpg?imageView2/1/w/300/h/300' },
      { sku: 'SLTR-TANPABROS-MRN', color: 'Maroon', option: 'Tanpa Bross', price: 75098, promoPrice: 50316, stock: 12, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/420692_1764152418353.jpg?imageView2/1/w/300/h/300' },
      { sku: 'SLTR-BROS-DST', color: 'Dusty', option: 'Dengan Bross', price: 92699, promoPrice: 56547, stock: 5, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/633238_1769124880326.jpg?imageView2/1/w/300/h/300' },
      { sku: 'SLTR-TANPABROS-DST', color: 'Dusty', option: 'Tanpa Bross', price: 75098, promoPrice: 50316, stock: 5, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/767036_1769124880471.jpg?imageView2/1/w/300/h/300' },
      { sku: 'SLTR-BROS-RSE', color: 'Rose', option: 'Dengan Bross', price: 92699, promoPrice: 56547, stock: 10, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/496061_1764041003385.jpg?imageView2/1/w/300/h/300' },
      { sku: 'SLTR-TANPABROS-RSE', color: 'Rose', option: 'Tanpa Bross', price: 75098, promoPrice: 50316, stock: 3, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/091209_1764228814611.jpg?imageView2/1/w/300/h/300' },
      { sku: 'SLTR-BROS-BWHITE', color: 'Broken White', option: 'Dengan Bross', price: 92699, promoPrice: 56546, stock: 5, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/916856_1776516448064.jpg?imageView2/1/w/300/h/300' },
      { sku: 'SLTR-TANPABROS-BWHITE', color: 'Broken White', option: 'Tanpa Bross', price: 75098, promoPrice: 50316, stock: 5, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/798999_1772626891975.jpg?imageView2/1/w/300/h/300' },
      { sku: 'SLTR-BROS-DNM', color: 'Denim', option: 'Dengan Bross', price: 92699, promoPrice: 56546, stock: 5, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/438361_1772626890401.jpg?imageView2/1/w/300/h/300' },
      { sku: 'SLTR-TANPABROS-DNM', color: 'Denim', option: 'Tanpa Bross', price: 75098, promoPrice: 50316, stock: 4, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/732476_1772626890620.jpg?imageView2/1/w/300/h/300' },
      { sku: 'SLTR-BROS-NVY', color: 'Navy', option: 'Dengan Bross', price: 92699, promoPrice: 56546, stock: 1, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/154937_1772626888995.jpg?imageView2/1/w/300/h/300' },
      { sku: 'SLTR-BROS-CCMLK', color: 'Coco Milk', option: 'Dengan Bross', price: 92699, promoPrice: 56546, stock: 3, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/482889_1772626887435.jpg?imageView2/1/w/300/h/300' },
      { sku: 'SLTR-TANPABROS-CCMLK', color: 'Coco Milk', option: 'Tanpa Bross', price: 75098, promoPrice: 50316, stock: 2, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/268162_1772626887726.jpg?imageView2/1/w/300/h/300' },
      { sku: 'SLTR-BROS-BPINK', color: 'Baby Pink', option: 'Dengan Bross', price: 92699, promoPrice: 56546, stock: 4, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/180856_1772626889514.jpg?imageView2/1/w/300/h/300' },
      { sku: 'SLTR-TANPABROS-BPINK', color: 'Baby Pink', option: 'Tanpa Bross', price: 75098, promoPrice: 50316, stock: 5, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/110193_1772626889676.jpg?imageView2/1/w/300/h/300' },
    ],
  },
  {
    id: 'sll',
    name: 'SECERA Selendang Kebaya Lurus Instant Premium + Bros',
    shortName: 'Selendang Lurus',
    category: 'Selendang Kebaya',
    description: 'Selendang kebaya lurus instant premium yang elegan untuk bridesmaid, wisuda & kondangan. Desain simpel namun berkelas.',
    material: 'Ceruty Babydoll Premium',
    weight: 100,
    shopeeLink: 'https://shopee.co.id/secerascarves',
    tiktokLink: 'https://vt.tiktok.com/ZS9Nda34epcAt-0AK4n/',
    details: [
      { title: 'MENGAPA SPESIAL', content: 'Desain lurus klasik yang timeless. Bahan Ceruty Babydoll premium yang jatuh sempurna.' },
      { title: 'CARA PERAWATAN', content: 'Cuci dengan tangan menggunakan air dingin. Setrika suhu rendah atau gunakan steamer.' },
      { title: 'PENGIRIMAN', content: 'Dikirim via J&T Express. Gratis ongkir untuk pesanan di atas Rp 200.000.' },
    ],
    variants: [
      { sku: 'SLL-BROSS-BTA', color: 'Bata', option: 'Dengan Bross', price: 88900, promoPrice: 57785, stock: 4, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/448877_1763037266370.jpg?imageView2/1/w/300/h/300' },
      { sku: 'SLL-TANPABROSS-BTA', color: 'Bata', option: 'Tanpa Bross', price: 71299, promoPrice: 46345, stock: 6, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/455512_1763101009791.jpg?imageView2/1/w/300/h/300' },
      { sku: 'SLL-BROSS-CCMLK', color: 'Choco Milk', option: 'Dengan Bross', price: 88900, promoPrice: 57785, stock: 6, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/586908_1765366672820.jpg?imageView2/1/w/300/h/300' },
      { sku: 'SLL-TANPABROSS-CCMLK', color: 'Choco Milk', option: 'Tanpa Bross', price: 71299, promoPrice: 46345, stock: 5, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/303824_1766388707307.jpg?imageView2/1/w/300/h/300' },
      { sku: 'SLL-BROSS-BONE', color: 'Bone', option: 'Dengan Bross', price: 88900, promoPrice: 57785, stock: 1, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/842891_1765374760970.jpg?imageView2/1/w/300/h/300' },
      { sku: 'SLL-BROSS-SYEL', color: 'Soft Yellow', option: 'Dengan Bross', price: 88900, stock: 2, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/301615_1776407775382.jpg?imageView2/1/w/300/h/300' },
      { sku: 'SLL-TANPABROSS-SYEL', color: 'Soft Yellow', option: 'Tanpa Bross', price: 71299, stock: 2, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/248155_1776407775558.jpg?imageView2/1/w/300/h/300' },
    ],
  },
  {
    id: 'versa',
    name: 'SECERA VERSA Multi Style One Set',
    shortName: 'VERSA One Set',
    category: 'Outer & Set',
    description: 'Outer multi style & rok lilit instan 3in1 convertible. Satu set untuk berbagai gaya — formal, kasual, atau acara spesial.',
    material: 'Ceruty Babydoll Premium',
    weight: 100,
    shopeeLink: 'https://shopee.co.id/secerascarves',
    tiktokLink: 'https://vt.tiktok.com/ZS9Nda34epcAt-0AK4n/',
    details: [
      { title: 'MENGAPA SPESIAL', content: '3in1 convertible design — satu outer bisa dipakai dengan 3 gaya berbeda. Rok lilit instan yang praktis.' },
      { title: 'PILIHAN PAKET', content: 'Tersedia dalam paket VERSA Outer Only atau VERSA One-set (Outer + Rok Lilit).' },
      { title: 'PENGIRIMAN', content: 'Dikirim via J&T Express. Gratis ongkir untuk pesanan di atas Rp 200.000.' },
    ],
    variants: [
      { sku: 'ONESET-NVY', color: 'Navy', option: 'One-set', price: 305800, promoPrice: 198770, stock: 7, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/950065_1768963239712.jpg?imageView2/1/w/300/h/300' },
      { sku: 'OUTER-NVY', color: 'Navy', option: 'Outer Only', price: 245900, promoPrice: 113975, stock: 11, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/353452_1769124880062.jpg?imageView2/1/w/300/h/300' },
      { sku: 'ONESET-BWH', color: 'Broken White', option: 'One-set', price: 305800, promoPrice: 198770, stock: 5, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/779401_1768963238314.jpg?imageView2/1/w/300/h/300' },
      { sku: 'OUTER-BWH', color: 'Broken White', option: 'Outer Only', price: 245900, promoPrice: 113975, stock: 9, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/620552_1769124879906.jpg?imageView2/1/w/300/h/300' },
      { sku: 'ONESET-BLACK', color: 'Black', option: 'One-set', price: 305800, promoPrice: 198770, stock: 5, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/702712_1768963779290.jpg?imageView2/1/w/300/h/300' },
      { sku: 'ONESET-MRN', color: 'Maroon', option: 'One-set', price: 305800, promoPrice: 198770, stock: 2, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/680507_1768966091340.jpg?imageView2/1/w/300/h/300' },
      { sku: 'ONESET-MHGN', color: 'Mahogany', option: 'One-set', price: 305800, promoPrice: 198770, stock: 1, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/895071_1769124880191.jpg?imageView2/1/w/300/h/300' },
      { sku: 'ONESET-CRM', color: 'Cream', option: 'One-set', price: 305800, promoPrice: 198770, stock: 5, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/584477_1770864983237.jpg?imageView2/1/w/300/h/300' },
      { sku: 'OUTER-CRM', color: 'Cream', option: 'Outer Only', price: 245900, promoPrice: 113975, stock: 10, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/238989_1772497037138.jpg?imageView2/1/w/300/h/300' },
    ],
  },
  {
    id: 'laras',
    name: 'SECERA LARAS Wrap Skirt / Rok Lilit Ceruty Babydoll Premium',
    shortName: 'LARAS Rok Lilit',
    category: 'Rok',
    description: 'Rok lilit premium berbahan Ceruty Babydoll yang flowy dan elegan. Desain wrap skirt yang praktis dan mudah disesuaikan.',
    material: 'Ceruty Babydoll Premium',
    weight: 300,
    shopeeLink: 'https://shopee.co.id/secerascarves',
    tiktokLink: 'https://vt.tiktok.com/ZS9Nda34epcAt-0AK4n/',
    details: [
      { title: 'MENGAPA SPESIAL', content: 'Desain wrap/lilit yang mudah disesuaikan dengan berbagai ukuran tubuh. Material premium yang jatuh sempurna.' },
      { title: 'PANDUAN UKURAN', content: 'All Size — Lingkar Pinggang adjustable, Panjang Rok ~95cm.' },
      { title: 'PENGIRIMAN', content: 'Dikirim via J&T Express. Gratis ongkir untuk pesanan di atas Rp 200.000.' },
    ],
    variants: [
      { sku: 'LARAS-MRN', color: 'Maroon', option: 'All Size', price: 168900, promoPrice: 94584, stock: 5, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/448974_1772626739811.jpg?imageView2/1/w/300/h/300' },
      { sku: 'LARAS-NVY', color: 'Navy', option: 'All Size', price: 168900, promoPrice: 94584, stock: 5, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/701922_1772626740973.jpg?imageView2/1/w/300/h/300' },
      { sku: 'LARAS-CRM', color: 'Cream', option: 'All Size', price: 168900, promoPrice: 94584, stock: 5, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/514244_1772626740705.jpg?imageView2/1/w/300/h/300' },
      { sku: 'LARAS-HTM', color: 'Black', option: 'All Size', price: 168900, promoPrice: 94584, stock: 5, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/211068_1772626740452.jpg?imageView2/1/w/300/h/300' },
      { sku: 'LARAS-BWH', color: 'Broken White', option: 'All Size', price: 168900, promoPrice: 94584, stock: 5, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/460949_1772626740173.jpg?imageView2/1/w/300/h/300' },
      { sku: 'LARAS-BGD', color: 'Burgundy', option: 'All Size', price: 168900, promoPrice: 94584, stock: 5, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/951882_1772626739987.jpg?imageView2/1/w/300/h/300' },
      { sku: 'LARAS-MHGN', color: 'Mahogany', option: 'All Size', price: 168900, promoPrice: 94584, stock: 5, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/944189_1772626741174.jpg?imageView2/1/w/300/h/300' },
    ],
  },
  {
    id: 'kala',
    name: 'SECERA KALA Kebaya Kartini Brokat Modern Full Furing',
    shortName: 'KALA Kebaya',
    category: 'Kebaya',
    description: 'Kebaya Kartini brokat modern full furing yang elegan dan berkelas. Cocok untuk acara formal, wisuda, dan kondangan.',
    material: 'Brokat Premium Full Furing',
    weight: 250,
    shopeeLink: 'https://shopee.co.id/secerascarves',
    tiktokLink: 'https://vt.tiktok.com/ZS9Nda34epcAt-0AK4n/',
    details: [
      { title: 'MENGAPA SPESIAL', content: 'Full furing untuk kenyamanan maksimal. Brokat premium dengan detail yang indah.' },
      { title: 'PANDUAN UKURAN', content: 'Tersedia dalam ukuran M dan L.' },
      { title: 'BONUS', content: 'Free Bross eksklusif SECERA untuk setiap pembelian.' },
    ],
    variants: [
      { sku: 'KALA-NVY-M', color: 'Navy', option: 'M', price: 189800, stock: 4, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/836437_1772497039027.jpg?imageView2/1/w/300/h/300' },
      { sku: 'KALA-NVY-L', color: 'Navy', option: 'L', price: 189800, stock: 5, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/062822_1772497039158.jpg?imageView2/1/w/300/h/300' },
      { sku: 'KALA-MRN-M', color: 'Maroon', option: 'M', price: 189800, stock: 1, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/944718_1772497038262.jpg?imageView2/1/w/300/h/300' },
      { sku: 'KALA-MRN-L', color: 'Maroon', option: 'L', price: 189800, stock: 5, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/422613_1772497038400.jpg?imageView2/1/w/300/h/300' },
      { sku: 'KALA-MHGN-M', color: 'Mahogany', option: 'M', price: 189800, stock: 5, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/769115_1772497039355.jpg?imageView2/1/w/300/h/300' },
      { sku: 'KALA-MHGN-L', color: 'Mahogany', option: 'L', price: 189800, stock: 5, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/927513_1772497039493.jpg?imageView2/1/w/300/h/300' },
      { sku: 'KALA-BGD-M', color: 'Burgundy', option: 'M', price: 189800, stock: 5, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/011406_1772497038563.jpg?imageView2/1/w/300/h/300' },
    ],
  },
  {
    id: 'ps',
    name: 'SECERA Pashmina Shawl - Hijab Pashmina Ceruty',
    shortName: 'Pashmina Shawl',
    category: 'Hijab',
    description: 'Hijab pashmina ceruty bahan jatuh dan lembut ukuran 75x180cm. Nyaman dipakai seharian.',
    material: 'Ceruty Premium',
    weight: 150,
    shopeeLink: 'https://shopee.co.id/secerascarves',
    tiktokLink: 'https://vt.tiktok.com/ZS9Nda34epcAt-0AK4n/',
    details: [
      { title: 'MENGAPA SPESIAL', content: 'Material ceruty premium yang jatuh dan lembut. Ukuran lebar 75x180cm untuk styling yang leluasa.' },
      { title: 'CARA PERAWATAN', content: 'Cuci dengan tangan menggunakan air dingin dan deterjen lembut.' },
    ],
    variants: [
      { sku: 'PS-BWH', color: 'Broken White', option: 'All Size', price: 36899, stock: 2, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/396968_1772626742255.jpg?imageView2/1/w/300/h/300' },
      { sku: 'PS-BONE', color: 'Bone', option: 'All Size', price: 36899, stock: 2, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/634127_1772626742001.jpg?imageView2/1/w/300/h/300' },
      { sku: 'PS-MRN', color: 'Maroon', option: 'All Size', price: 36899, stock: 2, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/810571_1772626741787.jpg?imageView2/1/w/300/h/300' },
      { sku: 'PS-NVY', color: 'Navy', option: 'All Size', price: 36899, stock: 2, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/449702_1772497037515.jpg?imageView2/1/w/300/h/300' },
      { sku: 'PS-HTM', color: 'Hitam', option: 'All Size', price: 36899, stock: 2, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/168843_1772497037386.jpg?imageView2/1/w/300/h/300' },
      { sku: 'PS-BGD', color: 'Burgundy', option: 'All Size', price: 36899, stock: 2, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/028340_1772497037822.jpg?imageView2/1/w/300/h/300' },
      { sku: 'PS-MHGN', color: 'Mahogany', option: 'All Size', price: 36899, stock: 2, image: 'https://res.bigseller.pro/sku/images/merchantsku/1233323/153166_1772497037672.jpg?imageView2/1/w/300/h/300' },
    ],
  },
];

export function formatPrice(price: number): string {
  return `Rp ${price.toLocaleString('id-ID')}`;
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'Semua') return products;
  return products.filter((p) => p.category === category);
}
