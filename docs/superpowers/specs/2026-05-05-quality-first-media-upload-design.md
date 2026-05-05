# Quality-First Media Upload Design (Revised Cap by Slot)

## 1. Objective
Menghilangkan kasus gambar pecah setelah upload CMS, sambil tetap menjaga performa storefront mobile dengan standar e-commerce.

## 2. Locked Constraints
1. Mode: quality-first.
2. Hero rasio utama: 16:9.
3. Cap file **berbeda per slot** (bukan satu cap global).

## 3. Slot-Based Size Standard (Revised)
1. Hero/banner cap target: 700KB-900KB.
2. Product detail cap target: 250KB-500KB.
3. Product listing/card cap target: 80KB-250KB.
4. Hard stop absolute untuk image web: 1MB.

## 4. Recommended Processing Strategy
1. Simpan master upload (tidak dipakai langsung ke storefront).
2. Generate family variant per slot:
- Hero 16:9 (`1280x720`, `1920x1080`)
- Product square (`720`, `1080`, `1440`)
3. Terapkan quality ladder:
- Mulai quality tinggi
- Turunkan bertahap kecil sampai masuk cap slot
- Jika masih lewat cap, turunkan dimensi bertahap
- Jangan melewati quality floor (hindari pecah)
4. Jika tetap gagal memenuhi cap tanpa turun di bawah quality floor: status `Needs Review`.

## 5. Storefront Delivery Rules
1. Hero hanya konsumsi variant family hero.
2. Listing/detail hanya konsumsi variant family product.
3. `srcset` hanya berisi variant yang memang tersedia (hindari 404).
4. Larang upscaling via CSS/layout.

## 6. CMS Guardrails
1. Validasi minimal resolusi source per slot.
2. Tampilkan warning saat source berisiko pecah setelah kompresi.
3. Preview hasil akhir mobile sebelum publish.
4. Tampilkan status: `Processing`, `Ready`, `Needs Review`, `Failed`.

## 7. Fallback and Error Handling
1. Jika AVIF gagal, fallback ke WebP.
2. Jika semua hasil di bawah standar visual, jangan auto-publish.
3. Log detail proses: source size, quality step, dimension step, output size.

## 8. QA Checklist
1. Hero tetap tajam di mobile device nyata.
2. Product card tidak blur di scroll grid koleksi.
3. Product detail tetap menunjukkan tekstur bahan tanpa artifact berat.
4. Tidak ada 404 media dari `srcset`.

## 9. Rollout Plan
1. Aktifkan dulu pada hero koleksi.
2. Lanjut ke product listing/card.
3. Lanjut ke product detail dan seluruh CMS image field.
4. Monitor complaint visual + web vitals tiap tahap.

## 10. Success Metrics
1. Complaint "gambar pecah" turun signifikan.
2. 404 media request = 0.
3. Mayoritas asset memenuhi cap slot masing-masing.
4. Visual QA pass rate >=95%.
