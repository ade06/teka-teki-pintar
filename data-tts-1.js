/* Tambahan level TTS (bagian 1). Kata = huruf kapital tanpa spasi. */
TTS_LEVELS.push(
  { cat: 'TTS Umum', title: 'Di Dapur', words: [
    { w: 'PISAU', c: 'Alat untuk memotong sayuran' }, { w: 'PIRING', c: 'Wadah untuk menaruh makanan' },
    { w: 'GARAM', c: 'Bumbu rasa asin' }, { w: 'PANCI', c: 'Wadah untuk memasak' }, { w: 'GULA', c: 'Pemanis dari tebu' } ] },
  { cat: 'TTS Umum', title: 'Di Sekolah', words: [
    { w: 'GURU', c: 'Pengajar di kelas' }, { w: 'KELAS', c: 'Ruang belajar murid' },
    { w: 'PAPAN', c: 'Tempat guru menulis di kelas' }, { w: 'TAS', c: 'Wadah buku murid' }, { w: 'ULANGAN', c: 'Tes untuk mengukur pemahaman' } ] },
  { cat: 'TTS Umum', title: 'Cuaca', words: [
    { w: 'HUJAN', c: 'Air yang turun dari langit' }, { w: 'PANAS', c: 'Suhu yang tinggi' },
    { w: 'MENDUNG', c: 'Langit tertutup awan gelap' }, { w: 'BADAI', c: 'Angin dan hujan yang sangat kuat' }, { w: 'EMBUN', c: 'Titik air di pagi hari' } ] },
  { cat: 'TTS Umum', title: 'Transportasi', words: [
    { w: 'BUS', c: 'Kendaraan umum untuk banyak penumpang' }, { w: 'MOBIL', c: 'Kendaraan roda empat' },
    { w: 'KAPAL', c: 'Kendaraan air' }, { w: 'PESAWAT', c: 'Kendaraan yang terbang' }, { w: 'BECAK', c: 'Kendaraan roda tiga di Indonesia' } ] },
  { cat: 'TTS Umum', title: 'Warna', words: [
    { w: 'MERAH', c: 'Warna darah' }, { w: 'HIJAU', c: 'Warna daun' }, { w: 'KUNING', c: 'Warna pisang matang' },
    { w: 'BIRU', c: 'Warna langit cerah' }, { w: 'UNGU', c: 'Warna terong' } ] },
  { cat: 'TTS Umum', title: 'Waktu', words: [
    { w: 'PAGI', c: 'Waktu setelah subuh' }, { w: 'SIANG', c: 'Waktu saat matahari tinggi' },
    { w: 'SORE', c: 'Waktu menjelang malam' }, { w: 'MALAM', c: 'Waktu gelap setelah senja' }, { w: 'MINGGU', c: 'Tujuh hari' } ] },
  { cat: 'TTS Umum', title: 'Pakaian', words: [
    { w: 'BAJU', c: 'Pakaian untuk badan' }, { w: 'CELANA', c: 'Pakaian untuk kaki' },
    { w: 'SARUNG', c: 'Kain tenun untuk dikenakan di pinggang' }, { w: 'SEPATU', c: 'Alas kaki tertutup' }, { w: 'TOPI', c: 'Penutup kepala' } ] },
  { cat: 'TTS Umum', title: 'Olahraga', words: [
    { w: 'BOLA', c: 'Benda bundar untuk dimainkan' }, { w: 'RENANG', c: 'Olahraga di dalam air' },
    { w: 'LARI', c: 'Gerakan cepat dengan kaki' }, { w: 'SENAM', c: 'Latihan gerak tubuh teratur' }, { w: 'PANAH', c: 'Olahraga memanah' } ] },
  { cat: 'TTS Pengetahuan', title: 'Planet', words: [
    { w: 'BUMI', c: 'Planet tempat kita tinggal' }, { w: 'MARS', c: 'Planet merah' },
    { w: 'VENUS', c: 'Planet terpanas' }, { w: 'SATURN', c: 'Planet bercincin' }, { w: 'JUPITER', c: 'Planet terbesar di tata surya' } ] },
  { cat: 'TTS Pengetahuan', title: 'Tumbuhan', words: [
    { w: 'AKAR', c: 'Bagian tumbuhan di dalam tanah' }, { w: 'DAUN', c: 'Tempat fotosintesis' },
    { w: 'BATANG', c: 'Penopang tumbuhan' }, { w: 'BUAH', c: 'Hasil dari bunga yang dibuahi' }, { w: 'BIJI', c: 'Bagian yang bisa tumbuh menjadi tanaman' } ] },
  { cat: 'TTS Pengetahuan', title: 'Organ Tubuh', words: [
    { w: 'PARU', c: 'Organ untuk bernapas' }, { w: 'GINJAL', c: 'Organ penyaring darah' },
    { w: 'OTAK', c: 'Pusat kendali tubuh' }, { w: 'PERUT', c: 'Tempat lambung berada' }, { w: 'KULIT', c: 'Lapisan terluar tubuh' } ] },
  { cat: 'TTS Pengetahuan', title: 'Benda Langit', words: [
    { w: 'BULAN', c: 'Satelit alami bumi' }, { w: 'KOMET', c: 'Benda langit berekor' },
    { w: 'BINTANG', c: 'Benda langit yang memancarkan cahaya' }, { w: 'GALAKSI', c: 'Kumpulan jutaan bintang' }, { w: 'ASTEROID', c: 'Batu angkasa yang mengorbit matahari' } ] },
  { cat: 'TTS Pengetahuan', title: 'Musim dan Alam', words: [
    { w: 'MUSIM', c: 'Periode perubahan cuaca tahunan' }, { w: 'PELANGI', c: 'Lengkung warna di langit' },
    { w: 'GEMPA', c: 'Getaran di permukaan bumi' }, { w: 'GUNUNG', c: 'Daratan yang sangat tinggi' }, { w: 'LAHAR', c: 'Aliran material gunung berapi' } ] },
  { cat: 'TTS Pengetahuan', title: 'Sains Dasar', words: [
    { w: 'ATOM', c: 'Satuan terkecil dari unsur' }, { w: 'MAGNET', c: 'Benda yang menarik besi' },
    { w: 'ENERGI', c: 'Kemampuan untuk melakukan kerja' }, { w: 'GRAVITASI', c: 'Gaya tarik bumi' }, { w: 'MOLEKUL', c: 'Gabungan dari atom' } ] },
  { cat: 'TTS Dunia', title: 'Ibu Kota', words: [
    { w: 'PARIS', c: 'Ibu kota Prancis' }, { w: 'ROMA', c: 'Ibu kota Italia' },
    { w: 'LONDON', c: 'Ibu kota Inggris' }, { w: 'KAIRO', c: 'Ibu kota Mesir' }, { w: 'SEOUL', c: 'Ibu kota Korea Selatan' } ] },
  { cat: 'TTS Dunia', title: 'Benua', words: [
    { w: 'AFRIKA', c: 'Benua tempat Gurun Sahara' }, { w: 'EROPA', c: 'Benua tempat Prancis' },
    { w: 'ASIA', c: 'Benua terluas di dunia' }, { w: 'AMERIKA', c: 'Benua dengan negara Brazil' }, { w: 'AUSTRALIA', c: 'Benua terkecil' } ] },
  { cat: 'TTS Dunia', title: 'Tokoh Dunia', words: [
    { w: 'NEWTON', c: 'Ilmuwan penemu hukum gravitasi' }, { w: 'EINSTEIN', c: 'Ilmuwan teori relativitas' },
    { w: 'GANDHI', c: 'Pemimpin kemerdekaan India' }, { w: 'MANDELA', c: 'Tokoh anti-apartheid Afrika Selatan' } ] },
  { cat: 'TTS Dunia', title: 'Sungai dan Laut', words: [
    { w: 'NIL', c: 'Sungai di Mesir' }, { w: 'AMAZON', c: 'Sungai di Amerika Selatan' },
    { w: 'HINDIA', c: 'Samudra di sebelah selatan Asia' }, { w: 'PASIFIK', c: 'Samudra terbesar' }, { w: 'ATLANTIK', c: 'Samudra di antara Eropa dan Amerika' } ] },
  { cat: 'TTS Dunia', title: 'Makanan Dunia', words: [
    { w: 'PIZZA', c: 'Makanan asal Italia' }, { w: 'SUSHI', c: 'Makanan asal Jepang' },
    { w: 'TACO', c: 'Makanan khas Meksiko' }, { w: 'PASTA', c: 'Makanan dari tepung khas Italia' } ] },
  { cat: 'TTS Dunia', title: 'Negara Asia', words: [
    { w: 'THAILAND', c: 'Negara dengan Bangkok' }, { w: 'VIETNAM', c: 'Negara dengan Hanoi' },
    { w: 'MALAYSIA', c: 'Negara tetangga Indonesia' }, { w: 'FILIPINA', c: 'Negara kepulauan di utara Indonesia' } ] },
  { cat: 'TTS Sejarah', title: 'Pergerakan', words: [
    { w: 'BUDIUTOMO', c: 'Organisasi kebangkitan nasional tahun 1908' }, { w: 'SUMPAH', c: 'Janji yang dibacakan pemuda tahun 1928' },
    { w: 'RENGASDENGKLOK', c: 'Tempat penculikan Soekarno-Hatta' }, { w: 'JEPANG', c: 'Penjajah terakhir Indonesia' } ] },
  { cat: 'TTS Sejarah', title: 'Tokoh Nusantara', words: [
    { w: 'DIPONEGORO', c: 'Pemimpin Perang Jawa' }, { w: 'KARTINI', c: 'Pejuang emansipasi wanita' },
    { w: 'TEUKUUMAR', c: 'Pahlawan perang dari Aceh' }, { w: 'HASANUDIN', c: 'Sultan Gowa yang dijuluki Ayam Jantan dari Timur' } ] },
  { cat: 'TTS Sejarah', title: 'Kerajaan', words: [
    { w: 'SRIWIJAYA', c: 'Kerajaan maritim di Sumatra' }, { w: 'MAJAPAHIT', c: 'Kerajaan besar di Jawa Timur' },
    { w: 'DEMAK', c: 'Kerajaan Islam pertama di Jawa' }, { w: 'MATARAM', c: 'Kerajaan agraris di Jawa Tengah' } ] },
  { cat: 'TTS Sejarah', title: 'Candi', words: [
    { w: 'BOROBUDUR', c: 'Candi Buddha terbesar di dunia' }, { w: 'PRAMBANAN', c: 'Candi Hindu di Yogyakarta' },
    { w: 'MENDUT', c: 'Candi dekat Borobudur' }, { w: 'KALASAN', c: 'Candi Buddha di Yogyakarta' } ] },
  { cat: 'TTS Sejarah', title: 'Perang', words: [
    { w: 'PADRI', c: 'Perang di Sumatra Barat' }, { w: 'PUPUTAN', c: 'Perang habis-habisan di Bali' },
    { w: 'PERANG', c: 'Konflik bersenjata' }, { w: 'DAMAI', c: 'Keadaan tanpa perang' }, { w: 'TENTARA', c: 'Pasukan bersenjata negara' } ] },
  { cat: 'TTS Indonesia', title: 'Pulau', words: [
    { w: 'JAWA', c: 'Pulau terpadat di Indonesia' }, { w: 'BALI', c: 'Pulau dewata' },
    { w: 'LOMBOK', c: 'Pulau bersebelahan dengan Bali' }, { w: 'SULAWESI', c: 'Pulau berbentuk huruf K' }, { w: 'SUMATRA', c: 'Pulau terbesar keenam di dunia' } ] },
  { cat: 'TTS Indonesia', title: 'Makanan Khas', words: [
    { w: 'SATE', c: 'Daging tusuk dibakar' }, { w: 'GADO', c: 'Sayuran dengan bumbu kacang' },
    { w: 'SOTO', c: 'Sup berkuah khas Indonesia' }, { w: 'BAKSO', c: 'Bola daging berkuah' }, { w: 'PECEL', c: 'Sayur dengan bumbu kacang khas Jawa' } ] },
  { cat: 'TTS Indonesia', title: 'Tarian', words: [
    { w: 'SAMAN', c: 'Tari dari Aceh yang dikenal dengan tepuk tangan' }, { w: 'KECAK', c: 'Tari dari Bali dengan paduan suara' },
    { w: 'JAIPONG', c: 'Tari dari Jawa Barat yang enerjik' }, { w: 'PENDET', c: 'Tari penyambutan dari Bali' } ] },
  { cat: 'TTS Indonesia', title: 'Alat Musik', words: [
    { w: 'SASANDO', c: 'Alat musik petik dari Nusa Tenggara Timur' }, { w: 'SERUNAI', c: 'Alat musik tiup dari Minangkabau' },
    { w: 'SULING', c: 'Alat musik tiup dari bambu' }, { w: 'KENDANG', c: 'Alat musik pukul' } ] },
  { cat: 'TTS Hewan', title: 'Hewan Laut', words: [
    { w: 'PAUS', c: 'Mamalia laut terbesar' }, { w: 'HIU', c: 'Ikan predator bertulang rawan' },
    { w: 'PENYU', c: 'Reptil laut bercangkang' }, { w: 'LUMBALUMBA', c: 'Mamalia laut yang cerdas' }, { w: 'KERANG', c: 'Hewan laut bercangkang dua' } ] }
);
