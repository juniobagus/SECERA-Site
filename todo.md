# SECERA Project Status (22 April 2026)

## 🔄 Backend Migration (PostgreSQL -> MySQL)
- [x] Create MySQL Schema DDL (`server/schema.sql`)
- [x] Initialize Express.js Backend (`server/`)
- [x] Build Core API Routes (Auth, Products, Categories)
- [x] Update Frontend API Utilities (`src/utils/api.ts`, `src/utils/auth.ts`)
- [ ] Set up MySQL locally and import schema
- [ ] Implement robust CSV Import logic for MySQL

## 🛠️ Products
- [x] Basic CRUD (Modified for MySQL)
- [ ] Product Promo setup
    - Add promo name, description, products, discount, start date, end date

## 📦 Orders
- [ ] CRUD Orders
- [ ] Order Status Update
- [ ] Payment Verification
- [ ] Finance Logic (HPP, Tax, etc.)

## 🔐 Auth (New Custom System)
- [x] Login
- [x] Register
- [x] Logout
- [ ] Forgot Password
    - [ ] Register 
    - [ ] Login 
    - [ ] Logout 
    - [ ] Change Password
    - [ ] Profile
- [ ] Add Admin Settings Page
- [ ] Review pages 

- Product data import from csv
- frontend editing with WYSIWYG editor
- settings in admin page (e.g whatsapp, account settings, etc)