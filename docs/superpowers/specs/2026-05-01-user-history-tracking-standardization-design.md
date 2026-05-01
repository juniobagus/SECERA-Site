# Spec: Indonesian Standardization, User History & Tracking

## 1. Goal Description
Meningkatkan profesionalitas dan pengalaman pasca-pembelian SECERA dengan menstandarisasi seluruh UI ke Bahasa Indonesia yang elegan, serta mengimplementasikan sistem Akun Pengguna untuk melihat riwayat pesanan dan pelacakan resi real-time.

---

## 2. User Review Required
> [!IMPORTANT]
> **Tone Bahasa**: Semua teks akan diubah menjadi Bahasa Indonesia formal-elegan (e.g., "Add to Cart" -> "Masukkan ke Keranjang", "Shop" -> "Koleksi").
> **Autentikasi**: Menggunakan sistem MySQL + JWT kustom. Data user akan disimpan secara lokal di database eksisting.

---

## 3. Proposed Changes

### A. Standardisasi Bahasa Indonesia
*   **Storefront**: Audit global pada `Navbar`, `Footer`, `Checkout`, `ProductDetail`, dan `CartDrawer`.
*   **Admin Panel**: Penyesuaian label menu dan tombol agar konsisten dalam Bahasa Indonesia.

### B. User Account System (Backend & Frontend)
#### [NEW] Database Schema (`schema.sql`)
*   **Tabel `users`**: `id`, `email`, `password_hash`, `name`, `phone`, `address`, `created_at`.
*   **Update Tabel `orders`**: Tambahkan kolom `user_id` (foreign key), `tracking_number` (string), dan `payment_proof_url` (string).

#### [NEW] Auth API (Backend)
*   `POST /api/auth/register`: Pendaftaran user baru.
*   `POST /api/auth/login`: Autentikasi dan pengiriman JWT.
*   `GET /api/auth/me`: Verifikasi session.

#### [NEW] Profile Page (`/profile`)
*   Menampilkan informasi akun dan daftar riwayat pesanan (`orders` yang difilter berdasarkan `user_id`).
*   Fitur "Claim Guest Order": Tombol untuk menghubungkan pesanan lama (guest) ke akun berdasarkan kecocokan Email/Nomor HP.

### C. Tracking & Payment Features
*   **Bukti Bayar**: Di halaman detail pesanan (User), tambahkan tombol "Unggah Bukti Pembayaran" yang menyimpan file ke server/cloud dan mengupdate `payment_proof_url`.
*   **Real-time Tracking**: 
    *   Implementasi `GET /api/shipping/track/:resi` di backend.
    *   Menghubungkan ke **RajaOngkir Waybill API** untuk mengambil data J&T secara real-time.
    *   Frontend menampilkan timeline status pengiriman yang elegan.

---

## 4. Verification Plan

### Automated Tests
*   `npm test`: Menjalankan unit test untuk logika i18n dan parsing data RajaOngkir.
*   Browser test: Memastikan login modal di checkout berfungsi dan tidak menginterupsi alur belanja.

### Manual Verification
*   Melakukan pendaftaran akun baru.
*   Membuat pesanan baru dan mengunggah bukti transfer.
*   Memasukkan nomor resi J&T di Admin dan memverifikasi status muncul di sisi User secara real-time.
