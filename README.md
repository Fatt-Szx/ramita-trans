# RAMITA TRANS — konsep penyewaan bus

Website publik satu halaman (`index.html`) dengan HTML, CSS, dan JavaScript biasa, tanpa framework. Fokusnya adalah **kebutuhan perjalanan rombongan → ringkasan → permintaan penawaran melalui WhatsApp**.

## Membuka website

Buka `index.html` untuk melihat website. Agar penyimpanan lokal dan website menggunakan asal yang sama, gunakan server statis, misalnya `python -m http.server 8000`, lalu buka `http://localhost:8000/`. Python hanya menyajikan berkas; tidak menjalankan backend aplikasi.

Semua navigasi publik menuju bagian di halaman yang sama: Armada, Layanan, Kontak, dan formulir penawaran. Setiap kartu armada memiliki carousel empat foto dengan panah, titik navigasi, geser pada layar sentuh, dan dukungan tombol panah keyboard. Klik foto untuk membuka galeri detail pada foto yang sedang ditampilkan. Panel konfigurasi lokal tetap tersedia terpisah di `admin.html`, tetapi tidak menjadi bagian navigasi publik.

## Alur sewa

1. Isi lokasi jemput, tujuan, tanggal berangkat dan kembali, jumlah peserta, serta keperluan perjalanan.
2. Pilih preferensi armada jika ada dan tambahkan itinerary atau kebutuhan khusus.
3. Tinjau ringkasan. Durasi dihitung sebagai jumlah hari kalender termasuk tanggal berangkat dan kembali.
4. Lanjutkan ke WhatsApp dengan pesan terisi otomatis. Harga, ketersediaan unit, dan pemesanan memerlukan konfirmasi admin.

Kontak WhatsApp website menggunakan nomor **085280028725**. Alamat, jam layanan, dan tautan Google Maps dapat dikelola melalui menu **Konten & Kontak** pada panel admin. Informasi yang belum diisi tidak ditampilkan pada website publik.

Tombol WhatsApp mengambang di kanan bawah membuka kontak layanan dengan pesan awal. Formulir penawaran juga mengirim ringkasan kebutuhan perjalanan ke nomor yang sama.

## Data armada dan panel admin

- Banner memakai `Media/Aset Bus/49c20097-27e4-421b-9aa7-b8f5450e3d65.png`. `data.js` mendaftarkan empat bus sesuai subfolder `Media/Aset Bus/1`–`4`. Semua 16 foto asli dipakai sebagai empat sudut eksterior tiap bus. Salinan WebP yang lebih ringan untuk website ada di `assets/fleet/`.
- Kapasitas dan fasilitas sengaja kosong sampai data resmi tersedia. Admin dapat mengisi spesifikasi tiap unit, mengubah empat foto, layanan, banner, alamat, peta, jam layanan, dan nomor konsultasi.
- Semua perubahan hanya tersimpan di browser yang sama. Data armada memakai kunci `ramita-rental-v2-data` agar empat bus baru langsung tampil; konten dan draf konsultasi memakai kunci `ramita-rental-v1-*` yang sudah ada.
- **Draf Konsultasi** adalah salinan lokal saat pengunjung membuka WhatsApp atau berhasil menyalin pesan. Draf bukan bukti pesan terkirim atau sewa dikonfirmasi. Penyimpanan dibatasi pada 100 draf terakhir.
- Belum ada akun admin, sinkronisasi server, harga otomatis, kalender ketersediaan aktual, pembayaran, atau konfirmasi pemesanan otomatis.
- Belum ada foto interior di `Media/Aset Bus`; galeri hanya menampilkan tampak luar. Verifikasi identitas unit dan rincian armada sebelum publikasi.
- `polish.css` menyatukan skala font, material kaca, dan animasi masuk saat scroll pada website publik serta panel lokal. Foto belakang Armada 04 diberi ruang tampil khusus pada kartu dan galeri agar tidak terlihat terlalu dekat. Animasi mengikuti preferensi pengurangan gerakan perangkat.

Arahan konsep dan susunan halaman tersedia di `KONSEP.md`.
