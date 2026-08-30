# Berkas Kasus: ilhamzik

Portofolio interaktif bergaya koran vintage detektif. Dibangun dengan Vite + React + TypeScript + Tailwind + Framer Motion.

## Menjalankan secara lokal

```bash
npm install
npm run dev       # dev server, biasanya di http://localhost:5173
npm run build      # build production ke folder dist/
npm run preview    # preview hasil build
```

## Struktur proyek

```
src/
  data/content.ts        <- SEMUA teks & data biografi ada di sini (bilingual ID/EN)
  types.ts                 tipe data untuk CaseFile, Education, Experience, dst.
  context/
    LanguageContext.tsx    toggle bahasa ID/EN
    CaseFileContext.tsx    state modal "berkas kasus" yang sedang dibuka
  components/
    layout/                Masthead (headline koran), Section, LeadParagraph
    evidence/               EvidenceItem (item yang bisa diklik), CaseFileModal (popup detail),
                           PolaroidPhoto (foto asli atau placeholder)
    icons/                 semua ikon SVG dibuat manual (lencana, kartu pelajar, medali, dst.)
    sections/               satu file per bagian koran: Interests, Education, Experience,
                           Projects, Skills, Contact
  assets/photos/           taruh file foto asli di sini (lihat bagian "Mengisi konten" di bawah)
```

## Mengisi konten asli

Cukup edit **`src/data/content.ts`** — semua komponen sudah dihubungkan ke sana, jadi tidak perlu
menyentuh kode komponen sama sekali. Semua teks berbentuk `{ id: "...", en: "..." }` (Indonesia & Inggris).

Setiap teks yang masih berbentuk `[dalam kurung siku]` adalah placeholder yang perlu diganti.

### Menambahkan foto asli

1. Taruh file gambar di `src/assets/photos/` (misal `profil.jpg`, `ktm-sd.jpg`).
2. Di `content.ts`, import lalu pasang ke field `photoSrc` pada entry terkait, contoh:

   ```ts
   import fotoSD from "../assets/photos/ktm-sd.jpg";
   // ...
   { id: "edu-sd", ..., photoSrc: fotoSD }
   ```

3. Kalau `photoSrc` tidak diisi, otomatis tampil placeholder siluet "PHOTO PENDING" — jadi aman
   untuk dikerjakan bertahap.

## Menambah section/evidence baru

1. Tambahkan data baru (dengan tipe `CaseFile` yang sesuai) di `src/data/content.ts`.
2. Bungkus visualnya dengan komponen `<EvidenceItem caseFile={...}>` di section terkait —
   klik otomatis akan membuka `CaseFileModal` dengan data itu.
3. Kalau perlu ikon baru, tambahkan di `src/components/icons/index.tsx` mengikuti gaya SVG yang ada.
