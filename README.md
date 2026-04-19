# Notes App

Ini aplikasi catatan sederhana (CRUD) dengan login.

Stack:
- Frontend: React (Vite)
- Backend: Express
- Database: MySQL/MariaDB (XAMPP)

## Sebelum mulai

Pastikan sudah ada:
- Node.js
- npm
- XAMPP

Nyalakan MySQL dari XAMPP dulu.

## Konfigurasi

Isi backend env di `backend/.env`:

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3406
DB_USER=root
DB_PASSWORD=
DB_NAME=notes_app
```

Isi frontend env di `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Catatan: database dan tabel akan dibuat otomatis saat backend jalan.

Login demo backend (default):

```env
DEMO_LOGIN_EMAIL=tester@notes.local
DEMO_LOGIN_PASSWORD=12345678
```

Akun demo ini juga ditampilkan langsung di halaman login web, jadi tester tinggal pakai.

## Cara jalanin

Di root project:

```powershell
npm install
npm run dev
```

Kalau sukses:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Cara test cepat

1. Buka frontend.
2. Login pakai akun demo yang tampil di halaman.
3. Tambah catatan.
4. Edit catatan.
5. Hapus catatan.
6. Klik refresh, pastikan data masih sesuai.

## Cek API (opsional)

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/api/health" | ConvertTo-Json -Depth 5
$login = Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/auth/login" -ContentType "application/json" -Body '{"email":"tester@notes.local","password":"12345678"}'
$headers = @{ Authorization = "Bearer $($login.token)" }
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/api/notes" -Headers $headers | ConvertTo-Json -Depth 5
```

## Kalau ada error

- Jalankan command dari folder root project.
- Cek MySQL XAMPP masih aktif.
- Cek isi `backend/.env` dan `frontend/.env`.

## Stop aplikasi

Di terminal yang jalanin `npm run dev`, tekan Ctrl + C.
