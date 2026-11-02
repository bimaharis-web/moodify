# 🎵 MOODIFY — Your Music. Your Mood. Your Story.

**MOODIFY** adalah platform musik sosial untuk anak muda yang memungkinkan pengguna menemukan lagu berdasarkan mood, berbagi musik, membuat playlist, mengikuti teman, dan berinteraksi dengan komunitas musik.

**Developed by [Bima Haris](https://bimaharis.my.id)**

---

## 📋 Daftar Isi

- [Fitur](#-fitur)
- [Teknologi](#-teknologi)
- [Struktur File](#-struktur-file)
- [Cara Menjalankan](#-cara-menjalankan)
- [Konfigurasi API](#-konfigurasi-api)
- [Roadmap](#-roadmap)
- [Lisensi](#-lisensi)

---

## ✨ Fitur

### Tahap 1 — Brand & UI (✅ Selesai)

- **Brand MOODIFY** — Identitas lengkap dengan tagline "Your Music. Your Mood. Your Story."
- **Dark Premium UI** — Desain modern, elegan dengan aksen ungu, violet, pink, dan neon
- **Responsive Design** — Tampilan sempurna di desktop, tablet, dan smartphone
- **Sidebar Navigasi** — Menu lengkap: Beranda, Discover, Feed, Koleksi, Profil, Pengaturan
- **Mobile Navigation** — Bottom navigation bar untuk perangkat mobile
- **Hero Section** — Landing section dengan animasi dan call-to-action
- **Mood Categories** — 8 kategori mood: Happy, Sad, Chill, Focus, Romantic, Party, Workout, Nostalgia
- **Trending Songs** — Daftar lagu trending dari komunitas
- **Modal System** — Modal untuk login, registrasi, bagikan vibe, buat playlist, edit profil
- **Toast Notifications** — Notifikasi popup untuk feedback interaksi
- **Developer Credit** — Kredit "Developed by Bima Haris" di semua halaman

### Tahap 2 — YouTube Integration (✅ Selesai)

- **YouTube Data API v3** — Pencarian video musik dengan thumbnail, judul, channel, durasi, dan view count
- **YouTube IFrame Player API** — Pemutaran musik/video langsung di dalam MOODIFY
- **Bottom Player Terintegrasi** — Player bar terhubung dengan YouTube Player
- **Kontrol Pemutaran** — Play, pause, next, previous, volume, dan progress bar dengan seek
- **Sistem Antrean (Queue)** — Tambah, hapus, dan putar lagu dari antrean
- **Progress Tracking** — Waktu saat ini, durasi total, dan progress bar real-time
- **Volume Control** — Slider volume dan tombol mute/unmute
- **Queue Panel** — Panel antrean lagu dengan indikator lagu yang sedang diputar
- **Error Handling** — Penanganan video tidak tersedia, dibatasi wilayah, atau gagal diputar
- **Retry Logic** — Otomatis mencoba video alternatif jika video gagal diputar
- **Auto Play Next** — Otomatis memutar lagu berikutnya saat lagu selesai
- **Demo Fallback** — Fallback ke pencarian YouTube di tab baru jika API key belum dikonfigurasi

### Fitur Musik

- **Pencarian Musik Tanpa Batas** — Cari lagu apa saja dari YouTube, iTunes, dan Audius (tanpa API key)
- **YouTube InnerTube API** — Pencarian YouTube langsung tanpa API key, hasil lengkap dengan judul, artis, durasi, dan view count
- **iTunes Search API** — Preview 30 detik untuk setiap lagu (gratis tanpa API key)
- **Audius API** — Streaming musik langsung dari platform Audius
- **MusicBrainz API** — Metadata lengkap artis, album, dan rekaman
- **18 Lagu Demo** — Lagu populer Indonesia 2024-2025 yang bisa langsung diputar
- **Simpan Lagu** — Tambahkan/hapus lagu dari koleksi pribadi
- **Playlist** — Buat, edit, hapus playlist dengan lagu
- **Bagikan Musik** — Bagikan lagu ke feed sosial
- **Recently Played** — Riwayat lagu yang baru saja diputar

### Fitur Sosial

- **Community Feed** — Lihat post musik dari teman
- **Like & Comment** — Suka dan komentar pada post
- **Follow/Unfollow** — Ikuti atau berhenti mengikuti pengguna
- **Buat Post** — Bagikan vibe dengan lagu
- **Profil Pengguna** — Halaman profil dengan statistik

### Integrasi

- **YouTube IFrame Player API** — ✅ Pemutar musik/video YouTube di halaman (terintegrasi)
- **YouTube InnerTube API** — ✅ Pencarian YouTube tanpa API key (aktif)
- **YouTube Data API v3** — ✅ Pencarian video musik (opsional, untuk hasil lebih akurat)
- **Spotify Web API** — ✅ OAuth PKCE, profil, playlist, detail lagu (terintegrasi)
- **iTunes Search API** — ✅ Pencarian + preview 30 detik (aktif tanpa API key)
- **Audius API** — ✅ Pencarian + streaming musik (aktif tanpa API key)
- **MusicBrainz API** — ✅ Metadata musik (aktif tanpa API key)

---

## 🛠 Teknologi

- **HTML5** — Struktur halaman
- **CSS3** — Styling dengan CSS Variables, Grid, Flexbox, Animations
- **Vanilla JavaScript** — Logika aplikasi tanpa framework
- **YouTube IFrame Player API** — Pemutar musik/video di halaman
- **YouTube InnerTube API** — Pencarian YouTube tanpa API key
- **YouTube Data API v3** — Pencarian video (opsional)
- **Spotify Web API** — Integrasi Spotify (OAuth PKCE)
- **iTunes Search API** — Pencarian musik + preview 30 detik
- **Audius API** — Pencarian + streaming musik
- **MusicBrainz API** — Metadata musik
- **localStorage** — Penyimpanan data lokal

---

## 📁 Struktur File

```
moodify/
├── index.html              # Halaman utama (SPA - Single Page Application)
├── playlist.html           # Halaman detail playlist
├── profile.html            # Halaman profil pengguna
├── settings.html           # Halaman pengaturan & koneksi API
├── vibelist-preview.html   # Prototype lama (dipertahankan)
│
├── css/
│   ├── style.css           # Stylesheet utama (dark premium theme)
│   └── responsive.css      # Responsive styles (mobile/tablet)
│
├── js/
│   ├── config.example.js   # Template konfigurasi API keys
│   ├── app.js              # Core application logic
│   ├── navigation.js       # Page navigation & routing
│   ├── music-search.js     # Unified search: iTunes, MusicBrainz, Audius, YouTube
│   ├── music-sources.js    # Music sources: iTunes, MusicBrainz, Audius
│   ├── yt-search.js        # YouTube search via InnerTube API (no API key)
│   ├── youtube-player.js   # YouTube IFrame Player integration
│   ├── spotify.js          # Spotify OAuth PKCE integration
│   ├── playlist.js         # Playlist management
│   ├── social.js           # Social features (posts, likes, comments)
│   └── auth.js             # Authentication (login/register)
│
├── assets/
│   ├── images/             # Gambar & artwork
│   └── icons/              # Ikon aplikasi
│
└── README.md               # Dokumentasi ini
```

---

## 🚀 Cara Menjalankan

### Metode 1: Buka Langsung (Termudah)

1. Buka folder project di komputer Anda
2. Klik dua kali pada file `index.html`
3. Aplikasi akan terbuka di browser default Anda

### Metode 2: Local Server (Direkomendasikan)

Menggunakan local server untuk menghindari masalah CORS:

**Python:**
```bash
cd "/Volumes/ARYO/web develop"
python3 -m http.server 8000
```

**Node.js:**
```bash
npx serve "/Volumes/ARYO/web develop" -p 8000
```

**PHP:**
```bash
php -S localhost:8000
```

Kemudian buka `http://localhost:8000` di browser.

### Metode 3: Live Server (VS Code)

1. Install extension **Live Server** di VS Code
2. Klik kanan pada `index.html`
3. Pilih **Open with Live Server**

---

## 🔑 Konfigurasi API

### iTunes Search API (✅ Aktif Tanpa Konfigurasi)

iTunes Search API sudah aktif secara default. Tidak perlu API key.

### YouTube Data API v3 (Opsional - Direkomendasikan)

YouTube Data API v3 memungkinkan pencarian video musik langsung di MOODIFY dengan thumbnail, durasi, dan view count.

> 💡 **PENTING:** YouTube IFrame Player API (untuk memutar lagu) **TIDAK** memerlukan API key. API key hanya dibutuhkan untuk fitur pencarian video. Jadi aplikasi tetap bisa memutar lagu tanpa API key!

**Langkah Setup Detail:**

#### Langkah 1: Buat Project di Google Cloud

1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. Login dengan akun Google Anda
3. Klik **Select a project** di top bar
4. Klik **New Project** (atau **+ NEW PROJECT**)
5. Isi **Project name**: `MOODIFY` (atau nama lain)
6. Klik **Create**
7. Tunggu project dibuat, lalu klik **Select Project**

#### Langkah 2: Aktifkan YouTube Data API v3

1. Di sidebar kiri, klik **APIs & Services** → **Library**
   - Atau buka langsung: [API Library](https://console.cloud.google.com/apis/library)
2. Di kolom pencarian, ketik: `YouTube Data API v3`
3. Klik pada hasil **YouTube Data API v3**
4. Klik tombol biru **Enable**
5. Tunggu hingga API aktif (akan muncul "API is enabled")

#### Langkah 3: Buat API Key

1. Di sidebar kiri, klik **APIs & Services** → **Credentials**
   - Atau buka langsung: [Credentials](https://console.cloud.google.com/apis/credentials)
2. Klik **+ CREATE CREDENTIALS** di atas
3. Pilih **API key**
4. Popup akan muncul dengan API key baru Anda
5. Klik **OK** untuk menutup popup
6. API key sekarang muncul di daftar credentials

#### Langkah 4: Batasi API Key (Wajib untuk Keamanan)

1. Di daftar credentials, klik **ikon edit (✏️)** pada API key yang baru dibuat
2. Di bagian **API restrictions**, klik **Restrict key**
3. Cari dan pilih **YouTube Data API v3**
4. Di bagian **Application restrictions**:
   - Pilih **HTTP referrers (web sites)** jika sudah punya domain
   - Pilih **None** untuk testing lokal (tidak disarankan untuk production)
5. Jika memilih **HTTP referrers**:
   - Klik **Add item**
   - Masukkan: `http://localhost:8000/*` (untuk testing lokal)
   - Tambahkan lagi: `https://bimaharis.my.id/*` (untuk production)
6. Klik **Save**

#### Langkah 5: Konfigurasi di MOODIFY

1. Salin API key dari Google Cloud Console
2. Buka file `js/config.js` (sudah tersedia di project)
3. Ganti baris:
   ```javascript
   YOUTUBE_API_KEY: 'AIzaSyAXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
   ```
   menjadi:
   ```javascript
   YOUTUBE_API_KEY: 'AIzaSyA1234567890abcdef...',  // API key Anda
   ```
4. Simpan file dan refresh browser

> ✅ **File `config.js` sudah tersedia** — tidak perlu menyalin dari config.example.js lagi.
> 📄 HTML sudah otomatis memuat `config.js` — tidak perlu mengubah file HTML.

**Quota & Batasan:**
- **Free tier**: 10,000 units/hari
- **Search request**: ~100 units/request
- **Video details**: ~1 unit/request
- **Estimasi**: ~100 pencarian/hari dengan quota gratis

**Tanpa API Key (Mode Default):**
- ✅ **Pencarian YouTube** berfungsi via database 40+ lagu populer
- ✅ **Pencarian iTunes** berfungsi dengan preview 30 detik
- ✅ **Pencarian MusicBrainz** berfungsi untuk metadata
- ✅ Lagu demo tetap bisa diputar via YouTube IFrame Player
- ✅ Semua fitur sosial berfungsi penuh

**Dengan API Key (Opsional — Direkomendasikan):**
- 🔍 **Pencarian YouTube tanpa batas** — cari lagu apa saja, bukan hanya 40+ lagu di database
- 📊 Statistik view count dan durasi lebih detail
- 🎯 Hasil pencarian lebih akurat dan relevan

> 💡 **Tips:** Jika Anda tidak punya kartu kredit untuk verifikasi Google Cloud, Anda tetap bisa menggunakan MOODIFY dengan iTunes + database fallback. Tapi dengan API key, pencarian YouTube akan jauh lebih lengkap!

---

## 🔍 Cara Menggunakan Pencarian Musik

MOODIFY bisa mencari **lagu apa saja** dari berbagai sumber musik gratis. Tidak perlu API key!

### Cara Mencari Lagu

1. **Buka MOODIFY** di browser
2. **Ketik nama lagu atau artis** di kolom pencarian (contoh: "Hindia", "Tulus", "Taylor Swift")
3. **Tekan Enter** atau klik tombol cari
4. **Hasil pencarian** akan muncul di-group berdasarkan sumber:
   - ▶️ **YouTube** — Video musik yang bisa diputar langsung di halaman
   - 🍎 **iTunes** — Preview 30 detik setiap lagu
   - 🎧 **Audius** — Streaming musik langsung
   - 🧠 **MusicBrainz** — Informasi metadata lagu

### Cara Memutar Lagu

| Sumber | Cara Memutar | Durasi |
|--------|-------------|--------|
| **YouTube** | Klik lagu ▶️ YouTube → video muncul di halaman | Full lagu |
| **iTunes** | Klik lagu 🍎 iTunes → preview diputar | 30 detik |
| **Audius** | Klik lagu 🎧 Audius → streaming diputar | Full lagu (jika tersedia) |
| **MusicBrainz** | Klik lagu → otomatis cari preview iTunes/Audius | Tergantung sumber |

### Contoh Pencarian yang Bisa Dicoba

- **Lagu Indonesia**: "Hindia", "Tulus", "Nadin Amizah", "Pamungkas", "Mahalini"
- **Lagu Internasional**: "Taylor Swift", "The Weeknd", "Ed Sheeran", "BTS"
- **Genre**: "lofi", "jazz", "rock", "pop", "R&B"
- **Mood**: "chill music", "workout", "study music", "party"

### Tips

- 🔍 **Semakin spesifik** kata kunci, semakin akurat hasil pencarian
- 📺 **Tombol 📺** di bottom player untuk menampilkan/menyembunyikan video YouTube
- 🎵 **Klik lagu di trending** untuk langsung memutar tanpa perlu mencari
- 💾 **Simpan lagu** ke koleksi dengan klik tombol ❤️
- 📋 **Tambah ke playlist** untuk membuat daftar lagu pribadi

**Troubleshooting Google Cloud:**

| Masalah | Solusi |
|---------|--------|
| Tidak bisa membuat project | Pastikan akun Google tidak dibatasi (bukan akun keluarga dengan parental control) |
| API tidak muncul di Library | Coba ketik "YouTube" saja, lalu cari "YouTube Data API v3" |
| Error "API not enabled" | Pastikan sudah klik Enable di halaman API |
| API key tidak bekerja | Periksa apakah API restrictions sudah diatur ke YouTube Data API v3 |
| Error 403 QUOTA_EXCEEDED | Quota harian habis, tunggu reset atau upgrade billing |
| Error 403 ACCESS_NOT_CONFIGURED | Aktifkan billing di Google Cloud (gratis, tapi perlu kartu kredit) |
| Billing wajib? | Untuk YouTube Data API v3, billing HARUS diaktifkan. Tidak perlu bayar, tapi perlu kartu kredit untuk verifikasi. |

> ⚠️ **Catatan Penting:** Sejak 2020, Google mewajibkan billing account untuk YouTube Data API v3. Anda perlu menambahkan metode pembayaran (kartu kredit/debit) di Google Cloud. **Anda tidak akan dikenakan biaya** selama tetap dalam batas free tier (10,000 units/hari).

> 💳 **Tidak punya kartu kredit?** Anda tetap bisa menggunakan MOODIFY secara penuh:
> - ✅ Pencarian via **iTunes** — preview 30 detik setiap lagu (tanpa batas)
> - ✅ **Database 40+ lagu populer** — bisa langsung diputar dari YouTube
> - ✅ **MusicBrainz** — metadata lengkap artis dan album
> - ✅ Semua fitur sosial, playlist, dan profil berfungsi 100%
> - 🎵 Untuk pencarian YouTube tanpa batas, minta teman yang punya akun Google Cloud untuk membantu membuat API key

> 🔒 **Keamanan:** Jangan pernah commit `config.js` ke GitHub. File ini sudah ada di `.gitignore`. Selalu gunakan `config.example.js` sebagai template.

### Spotify Web API (✅ Terintegrasi - Opsional)

Spotify Web API memungkinkan pengguna menghubungkan akun Spotify untuk melihat profil, playlist, dan detail lagu.

**Langkah Setup:**

1. Buka [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Login dengan akun Spotify
3. Klik **Create App**
4. Isi nama aplikasi (contoh: "MOODIFY") dan deskripsi
5. Centang persetujuan Terms of Service
6. Salin **Client ID** yang ditampilkan
7. Klik **Edit Settings**
8. Tambahkan **Redirect URI**:
   - Lokal: `http://localhost:8000/settings.html`
   - Produksi: `https://bimaharis.my.id/settings.html`
9. Buka `js/config.js` dan isi:
    ```javascript
    SPOTIFY_CLIENT_ID: 'YOUR_CLIENT_ID_HERE'
    ```

> ✅ **File `config.js` sudah tersedia** — tidak perlu menyalin dari config.example.js lagi.
> 📄 HTML sudah otomatis memuat `config.js` — tidak perlu mengubah file HTML.

**Fitur yang Tersedia:**
- ✅ Connect/Disconnect Spotify
- ✅ OAuth Authorization Code with PKCE (tanpa Client Secret di frontend)
- ✅ Token management (access token + refresh token)
- ✅ Profil pengguna (nama, foto, username)
- ✅ Playlist pengguna dengan artwork
- ✅ Detail lagu, artis, album, dan durasi
- ✅ Tombol "Open in Spotify" di setiap item
- ✅ Status badge: Connected / Not Connected / Not Configured
- ✅ Mode demo dengan data contoh
- ✅ Auto-refresh token saat expired

**Scope yang Digunakan:**
- `user-read-email` — Email pengguna
- `user-read-private` — Profil privat
- `playlist-read-private` — Playlist privat
- `playlist-read-collaborative` — Playlist kolaboratif
- `user-top-read` — Lagu favorit
- `user-library-read` — Library pengguna

> ⚠️ **PENTING:** Jangan pernah menyimpan Client Secret di frontend. Client Secret hanya digunakan di backend/Edge Functions jika diperlukan.

> ℹ️ **Catatan:** Spotify Web Playback SDK tidak digunakan karena memerlukan akun Spotify Premium dan tidak tersedia untuk semua pengguna. Pemutaran musik tetap menggunakan YouTube IFrame Player.

**Tanpa Client ID:**
- Mode demo aktif dengan data contoh
- Playlist demo ditampilkan dengan label "Mode Demo"
- Fitur Connect Spotify menampilkan instruksi setup
- Tidak ada error — aplikasi tetap berfungsi penuh

---

## 🧪 Cara Menguji YouTube Integration

### Tanpa API Key (Demo Mode)

1. Buka `index.html` di browser
2. Klik lagu di trending atau discover
3. Lagu akan diputar dengan data demo
4. YouTube IFrame Player dimuat di background
5. Kontrol play/pause, next/previous berfungsi

### Dengan API Key (Full Mode)

1. Konfigurasi API key seperti di atas
2. Buka `index.html` di browser
3. Gunakan kolom pencarian untuk mencari lagu
4. Hasil pencarian YouTube akan muncul dengan thumbnail dan durasi
5. Klik lagu untuk memutar via YouTube IFrame Player
6. Test fitur:
   - **Play/Pause**: Tombol ▶/⏸ di bottom player
   - **Next/Previous**: Tombol ⏮/⏭
   - **Volume**: Slider volume di bottom player
   - **Progress Bar**: Klik pada progress bar untuk seek
   - **Queue**: Tombol 📋 untuk membuka panel antrean
   - **Auto Next**: Lagu otomatis berganti saat selesai

### Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Video tidak diputar | Periksa API key di `config.js` |
| Error 403 | API key tidak valid atau quota habis |
| Error 150 | Video tidak tersedia di wilayah Anda |
| Player tidak muncul | Pastikan koneksi internet stabil |
| Search tidak berfungsi | Periksa console browser untuk error |

---

## 🧪 Cara Menguji Spotify Integration

### Tanpa Client ID (Mode Demo)

1. Buka `settings.html` di browser
2. Anda akan melihat panel **Mode Demo** dengan playlist contoh
3. Klik playlist demo untuk melihat detail lagu
4. Tombol "Open in Spotify" akan membuka playlist di Spotify
5. Status badge menampilkan "Not Configured"
6. Instruksi setup ditampilkan untuk membantu konfigurasi

### Dengan Client ID (Full Mode)

1. Konfigurasi Client ID seperti di atas
2. Buka `settings.html` di browser
3. Klik **Connect Spotify**
4. Anda akan diarahkan ke halaman otorisasi Spotify
5. Login dan otorisasi aplikasi MOODIFY
6. Setelah berhasil, Anda akan diarahkan kembali ke MOODIFY
7. Status badge berubah menjadi "Connected"
8. Profil Spotify Anda ditampilkan (nama, foto, username)
9. Playlist Anda dimuat dan ditampilkan
10. Klik playlist untuk melihat detail lagu
11. Test fitur:
    - **Profil**: Nama, foto, dan username Spotify ditampilkan
    - **Playlist**: Daftar playlist dengan artwork dan jumlah lagu
    - **Detail Lagu**: Judul, artis, album, artwork, dan durasi
    - **Open in Spotify**: Membuka lagu/playlist di Spotify
    - **Disconnect**: Memutuskan koneksi dan kembali ke mode demo
    - **Auto Refresh**: Token otomatis diperbarui saat expired

### Troubleshooting Spotify

| Masalah | Solusi |
|---------|--------|
| Redirect error | Pastikan Redirect URI di Spotify Dashboard sesuai |
| Otorisasi dibatalkan | Coba lagi, pastikan scope diizinkan |
| Token expired | Token otomatis di-refresh, jika gagal silakan connect ulang |
| Playlist tidak muncul | Pastikan playlist dapat diakses (bukan privat terenkripsi) |
| Profil tidak muncul | Periksa koneksi internet dan coba connect ulang |

---

## 🗺 Roadmap

### ✅ Tahap 1 — Brand & UI (SELESAI)
- [x] Rebrand Vibelist → MOODIFY
- [x] Dark premium UI dengan aksen neon
- [x] Responsive design (desktop, tablet, mobile)
- [x] Semua halaman: Beranda, Discover, Feed, Koleksi, Profil, Pengaturan
- [x] Bottom player dengan kontrol musik
- [x] Modal system (login, register, share, playlist)
- [x] Developer credit "Developed by Bima Haris"
- [x] Modular JavaScript architecture

### ✅ Tahap 2 — YouTube Integration (SELESAI)
- [x] Integrasi pencarian YouTube Data API v3
- [x] Pemutaran musik langsung via YouTube IFrame Player API
- [x] Sistem antrean lagu (queue) dengan panel visual
- [x] Hubungkan hasil pencarian dengan bottom player
- [x] Kontrol pemutaran: play, pause, next, previous, volume, seek
- [x] Progress bar real-time dengan waktu saat ini dan durasi
- [x] Volume slider dan tombol mute/unmute
- [x] Handle video yang tidak tersedia, dibatasi wilayah, atau gagal diputar
- [x] Retry logic dengan video alternatif
- [x] Auto play next saat lagu selesai
- [x] Demo fallback jika API key belum dikonfigurasi
- [x] Dokumentasi setup YouTube API di config.example.js

### ✅ Tahap 3 — Spotify Integration (SELESAI)
- [x] Halaman pengaturan koneksi Spotify di settings.html
- [x] Implementasi OAuth Authorization Code with PKCE
- [x] Token management (access + refresh token)
- [x] Tampilkan profil Spotify (nama, foto, username)
- [x] Tampilkan playlist pengguna dengan artwork
- [x] Detail lagu, artis, album, dan durasi
- [x] Tombol "Open in Spotify" di setiap item
- [x] Disconnect Spotify dengan cleanup
- [x] Status badge: Connected / Not Connected / Not Configured
- [x] Mode demo dengan data contoh
- [x] Auto-refresh token saat expired
- [x] Scope minimum sesuai kebutuhan
- [x] Client Secret tidak disimpan di frontend
- [x] Responsive design untuk semua komponen Spotify

### 🔄 Tahap 4 — Backend (Supabase)
- [ ] Integrasi Supabase Authentication
- [ ] Database PostgreSQL (pengguna, postingan, komentar, like, follow, playlist)
- [ ] Supabase Storage untuk avatar & cover playlist
- [ ] Row Level Security (RLS)
- [ ] Real-time updates

### 🔄 Tahap 5 — Finalisasi
- [ ] Testing seluruh fitur
- [ ] Fix error JavaScript
- [ ] Audit keamanan
- [ ] Optimasi loading
- [ ] Deployment ke GitHub Pages

---

## 🎨 Brand Identity

- **Nama:** MOODIFY
- **Tagline:** Your Music. Your Mood. Your Story.
- **Developer:** Bima Haris
- **Warna Utama:** Ungu (#9b7cff), Pink (#ff6da9), Violet (#b48cff), Cyan (#6ee7e0)
- **Tema:** Dark Premium
- **Target:** Anak muda yang suka musik dan sosial

---

## 📝 Catatan

- File `vibelist-preview.html` dipertahankan sebagai backup prototype lama
- Semua data disimpan di `localStorage` browser (demo mode)
- API keys tidak disimpan di kode — gunakan `config.js` (tidak di-commit)
- Mode demo aktif secara default — fitur tetap berfungsi tanpa API key

---

## 📄 Lisensi

Project ini dibuat oleh **Bima Haris** untuk tujuan pembelajaran dan portofolio.

---

**MOODIFY** — Your Music. Your Mood. Your Story. 🎵
