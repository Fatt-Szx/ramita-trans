(() => {
  'use strict';
  const R = window.RAMITA;
  const { data, content, esc } = R;
  R.mountFloatingWhatsApp();
  const $ = (selector) => document.querySelector(selector);
  const params = new URLSearchParams(location.search);
  const page = ['armada', 'layanan', 'tentang', 'kontak'].includes(params.get('page')) ? params.get('page') : 'armada';
  const pages = {
    armada: ['Kenali setiap armada', 'Jelajahi empat desain bus dari foto yang tersedia. Kapasitas, fasilitas, dan ketersediaan unit dikonfirmasi saat konsultasi.'],
    layanan: ['Sewa bus untuk setiap rencana', 'Wisata, kegiatan sekolah, ibadah, dan agenda khusus. Mulai konsultasi dari kebutuhan rombongan Anda.'],
    tentang: ['Satu bus. Banyak cerita.', 'Website penyewaan bus yang membantu merencanakan perjalanan rombongan bersama RAMITA TRANS.'],
    kontak: ['Mari rencanakan perjalanan', 'Sampaikan lokasi jemput, tujuan, tanggal, dan jumlah peserta untuk memulai konsultasi sewa bus.']
  };
  document.title = `${page === 'armada' ? 'Armada' : page === 'layanan' ? 'Layanan Sewa' : page === 'tentang' ? 'Tentang Kami' : 'Kontak'} — RAMITA TRANS`;
  document.querySelector(`.main-nav a[href="halaman.html?page=${page}"]`)?.setAttribute('aria-current', 'page');
  $('#page-content').innerHTML = `<section class="page-hero"><div class="container"><div><span class="section-kicker">RAMITA TRANS / ${page.toUpperCase()}</span><h1>${esc(pages[page][0])}<em>.</em></h1></div><p>${esc(pages[page][1])}</p></div></section><section class="page-section"><div class="container" id="page-body"></div></section>`;
  const body = $('#page-body');
  const cta = `<div class="page-cta"><div><h2>Ceritakan rencana perjalanan Anda</h2><p>Harga sewa disusun berdasarkan kebutuhan perjalanan dan dikonfirmasi melalui penawaran.</p></div><a class="button button-primary" href="index.html#penawaran">Minta Penawaran Sewa ↗</a></div>`;
  const address = String(content.address || '').trim();
  const hours = String(content.hours || '').trim();
  const maps = R.safeMaps(content.maps);
  const contactInformation = address || hours ? `<article class="rental-contact-box"><span class="section-kicker">INFORMASI LAYANAN</span><h2>Alamat & jam layanan</h2><div class="contact-info">${address ? `<div class="contact-info-row"><span class="contact-info-icon" aria-hidden="true">⌖</span><div><strong>Alamat kantor</strong><p>${esc(address)}</p>${maps ? `<a class="contact-map-link" href="${esc(maps)}" target="_blank" rel="noopener noreferrer">Buka Google Maps ↗</a>` : ''}</div></div>` : ''}${hours ? `<div class="contact-info-row"><span class="contact-info-icon" aria-hidden="true">◷</span><div><strong>Jam layanan</strong><p>${esc(hours)}</p></div></div>` : ''}</div></article>` : '';
  if (page === 'armada') {
    const selected = data.fleet.find((item) => item.id === params.get('id'));
    if (selected) {
      const photos = R.fleetPhotos(selected);
      body.innerHTML = `<a class="text-button" href="halaman.html?page=armada">← Kembali ke semua armada</a><div class="rental-detail-layout"><div class="rental-detail-gallery"><figure class="fleet-gallery-main"><img id="fleet-main-photo" src="${esc(photos[0].src)}" alt="${esc(selected.name)} — ${esc(photos[0].label)}"><figcaption id="fleet-photo-caption">${esc(photos[0].label)}</figcaption></figure><div class="fleet-gallery-thumbs" role="group" aria-label="Pilihan sudut foto ${esc(selected.name)}">${photos.map((photo, index) => `<button class="fleet-gallery-thumb${index === 0 ? ' is-active' : ''}" type="button" data-photo="${index}" aria-label="Lihat ${esc(photo.label)}" aria-pressed="${index === 0}"><img src="${esc(photo.src)}" alt="" loading="lazy"><span>${esc(photo.label)}</span></button>`).join('')}</div></div><article class="rental-detail-info"><span class="data-note">${esc(selected.style || 'FOTO ARMADA')}</span><h2>${esc(selected.name)}</h2><p>${esc(selected.description)}</p><dl><dt>Kapasitas</dt><dd>${selected.capacity ? `${esc(selected.capacity)} kursi / unit` : 'Konfirmasi admin'}</dd><dt>Fasilitas</dt><dd>${esc((selected.facilities || []).join(', ') || 'Konfirmasi admin')}</dd><dt>Harga sewa</dt><dd>Melalui penawaran perjalanan</dd><dt>Ketersediaan</dt><dd>Konfirmasi admin</dd></dl><p>Foto menampilkan tampak luar bus. Rincian unit dan fasilitas disampaikan saat konsultasi.</p><a class="button button-primary" href="index.html?fleet=${encodeURIComponent(selected.id)}#penawaran">Ajukan Sewa Armada Ini ↗</a></article></div>`;
      $('.fleet-gallery-thumbs').addEventListener('click', (event) => {
        const button = event.target.closest('[data-photo]');
        if (!button) return;
        const photo = photos[Number(button.dataset.photo)];
        $('#fleet-main-photo').src = photo.src;
        $('#fleet-main-photo').alt = `${selected.name} — ${photo.label}`;
        $('#fleet-photo-caption').textContent = photo.label;
        document.querySelectorAll('.fleet-gallery-thumb').forEach((thumb) => { const active = thumb === button; thumb.classList.toggle('is-active', active); thumb.setAttribute('aria-pressed', String(active)); });
      });
    } else {
      body.innerHTML = `<div class="rental-fleet-grid" id="page-fleet">${R.fleetCards(data.fleet) || '<p class="empty-state">Informasi armada sedang disiapkan.</p>'}</div><p class="fleet-disclaimer">Detail kapasitas, fasilitas, dan ketersediaan setiap armada dikonfirmasi sesuai kebutuhan perjalanan Anda.</p>${cta}`;
    }
  }
  if (page === 'layanan') body.innerHTML = `<p class="page-intro">Sewa bus direncanakan untuk kebutuhan rombongan Anda. Tentukan agenda dan itinerary, lalu konsultasikan armada serta rincian penawarannya.</p><div class="rental-service-grid">${R.serviceCards(data.services) || '<p class="empty-state">Informasi layanan sedang disiapkan.</p>'}</div>${cta}`;
  if (page === 'tentang') body.innerHTML = `<p class="page-intro">RAMITA TRANS hadir untuk membantu merencanakan kebutuhan transportasi rombongan dengan pilihan armada dan proses konsultasi yang mudah.</p><div class="page-info"><div><h2>Berangkat bersama</h2><p>Rencanakan transportasi untuk wisata, study tour, keluarga, kegiatan ibadah, serta acara rombongan.</p></div><div><h2>Mulai dari rencana Anda</h2><p>Lokasi jemput, tujuan, tanggal, dan jumlah peserta menjadi dasar konsultasi.</p></div><div><h2>Kenali pilihan armada</h2><p>Tinjau setiap unit dan pilih preferensi armada untuk dibahas bersama tim kami.</p></div><div><h2>Tinjau sebelum sepakat</h2><p>Konfirmasi rincian layanan, biaya, pembayaran, dan ketentuan sewa sebelum pemesanan.</p></div></div>${cta}`;
  if (page === 'kontak') body.innerHTML = `<div class="rental-contact-grid${contactInformation ? '' : ' is-single'}"><article class="rental-contact-box"><span class="section-kicker">KONSULTASI SEWA BUS</span><h2>Hubungi RAMITA TRANS</h2><p>Siapkan lokasi penjemputan, tujuan, tanggal, dan jumlah peserta agar tim kami dapat menyusun penawaran perjalanan Anda.</p><a class="button button-primary" href="${R.waLink('Halo RAMITA TRANS, saya ingin berkonsultasi tentang penyewaan bus.')}" target="_blank" rel="noopener noreferrer">Hubungi via WhatsApp ↗</a></article>${contactInformation}</div>${cta}`;
  const menu = $('.menu-toggle');
  menu.addEventListener('click', () => { const open = $('.main-nav').classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu'); });
})();
