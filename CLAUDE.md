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

Sudah terpasang (update 2026-09-07: + `tentang-kopi.jpg` di kartu Tentang
Kopi, + Makara UI di medali, + siluet Agent K di easter egg): lambang SDI PB
Soedirman/SMPN 49/SMAN 39 (dipasang sebagai
`photoSrc` kartu pendidikan, muncul di jendela foto kartu pelajar DAN di
polaroid modal), Makara UI (`ui.png` -> `ui-makara-engraved.png`, ter-struck
di medali kuliah, lihat sectionnya di bawah), foto wisuda asli
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

## Papan miniatur di kolom HP: `BoardMap` (2026-09-08)

Situs desktop ini satu world yang bisa diseret, dan itu SELURUH idenya.
Pengunjung HP dapat kolom bertumpuk, yang kebaca enak tapi nggak pernah
memberi tahu mereka bahwa yang sedang mereka scroll itu sebuah papan. Karena
mayoritas orang yang datang dari sebuah link itu pakai HP, gagasan inti situs
ini justru menjangkau bagian audiens yang paling kecil.

`src/components/mobile/BoardMap.tsx` menggambar seluruh papan dari atas, di
satu layar, memakai **koordinat yang sama** (`NODES`, `STRING_PATH`) yang
dipakai peta desktop. Tiap berkas adalah target sentuh yang melompat ke
sectionnya. Murah secara konstruksi: beberapa div plus satu SVG, nol gambar,
nol animasi. Panelnya `aspect-ratio` = `WORLD_WIDTH / WORLD_HEIGHT` jadi
proporsinya jujur, dan benangnya pakai `vectorEffect="non-scaling-stroke"`
supaya tetap setipis rambut walau viewBox-nya diperkecil 10x.

Terukur: panel 320x417, label 8px dengan kontras **12.34:1** (lolos WCAG AA
buat teks kecil), target sentuh terkecil 65px (anjuran 44px), tumpang-tindih
kartu terburuk 5% (home lawan experience, kebaca sebagai kertas bertumpuk).

**Kalau menggeser node di `NODES`, papan ini ikut berubah sendiri.** Nggak ada
koordinat yang diduplikasi. Yang perlu dicek ulang cuma dua: label masih muat
di kartu yang mengecil, dan tumpang-tindih antar kartu masih wajar.

## ⚠️ Anchor ke section di kolom HP: targetnya BERGERAK

Dua bug berturut-turut di sini, dua-duanya bikin navigasi HP nggak jalan.

**Pertama, targetnya nggak ada.** Chip INDEX dulu menunjuk `#<section-id>`,
tapi section baru dapat `id`-nya begitu `LazySection` mem-mount-nya, dan dari
posisi paling atas **nggak ada satu pun yang ter-mount** (hero-nya lebih
tinggi dari `rootMargin` 1200px). Terukur: nol dari enam target ada, nol yang
menggerakkan halaman. Sekarang tiap section punya anchor permanen
`nav-<id>` yang dirender di atasnya, terlepas dari status mount, dan itu yang
ditunjuk chip maupun `BoardMap`. Sengaja beda dari `id` section aslinya biar
nggak pernah bentrok waktu section-nya mount.

**Kedua, targetnya bergeser sambil dituju.** Lompatan anchor biasa mendarat
kependekan: section di atas target mount satu-satu selama perjalanan, tiap
satu menukar perkiraan tinggi dengan tinggi sebenarnya, jadi kolomnya
memanjang dan targetnya turun. Tap "Contact" dari atas mendarat **2700px
kependekan**, di tengah section projects, dan contact-nya sendiri belum
ter-mount. `jumpTo.ts` menyelesaikannya dengan mengejar: geser, tunggu
berhenti, kalau targetnya pindah geser lagi (maksimal 5 putaran, yang pertama
`smooth` sisanya `auto` biar nggak ada animasi kedua).

Verifikasinya: 6 section x 2 titik masuk (chip HUD dan kartu BoardMap) = 12
lompatan, semuanya harus mendarat dengan judul section **tepat 104px** dari
atas viewport (`HEADER_CLEARANCE`) dan section-nya ter-mount.

**Jangan ganti balik ke `<a href="#section">` polos.**

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
- Benang merah mobile = `MobileRedString.tsx`: SATU SVG sepanjang kolom,
  di-mount penuh dari awal (user minta seagresif desktop, benangnya harus
  nunjuk dari section ke section, bukan potongan per-celah). Statis, cuma
  stroke, tanpa filter/animasi, jadi murah walau tinggi ~10000px.
  Geometrinya diukur runtime dari anchor `[data-string-node]` (`StringNode`
  di `MobileView.tsx`, tiap anchor bawa `data-x` persen) lewat
  `ResizeObserver`, jadi benangnya nempel terus walau LazySection mount dan
  ngubah tinggi. **Bentuk segmennya penting**: turun lurus di gutter
  sepanjang section, baru menyeberang ke pin berikutnya di ~110px terakhir
  (area kosong di atas pin). Diagonal lurus antar-pin pernah dicoba dan
  hasilnya benang motong semua paragraf, susah dibaca. Lapisannya: benang
  utama tebal + 2 untai kendor offset (bundel 3 benang turun di gutter),
  plus "chaos layer" ~18 benang rambut yang ngiket tiap waypoint ke yang
  jaraknya 2/3/4/5 section, dengan ujung ter-jitter dan sedikit lengkung.
  Benang rambut inilah satu-satunya yang motong teks, dan user eksplisit
  bilang itu nggak ganggu bacaan (opacity 0.1-0.24, tebal 0.7-1.3px).
  Jitter-nya pakai PRNG deterministik dari indeks link, **bukan
  `Math.random()`** — kalau random beneran, tiap re-measure
  (ResizeObserver) benangnya bakal acak ulang dan kelihatan bergetar.
- **JANGAN pakai `torn-edge-top/bottom` di kolom mobile** — polygon
  clip-path-nya di-tune buat world desktop yang lebar-pendek; di kolom
  ~390px lebar & ~10000px tinggi giginya membesar jadi paku hitam
  setinggi layar. Grain + gradient kertas sudah cukup buat nuansa vintage.
- Diverifikasi lewat CDP (`Emulation.setDeviceMetricsOverride` 390x844):
  build lolos, nol console error, 6 section mount pas di-scroll, escape
  hatch balik ke peta desktop. **Tes di HP fisik tetap tanggung jawab user**
  (Claude nggak bisa profil hardware mobile beneran).

**Verifikasi WAJIB lewat `npm run preview`, bukan cuma `npm run dev`.**
Benang merah mobile sempat ke-ship dalam keadaan nggak kelihatan sama
sekali di produksi walau di dev kelihatan sempurna. Sebabnya:
`MobileRedString` baca ref ke div INDUKNYA, padahal React pasang ref
elemen host bottom-up di layout phase, jadi `useLayoutEffect` si anak
jalan sebelum ref induknya keisi, dapat `null`, lalu nyerah tanpa retry.
Di dev keliatan aman doang karena StrictMode manggil effect dua kali
(dev-only), panggilan kedua ref-nya sudah ada. Fix-nya: elemen kolom
disimpan di state lewat callback ref (`ref={setColumnEl}`) dan dioper ke
anak sebagai elemen, bukan ref object. **Kalau bikin komponen lain yang
ngukur elemen induk, pakai pola yang sama, dan tes di build produksi.**

Sticky note: **SUDAH DIFIX (2026-09-07)**, dulu `Section.tsx` render `note`
pakai `absolute top-4 right-4` TAPI Tailwind naruh `.relative` sesudah
`.absolute` di stylesheet, jadi utility `absolute` yang dioper lewat
className kalah dan note-nya nyangkut di kiri-atas. Sekarang note dibungkus
div posisi sendiri (`flex justify-end`) dan sengaja tetap di flow, bukan
absolute, di semua breakpoint: waktu masih dipin ke pojok, note-nya nabrak
headline yang lebar ("Suspect's Interests") di node peta yang sempit. Bug
yang sama juga ada di note `home` di `App.tsx` dan sudah ikut difix.
**Aturannya: jangan pernah oper `absolute` lewat `className` ke
`StickyNote`**, bungkus pakai wrapper.

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

## Kartu per-section: komponen sendiri, bukan ikon rata (2026-09-07)

Dulu tiap section cuma nempel satu ikon SVG rata (`StudentCardIcon`,
`EvidenceTagIcon`) plus teks di atasnya. Sekarang tiap keluarga kartu punya
komponen sendiri di `src/components/evidence/`, dan section-nya cuma
mengatur layout:

| Section | Komponen kartu | Isinya |
| --- | --- | --- |
| education | `StudentIdCard.tsx` | kartu pelajar: header warna sekolah, lambang asli di jendela foto, baris data diketik, tanda tangan, barcode (deterministik dari `entry.id`, bukan `Math.random()`), sheen laminasi |
| education (kuliah) | `GraduationMedalIcon` di icons | medali digambar ulang: pita satu untai bernotch (biru & merah), rim milled, **Makara UI ter-struck di tengah**, banner "S.Kom" |
| experience | `DossierCard.tsx` | kartu arsip bergaris: garis biru + margin merah, foto asli ter-mount, sudut terlipat, stempel status (AKTIF) |
| experience (papan) | `CorkString.tsx` | benang antar pin, **diukur runtime** dari `[data-pin]`, lihat bagiannya sendiri di bawah |
| projects | `ExhibitTag.tsx` | label kraft: lubang grommet asli (SVG mask, jadi kertas di baliknya benar-benar kelihatan), eyelet logam, benang bersimpul, huruf exhibit diambil dari `project.tag` |
| skills | `PrintCard.tsx` | kartu sidik jari: tick registrasi di 4 sudut, kotak cetakan, tangga "ridge clarity" |
| interests | `PhotoMount.tsx` | foto ter-mount pakai 4 sudut foto hitam + caption tulisan tangan |
| contact | inline di `ContactSection.tsx` | iklan baris ber-rule ganda + kupon tip-line dengan perforasi & stub |

**Gotcha yang paling gampang kena**: `EvidenceItem` render `children` di
dalam `<button>`, dan default UA tombol itu `text-align: center` (Tailwind
preflight nggak reset ini). Semua komponen kartu di atas WAJIB pasang
`text-left` sendiri, kalau nggak baris-baris teksnya mendadak nge-center.
Ini sudah kejadian sekali di `StudentIdCard`.

`CorkString` nerima elemen papan lewat **props elemen, bukan ref object**,
persis pola `MobileRedString` (ref anak diisi React sebelum ref induk, jadi
`useLayoutEffect` anak dapat `null`). Kalau bikin komponen pengukur lain,
ikuti pola ini.

Keputusan visual yang datang langsung dari user, jangan diubah tanpa dia minta:
- Warna kartu pelajar ikut seragam sekolah Indonesia: SD merah (`#b02a2a`),
  SMP biru navy (`#1f3d7a`), SMA abu (`#5c626b`).
- Pita medali kuliah bawa biru dan merah sebagai "soul color".
- Skill yang **nggak punya logo resmi** (Statistik & ML, Data Cleaning)
  dikelompokkan di akhir daftar, lewat `orderedSkills` (stable sort) di
  `SkillsSection.tsx`. Nomor `tag` (SIDIK-0X) sengaja TIDAK dirapikan ulang,
  itu nomor berkas dari `content.ts`.

Ikon yang dihapus karena sudah digantikan komponen di atas:
`StudentCardIcon`, `EvidenceTagIcon`. `ClubBadgeIcon` tetap disimpan
(fallback non-trademark, lihat catatan foto asli di atas).
`FingerprintIcon` digambar ulang total: pakai elliptical arc, BUKAN cubic,
karena apex cubic cuma nyampe ~3/4 jalan ke control point-nya jadi lengkung
sidik jarinya numpuk di tengah kotak. Tiap ridge juga dikasih "kaki" turun
ke dasar, kalau nggak bentuknya kayak tumpukan gapura, bukan sidik jari.

`SealedEnvelope`: container-nya dulu `h-32` padahal isinya svg full-height
PLUS dua baris caption di bawahnya, jadi captionnya kepotong. Sekarang
`h-[176px]` dengan svg `h-[114px]`. `MailboxIcon` diwarnai ulang ke ujung
palet yang terang karena sekarang dia duduk di header bar `bg-ink-700`.

## Makara UI di medali kuliah (2026-09-07)

`src/assets/photos/ui.png` (Makara resmi UI, kuning di atas kotak hitam
**opaque**, nggak ada tRNS chunk) ternyata sudah lama nangkring di repo tapi
belum kepakai sama sekali. Sekarang dia jadi sumber emblem yang ter-struck di
muka medali kuliah.

Yang dipakai di komponen BUKAN `ui.png` mentah, tapi turunannya
`ui-makara-engraved.png`. Resep pembuatannya (PIL, sekali jalan, `ui.png`
tetap disimpan sebagai sumber persis seperti `manutd-crest.svg`):

1. Alpha diambil dari kecerahan piksel (`max(r,g)/252`). Ini valid karena
   seluruh gambar cuma ramp hitam ke kuning, jadi background kekunci bersih
   dan tepi anti-alias-nya utuh. Jangan pakai threshold, giginya jadi kasar.
2. Tiga layer di-bake jadi satu PNG transparan: bayangan `#4a3308` offset
   turun-kanan, highlight `#f7e9ad` offset naik-kiri, badan bronze `#a1701a`
   di atasnya. Arah cahayanya harus **naik-kiri** supaya cocok sama radial
   gradient disc medali (`cx 36% cy 28%`), kalau dibalik emblem-nya kelihatan
   cekung bukan menonjol.
3. Di-resize ke 176px. Emblem-nya render di ~49px (sudah diukur di build
   produksi), jadi 176 itu cukup buat layar 3x dan file-nya 51KB.

Highlight/bayangan sengaja **di-bake ke aset**, bukan pakai filter SVG/CSS
runtime, karena layer ini hidup di dalam world yang terus di-transform (lihat
catatan perf di atas).

`GraduationMedalIcon` sekarang nerima prop `emblem` (+ `emblemLabel` buat
`<title>`). Tanpa `emblem`, dia fallback ke bintang struck biasa, jadi ikonnya
tetap kepakai buat konteks lain. Emblem-nya dioper dari `EducationSection`,
bukan di-import di `icons/index.tsx`, biar modul ikon tetap bebas aset (pola
yang sama kayak `SKILL_LOGOS` di `SkillsSection`).

Daun laurel di muka medali **dihapus** (tinggal dua garis ranting tipis)
waktu Makara masuk: Makara itu sendiri bentuknya sudah kipas yang ramai, dan
wreath berdaun penuh di sekelilingnya bikin sesak di ukuran render
sebenarnya.

## Halaman spesimen dev + folder preview (2026-09-07)

`gallery.html` + `src/gallery.tsx` adalah halaman **dev-only** buat lihat
satu section sekaligus di atas background kertas, tanpa peta pannable.
Vite cuma build `index.html`, jadi file ini TIDAK ikut ke `dist/` (sudah
diverifikasi). Query-nya: `?s=<section>` dan `?w=<lebar>`.

`?w=` itu kunci: dia yang dipakai buat **mengukur** `height` di
`mapLayout.ts` (render section di lebar node-nya, baca `offsetHeight`).
Dua hal yang bikin angkanya salah kalau nggak hati-hati: tunggu
`document.fonts.ready` dulu, DAN ukur di dua lebar jendela (sempit < 640px
dan lebar), ambil yang lebih besar. Pernah ketipu di sini: skills kebaca
920 di satu run dan 1194 di run lain, dan penyebabnya bukan font, tapi
breakpoint `sm:` yang ngikut lebar jendela (lihat catatan di bawah).

Hasil screenshot tiap kartu (desktop + HP) ada di `card-previews/`, lihat
`card-previews/README.md` buat cara regenerate.

## Bilingual: audit menyeluruh (2026-09-07)

User lapor masih ada kata Indonesia yang nongol di versi EN. Ternyata bukan
satu-dua, tapi satu keluarga bug yang sama: **field bertipe `string` polos
yang isinya kata, bukan kode.** Yang sudah difix:

- **`CaseFile.tag` jadi `Bilingual`.** Ini yang paling kelihatan. Isinya
  campur aduk: KARTU / BERKAS / SIDIK / BUKTI / MEDALI / CATATAN (Indonesia)
  TAPI juga EXHIBIT A-G (Inggris), jadi salah di **dua-duanya**. Sekarang
  ID: KARTU / BERKAS / SIDIK / BUKTI / MEDALI / CATATAN, EN: CARD / FILE /
  PRINT / EVIDENCE / MEDAL / NOTE / EXHIBIT. Ada 9 tempat yang render tag,
  semuanya lewat `t()` sekarang. **`ExhibitTag` mengambil huruf exhibit dengan
  mem-split tag**, jadi dia harus split hasil `t(tag)`, bukan tag mentah.
- `profile.issueDate` jadi `Bilingual` ("30 AGUSTUS 2026" / "30 AUGUST
  2026"), dipakai di Masthead + dua footer.
- `profile.location` jadi `Bilingual` walau belum dirender di mana pun,
  biar nggak jadi ranjau berikutnya.
- `EducationEntry.years` **dihapus**. Dia dead field (nggak dirender di mana
  pun) DAN isinya Indonesia-only ("Lulus 2016"), persis jenis ranjau di atas.
- `EvidenceItem` dulu `aria-label={caseFile.title.id}`, jadi nama aksesibel
  tiap barang bukti selalu Indonesia. Sekarang `t(caseFile.title)`.

**Cara audit-nya (ulangi kalau nambah konten):** jangan baca kode satu-satu,
render lalu sapu teksnya. Walk `document.body` pakai TreeWalker, kumpulkan
semua text node, dan regex cari kata fungsi bahasa seberang (di EN cari
`yang|untuk|dengan|klik|nggak|kartu|berkas|sidik|bukti|agustus|...`, di ID
cari `the|and|with|click|close|evidence|exhibit|print|card|...`). Lakukan di
view desktop DAN mobile, dengan modal case file kebuka, dan di kedua arah
bahasa. Sekarang hasilnya nol, kecuali dua hit yang memang disengaja user:
"(Student Executive Board)" (nama resmi organisasinya) dan baris
`otherSkills.soft` yang teks ID dan EN-nya identik (soft skill ditulis
Inggris di dua-duanya). Dua ini keputusan user, jangan diubah sendiri.

## ⚠️ Opacity modifier Tailwind cuma kelipatan 5

`bg-ink-900/92` **tidak menghasilkan CSS apa pun** dan gagal dalam diam:
skala opacity default Tailwind itu 0,5,10,...,95,100, jadi 92 invalid dan
class-nya dibuang tanpa warning. Efeknya backdrop easter egg sempat
transparan total padahal class-nya kelihatan benar. Kalau butuh nilai di
luar kelipatan 5, pakai bracket: `bg-ink-900/[0.92]`.

Cek cepat seluruh repo:

    grep -rhoE '(bg|text|border|from|to|ring|fill|stroke)-[a-z0-9-]+/[0-9]+' src --include=*.tsx       | sort -u | awk -F/ '{ if ($2 % 5 != 0) print "INVALID: " $0 }'

## Easter egg: berkas rahasia (2026-09-07)

Dua jalan masuk, karena HP nggak punya tombol Ctrl:
- **Ctrl+K / Cmd+K** (toggle). `preventDefault()` wajib, Ctrl+K itu shortcut
  search browser.
- **Tekan-dan-tahan 650ms nomor perkara di Masthead** ("NO. 007-ZIK").
  Ini jawaban buat pertanyaan user soal trigger di HP. Nomornya dikasih
  garis putus-putus tipis di bawah sebagai satu-satunya petunjuk.

`useHoldTrigger` (`secretFile.ts`) memasang listener move/up di **window,
bukan di elemennya**: di desktop trigger-nya ada di dalam world yang
pointer-handler-nya mengambil pointer capture, jadi elemennya sendiri nggak
pernah kebagian pointerup. Press dibatalkan kalau pointer geser > 12px,
supaya nyeret peta nggak ikut membuka egg. Sudah dites: buka, toggle, Esc,
tahan, dan seret-tidak-membuka.

`SecretFrame` render di `z-[70]`, di atas night shift (30), HUD (40), dan
CaseFileModal (50). Dia **tidak** terdaftar di `CaseFileContext`, jadi nggak
menambah angka meter kasus. Frame-nya sengaja besar (`w-[min(86vw,340px)]
sm:w-[430px] md:w-[500px]`) atas permintaan user, biar berasa "sesuatu yang
besar". Copy-nya di `secretFile` di content.ts dan sengaja tidak menyebut
siapa subjeknya.

### Resep silhouette (dan kenapa fotonya TIDAK ada di repo)

User kirim foto asli seorang perempuan berhijab buat dijadikan siluet.
Keputusannya berubah dua kali, jadi ini versi finalnya: **siluet asli yang
tajam, hitam-putih, tanpa detail dalam sama sekali.** (Iterasi pertama
di-blur berat dan kepalanya digambar ulang generik; user bilang itu kelewat
blur dan mengizinkan bentuk aslinya, "as long as the colors vanished".)

Resep di `make-silhouette.py` (skrip ada di scratchpad session):

1. Background dikunci pakai **flood fill dari tepi**, bukan threshold biasa.
   Threshold biasa bikin bolong di kacamata dan highlight wajah, karena
   kulit yang kena cahaya itu terang. Yang background cuma piksel terang
   yang **tersambung ke tepi frame**.
2. Seed fill-nya cuma dari sisi **atas + kiri + kanan, JANGAN dari bawah**.
   Subjeknya kepotong di tepi bawah foto, dan seed dari sana bikin fill
   merambat naik lewat kulit tangan yang terang lalu melubangi tangannya.
3. Cuma di-despeckle (median 3) plus blur 0.9 buat anti-alias tepi. Tidak
   ada blur berat: bentuknya harus tajam.
4. Diisi warna **netral** (abu sangat gelap ke hitam, tanpa tint hangat) +
   rim light pucat di tepi kiri-atas. Hasilnya: bentuk solid, nol informasi
   di dalamnya, nol warna.
5. Plate di belakangnya juga dinetralkan ke glow abu (`#9c9a95` ke
   `#0a0a09`) supaya keseluruhan plate kebaca sebagai foto hitam-putih.
   Frame-nya tetap emas dan stempel CLASSIFIED tetap merah, karena itu
   frame dan tinta, bukan bagian dari fotonya.

Isi siluet **harus lebih gelap dari glow plate di belakangnya**. Percobaan
sebelumnya isinya lebih terang dari background dan siluetnya hilang total.

Judulnya **"Agent K"** (permintaan user), pas sama trigger Ctrl+**K**, dengan
"Subjek Belum Teridentifikasi" jadi subtitle.

**Foto sumbernya sengaja TIDAK ada di repo** dan `.gitignore` memblokir
`src/assets/photos/*-source.*`. Repo ini publik dan yang di-ship cuma siluet
turunannya. Kalau perlu regenerate, minta user kirim ulang filenya dari luar
repo. Yang ikut ke repo cuma `easter-egg-silhouette.png`.

## ⚠️ User pernah lagi naruh aset di `dist/` (2026-09-07)

Kejadian kedua: `tentang-kopi.jpg` dan `eastereggsource.jpg` ditaruh di
`dist/assets/`. `dist/` itu output build DAN sudah masuk `.gitignore`, jadi
file di sana bakal hilang begitu `npm run build` jalan. Keduanya langsung
diselamatkan ke scratchpad dulu sebelum build apa pun, sesuai aturan di
bagian atas file ini, lalu dipindah ke `src/assets/photos/`. Kalau user
nyebut path di dalam `dist/` lagi, **copy dulu, tanya belakangan.**

`tentang-kopi.jpg` sekalian dikompres dari 205KB ke 54KB (604x640): foto itu
cuma dipakai sebagai thumbnail 54px di kartu dan 160px di modal.

## Jalur cepat buat recruiter (2026-09-07, iterasi keenam)

Kritik yang mendasari semua perubahan di bawah: situs ini dioptimalkan buat
bikin orang terkesan, belum buat bikin orang merekrut. Peta pannable-nya seru,
tapi orang yang nyaring kandidat cuma punya sekitar satu menit dan sebelumnya
nggak ada jalan buat dapat substansinya tanpa menjelajah dulu.

**`CaseSummary.tsx` + `caseSummary` di content.ts.** Lembar ringkasan: 5 baris
data diketik dan 3 baris bukti yang masing-masing membawa angka. Semua isinya
**restatement** dari fakta yang sudah ada di content.ts, jadi kalau fakta
aslinya berubah, lembar ini harus ikut diedit manual.

**Sekarang dia popup, bukan bagian alur halaman** (lihat bagian "Ringkasan
jadi popup" di bawah). Sejarahnya: dulu dia duduk di dalam node `home` persis
di bawah poster, dan itu bikin node `home` sekitar 500px lebih tinggi dari
tetangganya sampai semua node di bawahnya harus digeser +680px. Hasilnya
bagian atas dan bawah peta kebaca seperti dua tempat yang terpisah jauh.

## Ringkasan jadi popup dari poster WANTED (2026-09-08)

User: *"kayanya emang kalo ditambah summary disitu sih jadi ga proporsional
bgt ya, seolah bagian 'atas' dan bagian 'bawah' terpisah jauh sekali. gimana
kalo summarynya jadi pop up aja?"* Jadi seluruh poster WANTED sekarang tombol
yang membuka `SummaryModal`, dan lembar ringkasannya keluar dari alur halaman
(desktop maupun mobile).

**Geseran +680px itu sudah dibalik.** `experience`, `skills`, `projects`,
`contact` (beserta pin-nya) kembali ke koordinat lama, `WORLD_HEIGHT` balik ke
3780. Node `home` sekarang **diukur 984px** (jendela lebar maupun sempit sama),
di-`height` 1010 supaya longgar. Nol overlap di jendela 3120px dan 620px
dengan tujuh node ter-mount.

### ⚠️ `position: fixed` di dalam world peta itu TIDAK fixed ke viewport

Bug pertama versi popup ini, dan pelajarannya berlaku umum. World peta
di-`transform`, dan elemen ber-transform jadi **containing block** untuk
turunan `position: fixed`. Jadi overlay `fixed inset-0` yang dirender dari
dalam sebuah section mengambil ukuran **world** (terukur 2950x3780) bukan
viewport, dan panelnya mendarat di y=1590, jauh di luar layar. Di mobile
kelihatan normal karena di sana nggak ada ancestor ber-transform, jadi ini
gampang lolos kalau cuma dites di HP.

`SummaryModal` sekarang dirender lewat `createPortal(..., document.body)`.
**Overlay fixed lain yang dipasang dari dalam section wajib pakai pola yang
sama.** `CaseFileModal` dan `SecretFrame` aman karena dirender di root App,
di luar world.

Cek cepatnya: buka popup-nya lalu bandingkan `getBoundingClientRect()` overlay
dengan `innerWidth`/`innerHeight`. Harus 0,0,vw,vh.

### Poster jadi tombol: konsekuensinya drag nggak bisa mulai dari situ

`onPointerDown` di `usePannableCanvas` sengaja `return` untuk press yang
dimulai di `button, a, input, textarea, select, [role='button']` (kalau nggak,
pointer capture menelan klik anak-anaknya). Karena posternya sekarang tombol
selebar ~768px, **peta nggak bisa diseret mulai dari atas poster**. Ini
konsisten dengan semua evidence item lain di situs ini (press = buka berkas,
geser dari kertas di antaranya) dan kursor kaca pembesarnya jadi penandanya.
Kalau suatu saat ini jadi masalah, jangan hapus guard-nya, tambahkan opt-in
per-elemen.

Satu baris petunjuk tulisan tangan ditaruh di dalam garis poster ("Buka
berkasnya untuk ringkasan perkara →") sebagai satu-satunya penanda.
`SummaryModal` **tidak** terdaftar di `CaseFileContext`, jadi nggak menambah
angka meter kasus, sama seperti `SecretFrame`.

## ⚠️ Jangan pasang `whileHover` yang men-scale elemen besar di dalam world

Poster sempat dikasih `whileHover={{ rotate, scale }}`. User lapor
*"ketika geser-geser jadi agak stuttering"*. Sebabnya: waktu peta diseret,
kursor menyapu poster, framer-motion memicu hover, dan spring men-scale panel
768x400 ber-`shadow-case` di dalam world yang sedang di-transform, tiap frame.
Sudah dihapus; hover-nya sekarang cuma perubahan warna CSS di baris petunjuk
(`group-hover`). Evidence item kecil (226x120) nggak masalah, yang besar
masalah.

## Ukuran aset foto: kecilkan ke sisi terpanjang 400px (2026-09-08)

Waktu peta dirapatkan lagi, papan kasus jadi bertetangga langsung dengan hero,
jadi ikut ter-mount di tampilan pertama. Sekalian ketahuan foto-fotonya
kelewat besar buat ukuran render sebenarnya:

- `openhouse-fasilkom.jpg` 1600x1200 (410KB) dirender **51x48** → 31x
- `telkom.jpg` 1050x1400 (232KB) dirender 52x48 → 20x
- `sdit-soedirman-logo.png` 589x590 (225KB) dirender 18x18 → 34x

Total bitmap ter-decode di tampilan pertama ~20MB buat thumbnail sebesar
puluhan piksel. Semua aset yang dipakai sekarang **maksimal 400px sisi
terpanjang** (1814KB → sekitar 250KB, decoded 20MB → 7.7MB, `dist` jadi 1.1M).
Efek terukurnya di pan: dari 4 frame > 24ms (terburuk 33ms) jadi **nol**.

**Kenapa 400 dan bukan lebih kecil**: foto yang sama dipakai dua kali, sebagai
thumbnail ~50px di kartu DAN sebagai polaroid 160px di modal berkas. 400 itu
2.5x dari 160, pas buat layar high-DPI. Render terbesar di seluruh situs
adalah mugshot 189px.

Dua PNG (`manutd-crest.png`, `sdit-soedirman-logo.png`) malah **membengkak**
kalau cuma di-resize, jadi dua-duanya dikuantisasi ke palet (128 dan 64 warna,
`Image.FASTOCTREE`): 115KB → 17KB dan 225KB → 10KB. Kualitasnya **diukur**,
bukan ditebak: RMS error terhadap aslinya 3.1/255 dan 3.0/255 (~1.2%), jadi
nggak kelihatan di render 150px. Kalau mengganti aset ini lagi, ukur ulang
errornya, jangan cuma lihat ukuran file.

**Sengaja TIDAK disentuh**: `ui-makara-engraved.png` (176px, angkanya dipilih
sadar buat render 49px di layar 3x), `ui.png` (sumber emblem itu),
`easter-egg-silhouette.png` (dirender full-bleed di frame sampai 500px), dan
`manutd-crest.svg` (2.5MB, sumber non-raster yang disimpan sengaja). Aset asli
sebelum dikecilkan tetap ada di history git kalau suatu saat perlu.

## Stat tile angka headline (2026-09-07)

`CaseFile.metrics` dirender sebagai baris stat tile di **atas** narasi, biar
angkanya mendarat sebelum prosanya. Tiga aturan yang gampang salah:

- **`value` itu `Bilingual`, bukan string.** Pemisah ribuan dan desimal beda:
  "5.846"/"0,85" di Indonesia, "5,846"/"0.85" di Inggris.
- **Angkanya pakai `font-typewriter`, BUKAN `font-headline`.** Playfair itu
  display face; angka besar di atasnya kebaca sebagai dekorasi, bukan data.
  Typewriter itu "working face" sistem ini, yang dipakai semua nilai terketik
  lain di kartu-kartunya.
- **Jangan `tabular-nums`.** Digit selebar `0` bikin angka besar yang berdiri
  sendiri kelihatan longgar. Tabular cuma buat kolom angka yang harus rata
  vertikal (baris tabel, tick axis).

Ini bukan chart dan jangan dijadikan chart: segenggam angka yang berdiri
sendiri memang kerjaan stat tile. Nggak ada palet kategorikal di sini
(semuanya tinta di atas kertas), jadi nggak ada yang perlu divalidasi.

**Cuma masukkan angka yang sudah didukung body text-nya.** `proj-ecommerce`
sengaja tanpa metrics karena body-nya nggak menyebut satu angka konkret pun.

## Keterangan saksi: aturan kejujurannya (2026-09-07)

`CaseFile.witness` dipakai `exp-tentang-kopi`. User cerita pemiliknya
menyampaikan **lisan** bahwa bahan baku terbuang berkurang, tanpa angka. Jadi
yang ditulis persis itu, dan field `source`-nya menyebut terang-terangan bahwa
itu keterangan lisan dan **tidak ada persentase yang diklaim**.

**Jangan pernah mengarang angka buat mengisi lubang ini.** Menyebut provenance
apa adanya justru bikin sisa berkasnya lebih kredibel. Aturan yang sama buat
saksi berikutnya: `source` wajib bilang siapa yang ngomong dan sekuat apa
buktinya. Jangan bikin kutipan verbatim dari sebuah parafrase.

## Slot bukti lebar + bar redaksi (2026-09-07)

`CaseFile.exhibit` buat screenshot dashboard: dirender selebar modal, terpisah
dari `photoSrc` (polaroid kotak 160px, buat foto orang dan tempat; dashboard di
situ nggak kebaca). `exhibit.redact` menerima daftar kotak persen `{x,y,w,h}`
yang digambar sebagai bar hitam di atas gambarnya, jadi screenshot data
internal masih mungkin ditampilkan. **Belum ada satu pun yang terisi: nunggu
screenshot dari user.**

`PolaroidPhoto` juga nggak lagi jatuh ke placeholder siluet orang. Dulu tiap
berkas proyek dan skill kebuka dengan siluet orang asing plus tulisan "PHOTO
PENDING"; sekarang kolom fotonya cuma muncul kalau `photoSrc` beneran ada
(stempelnya tetap dirender sendiri kalau fotonya nggak ada).

## Tur berpandu "Ikuti benang merahnya" (2026-09-07)

Tombol di HUD kiri-bawah menggeser viewport menyusuri `STRING_PATH` dari
section ke section, buat pengunjung pertama yang belum sadar halaman ini peta
yang bisa diseret.

Implementasinya di `usePannableCanvas`: `glideTo()` meng-animasi offset/scale
pakai rAF + easeInOutCubic, dan `startTour()` menjalankannya berurutan.
Semua navigasi lain **tetap instan**; cuma tur ini yang di-animasi.

- Pembatalannya pakai **token yang di-increment** (`tourToken`), bukan flag
  boolean: tiap `await` mengecek tokennya dan langsung keluar kalau berubah.
- `stopTour()` dipanggil dari `onPointerDown` dan `onWheel`. Tur tidak boleh
  berebut kendali viewport dengan orangnya.
- `prefers-reduced-motion` bikin dia langsung lompat, nggak meluncur.
- `offsetRef`/`scaleRef` mem-mirror state, supaya `glideTo` bisa baca
  transform terkini tanpa mendaftarkan offset/scale sebagai dependency (yang
  bakal membangun ulang callback-nya tiap frame).

## Preview sosial (2026-09-07)

`public/og-image.jpg` (1200x630, 94KB) itu **screenshot situsnya sendiri**:
masthead plus poster WANTED lengkap. Cara regenerate: buka situsnya di viewport
1200x630, sembunyikan semua `.fixed` (HUD) DAN sticky note-nya (yang itu di
flow, bukan fixed, jadi nggak kena selector `.fixed`), set transform world ke
`translate(-905px, -150px) scale(1)`, screenshot, simpan JPEG q86.

`index.html` sekarang punya og:*/twitter:* lengkap plus JSON-LD `Person`
(recruiter mencari nama lengkap, bukan alias, jadi `<title>` juga sudah memuat
"Muhammad Ilham Zikri").

Catatan penting: **`og:image` masih path relatif.** Sebagian besar crawler
me-resolve itu relatif ke URL halaman, tapi LinkedIn minta absolut. Begitu
domainnya fix, ganti `og:image`/`twitter:image` ke URL absolut dan tambah
`og:url`. Komentarnya sudah ditaruh di `index.html` tepat di atas tag-tagnya.

## Benang merah papan kasus: `CorkString` (2026-09-07, iterasi ketujuh)

Ini komponen yang paling banyak dibolak-balik atas permintaan user. Baca ini
dulu sebelum menyentuh geometrinya, biar nggak mengulang jalan yang sudah
ditolak.

### Bug aslinya bukan geometrinya, tapi z-index

Dulu SVG-nya dirender **di belakang** kartu (paint order: SVG sebelum grid,
dua-duanya `z-auto`). Jadi tiap kaki benang ketelan kartu tempat dia mulai,
dan yang kelihatan cuma potongan tengahnya yang nyembul di celah antar kartu:
busur ngawang yang nggak nyambung ke pin mana pun. User baca ini sebagai
"benangnya gak teratur", padahal benangnya memang pin-ke-pin dari awal.
Sekarang SVG-nya `z-10`, di atas kartu (`z-auto`) dan di bawah kepala pin
(`z-20`). **Jangan hilangkan `z-10` itu.**

### ⚠️ `getBoundingClientRect` itu koordinat SESUDAH transform

Ini bug kedua dan lebih halus. `measure()` mengukur pin lewat
`getBoundingClientRect`, tapi SVG-nya digambar dalam piksel layout. Ada dua
transform berskala yang hidup di app ini:

1. **Mobile**: `LazySection` membungkus tiap section dengan `.animate-popIn`,
   yang jalan `scale(0.85) -> scale(1)` selama 0.35s. CorkString mengukur pas
   animasinya masih jalan.
2. **Desktop**: seluruh world peta di-`scale()` (`getDefaultScale()`), jadi di
   jendela sempit skalanya bisa 0.84.

Efeknya: benangnya kegambar di 0.847x dan **nyangkut di situ selamanya**,
karena `ResizeObserver` **tidak** bereaksi ke perubahan transform (dia
mengobservasi kotak layout, bukan ukuran visual). Fixnya: bagi selisihnya
dengan skala ancestor, `k = board.offsetWidth ? rect.width / board.offsetWidth : 1`.
`clientWidth`/`clientHeight` sendiri sudah bebas transform, itu sebabnya
`box` benar sementara pin salah, dan itu petunjuk yang menuntun ke sini.

**Aturan umum: komponen apa pun di repo ini yang mengukur elemen induk pakai
`getBoundingClientRect` sedang mengukur lewat transform peta.** Bagi dengan
skalanya, atau ukur lewat rantai `offsetLeft`/`offsetTop` yang bebas transform.
`MobileRedString` juga mengukur induk, cek ke sana kalau ada gejala serupa.

### Jalan yang SUDAH DITOLAK user, jangan diulang

- **Routing ortogonal lewat kanal kosong papan** (naik dari pin, lewat gutter,
  turun ke pin berikutnya, sudut dibulatkan). Secara teknis ini yang paling
  aman: nol persinggahan dengan kartu di semua layout, terukur. Tapi user
  bilang *"benang merah yang membentuk kotak dan terlalu menjalur gitu kayak
  aneh"* — kebaca sebagai pipa/kabel, kotak yang digambar di sekitar berkas,
  bukan tali yang mengikatnya. **Jangan kembali ke sini.**
- **Jaring silang padat** (tiap pasangan pin diikat 1-3 utas, 12+ utas):
  *"jangan terlalu semrawut gini juga masseee"*.
- **Benang keluar papan**: sempat diminta (*"kalo bisa sih ada benang yang
  connect ke luar board"*), lalu dibatalkan (*"gausah ada yang keluar board
  deh gapapa"*). SVG-nya sudah balik ke `inset-0`, nggak melebar lagi.

### Bentuk yang dipakai sekarang

Satu utas tali menyusuri berkas urut waktu, lewat di ATAS kartu, tanpa jaring
silang dan tanpa ujung keluar papan. Yang bikin kebaca organik:

- **Disampel, bukan dirumuskan.** Tiap bentang di-sampel `STEPS = 16` titik
  lalu dihaluskan Catmull-Rom ke cubic. Kurva tunggal (quadratic) cuma bisa
  bikin parabola simetris, dan papan penuh parabola identik kelihatan
  dicetak pabrik.
- **Gravitasi + skew.** Profil sag nol di kedua pin, di-skew acak-deterministik
  ke salah satu ujung, jadi nggak ada dua bentang yang menggantung sama.
- **Riak tegak lurus** dua suku sinus (~1px), di-fade ke nol di kedua pin biar
  benangnya tetap ketemu pinnya.
- **Serat bulat**: badan gelap `#7e1b1b` 2.5px + highlight tipis `#c9503c`
  0.9px yang di-offset `translate(-0.3 -0.7)`, plus bayangan jatuh
  `translate(1.6 2.8)`. Highlight-nya yang bikin talinya kebaca bulat dan
  kena cahaya, bukan garis vektor pipih.
- **PRNG deterministik** (`rnd(seed)`, mulberry32) dari indeks bentang,
  **bukan `Math.random()`**: geometrinya dihitung ulang tiap `ResizeObserver`
  jalan, kalau random beneran benangnya bergetar tiap papan reflow. Aturan
  yang sama seperti `MobileRedString`.
- **Kasus 1 kolom** (HP, dan jendela desktop < 640px): semua pin satu garis
  vertikal, jadi bentang tegang bakal turun lurus membelah judul tiap kartu.
  Karena itu tiap bentang dikasih `bulge` lateral bergantian kiri-kanan
  (`len * 0.42`), hasilnya talinya berkelok dan memotong kartu secara
  diagonal, judulnya tetap kebaca.

### Cara verifikasinya (jangan pakai mata saja)

Skrip di scratchpad session, tapi resepnya: ambil `path[data-main]`, lalu

1. `getPointAtLength` sepanjang path, cek nggak ada titik yang keluar
   `viewBox`;
2. tiap subpath (`d.split("M ")`) harus mulai DAN berakhir tepat di posisi pin
   (jarak 0, karena ujungnya nggak di-jitter lagi);
3. regex `NaN|Infinity|undefined` di semua atribut `d`.

Jalankan di **tiga layout**: jendela lebar (2 kolom), jendela < 640px
(1 kolom), dan view HP asli. Dan **di build produksi**, di peta desktop yang
world-nya di-scale (buka `/`, klik chip quicknav "Experience", ukur di
viewport ~760px biar skalanya 0.844) — itu justru kasus yang dulu rusak dan
nggak ketangkap di halaman gallery, karena gallery nggak punya transform.

⚠️ **`Page.captureScreenshot` dengan `captureBeyondViewport: true` + `clip`
pernah dua kali mengembalikan frame BASI** yang nggak cocok sama DOM saat itu,
dan itu sempat bikin ngejar bug yang nggak ada. Kalau screenshot dan hasil
`Runtime.evaluate` bertentangan, curigai screenshot-nya dulu: ambil ulang
tanpa `captureBeyondViewport` (viewport dibikin cukup tinggi saja).

## Lembar ringkasan: tanpa tombol (2026-09-07)

`CaseSummary` sekarang **tidak punya call to action** sama sekali (permintaan
user: *"tombol download file dan send a tip di summary gausah ada gapapa"*).
Tinggal 5 baris data diketik + 3 baris bukti berangka. Amplop CV dan kupon tip
line tetap ada di section kontak, jadi nggak ada yang hilang, cuma nggak
diulang. Ikutan yang sudah dibersihkan: prop `onContact` dihapus, wrapper
`SummaryWithNav` di `App.tsx` dihapus (sekarang `<CaseSummary />` langsung),
dan field `caseSummary.cta` + `caseSummary.contactCta` dibuang dari
content.ts biar nggak jadi field mati.

## ⚠️ `onWheel` React itu passive, `preventDefault()`-nya diam-diam gagal

React memasang listener `wheel` di root sebagai **passive**, jadi
`e.preventDefault()` di dalam prop `onWheel` tidak melakukan apa-apa dan cuma
memuntahkan warning "Unable to preventDefault inside passive event listener
invocation" ke console. Akibatnya nyata: ctrl+wheel di atas peta bikin
**browser nge-zoom seluruh halaman**, bukan petanya.

`usePannableCanvas` sekarang memasang listener wheel-nya sendiri ke
`viewportRef` lewat `addEventListener("wheel", handler, { passive: false })`
di dalam `useEffect`, dan `onWheel` sudah dikeluarkan dari objek `handlers`.
Cek cepatnya: dispatch `new WheelEvent("wheel", {ctrlKey:true, cancelable:true})`
ke viewport, lalu baca `ev.defaultPrevented` (harus `true`) dan pastikan
`scale` di transform world berubah.

**Kalau nambah handler pointer/wheel baru yang perlu `preventDefault`, jangan
lewat prop React**, pasang sendiri non-passive dengan pola yang sama.

## HUD kiri-bawah: satu kolom, jangan dua blok fixed (2026-09-07)

Tombol tur dulu `fixed bottom-[52px] left-4` sementara chip quicknav
`fixed bottom-4 left-4`. Quicknav isinya 7 chip yang **wrap jadi 2-3 baris**
tergantung bahasa dan lebar viewport, jadi tingginya bisa lewat 52px dan
tombol turnya ketiban. Sekarang dua-duanya di dalam SATU
`fixed bottom-4 left-4 flex flex-col items-start gap-2`, jadi layoutnya nggak
bisa lagi nabrak dirinya sendiri. **Jangan pin elemen baru di kiri-bawah pakai
offset tetap**, masukkan ke kolom itu.

## Catatan teknis penting lain
- `CaseFile` (types.ts) sekarang punya `techStack?` dan `redacted?` opsional di level base, dipakai `CaseFileModal.tsx` untuk render pill tech-stack dan `RedactedText`.
- `TOTAL_CASES` di `CaseFileContext.tsx` dihitung otomatis dari panjang array content (education+experience+projects+skills+interests+stickyNotes) — kalau nambah/kurang entri, angka meter ikut otomatis, tidak perlu update manual.
- `WORLD_HEIGHT` di mapLayout.ts = 3780 (pernah 4470 waktu lembar ringkasan
  masih di dalam node `home`, sudah dibalik). Semua `height` node sudah
  **diukur**, bukan ditebak (lihat section halaman spesimen di atas). Kalau
  nambah konten ke section manapun, ukur ulang dan cek
  `WORLD_WIDTH`/`WORLD_HEIGHT`.
- **`sm:` itu keyed ke viewport, bukan ke lebar node.** Ini jebakan paling
  halus di peta desktop: lebar node itu world px dan nggak pernah reflow,
  tapi utility `sm:` di section ngikut lebar *jendela browser*. Di jendela
  < 640px tiap section turun ke padding lebih kecil + headline lebih kecil,
  hasilnya section jadi **lebih tinggi DAN content box-nya lebih lebar**
  (experience: 1098 di jendela lebar vs 1278 di jendela sempit). Jadi tiap
  `height` harus diukur di dua lebar jendela dan diambil yang lebih besar,
  dan posisi node harus punya clearance buat kasus sempit itu. Kasus ini
  nyata: escape hatch "Open desktop version" dari HP, dan jendela desktop
  yang disempitkan.
- `projects` dan `skills` dipindah dari y 1750 (sekarang `skills` di
  x 1990 y 1970, `projects` di x 90 y 2240) karena rubric tiap section
  diakhiri hairline rule selebar kolom, dan di posisi lama rule itu kegambar
  melintasi pojok bawah papan gabus experience (kekonfirmasi 150px dan
  80px). Node yang cuma *bersentuhan* pun tetap bakal nyoret tetangganya
  gara-gara rule ini. Clearance sekarang 54px (vertikal, vs projects) dan
  44px (horizontal, vs skills) **di kasus jendela sempit**. Sesudah
  menggeser apa pun di `NODES`, verifikasi ulang dengan membandingkan
  bounding rect `.max-w-5xl` tiap section secara pairwise, di jendela lebar
  DAN sempit. Caranya ada di `card-previews/README.md`.

## Yang masih ditunggu dari user

Detail proyek Telkom **sudah terisi** (per 2026-09-07). Yang masih ditunggu:

- **Screenshot dashboard** buat `CaseFile.exhibit`. Slot dan bar redaksinya
  sudah jadi dan cuma nunggu gambar. Yang paling gampang duluan: proyek Olist
  (`proj-ecommerce`) yang punya sendiri, nol isu kerahasiaan.
- **URL repo** buat proyek pribadi (`proj-ecommerce`, `proj-webgraph`,
  `proj-terrorism`, `proj-thesis`). Field `link` di `CaseFile` sudah ada dan
  sudah dirender modal, tapi belum satu pun proyek yang mengisinya. **Jangan
  mengarang URL**: link mati lebih buruk daripada nggak ada link.
- **2 sampai 3 keterangan saksi lagi** (supervisor Telkom, tim BEM). Baru ada
  satu, dari pemilik Tentang Kopi. Lihat aturan kejujurannya di atas.
- **Domain final**, buat mengabsolutkan `og:image`.

Semua yang lain (nama sekolah SD/SMP/SMA, cerita masa sekolah, 2 minat tambahan di luar Man United) sudah lengkap per 2026-08-30.

Nomor telepon dari CV **sengaja tidak ditampilkan** di halaman kontak publik
(hanya ada di file CV yang diunduh) — keputusan privasi, bisa diubah kalau
user minta ditampilkan.
