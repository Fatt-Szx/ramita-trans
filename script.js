(() => {
  'use strict';
  const R = window.RAMITA;
  const { data, content, esc } = R;
  R.mountFloatingWhatsApp();
  const $ = (selector) => document.querySelector(selector);
  const form = $('#quote-form');
  const dialog = $('#quote-dialog');
  const error = $('#quote-error');
  const start = form.elements.departureDate;
  const end = form.elements.returnDate;
  const submit = form.querySelector('button[type="submit"]');
  let currentRequest = null;
  let savedDraft = false;
  if (content.title && content.title !== 'Satu bus. Banyak cerita.') $('#hero-title').textContent = content.title;
  if (content.description) $('#hero-description').textContent = content.description;
  const contactInfo = $('#contact-info');
  const addressRow = $('#contact-address-row');
  const hoursRow = $('#contact-hours-row');
  if (content.address) { $('#contact-address').textContent = content.address; addressRow.hidden = false; contactInfo.hidden = false; }
  if (content.hours) { $('#contact-hours').textContent = content.hours; hoursRow.hidden = false; contactInfo.hidden = false; }
  const contactMap = $('#contact-map');
  const mapsUrl = R.safeMaps(content.maps);
  if (mapsUrl && content.address) { contactMap.href = mapsUrl; contactMap.hidden = false; }
  if (R.phone(content.contactPhone)) $('#rental-contact').innerHTML = `<a href="${R.waLink()}" target="_blank" rel="noopener noreferrer">Hubungi via WhatsApp ↗</a>`;
  $('#fleet-list').innerHTML = R.fleetCards(data.fleet.slice(0, 4)) || '<p class="empty-state">Informasi armada sedang disiapkan. Sampaikan kebutuhan Anda melalui formulir penawaran.</p>';
  $('#service-list').innerHTML = R.serviceCards(data.services) || '<p class="empty-state">Konsultasikan jenis kegiatan Anda melalui formulir penawaran.</p>';
  $('#fleet-list').querySelectorAll('.rental-fleet-card').forEach((card, index) => {
    const fleet = data.fleet[index];
    const photos = R.fleetPhotos(fleet);
    const photoArea = card.querySelector('.fleet-card-photo');
    photoArea.classList.add('fleet-carousel');
    photoArea.setAttribute('role', 'region');
    photoArea.setAttribute('aria-roledescription', 'carousel');
    photoArea.setAttribute('aria-label', `Foto ${fleet.name}`);
    photoArea.innerHTML = `<div class="fleet-carousel-track">${photos.map((photo, photoIndex) => `<div class="fleet-carousel-slide" role="group" aria-roledescription="slide" aria-label="${photoIndex + 1} dari ${photos.length}: ${esc(photo.label)}"><img src="${esc(photo.src)}" alt="${esc(fleet.name)} — ${esc(photo.label)}" loading="lazy"></div>`).join('')}</div><span class="photo-label">${esc(fleet.name.toUpperCase())}</span>${photos.length > 1 ? `<button class="fleet-carousel-arrow fleet-carousel-prev" type="button" data-slide-direction="-1" aria-label="Foto sebelumnya dari ${esc(fleet.name)}">‹</button><button class="fleet-carousel-arrow fleet-carousel-next" type="button" data-slide-direction="1" aria-label="Foto berikutnya dari ${esc(fleet.name)}">›</button><div class="fleet-carousel-bottom"><div class="fleet-carousel-dots" role="group" aria-label="Pilih foto ${esc(fleet.name)}">${photos.map((photo, photoIndex) => `<button type="button" class="fleet-carousel-dot${photoIndex === 0 ? ' is-active' : ''}" data-slide-index="${photoIndex}" aria-label="Lihat ${esc(photo.label)}" aria-pressed="${photoIndex === 0}"></button>`).join('')}</div><span class="fleet-carousel-count" aria-live="polite">1 / ${photos.length}</span></div>` : ''}`;
    photoArea.insertAdjacentHTML('beforeend', `<button class="fleet-carousel-open" type="button" data-fleet-detail="${esc(fleet.id)}" aria-label="Buka detail dan galeri ${esc(fleet.name)}"></button>`);
    let activePhoto = 0;
    const showPhoto = (next) => {
      activePhoto = (next + photos.length) % photos.length;
      photoArea.style.setProperty('--slide-offset', `${-activePhoto * 100}%`);
      photoArea.querySelectorAll('.fleet-carousel-slide').forEach((slide, photoIndex) => { slide.setAttribute('aria-hidden', String(photoIndex !== activePhoto)); });
      photoArea.querySelectorAll('.fleet-carousel-dot').forEach((dot, photoIndex) => { const active = photoIndex === activePhoto; dot.classList.toggle('is-active', active); dot.setAttribute('aria-pressed', String(active)); });
      const counter = photoArea.querySelector('.fleet-carousel-count');
      if (counter) counter.textContent = `${activePhoto + 1} / ${photos.length}`;
    };
    photoArea.addEventListener('click', (event) => {
      const direction = event.target.closest('[data-slide-direction]');
      const dot = event.target.closest('[data-slide-index]');
      if (direction) showPhoto(activePhoto + Number(direction.dataset.slideDirection));
      if (dot) showPhoto(Number(dot.dataset.slideIndex));
    });
    photoArea.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); showPhoto(activePhoto + (event.key === 'ArrowRight' ? 1 : -1)); }
    });
    let touchStart = null;
    let suppressOpen = false;
    photoArea.addEventListener('click', (event) => {
      if (suppressOpen && event.target.closest('.fleet-carousel-open')) { event.preventDefault(); event.stopPropagation(); suppressOpen = false; }
    }, true);
    photoArea.addEventListener('touchstart', (event) => { const touch = event.changedTouches[0]; touchStart = { x: touch.clientX, y: touch.clientY }; }, { passive: true });
    photoArea.addEventListener('touchend', (event) => {
      if (!touchStart) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - touchStart.x, dy = touch.clientY - touchStart.y;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) { showPhoto(activePhoto + (dx < 0 ? 1 : -1)); suppressOpen = true; setTimeout(() => { suppressOpen = false; }, 500); }
      touchStart = null;
    }, { passive: true });
    showPhoto(0);
    const quote = card.querySelector('.button-secondary');
    if (quote) { quote.href = '#penawaran'; quote.dataset.selectFleet = fleet.id; }
  });
  $('#service-list').querySelectorAll('.rental-service-card').forEach((card, index) => {
    const link = card.querySelector('.text-button');
    if (link) { link.href = '#penawaran'; link.dataset.selectService = data.services[index].id; }
  });
  form.elements.serviceId.innerHTML += data.services.map((item) => `<option value="${esc(item.id)}">${esc(item.name)}</option>`).join('') + '<option value="other">Kegiatan lainnya</option>';
  form.elements.fleetId.innerHTML += data.fleet.map((item) => `<option value="${esc(item.id)}">${esc(item.name)}</option>`).join('');
  const fleetDialog = $('#fleet-dialog');
  function showFleet(id, selectedIndex = 0) {
    const fleet = data.fleet.find((item) => item.id === id);
    if (!fleet) return;
    const photos = R.fleetPhotos(fleet);
    $('#fleet-detail').innerHTML = `<div class="fleet-modal-layout"><div class="fleet-modal-gallery"><figure class="fleet-gallery-main"><img id="fleet-main-photo" src="${esc(photos[0].src)}" alt="${esc(fleet.name)} — ${esc(photos[0].label)}"><figcaption id="fleet-photo-caption">${esc(photos[0].label)}</figcaption></figure><div class="fleet-gallery-thumbs" role="group" aria-label="Pilihan sudut foto ${esc(fleet.name)}">${photos.map((photo, index) => `<button class="fleet-gallery-thumb${index === 0 ? ' is-active' : ''}" type="button" data-photo="${index}" aria-label="Lihat ${esc(photo.label)}" aria-pressed="${index === 0}"><img src="${esc(photo.src)}" alt="" loading="lazy"><span>${esc(photo.label)}</span></button>`).join('')}</div></div><div class="fleet-modal-info"><span class="section-kicker">${esc(fleet.style || 'FOTO ARMADA')}</span><h2>${esc(fleet.name)}</h2><p>${esc(fleet.description)}</p><dl><div><dt>Kapasitas</dt><dd>${fleet.capacity ? `${esc(fleet.capacity)} kursi / unit` : 'Konfirmasi admin'}</dd></div><div><dt>Fasilitas</dt><dd>${esc((fleet.facilities || []).join(', ') || 'Konfirmasi admin')}</dd></div></dl><p class="fleet-modal-note">Foto menampilkan eksterior. Rincian unit, harga, dan ketersediaan akan dikonfirmasi saat konsultasi.</p><a class="button button-primary" href="#penawaran" data-select-fleet="${esc(fleet.id)}">Ajukan Sewa Armada Ini ↗</a></div></div>`;
    $('#fleet-detail .fleet-modal-info .section-kicker').textContent = `${photos.length} FOTO EKSTERIOR`;
    $('#fleet-detail .fleet-modal-info > p').textContent = 'Telusuri tampilan unit dari berbagai sudut sebelum mengajukan penawaran perjalanan.';
    const initial = photos[selectedIndex] ? selectedIndex : 0;
    $('#fleet-main-photo').src = photos[initial].src;
    $('#fleet-main-photo').alt = `${fleet.name} — ${photos[initial].label}`;
    $('#fleet-photo-caption').textContent = photos[initial].label;
    $('#fleet-detail').querySelectorAll('.fleet-gallery-thumb').forEach((thumb, index) => { const active = index === initial; thumb.classList.toggle('is-active', active); thumb.setAttribute('aria-pressed', String(active)); });
    fleetDialog.showModal();
  }
  $('#fleet-list').addEventListener('click', (event) => {
    const detail = event.target.closest('[data-fleet-detail]');
    if (detail) { event.preventDefault(); const active = detail.closest('.fleet-carousel').querySelector('.fleet-carousel-dot.is-active'); showFleet(detail.dataset.fleetDetail, Number(active?.dataset.slideIndex || 0)); return; }
    const select = event.target.closest('[data-select-fleet]');
    if (select) form.elements.fleetId.value = select.dataset.selectFleet;
  });
  $('#service-list').addEventListener('click', (event) => {
    const select = event.target.closest('[data-select-service]');
    if (select) form.elements.serviceId.value = select.dataset.selectService;
  });
  $('#fleet-detail').addEventListener('click', (event) => {
    const thumbnail = event.target.closest('[data-photo]');
    if (thumbnail) {
      const fleet = data.fleet.find((item) => item.id === $('#fleet-detail [data-select-fleet]')?.dataset.selectFleet);
      const photo = R.fleetPhotos(fleet)[Number(thumbnail.dataset.photo)];
      $('#fleet-main-photo').src = photo.src;
      $('#fleet-main-photo').alt = `${fleet.name} — ${photo.label}`;
      $('#fleet-photo-caption').textContent = photo.label;
      $('#fleet-detail').querySelectorAll('.fleet-gallery-thumb').forEach((button) => { const active = button === thumbnail; button.classList.toggle('is-active', active); button.setAttribute('aria-pressed', String(active)); });
    }
    if (event.target.closest('[data-select-fleet]')) { form.elements.fleetId.value = event.target.closest('[data-select-fleet]').dataset.selectFleet; fleetDialog.close(); }
  });
  $('.fleet-modal-close').addEventListener('click', () => fleetDialog.close());
  fleetDialog.addEventListener('click', (event) => { if (event.target === fleetDialog) fleetDialog.close(); });
  start.min = R.today(); end.min = R.today();
  function updateDates() {
    end.min = start.value && start.value >= R.today() ? start.value : R.today();
    const days = R.duration(start.value, end.value);
    $('#quote-duration').textContent = start.value && end.value && Number.isFinite(days) && days > 0 ? `${days} hari${days === 1 ? ' · pergi & kembali hari yang sama' : ''}` : 'Pilih tanggal perjalanan';
  }
  start.addEventListener('change', updateDates); end.addEventListener('change', updateDates);
  form.addEventListener('input', (event) => { error.hidden = true; event.target.removeAttribute('aria-invalid'); });
  form.addEventListener('change', () => { error.hidden = true; });
  function fail(message, field) { error.textContent = message; error.hidden = false; if (field) { field.setAttribute('aria-invalid', 'true'); field.focus(); } }
  function messageFor(request) {
    return `Halo RAMITA TRANS, saya ingin meminta penawaran sewa bus.\n\nLokasi penjemputan: ${request.pickup}\nTujuan: ${request.destination}\nTanggal berangkat: ${R.dateLabel(request.departureDate)}\nTanggal kembali: ${R.dateLabel(request.returnDate)}\nDurasi: ${request.duration} hari\nJumlah peserta: ${request.participants} orang\nKeperluan: ${request.serviceName}\nPreferensi armada: ${request.fleetName}\nCatatan: ${request.notes || 'Tidak ada catatan tambahan'}\n\nMohon informasi ketersediaan armada, penawaran harga sewa, rincian layanan/biaya, serta ketentuan pembayaran dan pembatalan. Terima kasih.`;
  }
  function summary(request) {
    const selectedFleet = data.fleet.find((item) => item.id === request.fleetId);
    const multiUnit = selectedFleet?.capacity > 0 && request.participants > Number(selectedFleet.capacity);
    const message = messageFor(request);
    $('#quote-summary').innerHTML = `<span class="section-kicker">LANGKAH 02 / KONSULTASI</span><h2>Tinjau rencana sewa Anda</h2><p>Pastikan kebutuhan perjalanan sesuai sebelum melanjutkan konsultasi.</p><div class="quote-journey"><span>${esc(request.pickup)}</span><b aria-hidden="true">→</b><span>${esc(request.destination)}</span></div><dl><div><dt>Tanggal berangkat</dt><dd>${esc(R.dateLabel(request.departureDate))}</dd></div><div><dt>Tanggal kembali</dt><dd>${esc(R.dateLabel(request.returnDate))}</dd></div><div><dt>Durasi</dt><dd>${request.duration} hari</dd></div><div><dt>Peserta</dt><dd>${request.participants} orang</dd></div><div><dt>Keperluan</dt><dd>${esc(request.serviceName)}</dd></div><div><dt>Preferensi armada</dt><dd>${esc(request.fleetName)}</dd></div></dl>${multiUnit ? '<div class="quote-alert">Jumlah peserta melebihi kapasitas satu unit yang dipilih. Konsultasikan kebutuhan beberapa unit atau pilihan armada lain.</div>' : ''}${request.notes ? `<p class="quote-note"><strong>Catatan perjalanan</strong><br>${esc(request.notes)}</p>` : ''}<div class="quote-alert subtle">Harga sewa dan ketersediaan unit akan dikonfirmasi admin. Permintaan ini belum menjadi pemesanan.</div><details class="message-details"><summary>Lihat pesan konsultasi</summary><div class="message-preview" id="message-preview">${esc(message)}</div></details>${R.phone(content.contactPhone) ? '' : '<p class="quote-contact-note">Nomor WhatsApp layanan belum diisi. Salin pesan untuk menyiapkan permintaan penawaran.</p>'}<div class="quote-dialog-actions"><button type="button" class="button button-secondary" id="edit-quote">Ubah Rencana</button>${R.phone(content.contactPhone) ? `<a class="button button-primary" id="send-quote" href="${R.waLink(message)}" target="_blank" rel="noopener noreferrer">Lanjut ke WhatsApp ↗</a>` : '<button type="button" class="button button-primary" id="copy-quote">Salin Pesan Konsultasi</button>'}</div><p class="copy-status" id="copy-status" role="status"></p>`;
    $('#edit-quote').addEventListener('click', () => { dialog.close(); form.elements.pickup.focus(); });
    $('#send-quote')?.addEventListener('click', saveDraft);
    $('#copy-quote')?.addEventListener('click', async (event) => {
      const button = event.currentTarget;
      try { await navigator.clipboard.writeText(message); button.textContent = 'Pesan Tersalin ✓'; $('#copy-status').textContent = 'Pesan siap ditempel saat berkonsultasi.'; saveDraft(); }
      catch { $('.message-details').open = true; $('#copy-status').textContent = 'Salin teks pesan di atas secara manual.'; }
    });
    dialog.showModal();
  }
  function saveDraft() {
    if (savedDraft || !currentRequest) return;
    try { const drafts = R.read(R.keys.requests, []); drafts.unshift({ ...currentRequest, id: `req-${Date.now().toString(36)}`, createdAt: new Date().toISOString(), status: 'Draf' }); localStorage.setItem(R.keys.requests, JSON.stringify(drafts.slice(0, 100))); savedDraft = true; } catch { /* Konsultasi tetap dapat dilanjutkan jika penyimpanan lokal tidak tersedia. */ }
  }
  form.addEventListener('submit', (event) => {
    event.preventDefault(); error.hidden = true;
    const values = Object.fromEntries(new FormData(form));
    for (const [name, label] of [['pickup', 'lokasi penjemputan'], ['destination', 'tujuan perjalanan'], ['departureDate', 'tanggal berangkat'], ['returnDate', 'tanggal kembali'], ['participants', 'jumlah peserta'], ['serviceId', 'keperluan perjalanan']]) {
      if (!String(values[name] || '').trim()) return fail(`Isi ${label} terlebih dahulu.`, form.elements[name]);
    }
    if (!Number.isFinite(R.dateValue(values.departureDate)) || values.departureDate < R.today()) return fail('Tanggal berangkat harus hari ini atau setelahnya.', start);
    if (!Number.isFinite(R.dateValue(values.returnDate)) || values.returnDate < values.departureDate) return fail('Tanggal kembali harus sama atau setelah tanggal berangkat.', end);
    const participants = Number(values.participants);
    if (!Number.isInteger(participants) || participants < 1 || participants > 1000) return fail('Isi jumlah peserta berupa angka bulat antara 1 dan 1.000.', form.elements.participants);
    const service = data.services.find((item) => item.id === values.serviceId);
    if (!service && values.serviceId !== 'other') return fail('Pilih keperluan perjalanan yang tersedia.', form.elements.serviceId);
    const fleet = data.fleet.find((item) => item.id === values.fleetId);
    if (values.fleetId && !fleet) return fail('Pilih armada yang tersedia atau gunakan bantuan pemilihan.', form.elements.fleetId);
    currentRequest = { ...values, pickup: values.pickup.trim(), destination: values.destination.trim(), notes: values.notes.trim(), participants, duration: R.duration(values.departureDate, values.returnDate), serviceName: service?.name || 'Kegiatan lainnya', fleetName: fleet ? fleet.name : 'Bantu pilihkan armada' };
    savedDraft = false; submit.disabled = true; submit.textContent = 'Menyiapkan ringkasan…';
    setTimeout(() => { summary(currentRequest); submit.disabled = false; submit.innerHTML = 'Siapkan Permintaan Penawaran <span aria-hidden="true">→</span>'; }, 150);
  });
  $('.modal-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  const menu = $('.menu-toggle');
  menu.addEventListener('click', () => { const open = $('.main-nav').classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu'); });
  $('.main-nav').addEventListener('click', (event) => { if (event.target.closest('a')) { $('.main-nav').classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); } });
  const params = new URLSearchParams(location.search);
  if (data.fleet.some((item) => item.id === params.get('fleet'))) form.elements.fleetId.value = params.get('fleet');
  if (data.services.some((item) => item.id === params.get('service'))) form.elements.serviceId.value = params.get('service');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealTargets = document.querySelectorAll('.rental-panel, .rental-fleet-section .section-head, .rental-fleet-card, .rental-services-section .section-head, .rental-service-card, .story-image, .story-copy, .steps-section .section-head, .steps-grid > div, .faq-layout, .contact-layout');
    revealTargets.forEach((item, index) => { item.classList.add('js-reveal'); item.style.setProperty('--reveal-delay', `${index % 4 * 65}ms`); });
    document.body.classList.add('motion-ready');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
    }, { threshold: .08, rootMargin: '0px 0px -30px 0px' });
    revealTargets.forEach((item) => observer.observe(item));
  }
})();
