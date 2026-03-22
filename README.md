<div align="center">

# 🎓 BelajarAI

**Belajar Lebih Cepat dengan AI**

Platform pembelajaran berbasis AI yang mengubah dokumen dan video YouTube menjadi ringkasan terstruktur, poin-poin penting, FAQ, dan langkah selanjutnya — sehingga kamu bisa belajar lebih efisien.

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## 📖 Deskripsi

**BelajarAI** adalah platform pembelajaran full-stack yang memanfaatkan kecerdasan buatan (AI) untuk membantu pengguna memahami materi dari berbagai sumber dengan lebih cepat. Pengguna dapat mengunggah dokumen (PDF, DOCX, TXT, Markdown) atau menempelkan link YouTube, lalu AI akan secara otomatis menghasilkan:

- **Ringkasan 1 Menit** — Poin inti untuk pemahaman cepat
- **Ringkasan 5 Menit** — Penjelasan detail dengan contoh
- **Ringkasan Lengkap** — Cakupan menyeluruh dengan heading terstruktur
- **Poin Penting, Istilah, FAQ, dan Langkah Selanjutnya**

Project ini dibangun dengan arsitektur **MVC (Model-View-Controller)** menggunakan Next.js App Router:

| Layer | Implementasi |
|-------|-------------|
| **Model** | Supabase PostgreSQL + TypeScript types (`src/types/`) + Database schema (`supabase/schema.sql`) |
| **View** | React Server Components + Client Components (`src/app/`, `src/components/`) |
| **Controller** | API Routes (`src/app/api/`) + Server Actions (`src/lib/services/`) + Middleware (`src/middleware.ts`) |

---

## ✨ Fitur Utama

### 📊 Dashboard
Halaman utama yang menampilkan statistik pembelajaran secara keseluruhan: total materi, jumlah ringkasan AI, materi yang sudah selesai, dan bookmark. Dilengkapi progress bar, quick actions, dan daftar materi terbaru.

### 📚 Manajemen Materi
Browse semua materi dalam tampilan grid atau list. Mendukung pencarian teks, filter berdasarkan sumber (dokumen/YouTube), filter favorit, serta pengurutan. Setiap kartu materi menampilkan badge sumber, status progress, ringkasan singkat, tag, dan estimasi waktu baca.

### 📄 Upload Dokumen
Antarmuka drag-and-drop untuk mengunggah file dokumen. Mendukung format **PDF**, **DOCX**, **TXT**, dan **Markdown** dengan batas ukuran 10MB per file. File disimpan di Supabase Storage, lalu teks diekstrak untuk diproses AI.

### 🎬 Integrasi YouTube
Tempelkan URL video YouTube dan sistem akan otomatis mengambil metadata video (judul, thumbnail) serta transcript/subtitle untuk diproses menjadi ringkasan AI.

### 🤖 Ringkasan AI Multi-Format
Engine AI menggunakan **OpenAI GPT-4o-mini** untuk menghasilkan ringkasan dalam tiga tingkat kedalaman (1 menit, 5 menit, lengkap), dilengkapi poin penting, istilah penting dengan definisi, FAQ, kesimpulan, dan rekomendasi langkah selanjutnya. Semua output dihasilkan dalam **Bahasa Indonesia**.

### 🔖 Bookmark & Catatan
Tandai materi favorit dengan bookmark dan buat catatan pribadi pada setiap materi. Catatan mendukung mode view dan edit dengan fitur simpan/batal.

### 📈 Tracking Progress
Lacak status pembelajaran setiap materi (`Belum Dibaca`, `Sedang Dipelajari`, `Selesai`) dengan badge visual dan perhitungan persentase keseluruhan di dashboard.

### 🌗 Dark/Light Mode
Dukungan tema gelap dan terang dengan deteksi preferensi sistem otomatis.

---

## 🛠️ Teknologi

### Framework & Runtime
| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| [Next.js](https://nextjs.org/) | 15.1 | App Router, React Server Components, API Routes |
| [React](https://react.dev/) | 19 | UI library dengan hooks dan server components |
| [TypeScript](https://www.typescriptlang.org/) | 5.7 | Static typing dengan strict mode |

### Database & Autentikasi
| Teknologi | Keterangan |
|-----------|------------|
| [Supabase](https://supabase.com/) | PostgreSQL database, Auth, Storage, Row Level Security (RLS) |
| [@supabase/ssr](https://github.com/supabase/auth-helpers) | SSR authentication dengan cookie-based session |

### AI & Ekstraksi
| Teknologi | Keterangan |
|-----------|------------|
| [OpenAI API](https://openai.com/) | GPT-4o-mini untuk summarization (JSON mode, temperature 0.3) |
| YouTube oEmbed API | Metadata video tanpa API key |

### UI & Styling
| Teknologi | Keterangan |
|-----------|------------|
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework |
| [shadcn/ui](https://ui.shadcn.com/) | Komponen UI (New York style) berbasis Radix UI |
| [Radix UI](https://www.radix-ui.com/) | Headless UI primitives (Dialog, Tabs, Tooltip, dll.) |
| [Lucide React](https://lucide.dev/) | Icon library |
| [next-themes](https://github.com/pacocoursey/next-themes) | Dark/light mode |
| [react-dropzone](https://react-dropzone.js.org/) | Drag-and-drop file upload |

---

## 📁 Struktur Project (MVC)

```
belajarAI/
├── supabase/
│   └── schema.sql              # [Model] Database schema & RLS policies
├── src/
│   ├── types/
│   │   └── index.ts            # [Model] TypeScript interfaces & types
│   ├── lib/
│   │   ├── supabase/           # [Model] Database client (server, client, middleware)
│   │   ├── ai/
│   │   │   ├── prompts.ts      # [Controller] AI system prompts
│   │   │   └── summarizer.ts   # [Controller] OpenAI summarization logic
│   │   ├── extract/
│   │   │   ├── document.ts     # [Controller] Document text extraction
│   │   │   └── youtube.ts      # [Controller] YouTube metadata & transcript
│   │   ├── services/
│   │   │   └── materials.ts    # [Controller] Server actions (data fetching)
│   │   └── utils.ts            # Utility functions
│   ├── app/
│   │   ├── api/
│   │   │   ├── upload/route.ts     # [Controller] POST /api/upload
│   │   │   ├── youtube/route.ts    # [Controller] POST /api/youtube
│   │   │   └── summarize/route.ts  # [Controller] POST /api/summarize
│   │   ├── (app)/
│   │   │   ├── layout.tsx          # [View] App shell (sidebar + header)
│   │   │   ├── dashboard/page.tsx  # [View] Dashboard page
│   │   │   ├── materials/page.tsx  # [View] Materials list page
│   │   │   ├── materials/[id]/     # [View] Material detail page
│   │   │   ├── upload/page.tsx     # [View] Upload page
│   │   │   ├── youtube/page.tsx    # [View] YouTube input page
│   │   │   └── bookmarks/page.tsx  # [View] Bookmarks page
│   │   ├── layout.tsx              # [View] Root layout (theme, fonts)
│   │   └── middleware.ts           # [Controller] Auth session refresh
│   └── components/
│       ├── layout/                 # [View] Sidebar, Header
│       ├── dashboard/              # [View] StatsCard
│       ├── materials/              # [View] MaterialCard, SearchFilterBar, SummaryTabs
│       ├── upload/                 # [View] DocumentUpload, YouTubeInput
│       ├── shared/                 # [View] EmptyState, LoadingState, NoteEditor, dll.
│       └── ui/                     # [View] shadcn/ui base components
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## ⚙️ Instalasi

### Prasyarat

- **Node.js** >= 18.x
- **npm** >= 9.x (atau yarn/pnpm)
- Akun **[Supabase](https://supabase.com/)** (free tier tersedia)
- **OpenAI API Key** ([dapatkan di sini](https://platform.openai.com/api-keys))

### Langkah-langkah

1. **Clone repository**

   ```bash
   git clone https://github.com/username/belajarAI.git
   cd belajarAI
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup Supabase**

   - Buat project baru di [Supabase Dashboard](https://app.supabase.com/)
   - Jalankan SQL di `supabase/schema.sql` pada SQL Editor untuk membuat tabel, enum, index, dan RLS policies
   - Salin **Project URL** dan **Anon Key** dari Settings > API

4. **Konfigurasi environment variables**

   Buat file `.env.local` di root project:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   OPENAI_API_KEY=sk-your-openai-api-key
   ```

5. **Jalankan development server**

   ```bash
   npm run dev
   ```

   Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 🚀 Menjalankan Project

| Perintah | Keterangan |
|----------|------------|
| `npm run dev` | Jalankan development server (hot reload) |
| `npm run build` | Build production |
| `npm run start` | Jalankan production server |
| `npm run lint` | Jalankan ESLint untuk cek kualitas kode |

---

## 🔄 Flow Sistem

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                           │
│  Dashboard │ Materials │ Upload │ YouTube │ Bookmarks           │
└──────┬──────────┬──────────┬──────────┬──────────┬──────────────┘
       │          │          │          │          │
       ▼          ▼          ▼          ▼          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CONTROLLER LAYER                            │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐     │
│  │ API Routes   │  │ Server       │  │ Middleware         │     │
│  │ /api/upload  │  │ Actions      │  │ (Auth Session      │     │
│  │ /api/youtube │  │ getMaterials │  │  Refresh)          │     │
│  │ /api/summary │  │ getStats     │  │                    │     │
│  └──────┬───────┘  └──────┬───────┘  └────────────────────┘     │
│         │                 │                                      │
│  ┌──────▼─────────────────▼───────────────────────────────┐     │
│  │              AI & Extraction Engine                     │     │
│  │  ┌─────────────┐  ┌────────────┐  ┌─────────────────┐ │     │
│  │  │ Summarizer  │  │ Document   │  │ YouTube         │ │     │
│  │  │ (GPT-4o-    │  │ Extractor  │  │ Extractor       │ │     │
│  │  │  mini)      │  │ (PDF/DOCX/ │  │ (Metadata +     │ │     │
│  │  │             │  │  TXT/MD)   │  │  Transcript)    │ │     │
│  │  └─────────────┘  └────────────┘  └─────────────────┘ │     │
│  └────────────────────────────────────────────────────────┘     │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        MODEL LAYER                              │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   Supabase (PostgreSQL)                   │   │
│  │                                                           │   │
│  │  profiles ──┐                                             │   │
│  │             ├── materials ──┬── summaries                 │   │
│  │             │               ├── progress                  │   │
│  │             │               ├── bookmarks                 │   │
│  │             │               ├── notes                     │   │
│  │             │               └── material_tags ── tags     │   │
│  │             │                                             │   │
│  │  Auth ──────┘     Storage (Document Files)                │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Alur Utama

1. **Upload Dokumen** → User mengunggah file → `POST /api/upload` → File disimpan ke Supabase Storage → Record `materials` dibuat di database
2. **Input YouTube** → User menempelkan URL → `POST /api/youtube` → Ambil metadata & transcript → Record `materials` dibuat
3. **Summarization** → Trigger `POST /api/summarize` → AI (GPT-4o-mini) memproses konten → Output JSON terstruktur → Disimpan ke tabel `summaries`
4. **Browse & Belajar** → Server action `getMaterials()` mengambil data dengan RLS → Tampilkan di grid/list → User membaca ringkasan via tab UI
5. **Interaksi** → User bisa bookmark, menulis catatan, dan mengupdate progress → Semua tersimpan dan sinkron

---

## 🗄️ Database Schema

| Tabel | Keterangan |
|-------|------------|
| `profiles` | Ekstensi data user (nama, avatar) |
| `materials` | Materi utama (judul, sumber, file, URL, thumbnail) |
| `summaries` | Ringkasan AI per materi (1-min, 5-min, full, key points, FAQ, dll.) |
| `progress` | Status belajar per user per materi (unread/in_progress/completed) |
| `bookmarks` | Penanda favorit per user per materi |
| `notes` | Catatan pribadi per user per materi |
| `tags` | Label/tag global untuk kategorisasi |
| `material_tags` | Relasi many-to-many antara materi dan tag |

Semua tabel dilindungi oleh **Row Level Security (RLS)** — user hanya dapat mengakses data miliknya sendiri.

---

## 📝 API Endpoints

| Endpoint | Method | Deskripsi | Auth |
|----------|--------|-----------|------|
| `/api/upload` | POST | Upload file dokumen dan buat record materi | ✅ Required |
| `/api/youtube` | POST | Proses URL YouTube, ambil metadata/transcript | ✅ Required |
| `/api/summarize` | POST | Generate ringkasan AI dari materi yang sudah ada | ✅ Required |

---

## 📄 Lisensi

Project ini dibuat untuk tujuan pembelajaran.

---

<div align="center">

**BelajarAI** — Belajar Lebih Cepat dengan AI 🚀

</div>
