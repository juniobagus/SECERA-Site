# Panduan Upload Asset CMS (Untuk Admin & Marketing)

## Tujuan
Menjaga gambar tetap tajam di storefront (terutama mobile) tanpa bikin halaman jadi berat.

## 1) Pilih Slot Upload yang Benar
Saat upload gambar, pilih slot sesuai posisi tampilnya:
1. `Hero 16:9` untuk banner utama.
2. `Product Detail` untuk foto utama detail produk.
3. `Product Listing` untuk kartu produk di halaman koleksi.
4. `Generic` untuk kebutuhan lain.

Kenapa ini penting: setiap slot punya standar kompresi dan ukuran file yang berbeda.

## 2) Batas Ukuran (Standar E-commerce)
1. Hero: target `700KB-900KB`.
2. Product Detail: target `250KB-500KB`.
3. Product Listing: target `80KB-250KB`.
4. Batas maksimum absolut sistem: `1MB`.

Catatan: sistem otomatis menyesuaikan kualitas/dimensi agar tetap tajam dalam batas ini.

## 3) Syarat File Sebelum Upload
1. Jangan pakai file dari WhatsApp atau screenshot ulang.
2. Gunakan file master/original dari tim desain/foto.
3. Minimum resolusi:
- Hero: minimal lebar `1600px`
- Product: minimal lebar `1200px`
4. Format yang disarankan: JPG/PNG berkualitas baik.

## 4) Langkah Upload
1. Buka halaman CMS yang mau diubah.
2. Pilih slot upload yang sesuai.
3. Upload file master.
4. Tunggu status selesai diproses.
5. Preview di tampilan mobile.
6. Jika sudah sesuai, klik Publish.

## 5) Arti Status Sistem
1. `Processing`: sistem sedang membuat varian gambar otomatis.
2. `Ready`: gambar sudah lolos kualitas dan siap publish.
3. `Needs Review`: sistem tidak bisa mencapai target size tanpa menurunkan kualitas terlalu jauh.
4. `Failed`: upload gagal (format/rusak/error teknis).

## 6) Jika Muncul `Needs Review`
Lakukan ini:
1. Coba upload ulang dari source yang lebih tajam.
2. Coba crop ulang sesuai slot (terutama Hero 16:9).
3. Hindari file yang sudah pernah dikompres berulang.
4. Jika masih sama, kirim ke tim tech untuk pengecekan.

## 7) Checklist Sebelum Publish (Wajib)
1. Cek dari HP asli, bukan desktop saja.
2. Gambar hero tidak blur/pecah.
3. Foto produk di koleksi tetap tajam saat scroll.
4. Halaman tetap terasa cepat dibuka.

## 8) Do & Don't
Do:
1. Simpan file master campaign di folder terstruktur.
2. Gunakan nama file rapi (contoh: `secera-lebaran-hero-01.jpg`).
3. Selalu cek preview mobile sebelum publish.

Don't:
1. Jangan publish saat status masih `Processing`.
2. Jangan pakai screenshot sebagai source final.
3. Jangan upload file yang sudah di-compress berkali-kali.

## 9) Kapan Hubungi Tim Tech
1. Status `Processing` lebih dari 10 menit.
2. `Failed` lebih dari 2 kali untuk file yang sama.
3. `Needs Review` terus muncul padahal source sudah high quality.
