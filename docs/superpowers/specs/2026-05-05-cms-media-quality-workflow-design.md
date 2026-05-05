# CMS Media Quality Workflow Design (Self-Hosted, Mobile-First)

## 1) Goal and Scope
Membuat workflow upload media di CMS agar foto/video tetap terlihat tajam di storefront mobile, dengan keseimbangan kualitas visual dan performa loading.

In-scope:
- Pipeline upload media pada backend server internal.
- Strategi transformasi image/video multi-variant.
- Cara storefront memilih asset yang tepat untuk mobile.
- Guardrail CMS agar editor tidak publish aset berkualitas buruk.

Out-of-scope:
- Migrasi ke provider eksternal (Cloudinary/Imgix).
- Redesign UI CMS besar-besaran.

## 2) Success Criteria
- Hero dan product image terlihat tajam pada perangkat mobile umum (2x/3x DPR).
- Penurunan total bytes media per page dibanding 1-file-original strategy.
- Tidak ada upscaling image di storefront.
- Video memiliki poster tajam dan startup cepat di koneksi mobile normal.

## 3) Recommended Architecture
Komponen utama:
- `Upload API` (server): menerima file master dari CMS.
- `Media Processor` (server worker/process): generate varian image/video.
- `Media Storage` (filesystem server): menyimpan original + renditions.
- `Media Manifest` (DB JSON/table): metadata setiap asset dan variant.
- `Storefront Renderer` (React): memilih variant via `srcset/sizes` (image) atau source set video.

Direktori media (contoh):
- `/media/original/{assetId}/...`
- `/media/derived/{assetId}/{kind}-{w}.{ext}`
- `/media/poster/{assetId}/poster-{w}.webp`

## 4) Upload and Processing Workflow
1. Editor upload master file via CMS.
2. Server validasi MIME, dimensi, size, durasi.
3. Original disimpan tanpa overwrite.
4. Processor membuat turunan:
- Image widths: `480, 768, 1080, 1440, 2000`
- Formats: `avif` (primary), `webp` (secondary), `jpg` (fallback selected cases)
- Video renditions: `720p` + `1080p` MP4 (H.264/AAC)
- Video poster image: `720` + `1080` WebP/JPG
5. Server simpan manifest metadata (url/path, width, height, format, byte size, duration, checksum).
6. CMS menampilkan status `processing -> ready`.
7. Storefront hanya konsumsi asset status `ready`.

## 5) Quality and Encoding Policy
Image:
- Jangan upscale file di processor.
- AVIF quality: `50` baseline (range tuning 45-60).
- WebP quality: `78` baseline (range tuning 72-82).
- JPEG quality: `82` untuk fallback penting.

Video:
- Codec: H.264 (compatibility tinggi mobile).
- Audio: AAC 128kbps.
- 720p target bitrate: 1.8-2.5 Mbps.
- 1080p target bitrate: 3.5-5 Mbps.
- Keyframe interval disarankan 2 detik.

## 6) Storefront Delivery Rules (Mobile-First)
Image:
- Gunakan `<img srcset="..." sizes="...">`.
- `sizes` mengikuti layout mobile dulu, baru desktop.
- Untuk LCP/hero: gunakan prioritas load dan preload source utama.
- Pastikan CSS tidak memaksa render lebih besar dari variant terpilih.

Video:
- Default tampil poster tajam.
- `preload="metadata"`, bukan `auto`.
- Autoplay hanya bila `muted` dan memang diperlukan UX.
- Lazy-load video saat masuk viewport/interaksi.

## 7) CMS Guardrails
Validasi minimum sebelum publish:
- Hero image min width: `1600px`.
- Product detail image min width: `1200px`.
- Video min height: `720px`.

Validasi tambahan:
- Tolak file rusak/MIME mismatch.
- Warning bila aspect ratio tidak sesuai slot (mis. hero terlalu portrait).
- Tampilkan preview crop mobile sebelum save.

## 8) Caching and Versioning
- Filename berbasis hash konten (content hash) untuk cache busting.
- Header static media: `Cache-Control: public, max-age=31536000, immutable`.
- Manifest/API response dapat memakai ETag.
- Hindari URL tanpa versi untuk asset yang sering diganti.

## 9) Error Handling and Fallback
- Jika transform AVIF gagal: tetap simpan WebP/JPG dan tandai status degraded-ready.
- Jika video transcode gagal: fallback ke source original + poster, dengan alert ke admin.
- Logging wajib: upload source id, tahap gagal, reason, retry count.
- Retry policy untuk job processor (mis. 3x exponential backoff).

## 10) Testing Strategy
Functional:
- Upload image/video valid menghasilkan semua variant target.
- Upload file di bawah minimum resolution ditolak.

Visual QA:
- Cek hero/product di 2 device mobile nyata + 1 desktop.
- Bandingkan ketajaman terhadap baseline lama.

Performance:
- Uji page weight sebelum/sesudah.
- Pantau LCP image pada halaman utama dan product detail.

Regression:
- Existing CMS entry lama tetap bisa dirender lewat fallback logic.

## 11) Rollout Plan (Incremental)
1. Implement image pipeline dulu (lebih cepat impact).
2. Aktifkan srcset/sizes di storefront.
3. Tambahkan guardrails CMS.
4. Lanjut video pipeline + poster.
5. Monitoring 1-2 minggu, tuning quality/bitrate berdasarkan data nyata.

## 12) Key Decisions (Locked)
- Deployment tetap self-hosted (tidak migrasi CDN eksternal pada fase ini).
- Prioritas device: mobile.
- Target: seimbang kualitas dan performa.
- Multi-variant + modern format sebagai default strategy.
