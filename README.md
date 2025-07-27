# 📘 Article & PageView API

API ini menyediakan fitur manajemen artikel (draft & published), serta pencatatan dan agregasi page view. API dibangun menggunakan **Node.js**, **Express**, dan **MongoDB**.

## Fitur Utama

- Autentikasi JWT
- CRUD User
- CRUD Artikel (draft dan published)
- Pencatatan page view
- Agregasi page view berdasarkan waktu (hourly/daily/monthly)
- Dokumentasi Swagger & Postman
- Siap untuk deployment cloud & scale (stateless)

---

## 🚀 Instalasi & Menjalankan API

### 1. Clone Repo

```bash
git clone https://github.com/buyungalf/user-articles.git
cd user-articles

npm install
```

### 2. Buat File .env

```bash PORT=3000
MONGO_URI=mongodb://localhost:27017/user-articles
JWT_SECRET=supersecretkey
JWT_LIFETIME=30d
JWT_EXPIRES_IN=30d
PORT=3000
```

### 3. Menjalankan API

```bash
npm run dev
```

Gunakan npm start jika ingin menjalankan dalam mode production.

---

## Swagger (Auto-generated)

Setelah server dijalankan, buka:

```bash
http://localhost:3000/
```

## Postman Collection

Autentikasi
Gunakan header berikut untuk endpoint yang membutuhkan login:

```
Authorization: Bearer <your_token>
```

Token JWT bisa diperoleh dari endpoint login.

## Jalankan dengan Docker (Opsional)

```bash
docker build -t user-articles .
docker run -p 3000:3000 --env-file .env user-articles
```

## 🧾 Catatan Tambahan

API ini bersifat stateless, sehingga siap dijalankan di lingkungan multi-instance atau autoscale to 0.

#### Tidak menggunakan session, hanya JWT token.
