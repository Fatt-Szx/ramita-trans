# Konsep RAMITA TRANS: penyewaan bus rombongan

## Fokus

Membantu calon penyewa menjelaskan kebutuhan perjalanan, mengenali pilihan armada, dan mengajukan penawaran melalui WhatsApp. Website mengutamakan rombongan wisata, sekolah, keluarga, kegiatan ibadah, perusahaan, serta acara khusus.

Alur yang dipilih pengguna: **isi kebutuhan perjalanan → penawaran via WhatsApp**.

## Pesan utama dan visual

- Judul beranda: **Satu bus. Banyak cerita.**
- Tombol utama: **Minta Penawaran**.
- Warna mengikuti identitas yang diberikan: hitam arang pada header/footer, putih/krem untuk area isi, kuning/oranye pada tombol, hijau untuk aksen. Panel banner, formulir, dan beberapa kartu menggunakan efek kaca transparan.
- Banner menggunakan `Media/Aset Bus/49c20097-27e4-421b-9aa7-b8f5450e3d65.png`.
- Foto dari `Media/Aset Bus` menjadi visual utama; tiap bus memiliki carousel empat sudut eksterior pada kartunya dan galeri detail dalam dialog. Foto interior dapat ditambahkan saat tersedia.
- Tidak memakai harga contoh sebagai penawaran resmi. Harga dibahas berdasarkan itinerary, durasi, kebutuhan unit, dan rincian layanan.

## Susunan beranda

1. Banner sewa bus rombongan dan ajakan merencanakan perjalanan.
2. Formulir kebutuhan: lokasi jemput, tujuan, tanggal berangkat/kembali, peserta, jenis acara, preferensi armada, dan catatan.
3. Pilihan armada: foto, kapasitas per unit, fasilitas khusus unit, detail, dan tombol ajukan sewa.
4. Jenis layanan: wisata, study tour, umroh/haji, keluarga, dan event/acara.
5. Penjelasan cara merencanakan kebutuhan rombongan.
6. Panduan: isi kebutuhan → kirim permintaan → tinjau penawaran → konfirmasi sewa.
7. FAQ tentang harga, kapasitas, itinerary, pemesanan, pembayaran, dan pembatalan.
8. Kontak konsultasi dan navigasi informasi.

## Ringkasan dan WhatsApp

Ringkasan menampilkan semua kebutuhan sebelum pengguna melanjutkan. Tanggal kembali tidak boleh mendahului keberangkatan. Durasi dihitung dalam hari kalender. Jika peserta melebihi kapasitas yang sudah diisi untuk armada pilihan, arahkan konsultasi beberapa unit atau alternatif armada, tanpa menyatakan ketersediaan.

Pesan WhatsApp memuat lokasi jemput, tujuan, tanggal, durasi, peserta, kegiatan, armada, serta catatan. Pengguna meminta penawaran, ketersediaan, rincian biaya dan layanan, serta ketentuan sewa. Website tidak menyatakan bahwa pesan telah dikirim atau pesanan disetujui.

## Satu halaman publik dan konfigurasi lokal

Website publik hanya memakai `index.html`. Menu utama berisi Armada, Layanan, dan Kontak; foto pada carousel membuka dialog galeri pada halaman yang sama. Panel lokal `admin.html` tetap tersedia untuk mengisi armada, layanan, konten/kontak, serta draf konsultasi. Kapasitas, fasilitas, dan kontak yang belum tersedia dinyatakan perlu konfirmasi; data tersebut harus dilengkapi sebelum digunakan secara operasional.
