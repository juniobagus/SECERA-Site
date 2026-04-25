export interface ProductVariant {
  sku: string;
  color: string;
  option: string;
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
  thumbnail_url?: string;
  cms_content?: {
    features?: {
      title?: string;
      items: { icon: string; title: string; description?: string }[];
    };
    editorial?: {
      title: string;
      sections: { title: string; description: string; imageUrl: string; imagePosition: 'left' | 'right' }[];
    };
    accordions?: {
      material?: string;
      specs?: string;
      shipping?: string;
    };
  };
};

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
    "id": "sltr",
    "name": "SECERA Selendang Kebaya Layer Instant Premium dengan Bros",
    "shortName": "Selendang Layer",
    "category": "Selendang Kebaya",
    "description": "Selendang kebaya layer instant premium yang tampil anggun dalam hitungan detik. Cocok untuk bridesmaid, wisuda, kondangan, dan lebaran.",
    "material": "Ceruty Babydoll Premium",
    "weight": 100.0,
    "shopeeLink": "https://shopee.co.id/secerascarves",
    "tiktokLink": "https://vt.tiktok.com/ZS9Nda34epcAt-0AK4n/",
    "details": [
      {
        "title": "MENGAPA SPESIAL",
        "content": "Selendang kebaya layer instant premium yang tampil anggun dalam hitungan detik. Cocok untuk bridesmaid, wisuda, kondangan, dan lebaran."
      },
      {
        "title": "CARA PERAWATAN",
        "content": "Cuci dengan tangan menggunakan air dingin dan deterjen lembut."
      }
    ],
    "variants": [
      {
        "sku": "SLTR-BROS-BWHITE",
        "color": "Broken White",
        "option": "Dengan Bross",
        "price": 92699,
        "promoPrice": 56546,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/916856_1776516448064.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-TANPABROS-BWHITE",
        "color": "Broken White",
        "option": "Tanpa Bross",
        "price": 75098,
        "promoPrice": 50316,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/798999_1772626891975.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-BROS-WHITE",
        "color": "Broken White",
        "option": "Dengan Bross",
        "price": 92699,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/514809_1772626891826.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-TANPABROS-DNM",
        "color": "Denim",
        "option": "Tanpa Bross",
        "price": 75098,
        "promoPrice": 50316,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/732476_1772626890620.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-BROS-DNM",
        "color": "Denim",
        "option": "Dengan Bross",
        "price": 92699,
        "promoPrice": 56546,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/438361_1772626890401.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-TANPABROS-OLV",
        "color": "Olive",
        "option": "Tanpa Bross",
        "price": 75098,
        "promoPrice": 50316,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/022975_1772626890210.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-BROS-OLV",
        "color": "Olive",
        "option": "Dengan Bross",
        "price": 92699,
        "promoPrice": 56546,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/805828_1772626889916.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-TANPABROS-BPINK",
        "color": "Baby Pink",
        "option": "Tanpa Bross",
        "price": 75098,
        "promoPrice": 50316,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/110193_1772626889676.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-BROS-BPINK",
        "color": "Baby Pink",
        "option": "Dengan Bross",
        "price": 92699,
        "promoPrice": 56546,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/180856_1772626889514.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-TANPABROS-NVY",
        "color": "Navy",
        "option": "Tanpa Bross",
        "price": 75098,
        "promoPrice": 50316,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/414697_1772626889266.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-BROS-NVY",
        "color": "Navy",
        "option": "Dengan Bross",
        "price": 92699,
        "promoPrice": 56546,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/154937_1772626888995.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-TANPABROS-OLVM",
        "color": "Olive Muda",
        "option": "Tanpa Bross",
        "price": 75098,
        "promoPrice": 50316,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/214217_1772626888691.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-BROS-OLVM",
        "color": "Olive Muda",
        "option": "Dengan Bross",
        "price": 92699,
        "promoPrice": 56546,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/063206_1772626888486.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-TANPABROS-WDH",
        "color": "Wardah",
        "option": "Tanpa Bross",
        "price": 75098,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/078190_1772626888252.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-BROS-WDH",
        "color": "Wardah",
        "option": "Dengan Bross",
        "price": 92699,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/257441_1772626888014.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-TANPABROS-CCMLK",
        "color": "Coco milk",
        "option": "Tanpa Bross",
        "price": 75098,
        "promoPrice": 50316,
        "stock": 2,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/268162_1772626887726.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-BROS-CCMLK",
        "color": "Coco milk",
        "option": "Dengan Bross",
        "price": 92699,
        "promoPrice": 56546,
        "stock": 3,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/482889_1772626887435.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-BROSS-REQ",
        "color": "Request warna",
        "option": "Dengan Bross",
        "price": 92699,
        "promoPrice": 56546,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/756421_1770010266505.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-TANPABROS-DST",
        "color": "Dusty",
        "option": "Tanpa Bross",
        "price": 75098,
        "promoPrice": 50316,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/767036_1769124880471.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-BROS-DST",
        "color": "Dusty",
        "option": "Dengan Bross",
        "price": 92699,
        "promoPrice": 56547,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/633238_1769124880326.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-BROS-REQ",
        "color": "Request Warna",
        "option": "Dengan Bross",
        "price": 92699,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/803200_1767144448696.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-TANPABROS-SLVR",
        "color": "Silver",
        "option": "Tanpa Bross",
        "price": 75098,
        "promoPrice": 50316,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/015380_1767144448568.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-BROS-SLVR",
        "color": "Silver",
        "option": "Dengan Bross",
        "price": 92699,
        "promoPrice": 56546,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/429857_1767144448447.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-TANPABROS-REQ",
        "color": "Request Warna",
        "option": "Tanpa Bross",
        "price": 75098,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/209734_1764332751273.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-TANPABROS-RSE",
        "color": "Rose",
        "option": "Tanpa Bross",
        "price": 75098,
        "promoPrice": 50316,
        "stock": 3,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/091209_1764228814611.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-BROS-HJBTL",
        "color": "Hijau Botol",
        "option": "Dengan Bross",
        "price": 92699,
        "promoPrice": 56547,
        "stock": 3,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/172974_1764228814407.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-BROS-BGD",
        "color": "Burgundy",
        "option": "Dengan Bross",
        "price": 92699,
        "promoPrice": 56547,
        "stock": 3,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/074203_1764228814178.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-TANPABROS-MHGN",
        "color": "Mahogany",
        "option": "Tanpa Bross",
        "price": 75098,
        "promoPrice": 50316,
        "stock": 3,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/244255_1764228813888.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-TANPABROS-HJBTL",
        "color": "Hijau Botol",
        "option": "Tanpa Bross",
        "price": 75098,
        "promoPrice": 50316,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/572652_1764152420300.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-TANPABROS-MRN",
        "color": "Maroon",
        "option": "Tanpa Bross",
        "price": 75098,
        "promoPrice": 50316,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/420692_1764152418353.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-TANPABROS-BGD",
        "color": "Burgundy",
        "option": "Tanpa Bross",
        "price": 75098,
        "promoPrice": 50316,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/802131_1764060840147.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-BROS-RSE",
        "color": "Rose",
        "option": "Dengan Bross",
        "price": 92699,
        "promoPrice": 56547,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/496061_1764041003385.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-BROS-MHGN",
        "color": "Mahogany",
        "option": "Dengan Bross",
        "price": 92699,
        "promoPrice": 56547,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/294804_1763862820149.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-BROS-MRN",
        "color": "Maroon",
        "option": "Dengan Bross",
        "price": 92699,
        "promoPrice": 56547,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/048816_1763852623389.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-PAYET-BGD",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/260475_1759444927352.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLTR-POLOS-NVY",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/146442_1758660180238.jpg?imageView2/1/w/300/h/300"
      }
    ]
  },
  {
    "id": "slw",
    "name": "SECERA Selendang Kebaya Malay Pashmina Lebar + Bros Elegan",
    "shortName": "Selendang Malay",
    "category": "Selendang Kebaya",
    "description": "Selendang kebaya malay pashmina lebar yang elegan. Memberikan kesan mewah dan tradisional yang modern.",
    "material": "Ceruty Babydoll Premium",
    "weight": 100.0,
    "shopeeLink": "https://shopee.co.id/secerascarves",
    "tiktokLink": "https://vt.tiktok.com/ZS9Nda34epcAt-0AK4n/",
    "details": [
      {
        "title": "MENGAPA SPESIAL",
        "content": "Selendang kebaya malay pashmina lebar yang elegan. Memberikan kesan mewah dan tradisional yang modern."
      },
      {
        "title": "CARA PERAWATAN",
        "content": "Cuci dengan tangan menggunakan air dingin dan deterjen lembut."
      }
    ],
    "variants": [
      {
        "sku": "SLW-TANPABROSS-TRCT",
        "color": "Teracota",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": null,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/991217_1776516145719.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-TANPABROSS-CCMLK",
        "color": "Coco Milk",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/649253_1776516145394.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-BROSS-CCMLK",
        "color": "Coco Milk",
        "option": "Dengan Bross",
        "price": 86899,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/078984_1776516145303.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-BROSS-BBLUE",
        "color": "Baby blue",
        "option": "Dengan Bross",
        "price": 86899,
        "promoPrice": 58222,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/347088_1776516144905.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-BROSS-OLV",
        "color": "Olive",
        "option": "Dengan Bross",
        "price": 86899,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/403271_1775748911922.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-BROSS-TRCT",
        "color": "Teracota",
        "option": "Dengan Bross",
        "price": 86899,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/919163_1774403597256.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-TANPABROSS-OLV",
        "color": "Olive",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/679873_1773149340865.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-BROSS-EMB",
        "color": "Emerald blue",
        "option": "Dengan Bross",
        "price": 86899,
        "promoPrice": 58222,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/514298_1769218615323.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-BROSS-MCA",
        "color": "Mocca",
        "option": "Dengan Bross",
        "price": 86899,
        "promoPrice": 58222,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/038982_1769124881022.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-BROSS-RED",
        "color": "Merah",
        "option": "Dengan Bross",
        "price": 86899,
        "promoPrice": 58223,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/327440_1769124880891.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-BROSS-BWH",
        "color": "Broken White",
        "option": "Dengan Bross",
        "price": 86899,
        "promoPrice": 58223,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/374655_1769124880763.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-BROSS-BLS",
        "color": "Blue Sky",
        "option": "Dengan Bross",
        "price": 86899,
        "promoPrice": 58223,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/747168_1769124880647.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-TANPABROSS-MCA",
        "color": "Mocca",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 47770,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/974425_1768167143872.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-TANPABROSS-RED",
        "color": "Merah",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 47770,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/924405_1768167143735.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-TANPABROSS-BWH",
        "color": "Broken White",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 47771,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/468936_1768167143567.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-TANPABROSS-BLS",
        "color": "Blue Sky",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 47771,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/530455_1768167143336.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-TANPABROSS-SLVR",
        "color": "Silver",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 47771,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/874916_1767144448992.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-BROSS-SLVR",
        "color": "Silver",
        "option": "Dengan Bross",
        "price": 86899,
        "promoPrice": 58223,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/507176_1767144448860.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-TANPABROSS-RSE",
        "color": "Rose",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 47771,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/646695_1766897186264.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-BROSS-RSE",
        "color": "Rose",
        "option": "Dengan Bross",
        "price": 86899,
        "promoPrice": 58223,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/679057_1765506333511.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-TANPABROSS-EMB",
        "color": "Emerald blue",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 47770,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/650477_1765457026931.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-TANPABROSS-BBLUE",
        "color": "Baby blue",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 47770,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/669036_1765099835654.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-BROSS-EMLD",
        "color": "Emerald",
        "option": "Dengan Bross",
        "price": 86899,
        "promoPrice": 58223,
        "stock": 2,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/838982_1764228815605.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-TANPABROSS-HJBTL",
        "color": "Hijau Botol",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 47771,
        "stock": 2,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/795801_1764228815384.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-BROSS-HJBTL",
        "color": "Hijau Botol",
        "option": "Dengan Bross",
        "price": 86899,
        "promoPrice": 58223,
        "stock": 2,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/539772_1764228815209.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-TANPABROSS-MHGN",
        "color": "Mahogany",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 47771,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/990863_1764228815014.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-BROSS-MHGN",
        "color": "Mahogany",
        "option": "Dengan Bross",
        "price": 86899,
        "promoPrice": 58223,
        "stock": 1,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/749255_1764228814849.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-BROSS-DPRPL",
        "color": "Dusty Purple",
        "option": "Dengan Bross",
        "price": 86899,
        "promoPrice": 58223,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/366322_1764126039921.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-TANPABROSS-DPRPL",
        "color": "Dusty Purple",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 47771,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/240357_1763920514190.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-TANPABROSS-EMLD",
        "color": "Emerald",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 47771,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/920024_1763916139402.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-TANPABROSS-CRM",
        "color": "Cream",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 47771,
        "stock": 1,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/155974_1762829276713.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-BROSS-CRM",
        "color": "Cream",
        "option": "Dengan Bross",
        "price": 86899,
        "promoPrice": 58223,
        "stock": 3,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/105429_1762829276573.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-TANPABROSS-REQ",
        "color": "Request  Warna",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 47771,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/362028_1767871752161.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-BROSS-REQ",
        "color": "Request  Warna",
        "option": "Dengan Bross",
        "price": 86899,
        "promoPrice": 58223,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/197047_1767871484132.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-TANPABROSS-NVY",
        "color": "Navy",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 47771,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/350729_1767873072558.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-BROSS-NVY",
        "color": "Navy",
        "option": "Dengan Bross",
        "price": 86899,
        "promoPrice": 58223,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/360647_1767873111632.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-TANPABROSS-DST",
        "color": "Dusty",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 47771,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/430662_1767871562188.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-BROSS-DST",
        "color": "Dusty",
        "option": "Dengan Bross",
        "price": 86899,
        "promoPrice": 58223,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/442146_1767871417170.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-TANPABROSS-SGT",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/235799_1767871159073.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-BROSS-SGT",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/305496_1767872060946.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-TANPABROSS-HTM",
        "color": "Hitam",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 47771,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/194714_1768308862538.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-BROSS-HTM",
        "color": "Hitam",
        "option": "Dengan Bross",
        "price": 86899,
        "promoPrice": 58223,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/031098_1768310132797.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-TANPABROSS-MRN",
        "color": "Maroon",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 47771,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/863951_1768308006593.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-BROSS-MRN",
        "color": "Maroon",
        "option": "Dengan Bross",
        "price": 86899,
        "promoPrice": 58223,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/534453_1768307883926.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-TANPABROSS-BGD",
        "color": "Burgundy",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 47771,
        "stock": 10,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/010942_1768308184898.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-BROSS-BGD",
        "color": "Burgundy",
        "option": "Dengan Bross",
        "price": 86899,
        "promoPrice": 58223,
        "stock": 10,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/063029_1768307644013.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-TANPABROSS-MGHN",
        "color": "Mahogany",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 47770,
        "stock": 10,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/817636_1768312872425.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLW-BROSS-MGHN",
        "color": "Mahogany",
        "option": "Dengan Bross",
        "price": 86899,
        "promoPrice": 58222,
        "stock": 10,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/116556_1768310539074.jpg?imageView2/1/w/300/h/300"
      }
    ]
  },
  {
    "id": "sll",
    "name": "SECERA Selendang Kebaya Lurus Instant Premium + Bros",
    "shortName": "Selendang Lurus",
    "category": "Selendang Kebaya",
    "description": "Selendang kebaya lurus instant premium yang elegan untuk bridesmaid, wisuda & kondangan.",
    "material": "Ceruty Babydoll Premium",
    "weight": 100.0,
    "shopeeLink": "https://shopee.co.id/secerascarves",
    "tiktokLink": "https://vt.tiktok.com/ZS9Nda34epcAt-0AK4n/",
    "details": [
      {
        "title": "MENGAPA SPESIAL",
        "content": "Selendang kebaya lurus instant premium yang elegan untuk bridesmaid, wisuda & kondangan."
      },
      {
        "title": "CARA PERAWATAN",
        "content": "Cuci dengan tangan menggunakan air dingin dan deterjen lembut."
      }
    ],
    "variants": [
      {
        "sku": "SLL-TANPABROSS-SYEL",
        "color": "Soft Yellow",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": null,
        "stock": 2,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/248155_1776407775558.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-SYEL",
        "color": "Soft Yellow",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": null,
        "stock": 2,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/301615_1776407775382.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-CCMLK",
        "color": "Choco Milk",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/303824_1766388707307.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-MRN12",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/237317_1765532551190.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-MRN12",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/134498_1765517102739.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-MRNFS",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/898521_1765496646839.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-MRNFS",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/392693_1765489441217.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-BONE",
        "color": "Bone",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/842891_1765374760970.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-ASHPUR",
        "color": "Ash Purple",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/098347_1765371869812.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-CCMLK",
        "color": "Choco Milk",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/586908_1765366672820.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-BONE",
        "color": "Bone",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/123028_1765339283354.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-ASHPUR",
        "color": "Ash Purple",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/418559_1765338033195.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-BTA",
        "color": "Bata",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 6,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/455512_1763101009791.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-BTA",
        "color": "Bata",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/448877_1763037266370.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-KNYTGLP",
        "color": "Kunyit Gelap",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/176245_1762947890092.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-KNYTGLP",
        "color": "Kunyit Gelap",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/789539_1762947889886.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-MCA",
        "color": "Mocca",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/801325_1762829276409.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-MCA",
        "color": "Mocca",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/406296_1762829276237.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-EMLD",
        "color": "Emerald",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/224915_1762782367225.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-EMLD",
        "color": "Emerald",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/668769_1762581123684.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-DLME",
        "color": "Dark Lime",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/067934_1762438663521.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS--DLME",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/899536_1762217214753.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-DLME",
        "color": "Dark Lime",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/024482_1761929737276.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-HJBTL",
        "color": "Hijau Botol",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/413596_1761717931313.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-HJBTL",
        "color": "Hijau Botol",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/842498_1761687749272.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-CRM",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/560406_1760503897517.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-CRM",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/324253_1760492705696.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-EMB",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/432051_1758724191162.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-EMB",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/978493_1758722190787.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-CREAM",
        "color": "Cream",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 13,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/705647_1767871752252.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-CREAM",
        "color": "Cream",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 3,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/337480_1767871484351.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-TEAL",
        "color": "Teal Green",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/837331_1767871752043.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-TEAL",
        "color": "Teal Green",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/008531_1767871484422.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-MBD",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 2,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/309582_1767873072477.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-MBD",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/852066_1767873111659.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-DPRPL",
        "color": "Dusty Purple",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 7,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/063305_1767871561793.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-DPRPL",
        "color": "Dusty Purple",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 9,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/658441_1767871416755.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-BRY",
        "color": "Berry",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/091569_1767871159174.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-BRY",
        "color": "Berry",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 4,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/395140_1767872060934.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-GRY",
        "color": "Grey",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/745165_1767871752054.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-GRY",
        "color": "Grey",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/530561_1767871484370.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-TRCT",
        "color": "Teracota",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/670925_1767873072432.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-TRCT",
        "color": "Teracota",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/858934_1767873111642.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-LME",
        "color": "Lime",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 4,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/850773_1767871561793.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-LME",
        "color": "Lime",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 6,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/611263_1767871416769.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-RSE",
        "color": "Rose",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 13,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/366819_1767871159187.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-RSE",
        "color": "Rose",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/930430_1767872060560.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-MCB",
        "color": "Merah Cabe",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/308880_1767871752269.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-MCB",
        "color": "Merah Cabe",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/797063_1767871484365.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-BRCK",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/402670_1767873072444.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-BRCK",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/717037_1767873111658.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-SLVR",
        "color": "Silver",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 1,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/764265_1768308184960.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-SLVR",
        "color": "Silver",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/362538_1768307643995.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-KNYT",
        "color": "Kunyit",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 3,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/593412_1768312872067.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-KNYT",
        "color": "Kunyit",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/726277_1768310539033.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-EBLUE",
        "color": "Electric Blue",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/298157_1768308862617.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-EBLUE",
        "color": "Electric Blue",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/606548_1768310132784.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-BPNK",
        "color": "Baby pink",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/355119_1768308006587.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-BPNK",
        "color": "Baby pink",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/048638_1768307883511.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-SGE",
        "color": "Sage",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/465002_1768308185106.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-SGE",
        "color": "Sage",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/162348_1768307643991.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-TRO",
        "color": "Taro",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 8,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/010891_1768312872285.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-TRO",
        "color": "Taro",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 7,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/952076_1768310539034.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-OLV",
        "color": "Olive",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/656537_1768308862600.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-OLV",
        "color": "Olive",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 17,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/998079_1768310132802.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-WDH",
        "color": "Wardah",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/574888_1768308006599.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-WDH",
        "color": "Wardah",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 2,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/747535_1768307883774.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-RED",
        "color": "Merah",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/241097_1768308185177.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-RED",
        "color": "Merah",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/839773_1768307644028.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-BBLUE",
        "color": "Baby Blue",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/226433_1768312872102.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-BBLUE",
        "color": "Baby Blue",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/519773_1768310539059.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-FCHA",
        "color": "Fuchia",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 4,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/346690_1768408013214.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-FCHA",
        "color": "Fuchia",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 4,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/203460_1768405311950.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-WINE",
        "color": "Wine",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 40,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/513166_1768405836511.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-WINE",
        "color": "Wine",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/546157_1768405559209.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-OLVM",
        "color": "Olive muda",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/083729_1768405641067.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-OLVM",
        "color": "Olive muda",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 3,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/346936_1768410233301.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-BLS",
        "color": "Blue sky",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/384263_1768409844667.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-BLS",
        "color": "Blue sky",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/161603_1768408347861.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-REQ",
        "color": "Request warna",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/016589_1768408016611.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-REQ",
        "color": "Request warna",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/767787_1768405311960.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-NVY",
        "color": "Navy",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/268430_1768405836548.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-NVY",
        "color": "Navy",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/039290_1768405559245.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-GGR",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/320317_1768405641089.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS--GGR",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/535723_1768410233703.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-DST",
        "color": "Dusty",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/266035_1768409844652.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-DST",
        "color": "Dusty",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 4,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/633952_1768408348075.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-DNM",
        "color": "Denim",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/073283_1768408014384.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-DNM",
        "color": "Denim",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/247263_1768405311930.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-HJT",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/931479_1768405836561.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-HJT",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/771250_1768405558629.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-HTM",
        "color": "Hitam",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/547334_1767871562239.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-HTM",
        "color": "Hitam",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 4,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/936688_1767871416787.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-SGT",
        "color": "Sage tua",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 3,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/301174_1767871159182.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-SGT",
        "color": "Sage tua",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/953585_1767872060970.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-BWH",
        "color": "Broken White",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 8,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/189390_1767871752274.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-BWH",
        "color": "Broken White",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 8,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/100739_1767871484438.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-BGD",
        "color": "Burgundy",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 3,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/223961_1767873072448.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-BGD",
        "color": "Burgundy",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 10,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/365205_1767873111646.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-MRN",
        "color": "Maroon",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 12,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/349044_1767871562040.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-MRN",
        "color": "Maroon",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 9,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/334612_1767871416715.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-TANPABROSS-MHGN",
        "color": "Mahogany",
        "option": "Tanpa bross",
        "price": 71299,
        "promoPrice": 46345,
        "stock": 10,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/635642_1767871159112.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLL-BROSS-MHGN",
        "color": "Mahogany",
        "option": "Dengan bross",
        "price": 88900,
        "promoPrice": 57785,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/509340_1767872060979.jpg?imageView2/1/w/300/h/300"
      }
    ]
  },
  {
    "id": "ps",
    "name": "SECERA Pashmina Shawl",
    "shortName": "Pashmina Shawl",
    "category": "Hijab",
    "description": "Hijab pashmina ceruty bahan jatuh dan lembut ukuran 75x180cm.",
    "material": "Ceruty Premium",
    "weight": 150.0,
    "shopeeLink": "https://shopee.co.id/secerascarves",
    "tiktokLink": "https://vt.tiktok.com/ZS9Nda34epcAt-0AK4n/",
    "details": [
      {
        "title": "MENGAPA SPESIAL",
        "content": "Hijab pashmina ceruty bahan jatuh dan lembut ukuran 75x180cm."
      },
      {
        "title": "CARA PERAWATAN",
        "content": "Cuci dengan tangan menggunakan air dingin dan deterjen lembut."
      }
    ],
    "variants": [
      {
        "sku": "PS-BWH",
        "color": "Broken White",
        "option": "All Size",
        "price": 36899,
        "promoPrice": null,
        "stock": 2,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/396968_1772626742255.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "PS-BONE",
        "color": "Bone",
        "option": "All Size",
        "price": 36899,
        "promoPrice": null,
        "stock": 2,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/634127_1772626742001.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "PS-MRN",
        "color": "Maroon",
        "option": "All Size",
        "price": 36899,
        "promoPrice": null,
        "stock": 2,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/810571_1772626741787.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "PS-BWHITE",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 2,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/731171_1772497038141.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "PS-BNE",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 2,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/400391_1772497037945.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "PS-BGD",
        "color": "Burgundy",
        "option": "All Size",
        "price": 36899,
        "promoPrice": null,
        "stock": 2,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/028340_1772497037822.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "PS-MHGN",
        "color": "Mahogani",
        "option": "All Size",
        "price": 36899,
        "promoPrice": null,
        "stock": 2,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/153166_1772497037672.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "PS-NVY",
        "color": "Navy",
        "option": "All Size",
        "price": 36899,
        "promoPrice": null,
        "stock": 2,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/449702_1772497037515.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "PS-HTM",
        "color": "Hitam",
        "option": "All Size",
        "price": 36899,
        "promoPrice": null,
        "stock": 2,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/168843_1772497037386.jpg?imageView2/1/w/300/h/300"
      }
    ]
  },
  {
    "id": "laras",
    "name": "SECERA LARAS Wrap Skirt / Rok Lilit Ceruty Babydoll Premium",
    "shortName": "LARAS Wrap Skirt",
    "category": "Rok",
    "description": "Rok lilit ceruty babydoll premium dengan potongan yang elegan dan adjustable.",
    "material": "Ceruty Babydoll Premium",
    "weight": 300.0,
    "shopeeLink": "https://shopee.co.id/secerascarves",
    "tiktokLink": "https://vt.tiktok.com/ZS9Nda34epcAt-0AK4n/",
    "details": [
      {
        "title": "MENGAPA SPESIAL",
        "content": "Rok lilit ceruty babydoll premium dengan potongan yang elegan dan adjustable."
      },
      {
        "title": "CARA PERAWATAN",
        "content": "Cuci dengan tangan menggunakan air dingin dan deterjen lembut."
      }
    ],
    "variants": [
      {
        "sku": "LARAS-MHGN",
        "color": "Mahogany",
        "option": "All Size",
        "price": 168900,
        "promoPrice": 94584,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/944189_1772626741174.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "LARAS-NVY",
        "color": "Navy",
        "option": "All Size",
        "price": 168900,
        "promoPrice": 94584,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/701922_1772626740973.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "LARAS-CRM",
        "color": "Cream",
        "option": "All Size",
        "price": 168900,
        "promoPrice": 94584,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/514244_1772626740705.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "LARAS-HTM",
        "color": "Black",
        "option": "All Size",
        "price": 168900,
        "promoPrice": 94584,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/211068_1772626740452.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "LARAS-BWH",
        "color": "Broken White",
        "option": "All Size",
        "price": 168900,
        "promoPrice": 94584,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/460949_1772626740173.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "LARAS-BGD",
        "color": "Burgundy",
        "option": "All Size",
        "price": 168900,
        "promoPrice": 94584,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/951882_1772626739987.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "LARAS-MRN",
        "color": "Maroon",
        "option": "All Size",
        "price": 168900,
        "promoPrice": 94584,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/448974_1772626739811.jpg?imageView2/1/w/300/h/300"
      }
    ]
  },
  {
    "id": "versa",
    "name": "SECERA VERSA Multi Style One Set",
    "shortName": "VERSA Multi Style",
    "category": "Outer & Set",
    "description": "Outer multi style & rok lilit instan 3in1 convertible. Satu set untuk berbagai gaya.",
    "material": "Ceruty Babydoll Premium",
    "weight": 0.0,
    "shopeeLink": "https://shopee.co.id/secerascarves",
    "tiktokLink": "https://vt.tiktok.com/ZS9Nda34epcAt-0AK4n/",
    "details": [
      {
        "title": "MENGAPA SPESIAL",
        "content": "Outer multi style & rok lilit instan 3in1 convertible. Satu set untuk berbagai gaya."
      },
      {
        "title": "CARA PERAWATAN",
        "content": "Cuci dengan tangan menggunakan air dingin dan deterjen lembut."
      }
    ],
    "variants": [
      {
        "sku": "OUTER-BGD",
        "color": "Burgundy",
        "option": "VERSA Outer Only",
        "price": 245900,
        "promoPrice": 113975,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/369279_1772590634367.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "OUTER-CRM",
        "color": "Cream",
        "option": "Versa Outer",
        "price": 245900,
        "promoPrice": 113975,
        "stock": 10,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/238989_1772497037138.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "ROK-CRM",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/953072_1772457390730.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "ONESET-BGD",
        "color": "Burgundy",
        "option": "VERSA One-set",
        "price": 305800,
        "promoPrice": 198770,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/703624_1772376599513.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "ROK-BGD",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/840209_1772351106622.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "ONESET-CRM",
        "color": "Cream",
        "option": "VERSA One-set",
        "price": 305800,
        "promoPrice": 198770,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/584477_1770864983237.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "ONESET-MHGN",
        "color": "Mahogany",
        "option": "VERSA One-set",
        "price": 305800,
        "promoPrice": 198770,
        "stock": 1,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/895071_1769124880191.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "OUTER-NVY",
        "color": "Navy",
        "option": "Versa Outer",
        "price": 245900,
        "promoPrice": 113975,
        "stock": 11,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/353452_1769124880062.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "OUTER-BWH",
        "color": "Broken White",
        "option": "Versa Outer",
        "price": 245900,
        "promoPrice": 113975,
        "stock": 9,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/620552_1769124879906.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "ROK-MHGN",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/735770_1768966091455.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "ONESET-MRN",
        "color": "Maroon",
        "option": "VERSA One-set",
        "price": 305800,
        "promoPrice": 198770,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/680507_1768966091340.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "ROK-CREAM",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/536358_1768965908226.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "OUTER-MHGN",
        "color": "Mahogany",
        "option": "Versa Outer",
        "price": 245900,
        "promoPrice": 113975,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/082190_1768965454918.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "ROK-BLACK",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/558669_1768965454730.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "ONESET-CREAM",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/081386_1768964512717.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "OUTER-CREAM",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/493731_1768964177806.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "OUTER-MRN",
        "color": "Maroon",
        "option": "Versa Outer",
        "price": 245900,
        "promoPrice": 113975,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/236947_1768963779574.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "OUTER-BLACK",
        "color": "Black",
        "option": "Versa Outer",
        "price": 245900,
        "promoPrice": 113975,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/799827_1768963779432.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "ONESET-BLACK",
        "color": "Black",
        "option": "VERSA One-set",
        "price": 305800,
        "promoPrice": 198770,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/702712_1768963779290.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "ONESET-NVY",
        "color": "Navy",
        "option": "VERSA One-set",
        "price": 305800,
        "promoPrice": 198770,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/950065_1768963239712.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "ONESET-BWH",
        "color": "Broken White",
        "option": "VERSA One-set",
        "price": 305800,
        "promoPrice": 198770,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/779401_1768963238314.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "ROK-NVY",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/971134_1768963227131.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "ROK-MRN",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/726858_1768963226988.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "ROK-BWH",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/380657_1768963226791.jpg?imageView2/1/w/300/h/300"
      }
    ]
  },
  {
    "id": "kala",
    "name": "KALA Kebaya by SECERA",
    "shortName": "KALA Kebaya",
    "category": "Kebaya",
    "description": "Kebaya Kartini brokat modern full furing. Atasan saja, sudah termasuk bros cantik.",
    "material": "Brokat Premium Full Furing",
    "weight": 250.0,
    "shopeeLink": "https://shopee.co.id/secerascarves",
    "tiktokLink": "https://vt.tiktok.com/ZS9Nda34epcAt-0AK4n/",
    "details": [
      {
        "title": "MENGAPA SPESIAL",
        "content": "Kebaya Kartini brokat modern full furing. Atasan saja, sudah termasuk bros cantik."
      },
      {
        "title": "CARA PERAWATAN",
        "content": "Cuci dengan tangan menggunakan air dingin dan deterjen lembut."
      }
    ],
    "variants": [
      {
        "sku": "KALA-MHGN-L",
        "color": "Mahogany",
        "option": "L",
        "price": 189800,
        "promoPrice": null,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/927513_1772497039493.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "KALA-MHGN-M",
        "color": "Mahogany",
        "option": "M",
        "price": 189800,
        "promoPrice": null,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/769115_1772497039355.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "KALA-NVY-L",
        "color": "Navy",
        "option": "L",
        "price": 189800,
        "promoPrice": null,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/062822_1772497039158.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "KALA-NVY-M",
        "color": "Navy",
        "option": "M",
        "price": 189800,
        "promoPrice": null,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/836437_1772497039027.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "KALA-BGD-L",
        "color": "Burgundy",
        "option": "L",
        "price": 189800,
        "promoPrice": null,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/592431_1772497038857.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "KALA-HTM-L",
        "color": "Hitam",
        "option": "L",
        "price": 189800,
        "promoPrice": null,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/179756_1772497038661.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "KALA-BGD-M",
        "color": "Hitam",
        "option": "M",
        "price": 189800,
        "promoPrice": null,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/011406_1772497038563.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "KALA-BGD-M",
        "color": "Burgundy",
        "option": "M",
        "price": 189800,
        "promoPrice": null,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/011406_1772497038563.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "KALA-MRN-L",
        "color": "Maroon",
        "option": "L",
        "price": 189800,
        "promoPrice": null,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/422613_1772497038400.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "KALA-MRN-M",
        "color": "Maroon",
        "option": "M",
        "price": 189800,
        "promoPrice": null,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/944718_1772497038262.jpg?imageView2/1/w/300/h/300"
      }
    ]
  },
  {
    "id": "slp",
    "name": "SECERA [1.5m] Selendang Kebaya Instant + Bros Elegan",
    "shortName": "Selendang Instant 1.5m",
    "category": "Selendang Kebaya",
    "description": "Selendang kebaya instant dengan panjang 1.5m. Praktis dan cantik untuk berbagai acara.",
    "material": "Ceruty Babydoll Premium",
    "weight": 100.0,
    "shopeeLink": "https://shopee.co.id/secerascarves",
    "tiktokLink": "https://vt.tiktok.com/ZS9Nda34epcAt-0AK4n/",
    "details": [
      {
        "title": "MENGAPA SPESIAL",
        "content": "Selendang kebaya instant dengan panjang 1.5m. Praktis dan cantik untuk berbagai acara."
      },
      {
        "title": "CARA PERAWATAN",
        "content": "Cuci dengan tangan menggunakan air dingin dan deterjen lembut."
      }
    ],
    "variants": [
      {
        "sku": "SLP-TANPABROSS-DST",
        "color": "Dusty",
        "option": "Tanpa Bross",
        "price": 60299,
        "promoPrice": null,
        "stock": 1,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/369505_1769124881805.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-BROSS-DST",
        "color": "Dusty",
        "option": "Dengan Bross",
        "price": 80299,
        "promoPrice": null,
        "stock": 2,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/270600_1769124881673.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-TANPABROSS-BLS",
        "color": "Blue Sky",
        "option": "Tanpa Bross",
        "price": 60299,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/198987_1769124881553.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-BROSS-BLS",
        "color": "Blue Sky",
        "option": "Dengan Bross",
        "price": 80299,
        "promoPrice": null,
        "stock": 1,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/397393_1769124881427.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-TANPABROSS-DPRPL",
        "color": "Dusty Purple",
        "option": "Tanpa Bross",
        "price": 60299,
        "promoPrice": null,
        "stock": 1,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/148062_1769124881290.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-BROSS-DPRPL",
        "color": "Dusty Purple",
        "option": "Dengan Bross",
        "price": 80299,
        "promoPrice": null,
        "stock": 1,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/047416_1769124881156.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-BROSS-NVY",
        "color": "Navy",
        "option": "Dengan Bross",
        "price": 80299,
        "promoPrice": 53801,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/825059_1768904441973.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-TANPABROSS-NVY",
        "color": "Navy",
        "option": "Tanpa Bross",
        "price": 60299,
        "promoPrice": 40401,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/895233_1768016069254.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-TANPABROSS-HJBTL",
        "color": "Hijau Botol",
        "option": "Tanpa Bross",
        "price": 60299,
        "promoPrice": 40401,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/792095_1767426137211.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-BROSS-HJBTL",
        "color": "Hijau Botol",
        "option": "Dengan Bross",
        "price": 80299,
        "promoPrice": 53801,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/816348_1766277638905.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-BROSS-RSE",
        "color": "Rose",
        "option": "Dengan Bross",
        "price": 80299,
        "promoPrice": 53801,
        "stock": 1,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/988494_1763188471187.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-TANPABROSS-RSE",
        "color": "Rose",
        "option": "Tanpa Bross",
        "price": 60299,
        "promoPrice": 40401,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/918440_1763129173540.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-TANPABROSS-EMLD",
        "color": "Emerald",
        "option": "Tanpa Bross",
        "price": 60299,
        "promoPrice": 40401,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/344026_1762829277031.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-BROSS-EMLD",
        "color": "Emerald",
        "option": "Dengan Bross",
        "price": 80299,
        "promoPrice": 53801,
        "stock": 2,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/792275_1762829276868.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-TANPABROSS-SLVR",
        "color": "Silver",
        "option": "Tanpa Bross",
        "price": 60299,
        "promoPrice": 40401,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/988374_1760171978414.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-BROSS-SLVR",
        "color": "Silver",
        "option": "Dengan Bross",
        "price": 80299,
        "promoPrice": 53801,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/267764_1760171978271.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-TANPABROSS-CRM",
        "color": "Cream",
        "option": "Tanpa Bross",
        "price": 60299,
        "promoPrice": 40401,
        "stock": 1,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/011355_1760171978072.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-BROSS-CRM",
        "color": "Cream",
        "option": "Dengan Bross",
        "price": 80299,
        "promoPrice": 53801,
        "stock": 1,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/671529_1760171977946.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-TANPABROSS-EMB",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 1,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/195788_1760171977752.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-BROSS-EMB",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/953418_1760171977614.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-TANPABROSS-LIME",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/513637_1768308862917.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-BROSS-LIME",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 2,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/163727_1768310132792.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-TANPABROSS-RED",
        "color": "Merah",
        "option": "Tanpa Bross",
        "price": 60299,
        "promoPrice": 40401,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/204087_1768308006599.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-BROSS-RED",
        "color": "Merah",
        "option": "Dengan Bross",
        "price": 80299,
        "promoPrice": 53801,
        "stock": 1,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/617867_1768307883873.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-TANPABROSS-MCB",
        "color": "Merah cabe",
        "option": "Tanpa Bross",
        "price": 60299,
        "promoPrice": 40401,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/321192_1768308185124.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-BROSS-MCB",
        "color": "Merah cabe",
        "option": "Dengan Bross",
        "price": 80299,
        "promoPrice": 53801,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/539810_1768307644053.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-TANPABROSS-DNM",
        "color": "Denim",
        "option": "Tanpa Bross",
        "price": 60299,
        "promoPrice": 40401,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/250862_1768312872087.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-BROSS-DNM",
        "color": "Denim",
        "option": "Dengan Bross",
        "price": 80299,
        "promoPrice": 53801,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/008247_1768310539006.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-TANPABROSS-GNGR",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/930617_1768308863109.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-BROSS-GNGR",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/948473_1768310132804.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-TANPABROSS-HTM",
        "color": "Hitam",
        "option": "Tanpa Bross",
        "price": 60299,
        "promoPrice": 40401,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/731878_1768308006587.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-BROSS-HTM",
        "color": "Hitam",
        "option": "Dengan Bross",
        "price": 80299,
        "promoPrice": 53801,
        "stock": 4,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/422208_1768307883498.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-TANPABROSS-BWH",
        "color": "Broken White",
        "option": "Tanpa Bross",
        "price": 60299,
        "promoPrice": 40401,
        "stock": 6,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/418082_1767871752423.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-BROSS-BWH",
        "color": "Broken White",
        "option": "Dengan Bross",
        "price": 80299,
        "promoPrice": 53801,
        "stock": 6,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/596149_1767871484355.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-TANPABROSS-BGD",
        "color": "Burgundy",
        "option": "Tanpa Bross",
        "price": 60299,
        "promoPrice": 40401,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/086061_1767873072486.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-BROSS-BGD",
        "color": "Burgundy",
        "option": "Dengan Bross",
        "price": 80299,
        "promoPrice": 53801,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/003503_1767873111637.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-TANPABROSS-MRN",
        "color": "Maroon",
        "option": "Tanpa Bross",
        "price": 60299,
        "promoPrice": 40401,
        "stock": 10,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/507207_1767871562226.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-BROSS-MRN",
        "color": "Maroon",
        "option": "Dengan Bross",
        "price": 80299,
        "promoPrice": 53801,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/246836_1767871416745.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-TANPABROSS-MHGN",
        "color": "Mahogany",
        "option": "Tanpa Bross",
        "price": 60299,
        "promoPrice": 40401,
        "stock": 10,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/980757_1767871159048.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLP-BROSS-MHGN",
        "color": "Mahogany",
        "option": "Dengan Bross",
        "price": 80299,
        "promoPrice": 53801,
        "stock": 9,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/772124_1767872060935.jpg?imageView2/1/w/300/h/300"
      }
    ]
  },
  {
    "id": "sc",
    "name": "SECERA SCRUNCHIE",
    "shortName": "Scrunchie",
    "category": "Aksesoris",
    "description": "Ikat rambut hijab cepol yang nyaman dan tidak membuat pusing.",
    "material": "Velvet / Ceruty",
    "weight": 0.0,
    "shopeeLink": "https://shopee.co.id/secerascarves",
    "tiktokLink": "https://vt.tiktok.com/ZS9Nda34epcAt-0AK4n/",
    "details": [
      {
        "title": "MENGAPA SPESIAL",
        "content": "Ikat rambut hijab cepol yang nyaman dan tidak membuat pusing."
      },
      {
        "title": "CARA PERAWATAN",
        "content": "Cuci dengan tangan menggunakan air dingin dan deterjen lembut."
      }
    ],
    "variants": [
      {
        "sku": "SC-MEDIUM",
        "color": "",
        "option": "All Size",
        "price": 24998,
        "promoPrice": 14999,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/482310_1768964176356.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SC",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/947738_1768963227457.jpg?imageView2/1/w/300/h/300"
      }
    ]
  },
  {
    "id": "pj",
    "name": "SECERA Paris Basic",
    "shortName": "Paris Basic",
    "category": "Hijab",
    "description": "Hijab segi empat Paris Basic yang ringan dan mudah dibentuk.",
    "material": "Paris Premium",
    "weight": 0.0,
    "shopeeLink": "https://shopee.co.id/secerascarves",
    "tiktokLink": "https://vt.tiktok.com/ZS9Nda34epcAt-0AK4n/",
    "details": [
      {
        "title": "MENGAPA SPESIAL",
        "content": "Hijab segi empat Paris Basic yang ringan dan mudah dibentuk."
      },
      {
        "title": "CARA PERAWATAN",
        "content": "Cuci dengan tangan menggunakan air dingin dan deterjen lembut."
      }
    ],
    "variants": [
      {
        "sku": "PJ-SILVER",
        "color": "Silver",
        "option": "All Size",
        "price": 42900,
        "promoPrice": 39897,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/560117_1766728081090.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "PJ-STAUPE",
        "color": "Sweet Taupe",
        "option": "All Size",
        "price": 42900,
        "promoPrice": 39897,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/048888_1762263979700.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "PJ-STONE",
        "color": "Stone",
        "option": "All Size",
        "price": 42900,
        "promoPrice": 39897,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/535137_1762263979518.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "PJ-PMAV",
        "color": "Pale Mauve",
        "option": "All Size",
        "price": 42900,
        "promoPrice": 39897,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/819308_1762263979298.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "PJ-NPINK",
        "color": "Nude Pink",
        "option": "All Size",
        "price": 42900,
        "promoPrice": 39897,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/248316_1762263979133.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "PJ-NAVY",
        "color": "Navy",
        "option": "All Size",
        "price": 42900,
        "promoPrice": 39897,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/007971_1762263978953.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "PJ-MGREEN",
        "color": "Moss Green",
        "option": "All Size",
        "price": 42900,
        "promoPrice": 39897,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/962227_1762263978181.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "PJ-LSAGE",
        "color": "Light Sage",
        "option": "All Size",
        "price": 42900,
        "promoPrice": 39897,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/547768_1762263978041.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "PJ-IVR",
        "color": "Ivory",
        "option": "All Size",
        "price": 42900,
        "promoPrice": 39897,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/311113_1762263977841.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "PJ-HTM",
        "color": "Hitam",
        "option": "All Size",
        "price": 42900,
        "promoPrice": 39897,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/861753_1762263977667.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "PJ-CHAR",
        "color": "Charcoal",
        "option": "All Size",
        "price": 42900,
        "promoPrice": 39897,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/997413_1762263977541.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "PJ-BGD",
        "color": "Burgundy",
        "option": "All Size",
        "price": 42900,
        "promoPrice": 39897,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/331720_1762263977395.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "PJ-BISC",
        "color": "Biscuit",
        "option": "All Size",
        "price": 42900,
        "promoPrice": 39897,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/758879_1762263977200.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "PJ-ADST",
        "color": "Abu Dusty",
        "option": "All Size",
        "price": 42900,
        "promoPrice": 39897,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/415138_1762263977029.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "PJ-MHGN",
        "color": "Mahogany",
        "option": "All Size",
        "price": 42900,
        "promoPrice": 39897,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/008540_1762263976839.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "PJ-MRN",
        "color": "Maroon",
        "option": "All Size",
        "price": 42900,
        "promoPrice": 39897,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/522222_1762210173766.jpg?imageView2/1/w/300/h/300"
      }
    ]
  },
  {
    "id": "blm",
    "name": "BELT SABUK MUTIARA BESAR AKSESORIS KEBAYA KONDANGAN",
    "shortName": "BELT SABUK MUTIARA BESAR AKSES...",
    "category": "Lainnya",
    "description": "BELT SABUK MUTIARA BESAR AKSESORIS KEBAYA KONDANGAN",
    "material": "Premium Material",
    "weight": 0.0,
    "shopeeLink": "https://shopee.co.id/secerascarves",
    "tiktokLink": "https://vt.tiktok.com/ZS9Nda34epcAt-0AK4n/",
    "details": [
      {
        "title": "MENGAPA SPESIAL",
        "content": "BELT SABUK MUTIARA BESAR AKSESORIS KEBAYA KONDANGAN"
      },
      {
        "title": "CARA PERAWATAN",
        "content": "Cuci dengan tangan menggunakan air dingin dan deterjen lembut."
      }
    ],
    "variants": [
      {
        "sku": "BLM-MUTIARA-HTM",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/272245_1758851359349.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "BLM-MUTIARA-ABU",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/797475_1758693041667.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "BLM-MUTIARA-PTH",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/945773_1758693041446.jpg?imageView2/1/w/300/h/300"
      }
    ]
  },
  {
    "id": "brs",
    "name": "BROSS KEBAYA AKSESORIS (HANYA BISA PILIH WARNA)",
    "shortName": "BROSS KEBAYA AKSESORIS (HANYA ...",
    "category": "Lainnya",
    "description": "BROSS KEBAYA AKSESORIS (HANYA BISA PILIH WARNA)",
    "material": "Premium Material",
    "weight": 50.0,
    "shopeeLink": "https://shopee.co.id/secerascarves",
    "tiktokLink": "https://vt.tiktok.com/ZS9Nda34epcAt-0AK4n/",
    "details": [
      {
        "title": "MENGAPA SPESIAL",
        "content": "BROSS KEBAYA AKSESORIS (HANYA BISA PILIH WARNA)"
      },
      {
        "title": "CARA PERAWATAN",
        "content": "Cuci dengan tangan menggunakan air dingin dan deterjen lembut."
      }
    ],
    "variants": [
      {
        "sku": "BRS-GLD",
        "color": "Gold",
        "option": "All Size",
        "price": 15000,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/022869_1767873072490.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "BRS-SLVR",
        "color": "Silver",
        "option": "All Size",
        "price": 15000,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/694211_1767872061010.jpg?imageView2/1/w/300/h/300"
      }
    ]
  },
  {
    "id": "slo",
    "name": "Scarf Selendang Organza",
    "shortName": "Scarf Selendang Organza - Brid...",
    "category": "Lainnya",
    "description": "Scarf Selendang Organza - Bridesmaid, Wisuda, Kondangan & Pesta",
    "material": "Premium Material",
    "weight": 10.0,
    "shopeeLink": "https://shopee.co.id/secerascarves",
    "tiktokLink": "https://vt.tiktok.com/ZS9Nda34epcAt-0AK4n/",
    "details": [
      {
        "title": "MENGAPA SPESIAL",
        "content": "Scarf Selendang Organza - Bridesmaid, Wisuda, Kondangan & Pesta"
      },
      {
        "title": "CARA PERAWATAN",
        "content": "Cuci dengan tangan menggunakan air dingin dan deterjen lembut."
      }
    ],
    "variants": [
      {
        "sku": "SLO-ORG-ARMY",
        "color": "Army",
        "option": "All Size",
        "price": 44650,
        "promoPrice": null,
        "stock": 2,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/196600_1767873111781.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLO-ORG-GGR",
        "color": "Ginger",
        "option": "All Size",
        "price": 44650,
        "promoPrice": null,
        "stock": 4,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/104114_1767871561838.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLO-ORG-EMG",
        "color": "Emerald green",
        "option": "All Size",
        "price": 44650,
        "promoPrice": null,
        "stock": 1,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/169024_1767871416808.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLO-ORG-UGT",
        "color": "Ungu Tua",
        "option": "All Size",
        "price": 44650,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/787367_1767871159177.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLO-ORG-BLU",
        "color": "Blue",
        "option": "All Size",
        "price": 44650,
        "promoPrice": null,
        "stock": 2,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/311393_1767872060969.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLO-ORG-BGD",
        "color": "Burgundy",
        "option": "All Size",
        "price": 44650,
        "promoPrice": null,
        "stock": 15,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/056394_1767871752129.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLO-ORG-MCA",
        "color": "Mocca",
        "option": "All Size",
        "price": 44650,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/425461_1767871484175.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLO-ORG-REQ",
        "color": "Request Warna",
        "option": "All Size",
        "price": 44650,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/952834_1767873072464.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLO-ORG-WHT",
        "color": "White",
        "option": "All Size",
        "price": 44650,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/631379_1767873111716.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLO-ORG-DST",
        "color": "Dusty Pink",
        "option": "All Size",
        "price": 44650,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/804270_1767871562214.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLO-ORG-MKT",
        "color": "Milktea",
        "option": "All Size",
        "price": 44650,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/214787_1767871416732.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLO-ORG-BRN",
        "color": "Brown",
        "option": "All Size",
        "price": 44650,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/673849_1767871159291.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLO-ORG-HTM",
        "color": "Hitam",
        "option": "All Size",
        "price": 44650,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/045478_1767872060778.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLO-ORG-GRY",
        "color": "Abu-abu",
        "option": "All Size",
        "price": 44650,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/806824_1767871752088.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLO-ORG-NVY",
        "color": "Navy",
        "option": "All Size",
        "price": 41230,
        "promoPrice": null,
        "stock": 11,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/357389_1767871484127.jpg?imageView2/1/w/300/h/300"
      }
    ]
  },
  {
    "id": "slt",
    "name": "SLAYER SELENDANG AKSESORIS KEBAYA PUNDAK / BAHAN SOFT TILLE COCOK UNTUK KONDANGAN DAN WISUDA",
    "shortName": "SLAYER SELENDANG AKSESORIS KEB...",
    "category": "Lainnya",
    "description": "SLAYER SELENDANG AKSESORIS KEBAYA PUNDAK / BAHAN SOFT TILLE COCOK UNTUK KONDANGAN DAN WISUDA",
    "material": "Premium Material",
    "weight": 10.0,
    "shopeeLink": "https://shopee.co.id/secerascarves",
    "tiktokLink": "https://vt.tiktok.com/ZS9Nda34epcAt-0AK4n/",
    "details": [
      {
        "title": "MENGAPA SPESIAL",
        "content": "SLAYER SELENDANG AKSESORIS KEBAYA PUNDAK / BAHAN SOFT TILLE COCOK UNTUK KONDANGAN DAN WISUDA"
      },
      {
        "title": "CARA PERAWATAN",
        "content": "Cuci dengan tangan menggunakan air dingin dan deterjen lembut."
      }
    ],
    "variants": [
      {
        "sku": "SLT-TILE-REQ",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/775759_1767873072471.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLT-TILE-ABMD",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/503477_1767873111682.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLT-TILE-HTUA",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/559483_1767871562236.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLT-TILE-BBL",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/616141_1767871416742.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLT-TILE-TRO",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 2,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/054690_1767871159163.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLT-TILE-DMLO",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/063280_1767872060963.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLT-TILE-LME",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 1,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/943804_1767871751812.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLT-TILE-KRM",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/981960_1767871484097.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLT-TILE-GRY",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/618636_1767873072470.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLT-TILE-TSC",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/690800_1767873111823.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLT-TILE-MRH",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/314906_1767871562272.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLT-TILE-DST",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/874624_1767871416822.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLT-TILE-MRN",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/181948_1767871159306.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLT-TILE-HTM",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/372730_1767872060613.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLT-TILE-MLO",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 3,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/244014_1767871752057.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLT-TILE-NVY",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 1,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/964782_1767871484381.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLT-TILE-SGG",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 2,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/542852_1767873072435.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLT-TILE-BRW",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 1,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/659644_1767873111798.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLT-TILE-DNM",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/966394_1767871561853.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLT-TILE-TRCT",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 2,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/481390_1767871416778.jpg?imageView2/1/w/300/h/300"
      }
    ]
  },
  {
    "id": "blr",
    "name": "BELT SABUK MUTIARA RANTAI AKSESORIS KEBAYA KONDANGAN",
    "shortName": "BELT SABUK MUTIARA RANTAI AKSE...",
    "category": "Lainnya",
    "description": "BELT SABUK MUTIARA RANTAI AKSESORIS KEBAYA KONDANGAN",
    "material": "Premium Material",
    "weight": 0.0,
    "shopeeLink": "https://shopee.co.id/secerascarves",
    "tiktokLink": "https://vt.tiktok.com/ZS9Nda34epcAt-0AK4n/",
    "details": [
      {
        "title": "MENGAPA SPESIAL",
        "content": "BELT SABUK MUTIARA RANTAI AKSESORIS KEBAYA KONDANGAN"
      },
      {
        "title": "CARA PERAWATAN",
        "content": "Cuci dengan tangan menggunakan air dingin dan deterjen lembut."
      }
    ],
    "variants": [
      {
        "sku": "BLR-RANTAI-PTH",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/122437_1767871159210.jpg?imageView2/1/w/300/h/300"
      }
    ]
  },
  {
    "id": "slb",
    "name": "Selendang Kebaya Bali Double Hycon 2,4m",
    "shortName": "Selendang Kebaya Bali Double H...",
    "category": "Lainnya",
    "description": "Selendang Kebaya Bali Double Hycon 2,4m",
    "material": "Premium Material",
    "weight": 30.0,
    "shopeeLink": "https://shopee.co.id/secerascarves",
    "tiktokLink": "https://vt.tiktok.com/ZS9Nda34epcAt-0AK4n/",
    "details": [
      {
        "title": "MENGAPA SPESIAL",
        "content": "Selendang Kebaya Bali Double Hycon 2,4m"
      },
      {
        "title": "CARA PERAWATAN",
        "content": "Cuci dengan tangan menggunakan air dingin dan deterjen lembut."
      }
    ],
    "variants": [
      {
        "sku": "SLB-2,4-HTM",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/166342_1768308862524.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLB-2,4-NVY",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 4,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/286327_1768310132830.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLB-2,4-BGD",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/748552_1768308006679.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLB-2,4-EMRLD",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 5,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/029408_1768307884186.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLB-2,4-MRN",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/082289_1768308185296.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLB-2,4-TRCT",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 2,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/769974_1768307644029.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLB-2,4-RED",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/860857_1768312872105.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLB-2,4-PTH",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 3,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/133671_1768310538994.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLB-2,4-HJU",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 3,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/921579_1768308863000.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLB-2,4-KNYT",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/020522_1768310132792.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLB-HTM",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 2,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/762816_1768308006663.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLB-NVY",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 3,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/921318_1768307884256.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLB-BGD",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 1,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/308143_1768308185147.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLB-EMRLD",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/997869_1768307644029.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLB-MRN",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 1,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/687742_1768312872136.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLB-TRCT",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/629683_1768310539039.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLB-RED",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/427088_1768308862611.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLB-PTH",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 2,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/692149_1768310132831.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLB-HJU",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 0,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/840731_1768308006772.jpg?imageView2/1/w/300/h/300"
      },
      {
        "sku": "SLB-KNYT",
        "color": "",
        "option": "All Size",
        "price": 0,
        "promoPrice": null,
        "stock": 1,
        "image": "https://res.bigseller.pro/sku/images/merchantsku/1233323/925383_1768307883798.jpg?imageView2/1/w/300/h/300"
      }
    ]
  }
];


export function formatPrice(price: number | string | null | undefined): string {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (numericPrice === null || numericPrice === undefined || isNaN(numericPrice)) return 'Rp. 0';
  return `Rp. ${Math.floor(numericPrice).toLocaleString('id-ID')}`;
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'Semua') return products;
  return products.filter((p) => p.category === category);
}
