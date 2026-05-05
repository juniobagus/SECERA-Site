# Implementation Plan - CMS Media Quality Workflow

Reference design:
- `docs/superpowers/specs/2026-05-05-cms-media-quality-workflow-design.md`

## Phase 0 - Baseline and Instrumentation
1. Audit current upload endpoints and media storage paths (`server/index.js`, related handlers).
2. Tambahkan logging terstruktur untuk upload event (assetId, MIME, size, dimensions, process stage).
3. Definisikan metric baseline:
- Home LCP image (mobile)
- Product detail image bytes
- Video first frame time

Deliverables:
- Baseline report markdown.
- Logger fields documented.

## Phase 1 - Image Processing Pipeline
1. Tambahkan module processor image (disarankan service terpisah `server/services/mediaProcessor.js`).
2. Saat upload image:
- Simpan original
- Generate variant widths: 480/768/1080/1440/2000
- Generate format: AVIF + WebP (+ JPEG fallback opsional)
3. Simpan metadata manifest per asset:
- id, original path/url, variants, width/height, bytes, mime, status
4. Return status `processing` lalu update ke `ready` saat selesai.

Acceptance criteria:
- 1 upload image menghasilkan seluruh varian target.
- Tidak ada upscaling jika source lebih kecil.

## Phase 2 - Storefront Responsive Delivery
1. Update komponen image utama (Home hero, Shop hero, Product detail gallery) untuk konsumsi manifest variant.
2. Implement `srcset` + `sizes` mobile-first.
3. Tambahkan logic priority/preload hanya untuk hero image LCP.
4. Pastikan fallback ke original image untuk data lama.

Acceptance criteria:
- Mobile tidak lagi download image oversized.
- Tampilan tetap tajam pada DPR tinggi.

## Phase 3 - CMS Guardrails
1. Tambahkan validasi upload:
- Hero min 1600px width
- Product min 1200px width
- Video min 720p
2. Tambahkan warning aspect ratio dan preview crop mobile.
3. Tambahkan pesan error yang bisa dipahami non-teknis.

Acceptance criteria:
- Asset kualitas rendah tidak bisa publish.
- Admin paham alasan penolakan upload.

## Phase 4 - Video Pipeline
1. Tambahkan transcode ke MP4 H.264 (720p + 1080p).
2. Generate poster image dari frame representatif.
3. Simpan variant video + poster ke manifest.
4. Storefront update:
- preload metadata
- default tampil poster
- lazy-load video di viewport/interaksi

Acceptance criteria:
- Video startup cepat di mobile.
- Poster tajam selalu muncul sebelum playback.

## Phase 5 - Caching, Reliability, and Rollout
1. Terapkan content-hash filename untuk derived assets.
2. Header cache immutable untuk static media.
3. Retry mechanism job processing (3x backoff).
4. Degraded mode jika salah satu format gagal (tetap serve format lain).
5. Rollout bertahap:
- 10% entry CMS
- 50%
- 100% setelah monitoring stabil

Acceptance criteria:
- Tidak ada regression signifikan.
- Error rate processing berada di batas aman yang disepakati.

## Test Plan
1. Unit test:
- dimension validator
- variant manifest builder
- srcset formatter
2. Integration test:
- upload -> process -> ready -> render
3. Manual QA:
- iPhone/Android real-device visual check
- jaringan 4G simulasi
4. Performance compare:
- before vs after untuk LCP dan page media bytes

## Risks and Mitigation
1. CPU spike saat transcode/resize.
- Mitigasi: queue + concurrency limit.
2. Disk growth cepat.
- Mitigasi: lifecycle policy dan cleanup orphan assets.
3. Broken link pada data legacy.
- Mitigasi: fallback ke original URL.

## Execution Order (Recommended)
1. Phase 0
2. Phase 1
3. Phase 2
4. Phase 3
5. Phase 4
6. Phase 5
