import type {
  Bilingual,
  CaseFile,
  EducationEntry,
  ExperienceEntry,
  InterestEntry,
  ProjectEntry,
  SkillEntry,
} from "../types";
import ilhamWisuda from "../assets/photos/ilham-wisuda.jpg";
import sditSoedirmanLogo from "../assets/photos/sdit-soedirman-logo.png";
import smpn49Logo from "../assets/photos/smpn49-logo.jpg";
import sman39Logo from "../assets/photos/sman39-logo.png";
import telkomPhoto from "../assets/photos/telkom.jpg";
import bemCampaignPhoto from "../assets/photos/bem-campaign.jpg";
import openhouseFasilkomPhoto from "../assets/photos/openhouse-fasilkom.jpg";
import wayneRooneyPhoto from "../assets/photos/wayne-rooney.jpg";
import lizIvePhoto from "../assets/photos/liz-ive.jpg";
import mamaPhoto from "../assets/photos/mama.jpg";

/**
 * Source of truth for the site's biography content. Components read from
 * here — update a value below and the whole site updates, no component
 * code needs to change. Anything still bracketed like [isi ...] is a
 * direct cue for what's still missing.
 */

export const profile = {
  name: "ilhamzik",
  fullName: "Muhammad Ilham Zikri",
  role: {
    id: "Lulusan Ilmu Komputer UI, kini @TelkomIndonesia sebagai Data Analyst Intern",
    en: "Computer Science UI Graduate, now @TelkomIndonesia as a Data Analyst Intern",
  } as Bilingual,
  tagline: {
    id: "Kasus ini masih dalam penyelidikan aktif sejak Agustus 2024.",
    en: "This case has been under active investigation since August 2024.",
  } as Bilingual,
  location: "Jakarta Timur, Indonesia",
  caseNumber: "NO. 007-ZIK",
  issueDate: "30 AGUSTUS 2026",
  resumeHref: "/CV-Muhammad-Ilham-Zikri.pdf",
};

/** Copy for the "wanted poster" hero — playful mafia-boss framing, per user's request. */
export const wanted = {
  heading: { id: "DICARI", en: "WANTED" } as Bilingual,
  alias: { id: "a.k.a. “ilhamzik”", en: "a.k.a. “ilhamzik”" } as Bilingual,
  charge: {
    id: "Diduga menjadi dalang di balik sejumlah proyek data berskala besar, mulai dari model machine learning, dashboard kampanye, sampai analisis skripsi yang divalidasi terlalu rapi untuk dianggap kebetulan. Terakhir terpantau beroperasi di Fasilkom UI, kini dilaporkan bersembunyi di kantor Telkom Indonesia.",
    en: "Suspected mastermind behind a string of large-scale data projects: machine learning models, campaign dashboards, and a thesis validated a little too rigorously to be a coincidence. Last spotted operating out of Fasilkom UI, now reportedly hiding out at a Telkom Indonesia office.",
  } as Bilingual,
  reward: {
    id: "IMBALAN: satu kolaborasi proyek, atau minimal kopi bareng.",
    en: "REWARD: one project collaboration, or at least a coffee.",
  } as Bilingual,
  status: { id: "BURON", en: "AT LARGE" } as Bilingual,
};

export const education: EducationEntry[] = [
  {
    id: "edu-sd",
    level: "sd",
    tag: "KARTU-01",
    title: { id: "Sekolah Dasar", en: "Elementary School" },
    institution: { id: "SDI PB Soedirman, Cijantung", en: "SDI PB Soedirman, Cijantung" },
    years: "Lulus 2016",
    subtitle: { id: "Kartu Pelajar", en: "Student Card" },
    body: [
      {
        id: "Di sinilah investigasi dimulai. Rasa ingin tahu pertama kali tercatat dalam berkas.",
        en: "This is where the investigation began. The first recorded signs of curiosity.",
      },
      {
        id: "Separuh waktu luangnya habis di lapangan bola bareng teman-teman, tapi begitu ada lomba matematika, dia biasanya salah satu yang paling semangat ikut, bukan buat gengsi, cuma karena memang senang sama tantangan itung-itungannya.",
        en: "Half his free time went to the football field with friends, but whenever a math competition came around, he was usually one of the most eager to join, not for bragging rights, just because he genuinely enjoyed the challenge of the numbers.",
      },
    ],
    facts: [{ label: { id: "Lulus", en: "Graduated" }, value: { id: "2016", en: "2016" } }],
    photoSrc: sditSoedirmanLogo,
    photoCaption: { id: "Lambang sekolah, ditempel di berkas.", en: "School crest, pinned into the file." },
  },
  {
    id: "edu-smp",
    level: "smp",
    tag: "KARTU-02",
    title: { id: "Sekolah Menengah Pertama", en: "Junior High School" },
    institution: { id: "SMPN 49 Jakarta", en: "SMPN 49 Jakarta" },
    years: "Lulus 2019",
    subtitle: { id: "Kartu Pelajar", en: "Student Card" },
    body: [
      {
        id: "Bola masih jadi rutinitas harian, tapi jam terbang ikut lomba matematika juga makin sering. Tipe anak yang larinya kencang di lapangan, tapi juga betah mikirin soal susah di kelas.",
        en: "Football was still a daily routine, but the math-competition mileage kept adding up too. The kind of kid who was quick on the field but just as happy wrestling with a hard problem in class.",
      },
    ],
    facts: [{ label: { id: "Lulus", en: "Graduated" }, value: { id: "2019", en: "2019" } }],
    photoSrc: smpn49Logo,
    photoCaption: { id: "Lambang sekolah, ditempel di berkas.", en: "School crest, pinned into the file." },
  },
  {
    id: "edu-sma",
    level: "sma",
    tag: "KARTU-03",
    title: { id: "Sekolah Menengah Atas", en: "Senior High School" },
    institution: { id: "SMAN 39 Jakarta", en: "SMAN 39 Jakarta" },
    years: "Lulus 2022",
    subtitle: { id: "Kartu Pelajar", en: "Student Card" },
    body: [
      {
        id: "Baru satu semester masuk SMA, pandemi datang dan lapangan bola/futsal jadi nggak bisa diakses lagi. Dari situ dia malah ketagihan Mobile Legends dan Valorant, sambil maraton serial dan film di Netflix, cara baru untuk tetap “main” walau dari rumah.",
        en: "Just one semester into high school, the pandemic hit and the football/futsal fields became off-limits. That's when he got hooked on Mobile Legends and Valorant instead, alongside marathoning Netflix shows and movies, a new way to keep “playing” from home.",
      },
    ],
    facts: [{ label: { id: "Lulus", en: "Graduated" }, value: { id: "2022", en: "2022" } }],
    photoSrc: sman39Logo,
    photoCaption: { id: "Lambang sekolah, ditempel di berkas.", en: "School crest, pinned into the file." },
  },
  {
    id: "edu-kuliah",
    level: "kuliah",
    tag: "MEDALI-01",
    title: { id: "Pendidikan Tinggi", en: "Higher Education" },
    institution: {
      id: "Universitas Indonesia, S1 Ilmu Komputer, Fasilkom UI",
      en: "University of Indonesia, B.S. Computer Science, Faculty of Computer Science",
    },
    years: "2022–2026",
    subtitle: { id: "Medali Wisuda", en: "Graduation Medal" },
    body: [
      {
        id: "Bukti kelulusan yang tergantung di berkas, hasil akhir dari empat tahun penyelidikan akademik di Fasilkom UI. Nilainya sendiri bukan yang paling mentereng di angkatan, tapi cukup solid untuk membawanya wisuda tepat waktu tanpa drama.",
        en: "The proof of completion hanging in the file, the result of four years of academic investigation at Fasilkom UI. His grades were never the flashiest in the cohort, but solid enough to get him through graduation on time, no drama.",
      },
      {
        id: "Skripsi: klasifikasi pola prompt GenAI, coding kualitatif untuk menyusun taksonomi 5 kelas penggunaan, divalidasi dengan Krippendorff's Alpha (≈ 0,85), lalu dibangun model klasifikasi teks multi-kelas di atasnya.",
        en: "Thesis: GenAI prompt pattern classification, qualitative coding to build a 5-class usage taxonomy, validated with Krippendorff's Alpha (≈ 0.85), then a supervised multi-class text classification model built on top of it.",
      },
      {
        id: "Mata kuliah kunci: Data Mining, E-Commerce, Business Process Management, AI and Data Science, Statistics and Probability, Deep Learning, Computer Vision, Database.",
        en: "Key coursework: Data Mining, E-Commerce, Business Process Management, AI and Data Science, Statistics and Probability, Deep Learning, Computer Vision, Database.",
      },
    ],
    facts: [{ label: { id: "Lulus", en: "Graduated" }, value: { id: "2026", en: "2026" } }],
    stamp: { id: "LULUS", en: "GRADUATED" },
    photoSrc: ilhamWisuda,
    photoCaption: { id: "Foto arsip, sedikit ternoda usia.", en: "Archive photo, slightly tarnished with age." },
  },
];

export const experience: ExperienceEntry[] = [
  {
    id: "exp-telkom",
    tag: "BERKAS-A",
    title: { id: "Praktikan, Tim CPO", en: "Intern, CPO Team" },
    role: { id: "Praktikan, Tim CPO (Divisi SDA)", en: "Intern, CPO Team (SDA Division)" },
    organization: { id: "Telkom Indonesia", en: "Telkom Indonesia" },
    period: { id: "Jul 2026 – Sekarang", en: "Jul 2026 – Present" },
    body: [
      {
        id: "Baru memasuki bulan kedua magang, dan sudah berkesempatan ikut serta di beberapa proyek tim ini. Detail lengkap berkas ini masih dalam proses pengumpulan dan akan menyusul.",
        en: "Just entering the second month of this internship, and already had the chance to take part in a few of the team's projects. Full case details are still being compiled and will follow soon.",
      },
    ],
    stamp: { id: "AKTIF", en: "ACTIVE" },
    photoSrc: telkomPhoto,
    photoCaption: { id: "Di depan Divisi SDA.", en: "In front of the SDA Division." },
  },
  {
    id: "exp-bem-campaign",
    tag: "BERKAS-B",
    title: { id: "Data Analyst", en: "Data Analyst" },
    role: { id: "Data Analyst", en: "Data Analyst" },
    organization: {
      id: "Tim Kampanye Pemilihan BEM (Student Executive Board)",
      en: "Student Executive Board (BEM) Election Campaign Team",
    },
    period: { id: "Des 2024 – Apr 2025", en: "Dec 2024 – Apr 2025" },
    body: [
      {
        id: "Menganalisis dan memvisualisasikan data survei untuk mendukung pengambilan keputusan strategis kampanye, lalu membangun dashboard dan laporan visual yang mengarahkan strategi dan alokasi sumber daya tim kampanye.",
        en: "Analyzed and visualized survey data to support strategic campaign decisions, then built dashboards and visual reports that guided the campaign's direction and resource allocation.",
      },
    ],
    photoSrc: bemCampaignPhoto,
    photoCaption: { id: "Bareng tim kampanye.", en: "With the campaign team." },
  },
  {
    id: "exp-tentang-kopi",
    tag: "BERKAS-C",
    title: { id: "Data Scientist Freelance", en: "Freelance Data Scientist" },
    role: { id: "Data Scientist Freelance", en: "Freelance Data Scientist" },
    organization: { id: "Tentang Kopi", en: "Tentang Kopi" },
    period: { id: "Agu – Des 2024", en: "Aug – Dec 2024" },
    body: [
      {
        id: "Melakukan analisis product bundling dengan teknik association rule mining (support, confidence, lift) untuk menemukan kombinasi produk berperforma tinggi, dan berhasil mengembangkan beberapa bundel yang membantu Tentang Kopi meminimalkan bahan baku terbuang karena kedaluwarsa.",
        en: "Conducted product bundling analysis using association rule mining (support, confidence, lift) to find high-performing combinations, successfully developing bundles that helped Tentang Kopi minimize ingredient waste from expiration.",
      },
    ],
  },
  {
    id: "exp-openhouse",
    tag: "BERKAS-D",
    title: { id: "VPIC & Staf Public Relations", en: "VPIC & Public Relations Staff" },
    role: { id: "VPIC & Staf Public Relations", en: "VPIC & Public Relations Staff" },
    organization: { id: "Open House & BEM Fasilkom UI", en: "Open House & BEM Fasilkom UI" },
    period: { id: "Agu – Des 2023", en: "Aug – Dec 2023" },
    body: [
      {
        id: "Turut memimpin operasional divisi PR, mengarahkan kampanye video “Fasilkom Rewind” dan mengelola distribusi talent MC lintas divisi, serta menjalankan program outreach sekolah dan jejaring lintas fakultas.",
        en: "Co-led PR division operations, directing the “Fasilkom Rewind” video campaign and managing cross-divisional MC talent distribution, plus running school outreach programs and cross-faculty networking.",
      },
    ],
    photoSrc: openhouseFasilkomPhoto,
    photoCaption: { id: "Bareng tim Open House.", en: "With the Open House team." },
  },
];

export const projects: ProjectEntry[] = [
  {
    id: "proj-ecommerce",
    tag: "EXHIBIT A",
    title: { id: "Analisis Penjualan & Pengiriman E-Commerce", en: "E-Commerce Sales & Delivery Performance Analysis" },
    subtitle: { id: "Proyek pribadi (sedang berjalan), Jul 2026", en: "Personal project (in progress), Jul 2026" },
    body: [
      {
        id: "Audit kualitas data dan eksplorasi pada data transaksi e-commerce Brasil (dataset Olist), termasuk investigasi akar masalah ketidakcocokan record order-item. Menganalisis tren pendapatan dan pertumbuhan bulanan dengan SQL (CTE, window function), lalu menemukan bahwa sebagian besar pesanan berulasan buruk justru dikirim tepat waktu, temuan yang berlawanan dengan intuisi.",
        en: "Ran a data quality audit and exploratory analysis on Brazilian e-commerce transaction data (the Olist dataset), including root-cause investigation of order-item record mismatches. Analyzed revenue trends and month-over-month growth using SQL (CTEs, window functions), uncovering that a notable share of low-rated orders were, counterintuitively, delivered on time.",
      },
    ],
    techStack: ["SQL (SQLite)", "Python", "Power BI"],
  },
  {
    id: "proj-thesis",
    tag: "EXHIBIT B",
    title: { id: "Klasifikasi Pola Prompt GenAI (Skripsi)", en: "GenAI Prompt Pattern Classification (Thesis)" },
    subtitle: { id: "Skripsi Sarjana, Fasilkom UI, Feb–Jun 2026", en: "Undergraduate Thesis, Fasilkom UI, Feb–Jun 2026" },
    body: [
      {
        id: "Melakukan coding kualitatif atas berbagai prompt GenAI untuk menyusun taksonomi penggunaan 5 kelas, memvalidasi reliabilitasnya dengan Krippendorff's Alpha (≈ 0,85), lalu membangun model klasifikasi teks multi-kelas untuk menganalisis pola perilaku mahasiswa dalam pemecahan masalah berbantuan AI.",
        en: "Conducted qualitative coding on GenAI prompts to derive a 5-class usage taxonomy, validated its reliability with Krippendorff's Alpha (≈ 0.85), then built a supervised multi-class text classification model to analyze student behavioral patterns in AI-assisted problem solving.",
      },
    ],
    techStack: ["Python", "Pandas", "Scikit-Learn", "Krippendorff's Alpha"],
  },
  {
    id: "proj-webgraph",
    tag: "EXHIBIT C",
    title: { id: "Analisis Jaringan Web & Deteksi Komunitas", en: "Web Graph Network Analysis and Community Detection" },
    subtitle: { id: "Proyek Kelompok Data Mining, Feb–Jun 2025", en: "Data Mining Course Group Project, Feb–Jun 2025" },
    body: [
      {
        id: "Mengambil sampel graf web 4.200 node untuk menganalisis metrik sentralitas, PageRank, dan deteksi komunitas (Louvain, Infomap, Girvan-Newman), lalu mendeteksi anomali jaringan dengan ensemble Isolation Forest dan DBSCAN untuk mengidentifikasi node kunci.",
        en: "Sampled a 4,200-node web graph to analyze centrality metrics, PageRank, and community detection using Louvain, Infomap, and Girvan-Newman, then detected network anomalies with an Isolation Forest + DBSCAN ensemble to identify key influencer nodes.",
      },
    ],
    techStack: ["Python", "NetworkX", "Scikit-Learn"],
  },
  {
    id: "proj-terrorism",
    tag: "EXHIBIT D",
    title: { id: "Analisis Data Terorisme Global & Model ML", en: "Global Terrorism Data Analysis and ML Model" },
    subtitle: { id: "Proyek Akhir KASDD, Agu–Des 2024", en: "KASDD Course Final Project, Aug–Dec 2024" },
    body: [
      {
        id: "Membangun model klasifikasi multi-kelas dan regresi pada 33.140 catatan untuk memprediksi target serangan dan memperkirakan biaya kerusakan, serta menerapkan K-Means & Hierarchical Clustering (dievaluasi dengan Silhouette Score & Dendrogram) untuk mengelompokkan pola serangan.",
        en: "Built multi-class classification and regression models on 33,140 records to predict attack targets and estimate damage costs, and applied K-Means & Hierarchical Clustering (evaluated via Silhouette Score & Dendrograms) to segment attack patterns.",
      },
    ],
    techStack: ["Python", "Pandas", "Scikit-Learn", "Matplotlib"],
  },
];

export const skills: SkillEntry[] = [
  { id: "skill-sql", tag: "SIDIK-01", title: { id: "SQL", en: "SQL" }, body: [{ id: "Dipakai untuk audit data, CTE, dan window function di berbagai proyek analitik.", en: "Used for data audits, CTEs, and window functions across analytics projects." }], proficiency: 4 },
  { id: "skill-python", tag: "SIDIK-02", title: { id: "Python", en: "Python" }, body: [{ id: "Bahasa utama untuk data cleaning, machine learning, dan riset.", en: "Primary language for data cleaning, machine learning, and research." }], proficiency: 4 },
  { id: "skill-ml", tag: "SIDIK-03", title: { id: "Statistik & Machine Learning", en: "Statistics & Machine Learning" }, body: [{ id: "Klasifikasi, regresi, clustering, hingga validasi reliabilitas statistik.", en: "Classification, regression, clustering, through to statistical reliability validation." }], proficiency: 4 },
  { id: "skill-scikit", tag: "SIDIK-04", title: { id: "Scikit-Learn", en: "Scikit-Learn" }, body: [{ id: "Dipakai membangun model klasifikasi/regresi di beberapa proyek.", en: "Used to build classification/regression models across several projects." }], proficiency: 4 },
  { id: "skill-powerbi", tag: "SIDIK-05", title: { id: "Power BI", en: "Power BI" }, body: [{ id: "Dashboard interaktif untuk visualisasi temuan analitik.", en: "Interactive dashboards for visualizing analytical findings." }], proficiency: 3 },
  { id: "skill-excel", tag: "SIDIK-06", title: { id: "Excel", en: "Excel" }, body: [{ id: "Analisis dan pelaporan data cepat.", en: "Fast data analysis and reporting." }], proficiency: 4 },
  { id: "skill-cleaning", tag: "SIDIK-07", title: { id: "Data Cleaning", en: "Data Cleaning" }, body: [{ id: "Audit kualitas data & investigasi akar masalah sebelum analisis.", en: "Data quality audits & root-cause investigation before analysis." }], proficiency: 4 },
  { id: "skill-git", tag: "SIDIK-08", title: { id: "Git", en: "Git" }, body: [{ id: "Version control untuk kerja kode maupun kolaborasi.", en: "Version control for code work and collaboration." }], proficiency: 3 },
];

export const otherSkills = {
  soft: {
    id: "Soft skills: Analytical Thinking, Communication, Data Storytelling, Attention to Detail, Problem Solving, Stakeholder Management, Teamwork, Adaptability.",
    en: "Soft skills: Analytical Thinking, Communication, Data Storytelling, Attention to Detail, Problem Solving, Stakeholder Management, Teamwork, Adaptability.",
  } as Bilingual,
  languages: {
    id: "Bahasa: Inggris, Bahasa Indonesia.",
    en: "Languages: English, Bahasa Indonesia.",
  } as Bilingual,
};

export const interests: InterestEntry[] = [
  {
    id: "int-manutd",
    icon: "manutd",
    tag: "BUKTI-01",
    title: { id: "Manchester United", en: "Manchester United" },
    subtitle: { id: "Lencana Klub", en: "Club Badge" },
    body: [
      {
        id: "Sudah lebih dari 15 tahun mendukung klub ini. Awalnya cuma karena suka lambangnya waktu lihat di PlayStation. Tapi kata mas kandungnya, tim ini kuat dan layak didukung, jadi sejak itu dukungannya makin serius.",
        en: "A supporter for more than 15 years now. It started simply because he liked the badge seeing it on a PlayStation. But his older brother told him this club was strong and worth backing, so the support got serious from there.",
      },
    ],
    facts: [
      { label: { id: "Sejak", en: "Since" }, value: { id: "15+ tahun", en: "15+ years" } },
      { label: { id: "Awal mula", en: "Origin" }, value: { id: "PlayStation", en: "PlayStation" } },
      { label: { id: "Pemain favorit", en: "Favorite player" }, value: { id: "Wayne Rooney", en: "Wayne Rooney" } },
    ],
    photoSrc: wayneRooneyPhoto,
    photoCaption: { id: "Wayne Rooney, pemain favorit.", en: "Wayne Rooney, favorite player." },
  },
  {
    id: "int-liz",
    icon: "custom",
    tag: "BUKTI-02",
    title: { id: "Liz (IVE)", en: "Liz (IVE)" },
    subtitle: { id: "Bias K-pop", en: "K-pop Bias" },
    body: [
      {
        id: "Bias resmi: Liz dari IVE. Nggak butuh alasan rumit buat suka, pokoknya sudah locked in sejak awal.",
        en: "Official bias: Liz from IVE. No complicated reasoning needed, locked in as a fan since day one.",
      },
    ],
    facts: [{ label: { id: "Grup", en: "Group" }, value: { id: "IVE", en: "IVE" } }],
    photoSrc: lizIvePhoto,
    photoCaption: { id: "Liz, IVE.", en: "Liz, IVE." },
  },
  {
    id: "int-motto",
    icon: "custom",
    tag: "BUKTI-03",
    title: { id: "Motto Hidup", en: "Life Motto" },
    subtitle: { id: "Kutipan Pribadi", en: "Personal Quote" },
    body: [
      {
        id: "“Asal mamake bangga.” Simpel: apa pun yang dikerjakan, ujung-ujungnya biar bisa bikin mama bangga. Motto ini yang diam-diam jadi alasan di balik banyak keputusan besar.",
        en: "“As long as it makes mom proud.” Simple as that. Whatever gets done, the underlying reason is making his mom proud. This quiet motto sits behind a lot of the bigger decisions.",
      },
    ],
    photoSrc: mamaPhoto,
    photoCaption: { id: "Sama mama, dari dulu.", en: "With mom, since way back." },
  },
];

export const contact = {
  heading: { id: "Kirim Petunjuk", en: "Send a Tip" } as Bilingual,
  description: {
    id: "Punya proyek, pertanyaan, atau sekadar ingin menyapa? Berkas ini masih terbuka untuk kontak.",
    en: "Got a project, a question, or just want to say hi? This case file is still open for contact.",
  } as Bilingual,
  email: "zikriilham2@gmail.com",
  links: [
    { label: "GitHub", href: "https://github.com/ilhamzik" },
    { label: "LinkedIn", href: "https://linkedin.com/in/ilhamzik" },
    { label: "Instagram", href: "https://instagram.com/ilhamzik" },
  ],
  resumeLabel: { id: "Unduh Berkas Kasus (CV)", en: "Download Case File (CV)" } as Bilingual,
  classifiedAd: {
    id: "DICARI: kolaborator proyek data. Syarat: nggak takut sama deadline dan data kotor.",
    en: "WANTED: data project collaborators. Requirements: not afraid of deadlines or dirty data.",
  } as Bilingual,
  envelopeLabel: { id: "Amplop Tersegel", en: "Sealed Envelope" } as Bilingual,
  envelopeHint: { id: "klik untuk membuka →", en: "click to open →" } as Bilingual,
};

export const pressCredits = {
  id: "Dilaporkan oleh redaksi ilhamzik.",
  en: "Reported by the ilhamzik editorial desk.",
} as Bilingual;

/**
 * Newspaper-feature-style narrative copy for each section — the "article
 * body" that runs above the evidence items. Voice is deliberately a little
 * breathless/tabloid, per the user's explicit request to gimmick it up a bit.
 * Grounded in real facts, dramatized in delivery only.
 */
export const articles: Record<string, Bilingual> = {
  education: {
    id: "Sejak bangku SDI PB Soedirman Cijantung, bocah asal Jakarta Timur ini bikin guru-gurunya bingung: kakinya di lapangan bola, tapi sesekali juga ikut lomba matematika, dan dua-duanya jalan beriringan sampai ke SMPN 49 Jakarta. Semua berubah waktu pandemi menyerang di awal masa SMAN 39 Jakarta: lapangan ditutup, dan yang tersisa cuma Mobile Legends, Valorant, dan maraton Netflix sampai larut malam. Untungnya arah hidupnya lurus lagi begitu masuk Fasilkom Universitas Indonesia, dan empat tahun kemudian, keluar membawa gelar S.Kom, dengan nilai yang menurutnya sendiri masih biasa saja.",
    en: "Since his days at SDI PB Soedirman Cijantung, this East Jakarta kid has been confusing his teachers: feet on the football field, occasionally also entering math competitions, and both ran side by side all the way through SMPN 49 Jakarta. Everything changed when the pandemic hit right at the start of SMAN 39 Jakarta: the field shut down, leaving only Mobile Legends, Valorant, and late-night Netflix marathons. Luckily his trajectory straightened out again once he entered the Faculty of Computer Science, University of Indonesia, and four years later, walked out with a computer science degree and grades he'd describe as nothing special.",
  },
  experience: {
    id: "Rekam jejak kerjanya dimulai dari balik layar booth Open House Fasilkom UI, lalu masuk ke dunia data lewat sebuah kedai kopi lokal, tempat analisis bundling produknya sukses menekan bahan baku terbuang. Aksinya berlanjut di tim kampanye pemilihan BEM, mengubah tumpukan data survei jadi dashboard yang benar-benar dipakai untuk ambil keputusan. Ceritanya kini berlanjut di kantor Telkom Indonesia sebagai praktikan di Tim CPO, baru dua bulan, tapi sudah berkesempatan ikut serta di beberapa proyek tim.",
    en: "His work record starts backstage at a Fasilkom UI Open House booth, then moves into the data world through a local coffee shop, where his product-bundling analysis successfully cut down wasted ingredients. The story continues on a BEM election campaign team, turning stacks of survey data into dashboards that actually got used to make decisions. It now continues at a Telkom Indonesia office as an intern on the CPO team, only two months in, but already given the chance to take part in a few of the team's projects.",
  },
  projects: {
    id: "Empat berkas ini bukti bahwa rasa penasarannya nggak pernah berhenti di satu topik saja. Mulai dari membedah data e-commerce Brasil untuk cari tahu kenapa paket telat tapi rating tetap bagus, sampai skripsi yang mengubah obrolan dengan AI jadi taksonomi ilmiah lengkap dengan uji reliabilitas statistik. Belum lagi pemetaan 4.200 node jaringan web dan pembongkaran 33 ribu catatan serangan terorisme global, semuanya demi satu tujuan sederhana: bikin data yang berantakan jadi masuk akal.",
    en: "These four files are proof his curiosity never stays on one topic for long. From dissecting Brazilian e-commerce data to figure out why late packages still got good ratings, to a thesis that turned conversations with an AI into a scientific taxonomy complete with statistical reliability testing. Add in mapping a 4,200-node web network and cracking open 33,000 global terrorism incident records, all in service of one simple goal: making messy data make sense.",
  },
  skills: {
    id: "Kalau ditanya senjata andalan buat bongkar-bongkar data, daftarnya cukup panjang: dari SQL dan Python untuk menggali informasi, sampai Power BI untuk bikin temuan itu enak dilihat orang lain. Tapi menurut pengakuannya sendiri, senjata yang paling sering dipakai bukan salah satu dari itu, melainkan rasa nggak enakan kalau ada data kotor yang dibiarkan lolos sebelum dianalisis.",
    en: "Ask for his go-to weapons for cracking open data and the list runs long: SQL and Python for digging up information, Power BI for making the findings presentable. But by his own admission, the most-used weapon isn't any of those. It's a nagging discomfort whenever dirty data slips through unchecked before analysis.",
  },
  interests: {
    id: "Di luar urusan data, hidupnya dikendalikan oleh tiga hal yang sebetulnya nggak ada hubungannya sama sekali: satu klub sepak bola yang disukai gara-gara lambangnya di PlayStation, satu member girl group yang jadi bias tanpa alasan yang bisa dijelaskan logika, dan satu motto sederhana yang diam-diam jadi kompas di balik keputusan-keputusan besarnya.",
    en: "Outside of data, his life is run by three things that have nothing to do with each other: a football club he liked because of its badge on a PlayStation, a girl-group member who became his bias for no logically explainable reason, and one simple motto quietly compassing his biggest decisions.",
  },
  contact: {
    id: "Berkas ini masih terbuka. Siapa pun yang punya proyek, pertanyaan, atau sekadar mau menyapa dipersilakan tinggalkan jejak di bawah. Jalur komunikasi tersangka masih aktif dan dipantau.",
    en: "This file is still open. Anyone with a project, a question, or just wanting to say hi is welcome to leave a trace below. The suspect's communication line is still active and monitored.",
  },
};

/**
 * Quick "post-it" footnotes pinned onto a section's article — small
 * supplementary facts that don't have a tangible evidence object of their
 * own. Optional per section; only sections listed here get one.
 */
export const stickyNotes: Partial<Record<string, CaseFile>> = {
  home: {
    id: "note-alias",
    tag: "CATATAN",
    title: { id: "Soal nama “ilhamzik”", en: "About the name “ilhamzik”" },
    body: [
      {
        id: "Simpel: gabungan nama depan (Ilham) dan potongan nama belakang (Zikri), jadi “ilham” + “zik”. Bukan hasil generator username jam 2 pagi, walau kelihatannya begitu.",
        en: "Simple: a mashup of his first name (Ilham) and a slice of his last name (Zikri), giving “ilham” + “zik”. Not the output of a 2AM username generator, even though it looks like one.",
      },
    ],
  },
  education: {
    id: "note-grades",
    tag: "CATATAN",
    title: { id: "Soal nilai akademiknya", en: "About his grades" },
    body: [
      {
        id: "Nggak pernah jadi juara umum, tapi juga nggak pernah tinggal kelas atau remedial. Konsisten di tengah-tengah, dan buat sejauh ini itu sudah cukup.",
        en: "Never the top of the class, but never held back or needed remedial classes either. Consistently solid in the middle, and so far that's been enough.",
      },
    ],
  },
  experience: {
    id: "note-telkom-secret",
    tag: "CATATAN",
    title: { id: "Soal proyek di Telkom", en: "About the Telkom projects" },
    body: [
      {
        id: "Belum bisa dibongkar di sini, anggap saja rahasia perusahaan. Detailnya menyusul begitu sudah boleh diceritakan.",
        en: "Can't be cracked open here yet, call it a company secret. Details to follow once he's cleared to share.",
      },
    ],
    redacted: {
      id: "Nama proyek: sedang dalam status classified. Coba lagi setelah NDA-nya kadaluarsa.",
      en: "Project name: currently classified. Try again once the NDA expires.",
    },
  },
  interests: {
    id: "note-conclusion",
    tag: "CATATAN",
    title: { id: "Kesimpulan sementara investigasi", en: "Preliminary investigation conclusion" },
    body: [
      {
        id: "Tiga variabel yang mengendalikan hidupnya: bola (Man United), K-pop (Liz dari IVE), dan restu mama. Korelasinya belum bisa dijelaskan secara statistik.",
        en: "Three variables running his life: football (Man United), K-pop (Liz from IVE), and his mom's blessing. The correlation can't be statistically explained yet.",
      },
    ],
  },
};
