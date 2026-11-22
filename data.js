/* =========================================================
   DATA SOAL TEKA TEKI PINTAR
   Cara menambah soal:
   - TTS: tambah objek ke TTS_LEVELS. Kata = huruf kapital tanpa spasi.
     Grid disusun otomatis oleh mesin, jadi cukup isi daftar kata + petunjuk.
   - Tebak Kata: tambah ke TEBAK_LEVELS (word, hint, extra opsional).
   - Sambung Kata: tambah ke SAMBUNG_LEVELS (word, petunjuk).
   - Kuis ABCD: tambah ke QUIZ_QUESTIONS (q, options[4], answer 0-3, explain, cat).
   ========================================================= */

// Konfigurasi iklan: slot kosong, tidak ada iklan palsu/klik otomatis.
// Isi "enabled" dan "provider" saat sudah memakai jaringan iklan resmi.
const AD_CONFIG = {
  enabled: false,
  slots: {
    'home-banner': { position: 'home-top' },
    'category-banner': { position: 'category-list' },
    'between-levels': { position: 'after-level' },
    'settings-banner': { position: 'settings-bottom' }
  },
  // Iklan tidak pernah ditampilkan saat pemain sedang mengisi TTS
  hideDuringTTS: true
};

// Level TTS: setiap level = satu kategori + daftar kata & petunjuk.
const TTS_LEVELS = [
  { cat: 'TTS Umum', title: 'Benda Rumah', words: [
    { w: 'BUKU', c: 'Berisi tulisan untuk dibaca' },
    { w: 'KURSI', c: 'Tempat duduk berkaki empat' },
    { w: 'UANG', c: 'Alat tukar untuk berbelanja' },
    { w: 'KERAN', c: 'Alat untuk mengalirkan air dari pipa' },
    { w: 'ROTI', c: 'Makanan dari tepung yang dipanggang' }
  ]},
  { cat: 'TTS Umum', title: 'Alam Sekitar', words: [
    { w: 'LAUT', c: 'Perairan luas yang asin' },
    { w: 'HUTAN', c: 'Kumpulan pepohonan lebat' },
    { w: 'SUNGAI', c: 'Aliran air tawar yang panjang' },
    { w: 'AWAN', c: 'Kumpulan uap air di langit' },
    { w: 'BUNGA', c: 'Bagian tanaman yang berwarna' },
    { w: 'RUMPUT', c: 'Tanaman hijau di halaman' }
  ]},
  { cat: 'TTS Pengetahuan', title: 'Tubuh Manusia', words: [
    { w: 'MATA', c: 'Alat untuk melihat' },
    { w: 'TELINGA', c: 'Alat untuk mendengar' },
    { w: 'HIDUNG', c: 'Alat untuk mencium bau' },
    { w: 'LIDAH', c: 'Alat untuk mengecap rasa' },
    { w: 'JANTUNG', c: 'Organ pemompa darah' },
    { w: 'TANGAN', c: 'Anggota tubuh untuk memegang' }
  ]},
  { cat: 'TTS Dunia', title: 'Negeri Asing', words: [
    { w: 'JEPANG', c: 'Negara dengan ibu kota Tokyo' },
    { w: 'MESIR', c: 'Negara dengan Piramida Giza' },
    { w: 'BRAZIL', c: 'Negara terbesar di Amerika Selatan' },
    { w: 'KANADA', c: 'Negara di utara Amerika Serikat' },
    { w: 'INDIA', c: 'Negara dengan Taj Mahal' },
    { w: 'CHINA', c: 'Negara Tembok Raksasa' }
  ]},
  { cat: 'TTS Sejarah', title: 'Kemerdekaan', words: [
    { w: 'MERDEKA', c: 'Bebas dari penjajahan' },
    { w: 'PROKLAMASI', c: 'Pernyataan kemerdekaan Indonesia' },
    { w: 'SOEKARNO', c: 'Presiden pertama Indonesia' },
    { w: 'HATTA', c: 'Wakil presiden pertama Indonesia' },
    { w: 'PAHLAWAN', c: 'Orang yang berjasa bagi bangsa' },
    { w: 'SUMPAH', c: 'Janji yang diucapkan dengan khidmat' }
  ]},
  { cat: 'TTS Indonesia', title: 'Budaya Nusantara', words: [
    { w: 'BATIK', c: 'Kain dengan motif lilin dan pewarna' },
    { w: 'ANGKLUNG', c: 'Alat musik bambu dari Jawa Barat' },
    { w: 'GAMELAN', c: 'Ansambel musik tradisional Jawa dan Bali' },
    { w: 'RENDANG', c: 'Masakan daging khas Minangkabau' },
    { w: 'WAYANG', c: 'Pertunjukan boneka tradisional' },
    { w: 'TARI', c: 'Gerakan tubuh yang diiringi musik' }
  ]},
  { cat: 'TTS Hewan', title: 'Binatang Darat', words: [
    { w: 'GAJAH', c: 'Hewan berbelalai terbesar di darat' },
    { w: 'HARIMAU', c: 'Kucing besar bergaris' },
    { w: 'ZEBRA', c: 'Kuda berbelang hitam putih' },
    { w: 'KERBAU', c: 'Hewan ternak yang kuat membajak sawah' },
    { w: 'KELINCI', c: 'Hewan bertelinga panjang' },
    { w: 'MONYET', c: 'Primata yang suka bergelantungan' }
  ]},
  { cat: 'TTS Mini', title: 'Mini 1', words: [
    { w: 'API', c: 'Hasil pembakaran yang panas' },
    { w: 'ANGIN', c: 'Udara yang bergerak' },
    { w: 'PASIR', c: 'Butiran halus di pantai' }
  ]},
  { cat: 'TTS Mini', title: 'Mini 2', words: [
    { w: 'TOPI', c: 'Penutup kepala' },
    { w: 'PITA', c: 'Kain sempit untuk hiasan rambut' },
    { w: 'PAYUNG', c: 'Pelindung dari hujan dan panas' }
  ]}
];

// Tebak kata: pemain menyusun huruf dari huruf acak (berisi huruf pengecoh).
const TEBAK_LEVELS = [
  { word: 'KUCING', hint: 'Hewan peliharaan yang suka mengeong', extra: 'Hewan berkaki empat' },
  { word: 'RUMAH', hint: 'Tempat tinggal sebuah keluarga', extra: 'Dinding, atap, dan pintu' },
  { word: 'BUKU', hint: 'Kumpulan halaman berisi tulisan', extra: 'Dibaca untuk menambah ilmu' },
  { word: 'SEKOLAH', hint: 'Tempat murid belajar setiap hari', extra: 'Ada guru dan kelas' },
  { word: 'PASAR', hint: 'Tempat jual beli kebutuhan sehari-hari', extra: 'Ramai pedagang dan pembeli' },
  { word: 'SAWAH', hint: 'Lahan tempat menanam padi', extra: 'Biasanya tergenang air' },
  { word: 'JENDELA', hint: 'Bukaan di dinding untuk masuknya cahaya', extra: 'Biasanya berkaca' },
  { word: 'MATAHARI', hint: 'Bintang terdekat dengan bumi', extra: 'Terbit di pagi hari' },
  { word: 'GUNUNG', hint: 'Daratan yang menjulang tinggi', extra: 'Kadang mengeluarkan lava' },
  { word: 'SEPEDA', hint: 'Kendaraan roda dua yang dikayuh', extra: 'Tanpa mesin' },
  { word: 'PELANGI', hint: 'Lengkung warna setelah hujan', extra: 'Muncul saat cerah di sisi hujan' },
  { word: 'KERETA', hint: 'Kendaraan besar yang berjalan di atas rel', extra: 'Berangkat dari stasiun' }
];

// Sambung kata: pemain menghubungkan huruf (tanpa pengecoh) untuk membentuk kata.
const SAMBUNG_LEVELS = [
  { word: 'MEJA', petunjuk: 'Perabot tempat menaruh barang' },
  { word: 'BULAN', petunjuk: 'Benda langit yang mengelilingi bumi' },
  { word: 'PISANG', petunjuk: 'Buah kuning yang manis' },
  { word: 'JERUK', petunjuk: 'Buah berkulit tipis dan asam segar' },
  { word: 'SEMUT', petunjuk: 'Serangga kecil yang bekerja bergotong royong' },
  { word: 'BURUNG', petunjuk: 'Hewan bersayap yang bisa terbang' },
  { word: 'PENSIL', petunjuk: 'Alat tulis dengan grafit' },
  { word: 'IKAN', petunjuk: 'Hewan air yang bernapas dengan insang' },
  { word: 'SAPI', petunjuk: 'Hewan ternak penghasil susu' },
  { word: 'LAMPU', petunjuk: 'Alat penerang di malam hari' },
  { word: 'PINTU', petunjuk: 'Penutup untuk masuk ke dalam rumah' },
  { word: 'TANAH', petunjuk: 'Permukaan bumi tempat berpijak' }
];

// Kuis ABCD: 6 kategori.
const QUIZ_CATEGORIES = [
  { id: 'umum', name: 'Pengetahuan Umum', icon: '🌍' },
  { id: 'sains', name: 'Sains', icon: '🔬' },
  { id: 'sejarah', name: 'Sejarah', icon: '📜' },
  { id: 'geografi', name: 'Geografi', icon: '🗺️' },
  { id: 'teknologi', name: 'Teknologi', icon: '💻' },
  { id: 'bahasa', name: 'Bahasa Indonesia', icon: '📝' }
];

const QUIZ_QUESTIONS = [
  { cat: 'umum', q: 'Berapa jumlah benua di dunia?', options: ['5', '6', '7', '8'], answer: 2, explain: 'Dunia terdiri dari tujuh benua.' },
  { cat: 'umum', q: 'Apa ibu kota Jepang?', options: ['Osaka', 'Tokyo', 'Kyoto', 'Nagoya'], answer: 1, explain: 'Tokyo adalah ibu kota Jepang.' },
  { cat: 'umum', q: 'Berapa hari dalam seminggu?', options: ['5', '6', '7', '8'], answer: 2, explain: 'Seminggu terdiri dari tujuh hari.' },
  { cat: 'umum', q: 'Warna bendera Indonesia adalah?', options: ['Merah-Putih', 'Biru-Putih', 'Merah-Kuning', 'Hijau-Putih'], answer: 0, explain: 'Bendera Indonesia berwarna merah di atas dan putih di bawah.' },

  { cat: 'sains', q: 'Planet terdekat dengan Matahari adalah?', options: ['Venus', 'Merkurius', 'Mars', 'Bumi'], answer: 1, explain: 'Merkurius adalah planet paling dekat dengan Matahari.' },
  { cat: 'sains', q: 'Gas yang dibutuhkan manusia untuk bernapas adalah?', options: ['Karbon dioksida', 'Nitrogen', 'Oksigen', 'Helium'], answer: 2, explain: 'Manusia membutuhkan oksigen untuk bernapas.' },
  { cat: 'sains', q: 'Air membeku pada suhu berapa derajat Celsius?', options: ['100', '50', '0', '-10'], answer: 2, explain: 'Pada tekanan normal, air membeku pada 0°C.' },
  { cat: 'sains', q: 'Tulang terpanjang di tubuh manusia adalah?', options: ['Humerus', 'Femur', 'Tibia', 'Radius'], answer: 1, explain: 'Femur atau tulang paha adalah tulang terpanjang di tubuh.' },

  { cat: 'sejarah', q: 'Proklamasi kemerdekaan Indonesia dibacakan pada tahun?', options: ['1942', '1945', '1949', '1928'], answer: 1, explain: 'Proklamasi dibacakan pada 17 Agustus 1945.' },
  { cat: 'sejarah', q: 'Perang yang dipimpin Pangeran Diponegoro dikenal sebagai?', options: ['Perang Padri', 'Perang Jawa', 'Perang Paregreg', 'Perang Puputan'], answer: 1, explain: 'Perang Jawa (1825–1830) dipimpin Pangeran Diponegoro.' },
  { cat: 'sejarah', q: 'Candi Borobudur dibangun oleh dinasti?', options: ['Majapahit', 'Sriwijaya', 'Syailendra', 'Demak'], answer: 2, explain: 'Borobudur umumnya dikaitkan dengan Dinasti Syailendra.' },
  { cat: 'sejarah', q: 'Sumpah Pemuda dicetuskan pada tahun?', options: ['1908', '1928', '1945', '1965'], answer: 1, explain: 'Sumpah Pemuda diikrarkan pada 28 Oktober 1928.' },

  { cat: 'geografi', q: 'Gunung tertinggi di Indonesia adalah?', options: ['Semeru', 'Puncak Jaya', 'Rinjani', 'Kerinci'], answer: 1, explain: 'Puncak Jaya di Papua adalah gunung tertinggi di Indonesia.' },
  { cat: 'geografi', q: 'Benua terluas di dunia adalah?', options: ['Afrika', 'Asia', 'Eropa', 'Amerika'], answer: 1, explain: 'Asia adalah benua terluas di dunia.' },
  { cat: 'geografi', q: 'Negara dengan luas terkecil di dunia adalah?', options: ['Monako', 'Vatikan', 'San Marino', 'Liechtenstein'], answer: 1, explain: 'Vatikan adalah negara berdaulat terkecil di dunia.' },
  { cat: 'geografi', q: 'Samudra terbesar di dunia adalah?', options: ['Atlantik', 'Hindia', 'Pasifik', 'Arktik'], answer: 2, explain: 'Samudra Pasifik adalah samudra terbesar.' },

  { cat: 'teknologi', q: 'Singkatan CPU adalah?', options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Core Processing Unit'], answer: 0, explain: 'CPU adalah singkatan dari Central Processing Unit.' },
  { cat: 'teknologi', q: 'Bahasa markup standar untuk membuat struktur halaman web adalah?', options: ['HTML', 'Python', 'Photoshop', 'Excel'], answer: 0, explain: 'HTML digunakan untuk menyusun struktur halaman web.' },
  { cat: 'teknologi', q: 'Memori RAM bersifat?', options: ['Permanen', 'Sementara', 'Tidak ada', 'Hanya baca'], answer: 1, explain: 'RAM menyimpan data sementara selama perangkat menyala.' },
  { cat: 'teknologi', q: 'Perangkat yang berfungsi untuk memasukkan teks ke komputer adalah?', options: ['Monitor', 'Speaker', 'Keyboard', 'Printer'], answer: 2, explain: 'Keyboard adalah perangkat input untuk mengetik.' },

  { cat: 'bahasa', q: 'Antonim (lawan kata) dari "tinggi" adalah?', options: ['Besar', 'Rendah', 'Dalam', 'Panjang'], answer: 1, explain: 'Lawan kata tinggi adalah rendah.' },
  { cat: 'bahasa', q: 'Penulisan yang baku adalah?', options: ['resiko', 'risiko', 'resico', 'risico'], answer: 1, explain: 'Bentuk baku dalam KBBI adalah "risiko".' },
  { cat: 'bahasa', q: 'Sinonim (persamaan kata) dari "pandai" adalah?', options: ['Bodoh', 'Cerdas', 'Malas', 'Lambat'], answer: 1, explain: 'Pandai memiliki makna yang sama dengan cerdas.' },
  { cat: 'bahasa', q: 'Kata baku dari "nggak" adalah?', options: ['tidak', 'enggak', 'gak', 'ngga'], answer: 0, explain: 'Bentuk baku yang benar adalah "tidak".' }
];

// Tema warna yang tersedia di pengaturan.
const THEMES = [
  { id: 'red', name: 'Merah', color: '#dc2626' },
  { id: 'blue', name: 'Biru', color: '#2563eb' },
  { id: 'purple', name: 'Ungu', color: '#7c3aed' },
  { id: 'green', name: 'Hijau', color: '#16a34a' },
  { id: 'pink', name: 'Pink', color: '#db2777' },
  { id: 'orange', name: 'Orange', color: '#ea580c' }
];

// Daftar pencapaian. check(state) mengembalikan true jika sudah tercapai.
const ACHIEVEMENTS = [
  { id: 'first', icon: '🥇', name: 'Level Pertama', desc: 'Selesaikan 1 level', check: s => s.levelsDone >= 1 },
  { id: 'ten', icon: '🔟', name: 'Sepuluh Level', desc: 'Selesaikan 10 level', check: s => s.levelsDone >= 10 },
  { id: 'quiz', icon: '🎯', name: 'Kuis Sempurna', desc: 'Dapat skor penuh di kuis ABCD', check: s => s.quizPerfect },
  { id: 'rich', icon: '💰', name: 'Kaya Koin', desc: 'Kumpulkan 200 koin', check: s => s.coins >= 200 },
  { id: 'streak', icon: '🔥', name: 'Tanpa Salah', desc: 'Jawab 10 benar berturut-turut', check: s => s.bestStreak >= 10 }
];
