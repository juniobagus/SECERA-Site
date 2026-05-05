# Implementation Plan - Quality-First Media Upload (Slot-Based Caps)

Reference spec:
- `docs/superpowers/specs/2026-05-05-quality-first-media-upload-design.md`

## Goal
Menerapkan pipeline image CMS berbasis slot (hero/listing/detail) agar tetap tajam, sesuai batas ukuran e-commerce, dan bebas 404 `srcset`.

## Phase 1 - Upload Contract & Data Model
1. Extend response upload image supaya mengembalikan metadata berikut:
- `family` (`hero_16x9` | `product_square` | `generic`)
- `variants[]` (url, width, height, format, bytes, slot)
- `qualityReport` (startQuality, endQuality, dimensionSteps, finalBytes)
- `status` (`ready` | `needs_review`)
2. Tambahkan backward compatibility:
- `url` tetap ada untuk klien lama.
3. Tambahkan util tipe frontend untuk parse respons baru tanpa merusak data lama.

Acceptance:
- Endpoint lama tetap berfungsi.
- Payload baru tersedia untuk klien baru.

## Phase 2 - Slot-Based Processor Engine
1. Implement processor profile per slot:
- Hero: target 700KB-900KB, hard stop 1MB, ratio 16:9.
- Product detail: target 250KB-500KB.
- Product listing: target 80KB-250KB.
2. Implement quality ladder:
- Start quality tinggi.
- Step down kecil (mis. -3).
- Jika masih lewat cap, step down dimensi.
- Stop di quality floor.
3. Implement `needs_review` gate jika cap tidak bisa dicapai tanpa turun di bawah floor.

Acceptance:
- File akhir masuk rentang slot mayoritas kasus.
- Tidak ada output ekstrem kecil yang merusak kualitas.

## Phase 3 - CMS Guardrails
1. Tambahkan selector slot saat upload image di admin UI (`Hero`, `Product`, `Generic`).
2. Validasi minimum source resolution per slot.
3. Tampilkan pesan human-readable ketika `needs_review`.
4. Tampilkan ringkasan hasil kompresi (before/after size).

Acceptance:
- Admin paham alasan penolakan/review.
- Human error berkurang.

## Phase 4 - Storefront Consumption
1. Hero gunakan hanya family `hero_16x9`.
2. Product listing/detail gunakan family `product_square`.
3. `srcset` builder gunakan daftar `variants` nyata dari API (bukan inferensi filename).
4. Retain fallback ke URL tunggal untuk data legacy.

Acceptance:
- 404 image dari `srcset` = 0.
- Rendering tetap stabil untuk data lama.

## Phase 5 - QA, Metrics, and Rollout
1. QA visual mobile:
- Hero sharpness
- Listing clarity
- Detail texture fidelity
2. QA teknis:
- ukuran file slot sesuai target
- `needs_review` flow berjalan
3. Rollout bertahap:
- Stage A: hero koleksi
- Stage B: listing/card
- Stage C: detail + seluruh CMS image
4. Monitoring:
- complaint “pecah”
- request 404 media
- distribusi ukuran file per slot

Acceptance:
- pass rate visual >=95%
- 404 media = 0
- ukuran asset dominan dalam target slot

## Task Breakdown (Suggested Order)
1. Backend: refactor `server/routes/uploads.js` into service-level processor.
2. Backend: implement slot profiles + quality ladder + `needs_review`.
3. Frontend admin: tambah slot selector + upload result panel.
4. Frontend storefront: migrate to real `variants` array.
5. Regression test + rollout checklist.

## Risks and Mitigation
1. Risiko proses upload lebih lama.
- Mitigasi: progress state `processing` dan async job option bila perlu.
2. Risiko mismatch data legacy.
- Mitigasi: fallback parser + URL tunggal tetap didukung.
3. Risiko kualitas tidak konsisten antar konten.
- Mitigasi: tuning threshold berdasarkan hasil QA per campaign.
