# Berkas Kasus: ilhamzik — project notes

Portofolio interaktif bergaya koran vintage detektif untuk Muhammad Ilham Zikri
("ilhamzik"). Lihat [README.md](README.md) untuk cara menjalankan proyek dan
mengisi konten.

## Arahan kreatif yang sudah disepakati

- Stack: Vite + React + TS + Tailwind + Framer Motion (versi di-pin ke
  vite@5.4.x / react@18.3.x — jangan biarkan `npm create vite` menarik versi
  terbaru begitu saja, versi 8/rolldown belum kompatibel dengan Node yang
  terpasang di mesin ini).
- Semua konten biografi ada di [src/data/content.ts](src/data/content.ts),
  bilingual (`{id, en}`), komponen tidak perlu diubah untuk update teks.
- Semua ikon adalah SVG buatan tangan ([src/components/icons](src/components/icons)) — tidak ada aset gambar eksternal kecuali foto asli.
- Interaktivitas level "sedang": klik → popup case file, hover magnifier
  cursor, tanpa gamifikasi berat (tidak ada progress meter / sound / night
  mode) — ini keputusan sadar, bukan keterbatasan teknis.
- **Narasi playful "mafia boss diburu detektif"**: user (subjek situs) ingin
  dirinya digambarkan seolah bos besar yang sedang dicari-cari si detektif —
  lucu, bukan seram. Elemen "WANTED poster" di hero
  ([WantedPoster.tsx](src/components/sections/WantedPoster.tsx)) pakai foto
  mugshot dengan background diganti jadi papan ukur tinggi ala kepolisian
  (`src/assets/photos/ilham-mugshot.png`, di-generate lewat compositing
  canvas — chroma-key + backdrop baru, bukan foto asli yang diedit manual).
  Nada harus tetap ringan: "diduga jadi dalang proyek data", bukan tuduhan
  kriminal sungguhan. Pertahankan nada ini kalau menambah copy baru.

## Arsitektur peta pannable (2026-08-30, iterasi kedua)

Situs ini BUKAN lagi halaman scroll vertikal biasa. Sekarang seluruh koran
adalah satu "world" besar (3150×3300px, lihat
[mapLayout.ts](src/components/map/mapLayout.ts)) yang digeser (drag/pan)
seperti peta game, dikelola lewat [MapContext.tsx](src/context/MapContext.tsx)
+ [usePannableCanvas.ts](src/hooks/usePannableCanvas.ts). Landing pertama
selalu align ke node "home" (Masthead + WantedPoster) lewat `alignTopOn`,
bukan `recenterOn` biasa (karena home ada di tepi atas world, center biasa
menyisakan area kosong).

**Gotcha penting**: pointer handler pan di viewport HARUS skip
`setPointerCapture` kalau target-nya di dalam elemen interaktif
(`button`/`a`), kalau tidak, klik semua evidence item/sticky note akan
tertelan diam-diam (pointer capture me-redirect pointerup ke viewport,
sehingga event `click` browser tidak pernah sampai ke tombol aslinya). Sudah
difix di `onPointerDown` — jangan hilangkan guard itu kalau refactor hook ini.

Setiap section (`EducationSection`, dll.) sekarang juga punya `article`
(paragraf narasi ala berita, lihat `articles` di `content.ts`, drop-cap lewat
`LeadParagraph`) dan opsional `note` (sticky-note post-it kecil via
`stickyNotes` di `content.ts`, komponen `StickyNote.tsx`) yang menempel di
pojok section dan bisa diklik seperti evidence item biasa. Benang merah lintas
section digambar oleh `RedString.tsx` mengikuti urutan `STRING_PATH` di
`mapLayout.ts`.

**Gaya penulisan**: user eksplisit minta TIDAK ADA em dash (—) di narasi
manapun ("kayak AI generated"). Semua string di `content.ts`/`App.tsx` sudah
dibersihkan, pakai koma/titik/titik dua sebagai gantinya. En-dash di rentang
tanggal (`Feb–Jun`, `Jul 2026 – Sekarang`) TETAP dipakai karena itu konvensi
angka biasa, bukan gaya prosa. Pertahankan aturan ini untuk narasi baru.

## Ide brainstorming awal — status implementasi (update 2026-08-30, iterasi ketiga)

**Section koran tambahan — semua ✅ sudah ada:**
- "Case Files"/papan kasus untuk experience: corkboard + benang merah lokal ([ExperienceSection.tsx](src/components/sections/ExperienceSection.tsx))
- "Exhibit Room" untuk projects, klik → modal berisi narasi + tech stack pills ("laporan forensik")
- "Fingerprint Files" untuk skills: level penguasaan = **kejelasan sidik jari** (opacity/stroke makin tajam sesuai proficiency, bukan dot generik lagi — lihat `FingerprintIcon` di [icons/index.tsx](src/components/icons/index.tsx))
- "Classifieds/Wanted" untuk kontak: iklan baris "DICARI: kolaborator" ✅ + Tip Line ✅ + amplop tersegel untuk unduh CV ✅
- "Press Credits" footer: "* * * End of Report * * *" + byline "Dilaporkan oleh redaksi ilhamzik" + tanggal terbit (`pressCredits` di content.ts)

**Barang bukti & mekanik — status:**
- ✅ Polaroid + paperclip (`PolaroidPhoto.tsx`, prop `clipped`)
- ✅ Stempel karet dengan animasi "digebrak" (`animate-stampIn`, dipakai untuk LULUS/AKTIF/BURON/KASUS DITUTUP)
- ✅ Teks redaksi hover/klik-to-reveal (`RedactedText.tsx`, dipakai di sticky note rahasia Telkom)
- ✅ Amplop tersegel dengan animasi buka (`SealedEnvelope.tsx`, dipakai untuk unduh CV)
- ✅ Kursor kaca pembesar custom (bukan `zoom-in` browser bawaan lagi — SVG inline di `.magnifier-cursor`, index.css)
- ✅ Meter "Case Completion" (`X/27`, pojok kanan atas via `CaseFileContext`) + overlay "KASUS DITUTUP" saat 100%
- ✅ Maskot detektif kecil dengan speech-bubble hint kontekstual (`DetectiveGuide.tsx`, hint berubah sesuai progress)
- ✅ Noda kopi fisik di beberapa titik kosong map (`PaperDecor.tsx`) + tepi sobek di seluruh world (`torn-edge-top/bottom` pada World Canvas)
- ⬜ Tiket bioskop/boarding pass sobek — BELUM, perlu momen personal spesifik dari user dulu (jangan dikarang tanpa fakta).
- ✅ Mode "Night Shift": toggle 🔦 di HUD, overlay hitam nyaris penuh dengan lubang spotlight yang ngikutin kursor (`NightShiftContext.tsx` + `NightShiftOverlay.tsx`). Posisi kursor di-track imperatif via `style.setProperty` (bukan React state) supaya tetap 60fps, overlay `pointer-events-none` jadi drag/klik evidence tetap jalan normal di baliknya.
- ⬜ Sound design (gemerisik kertas, bunyi stamp) — belum, perlu toggle mute + aset audio.
- ⬜ Easter egg tersembunyi spesifik (klik kaca pembesar 3x, dst).
- ⬜ Testimoni/rekomendasi sebagai "witness statement" — perlu testimoni asli dari user.
- ⬜ GitHub activity sebagai "Surveillance Log" — perlu keputusan soal fetch GitHub API live atau statis.

Kalau user minta lanjut lagi, mulai dari daftar ⬜ di atas, jangan brainstorm ulang dari nol.

## Benang merah "agresif" (2026-08-30, iterasi keempat)

`RedString.tsx` sekarang menggambar dua lapis: `STRING_PATH` (trail utama,
stroke tebal 4px, opacity ~0.92) DAN `EXTRA_LINKS` di `mapLayout.ts` (koneksi
silang tambahan antar node yang nggak berurutan, stroke lebih tipis/transparan)
supaya papan investigasinya kelihatan lebih ramai/frantic, bukan cuma satu
garis lurus. Kalau nambah node baru ke peta, pertimbangkan juga nambah 1-2
extra link biar benangnya tetap ramai menyilang.

Case number sekarang **"NO. 007-ZIK"** (`profile.caseNumber` di content.ts) —
sudah otomatis kepakai di Masthead & WantedPoster, tidak ada tempat lain yang
hardcode nomor lama.

## ⚠️ Jangan taruh aset sumber di `dist/`

`dist/` adalah output build Vite — **dibersihkan total setiap kali `npm run
build` jalan**. User pernah taruh foto-foto asli di `dist/assets/assetss/`
(bukan salah user, dia cuma nunjukkan path yang ada), dan begitu build
dijalankan lagi, 2 file yang belum sempat diproses (`lizz.jpg`,
`wayne-rooney.avif`) hilang permanen. Kalau user kasih tahu ada file di dalam
`dist/` lagi, **langsung salin semuanya ke scratchpad DULU** sebelum
menyentuh `npm run build` apa pun, baru olah dari salinan itu. Aset sumber
yang benar selalu masuk ke `src/assets/photos/`.

## Foto asli — status per 2026-08-30

Sudah terpasang: lambang SDI PB Soedirman/SMPN 49/SMAN 39 (dipasang sebagai
`photoSrc` kartu pendidikan, muncul di polaroid modal), foto wisuda asli
(`ilham-wisuda.jpg`, gantikan `ilham.png` di kartu kuliah), foto di kantor
Telkom (`telkom.jpg`), foto tim kampanye BEM (`bem-campaign.jpg`), foto tim
Open House Fasilkom (`openhouse-fasilkom.jpg`), dan crest asli Manchester
United (`manutd-crest.svg`, real official crest — user eksplisit minta ini,
bukan ilustrasi custom `ClubBadgeIcon` yang sudah tidak dipakai lagi tapi
tetap ada di icons/index.tsx kalau suatu saat perlu fallback non-trademark).

Belum terpasang / hilang: foto Wayne Rooney dan foto Liz (IVE) — keduanya
sempat ada tapi hilang kena isu `dist/` di atas. Kedua file itu juga
kelihatannya foto pers/promosi yang di-download dari internet (bukan koleksi
pribadi user), jadi kalau user kirim ulang, ingatkan dulu soal risiko hak
cipta motret orang lain sebelum dipasang publik — sudah pernah diangkat ke
user, tinggal tunggu keputusannya.

Dua foto pengalaman (`bem-campaign.jpg`, `openhouse-fasilkom.jpg`) memuat
banyak wajah orang lain (teman satu tim) yang bukan user — sudah dipasang
karena user tampaknya oke, tapi belum ada konfirmasi eksplisit soal privasi
teman-temannya. Kalau user pernah komplain/minta blur/ganti, itu alasannya.

## Perf fix (2026-08-30): drag/klik kerasa berat

User laporan drag & klik nggak smooth. Tiga penyebab nyata yang sudah difix:
1. `onPointerMove`/`onWheel` di `usePannableCanvas.ts` dulu manggil `setOffset`
   di SETIAP raw event (bisa ratusan kali/detik), jauh lebih sering dari refresh
   rate layar. Sekarang di-throttle lewat `scheduleOffset` (rAF-batched, commit
   1 update per frame). Kalau nambah interaksi pointer baru di hook ini, pakai
   pola yang sama, jangan `setOffset` langsung dari raw event.
2. `RedString.tsx` sempat pakai `filter: drop-shadow(...)` di root `<svg>`
   yang membentang SELURUH world (3150×3750px) — SVG filter di area sebesar
   itu mahal untuk di-composite ulang. Sudah dihapus.
3. `manutd-crest.svg` yang user kasih adalah hasil trace Inkscape, 2.5MB
   walau keliatannya cuma logo simpel. Sudah di-rasterize sekali jadi
   `manutd-crest.png` (116KB, transparan, tampak identik di ukuran kecil
   yang dipakai). **Kalau user kasih SVG lain yang gede** (cek ukuran file,
   bukan cuma tampilan), rasterize dulu pakai pola yang sama sebelum dipakai
   sebagai `<img>` — jangan asumsikan SVG selalu ringan.

## Responsive HP/tablet (2026-08-30) + default bahasa Inggris

Default bahasa sekarang **English** (`LanguageContext.tsx` initial state `"en"`,
juga `index.html lang="en"`) — user eksplisit minta ini.

Sempat ketauan: di HP (viewport ~390px), semua node peta lebar tetapnya
600-1100px, jadi di scale 1 teks kepotong tiap baris (harus geser tiap
baca satu baris). Sudah difix di `usePannableCanvas.ts`:
- `getDefaultScale()` menghitung scale nyaman berdasar `viewportRef.current.clientWidth`
  (patokan lebar konten ideal ~900px) — dipakai sebagai default awal saat
  landing DAN tiap kali HUD navigasi (tombol home/quicknav) dipanggil tanpa
  parameter scale eksplisit. **Jangan hardcode `1`** lagi di pemanggilan
  `alignTopOn`/`recenterOn` dari HUD — biarkan optional supaya ikut
  responsif per device.
- **Pinch-to-zoom asli** (2 pointer) sudah diimplementasikan di hook yang
  sama (bukan cuma ctrl+wheel desktop) — pakai `pointers` Map + hitung jarak
  antar 2 titik sentuh, zoom-to-midpoint. Kalau refactor hook ini, jangan
  hilangkan logic multi-pointer-nya.
- `minScale` diturunkan ke 0.4 (dari 0.55) supaya `getDefaultScale()` di HP
  kecil nggak ke-clamp.
- `setPointerCapture` dibungkus try/catch — beberapa kombinasi
  browser/pointer-session bisa nolak capture; jangan biarkan itu bikin
  seluruh pan/pinch berhenti kerja.

Sudah dites end-to-end pakai Playwright device emulation (iPhone 13, iPad
Mini, Pixel 5) + simulasi pinch dua-pointer asli — semua jalan tanpa error.
Kalau user lapor masih ada yang aneh di device tertentu, mulai dari
`getDefaultScale()`'s baseline 900px — mungkin perlu tuning per breakpoint.

## Logo resmi di Fingerprint Files (2026-08-30)

Skill yang punya brand/produk nyata sekarang pakai logo resmi asli (bukan
ilustrasi generik) — diambil dari `devicons/devicon` (Python, Git, SQLite,
Scikit-Learn — warna asli multi-tone) dan `simple-icons` untuk Excel/Power BI
(produk Microsoft, tidak ada di devicon; SVG-nya monokrom by design jadi
warna resmi di-inject manual: Excel `#217346`, Power BI `#F2C811`). Disimpan
di `src/assets/logos/`, di-map lewat `SKILL_LOGOS` di `SkillsSection.tsx`.

**Sengaja TIDAK dikasih logo**: "Statistik & Machine Learning" dan "Data
Cleaning" — itu kategori skill umum, bukan brand/produk, jadi tidak ada
"logo resmi"-nya. Tetap pakai ilustrasi sidik jari (`FingerprintIcon`).
Kalau nanti ada skill baru yang juga cuma kategori umum, jangan dipaksa
carikan logo, ikuti pola yang sama (biarkan pakai fallback fingerprint).

"SQL" sendiri juga nggak punya logo resmi (itu bahasa/standar, bukan produk)
— dipakaikan logo SQLite karena itu database engine konkret yang dipakai di
salah satu proyek (`proj-ecommerce`), bukan klaim bahwa SQL = SQLite.

## Mobile/tablet: scroll view sendiri, BUKAN lagi Coming Soon gate (2026-09-02)

Sejarah: sempat di-gate ke `MobileComingSoon.tsx` setelah beberapa iterasi
optimasi peta pannable di HP nggak cukup. **Sekarang HP/tablet dapat render
tree terpisah**: `src/components/mobile/MobileView.tsx` — koran yang sama,
dibaca scroll atas-ke-bawah, tanpa pannable world / rAF loop / RedString
SVG sedunia / MapContext. `MobileComingSoon.tsx` sudah dihapus.

- Branch di `App.tsx`: `if (isMobileOrTablet && !isForceDesktop()) return <MobileView/>`.
- `useIsMobileOrTablet.ts` TIDAK diubah (masih regex UA + fallback touch-points).
- **Escape hatch**: tombol "Open desktop version" di footer mobile set
  `sessionStorage["ilhamzik:forceDesktop"]="1"` lalu reload — `App.tsx` baca
  lewat `isForceDesktop()` (`src/components/mobile/forceDesktop.ts`).
  Session-scoped sengaja, biar nggak permanen ngunci orang di view berat.
- **Section components di-reuse apa adanya** (`EducationSection` dst.,
  `Section.tsx`, `Masthead`, `WantedPoster`, `CaseFileModal`, `StickyNote`) —
  semuanya sudah responsif (`sm:` breakpoints) dan nggak pernah nyentuh
  `MapContext`. Jangan bikin versi mobile terpisah dari section-section ini.
- **Murah by design**: `LazySection.tsx` bungkus tiap section dengan
  `content-visibility:auto` + `contain-intrinsic-size` DAN gate mount-once
  via `IntersectionObserver` (`rootMargin: 1200px`, sekali `true` nggak
  balik `false` biar nggak scroll-jump). Off-screen section nggak pernah
  bikin instance Framer Motion-nya sampai di-scroll mendekat.
- HUD mobile (`MobileHud.tsx`) = satu `<header>` fixed: strip INDEX (anchor
  chip ke `#education` dst., label dari `NODE_LABELS`) + baris meter kasus +
  toggle EN/ID + 🔦. Kolom konten `pt-[92px]` buat clearance. Desktop `Hud.tsx`
  / `DetectiveGuide` / `PaperDecor` TIDAK dipakai di mobile.
- Night Shift mobile = `MobileNightShiftOverlay.tsx`, flat dark gradient
  doang (nggak ada spotlight ikut kursor — touch nggak punya kursor).
- Benang merah mobile = `StringGap` di `MobileView.tsx`: garis dashed
  vertikal + pushpin antar section. Bukan SVG sedunia.
- **JANGAN pakai `torn-edge-top/bottom` di kolom mobile** — polygon
  clip-path-nya di-tune buat world desktop yang lebar-pendek; di kolom
  ~390px lebar & ~10000px tinggi giginya membesar jadi paku hitam
  setinggi layar. Grain + gradient kertas sudah cukup buat nuansa vintage.
- Diverifikasi lewat CDP (`Emulation.setDeviceMetricsOverride` 390x844):
  build lolos, nol console error, 6 section mount pas di-scroll, escape
  hatch balik ke peta desktop. **Tes di HP fisik tetap tanggung jawab user**
  (Claude nggak bisa profil hardware mobile beneran).

Quirk kosmetik yang diketahui & sengaja dibiarkan: `Section.tsx` render
`note` (sticky note) pakai `absolute top-4 right-4` TAPI Tailwind naruh
`.relative` sesudah `.absolute` di stylesheet, jadi note-nya efektif
`position: relative` dan nyangkut di kiri-atas flow section, bukan nempel
pojok kanan. Di desktop nggak kentara (ruang lega); di kolom mobile agak
mepet kiri. Nggak difix karena plan-nya reuse section tanpa diubah —
kalau mau dibenerin, benerin di `Section.tsx` dan cek ulang desktop.

## Virtualization / lazy-mount section (2026-08-30, mobile perf lanjutan)

CSS-level fix (hapus blend-mode/blur/will-change, kompres gambar) ternyata
belum cukup — user masih lapor berat parah di HP asli. Root cause
sebenarnya: **semua 7 section (plus semua evidence item, foto, Framer Motion
instance di dalamnya) selalu ke-mount di DOM sejak awal**, terlepas dari
posisi pan. `overflow:hidden` di viewport cuma nyembunyiin secara visual,
browser tetap kerja keras buat semuanya.

Fix-nya di `MapNode.tsx`: setiap node sekarang cek posisinya sendiri
relatif ke area yang kelihatan di viewport (pakai `offset`/`scale` dari
`useMap()`), dengan buffer 650px world-space di tiap sisi. Kalau di luar
area itu, `children`-nya di-render `null` (dilepas total dari DOM, bukan
cuma `display:none`) — semua foto/animasi di dalamnya ikut lenyap dari
memory. Begitu digeser mendekat, otomatis mount lagi.

**Penting kalau nambah node baru ke map**: `MapNodeConfig` sekarang wajib
punya field `height` (perkiraan tinggi render, dibulatkan ke atas biar
nggak underestimate — nggak akan motong konten kalau meleset, cuma
mempengaruhi kapan node itu di-mount/unmount). Ukur beneran pakai teknik di
bawah (bukan nebak) kalau mau presisi, sama seperti waktu benerin WORLD_WIDTH/HEIGHT.

Efek samping yang diharapkan: kalau di-zoom out jauh (gampang di desktop),
banyak/semua node otomatis ke-mount lagi karena masuk area kelihatan +
buffer — jadi "lihat semua sekaligus" tetap bisa, cuma nggak lagi bawaan
default. Di HP ini nggak masalah karena zoom-out-jauh-buat-lihat-semua
bukan use case yang penting (teksnya bakal kekecilan buat dibaca).

## Nilai akademik dihapus dari narasi (2026-08-31)

User minta angka NEM (SD/SMP) dan cGPA (kuliah) dihapus semua dari
`content.ts` — cukup dinarasikan "deliver di akademisnya walaupun bukan
yang terbaik" tanpa angka konkret. Yang sudah dilakukan:
- `facts` array edu-sd/edu-smp/edu-kuliah sekarang cuma sisa "Lulus/Graduated
  [tahun]" — baris NEM dan cGPA dihapus total.
- Sticky note `stickyNotes.education` (dulu "note-nem", isinya ngomongin
  angka NEM) diganti jadi "note-grades" — tetap ada notenya, tapi isinya
  kualitatif ("nggak pernah juara umum, tapi juga nggak pernah remedial").
- Body teks edu-kuliah yang tadinya nyebut "cGPA-nya 3,34" ditulis ulang
  jadi "nilainya bukan yang paling mentereng, tapi solid" — tanpa angka.
- **Angka lain (jumlah data proyek, tanggal, statistik teknis proyek) TETAP
  ada** — itu beda kategori (fakta teknis proyek, bukan skor personal),
  jangan ikut dihapus kalau diminta hal serupa lagi.

Sekalian ketemu 2 bug bilingual yang sejenis (field bukan `Bilingual`
padahal isinya ada kata Indonesia) waktu ngerjain ini, langsung dibenerin:
- `ExperienceEntry.period` (types.ts) dari `string` jadi `Bilingual` — dulu
  versi EN tetap nampilin "Sekarang"/"Agu"/"Des" karena field-nya nggak
  pernah di-`t()`. Kalau nambah experience baru, WAJIB isi `period` sebagai
  `{id, en}`, bukan string polos.
- `CaseFile.stamp` (types.ts) dari `string` jadi `Bilingual` juga — stempel
  "LULUS"/"AKTIF" dulu nggak ikut translate ke "GRADUATED"/"ACTIVE" di mode
  EN. Sama, isi sebagai `{id, en}` kalau nambah stamp baru.
- `EducationEntry.years` masih `string` polos (ada "Lulus 2016" dst) TAPI
  field ini ternyata nggak dipakai/dirender di mana pun (dead field, info
  yang sama sudah ada di `facts`) — dibiarkan apa adanya, nggak perlu
  dibenerin kecuali suatu saat mulai dipakai di komponen.

## Catatan teknis penting lain
- `CaseFile` (types.ts) sekarang punya `techStack?` dan `redacted?` opsional di level base, dipakai `CaseFileModal.tsx` untuk render pill tech-stack dan `RedactedText`.
- `TOTAL_CASES` di `CaseFileContext.tsx` dihitung otomatis dari panjang array content (education+experience+projects+skills+interests+stickyNotes) — kalau nambah/kurang entri, angka meter ikut otomatis, tidak perlu update manual.
- `WORLD_HEIGHT` di mapLayout.ts sudah dinaikkan ke 3750 setelah ContactSection tumbuh (classified ad + amplop). Kalau nambah konten baru ke section manapun terutama yang paling bawah, cek dulu apakah perlu naikkan `WORLD_WIDTH`/`WORLD_HEIGHT` lagi supaya tidak kepotong torn-edge.

## Yang masih ditunggu dari user

Satu-satunya yang masih sengaja kosong di `content.ts`:
- Detail proyek-proyek di Telkom Indonesia (baru boleh ditambahkan belakangan, atas permintaan user sendiri — jangan tanyakan lagi sampai dia yang mengangkat topik ini).

Semua yang lain (nama sekolah SD/SMP/SMA, cerita masa sekolah, 2 minat tambahan di luar Man United) sudah lengkap per 2026-08-30.

Nomor telepon dari CV **sengaja tidak ditampilkan** di halaman kontak publik
(hanya ada di file CV yang diunduh) — keputusan privasi, bisa diubah kalau
user minta ditampilkan.
