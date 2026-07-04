# InvoiceGua

PWA invoice & penawaran untuk freelancer dan bisnis kecil Indonesia. Buat invoice profesional, export PDF, kirim via WhatsApp — semua tanpa server, semua tersimpan di browser.

---

## Fitur

- **Invoice & Penawaran** — buat, edit, hapus, filter status (draft / dikirim / lunas / belum lunas)
- **Konversi** — ubah penawaran jadi invoice dengan satu klik
- **PDF Export** — generate PDF via `@react-pdf/renderer`, download langsung
- **WhatsApp Share** — kirim ringkasan dokumen ke nomor HP klien via deeplink WA
- **Kalkulasi otomatis** — subtotal, diskon (persen atau nominal), PPN, uang muka (DP)
- **Manajemen Klien** — CRUD klien, snapshot data klien disimpan di dokumen
- **Template Layanan** — preset item yang bisa di-klik langsung ke form invoice
- **Dashboard** — revenue chart 6 bulan, stat cards, dokumen terbaru
- **Auth lokal** — register & login, password di-hash SHA-256 + salt via Web Crypto API, sesi 8 jam di `sessionStorage`
- **Backup & Restore** — export/import JSON, factory reset (tanpa hapus akun)
- **Dark mode** — toggle persist di `localStorage`
- **PWA** — installable, offline-ready via Workbox

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 18 + Vite 6 |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 |
| Routing | React Router v6 |
| State | Zustand |
| Database | Dexie (IndexedDB) |
| PDF | @react-pdf/renderer |
| Animasi | Framer Motion |
| Icons | @tabler/icons-react |
| Chart | Chart.js + react-chartjs-2 |
| PWA | vite-plugin-pwa + Workbox |

---

## Struktur Project

```
src/
├── components/
│   ├── auth/          # AuthGuard, LoginPage, UserMenu
│   ├── client/        # ClientForm, ClientList, ClientSelector
│   ├── dashboard/     # MonthlyChart, RecentDocuments, StatCards
│   ├── document/      # DocumentForm, DocumentList, LineItemTable, TotalsSection, StatusUpdater
│   ├── layout/        # AppShell, Sidebar, BottomNav
│   ├── pdf/           # PDFTemplate (react-pdf), PDFPreview (HTML live preview)
│   ├── service/       # ServiceTemplateForm, ServiceTemplateList
│   └── ui/            # Button, Card, Modal, Toast, Skeleton, dll
├── db/
│   ├── database.ts    # Dexie schema (documents, clients, serviceTemplates, settings)
│   └── seeds.ts       # Default template layanan & settings
├── hooks/
│   ├── useDocuments.ts
│   ├── useClients.ts
│   ├── useServiceTemplates.ts
│   ├── useBusinessProfile.ts
│   ├── useDashboardStats.ts
│   └── useExport.ts   # Backup, restore, factory reset
├── lib/
│   ├── auth.ts        # Register, login, logout, changePassword
│   ├── crypto.ts      # SHA-256 + salt via Web Crypto API
│   ├── calculations.ts
│   ├── currency.ts    # Format IDR
│   ├── dateUtils.ts
│   ├── documentNumber.ts  # Auto-increment INV/QUO number
│   ├── pdfExport.ts   # Download PDF via @react-pdf/renderer
│   └── whatsapp.ts    # WA deeplink builder
├── pages/
│   ├── Dashboard.tsx
│   ├── InvoiceList.tsx / InvoiceCreate.tsx / InvoiceDetail.tsx
│   ├── QuoteList.tsx / QuoteCreate.tsx / QuoteDetail.tsx
│   ├── Clients.tsx
│   └── Settings.tsx
└── store/
    ├── useAppStore.ts   # Theme, toast
    └── useAuthStore.ts  # Session state
```

---

## Menjalankan Secara Lokal

### 1. Clone & install

```bash
git clone https://github.com/evanrasyidd/invoicegua.git
cd invoicegua
npm install
```

### 2. Setup environment

```bash
cp .env.example .env.local
```

Isi `.env.local` sesuai kebutuhan (lihat bagian [Environment Variables](#environment-variables)).

### 3. Jalankan dev server

```bash
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173).

### 4. Build production

```bash
npm run build
```

Preview hasil build:

```bash
npm run preview
# atau
npm start
```

---

## Environment Variables

Semua env var wajib diawali `VITE_` agar bisa diakses di browser.

| Variable | Default | Keterangan |
|---|---|---|
| `VITE_DEMO_MODE` | `false` | Set `true` untuk disable registrasi akun baru. Berguna saat deploy publik. |

Salin `.env.example` ke `.env.local` untuk development lokal. Jangan commit `.env.local` ke git — sudah ada di `.gitignore`.

Untuk Vercel, set env var via dashboard: **Settings → Environment Variables**.

---

## Deploy ke Vercel

### Via GitHub (recommended)

1. Push repo ke GitHub
2. Import project di [vercel.com](https://vercel.com/new)
3. Vercel otomatis detect Vite — tidak perlu konfigurasi tambahan
4. Set `VITE_DEMO_MODE=true` di Vercel Environment Variables kalau mau disable registrasi publik
5. Deploy

`vercel.json` sudah dikonfigurasi dengan:
- SPA rewrite (semua route ke `index.html`)
- Security headers: `X-Frame-Options`, `X-Content-Type-Options`, `CSP`, `Referrer-Policy`, `Permissions-Policy`
- Cache immutable untuk static assets

### Via Vercel CLI

```bash
npm install -g vercel
vercel
```

---

## Auth & Keamanan

Karena ini PWA client-side (tidak ada server), auth menggunakan pendekatan lokal:

- **Password** — di-hash dengan SHA-256 + random 16-byte salt via browser-native **Web Crypto API**. Tidak ada dependency eksternal.
- **Session** — disimpan di `sessionStorage` dengan expiry 8 jam. Auto-clear saat browser ditutup.
- **Data auth** — disimpan di IndexedDB dengan prefix `auth:user:*`. Tidak pernah masuk ke file backup JSON.
- **Route protection** — semua halaman di-wrap `AuthGuard`. Redirect ke `/login` kalau session tidak valid atau expired.

> Catatan: Karena data tersimpan per-browser (IndexedDB), setiap device/browser membutuhkan akun sendiri. Tidak ada sinkronisasi antar device — ini by design untuk MVP.

---

## Data & Privacy

- Semua data (invoice, klien, pengaturan) tersimpan **100% di browser** via IndexedDB.
- Tidak ada data yang dikirim ke server manapun.
- Backup data bisa di-export ke file JSON kapan saja via menu **Setelan → Backup & Restore**.
- Factory reset menghapus semua data kecuali akun login.

---

## Scripts

| Command | Keterangan |
|---|---|
| `npm run dev` | Jalankan dev server (hot reload) |
| `npm run build` | Build production (`tsc -b && vite build`) |
| `npm run preview` | Preview hasil build secara lokal |
| `npm start` | Alias untuk `npm run preview` |
| `npm run lint` | Jalankan ESLint |

---

## Author

**Evan Rasyid Ega Pratama**
GitHub & Instagram: [@evanrasyidd](https://github.com/evanrasyidd)
Brand: EgaxDev Studios
