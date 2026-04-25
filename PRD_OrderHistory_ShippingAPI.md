# PRD: User History & J&T Shipping Integration

## 1. Executive Summary
**Problem Statement:** Users currently cannot track their previous purchases or see accurate, real-time shipping costs during checkout, leading to friction in the purchasing decision and increased customer support load for status inquiries.
**Proposed Solution:** Implement a dual-mode user system (Account & Guest) with a **Login Modal** during checkout, and integrate **RajaOngkir Starter API** to provide automated J&T shipping rates at the city level.
**Success Criteria:**
- 100% accuracy in shipping cost calculation berdasarkan tarif J&T tingkat Kota.
- Pengalaman checkout yang mulus dengan Login Modal (tanpa pindah halaman).
- > 30% user memilih membuat akun untuk fitur tracking.

---

## 2. User Experience & Functionality

### User Personas
- **Registered User:** Ingin menyimpan data untuk checkout lebih cepat dan melihat riwayat lengkap.
- **Guest User:** Ingin belanja cepat tanpa buat akun, namun tetap bisa cek status pesanan terakhir.

### User Stories
- **Sebagai pembeli,** saya ingin bisa Login melalui **Pop-up/Modal** saat checkout agar proses belanja tidak terinterupsi.
- **Sebagai Guest,** saya ingin bisa mengecek status pesanan saya menggunakan Order ID dan nomor HP.
- **Sebagai Registered User,** saya ingin melihat daftar pesanan masa lalu dan status pengirimannya di halaman "My Orders".
- **Sebagai pembeli,** saya ingin ongkir J&T terhitung otomatis sesuai **Kota** saya agar tidak perlu menunggu konfirmasi admin.

### Acceptance Criteria
- **Sistem Akun:**
    - **Login/Register via Modal** di halaman Checkout.
    - Opsi "Lanjut sebagai Tamu" tetap tersedia.
    - Halaman profil/dashboard user untuk histori pesanan.
- **Histori Pesanan:**
    - Pesanan tersimpan di **MySQL Database** melalui API backend eksisting.
    - Status meliputi: `Menunggu Pembayaran`, `Diproses`, `Dikirim`, `Selesai`, `Dibatalkan`.
- **Integrasi Pengiriman:**
    - Integrasi **RajaOngkir Starter** (Kurir: J&T).
    - Dropdown lokasi terbatas pada **Provinsi -> Kota** (Sesuai limitasi versi Starter).
    - Update total harga otomatis di ringkasan checkout.

### Non-Goals
- Perhitungan tingkat Kecamatan (Membutuhkan RajaOngkir Pro).
- Generate resi/label pengiriman otomatis (Direncanakan untuk v1.1).
- Integrasi kurir selain J&T.

---

## 3. Technical Specifications

### Architecture Overview
- **Frontend:** React (Vite) storefront.
- **Backend/DB:** **MySQL** sebagai *primary database* (Eksisting).
- **API:** 
    - Internal API (Express/Node) untuk manajemen order dan autentikasi.
    - RajaOngkir Starter API untuk tarif ongkir.

### Integration Points
- **RajaOngkir Starter:** REST API call ke endpoint `/cost` dengan filter kurir `jnt`.
- **Custom Auth:** Implementasi API `/api/auth/login` dan `/api/auth/register` menggunakan MySQL.
- **Order Tracking:** Tabel `orders` akan dihubungkan dengan tabel `users` via `user_id`.

### Security & Privacy
- Password user wajib di-hash sebelum disimpan di MySQL (menggunakan `bcrypt` atau serupa).
- Lookup pesanan Guest wajib memasukkan Order ID DAN Nomor HP/Email.

---

## 4. Risks & Roadmap

### Phased Rollout
1. **MVP (v1.0):** Ongkir RajaOngkir (City level) & Login Modal.
2. **v1.1:** Upgrade ke RajaOngkir Pro (Kecamatan level) jika volume transaksi meningkat.
3. **v2.0:** Integrasi Payment Gateway (Midtrans/Xendit).

### Technical Risks
- **Akurasi Starter:** Ongkir mungkin sedikit meleset jika lokasi user berada di pinggiran kota yang memiliki tarif berbeda (karena limitasi City-level).
- **API Key Exposure:** Pastikan API Key RajaOngkir dipanggil melalui *proxy* atau *Edge Function* agar tidak terekspos di sisi klien.

---

## 5. Pertanyaan Kunci untuk Implementasi
1. **Edge Function:** Apakah kita akan menggunakan Supabase Edge Functions untuk menjembatani API RajaOngkir? (Sangat disarankan untuk keamanan API Key).
2. **Guest Tracking:** Apakah Guest perlu fitur "Cek Status" di menu navigasi utama?
