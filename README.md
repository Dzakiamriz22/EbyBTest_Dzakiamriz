# Notes App

Aplikasi catatan sederhana dengan fitur login dan CRUD notes.

## Tech Stack

- Frontend: React 19 + Vite 5
- Backend: Node.js + Express 5
- Database: MySQL/MariaDB (XAMPP)
- Driver DB: mysql2
- Utility: dotenv, cors, concurrently

## Persiapan

1. Pastikan sudah install Node.js, npm, dan XAMPP.
2. Nyalakan MySQL dari XAMPP.

## Konfigurasi Environment

### Backend

Buat atau isi file backend/.env:

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3406
DB_USER=root
DB_PASSWORD=
DB_NAME=notes_app
DEMO_LOGIN_EMAIL=tester@notes.local
DEMO_LOGIN_PASSWORD=12345678
```

Catatan: database dan tabel dibuat otomatis saat backend start.

### Frontend

Buat atau isi file frontend/.env:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_DEMO_EMAIL=tester@notes.local
VITE_DEMO_PASSWORD=12345678
```

## Cara Menjalankan

Jalankan dari root project:

```powershell
npm install
npm run dev
```

URL aplikasi:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Akun Login Demo

- Email: tester@notes.local
- Password: 12345678

## Cara Penggunaan Aplikasi

1. Buka halaman frontend.
2. Login menggunakan akun demo yang tampil di halaman.
3. Tambah catatan baru.
4. Edit catatan.
5. Hapus catatan.
6. Klik Refresh untuk cek data terbaru.

## Pengujian API Singkat

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/api/health"

$login = Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/auth/login" -ContentType "application/json" -Body '{"email":"tester@notes.local","password":"12345678"}'
$headers = @{ Authorization = "Bearer $($login.token)" }
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/api/notes" -Headers $headers
```

## Troubleshooting

- Jalankan command dari folder root project.
- Pastikan MySQL XAMPP aktif di port yang sesuai.
- Pastikan backend/.env dan frontend/.env sudah benar.
- Jika port sudah dipakai, stop proses lama lalu jalankan lagi npm run dev.

## Stop Aplikasi

Tekan Ctrl + C di terminal yang menjalankan npm run dev.
