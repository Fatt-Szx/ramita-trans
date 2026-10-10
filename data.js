/* Data utama website RAMITA TRANS. */
window.RAMITA_RENTAL_DEFAULTS = {
  fleet: [
    { id: 'bus-01', name: 'Armada 01', style: 'Foto eksterior', capacity: '', facilities: [], description: 'Lihat tampilan unit dari berbagai sudut sebelum menyampaikan kebutuhan perjalanan.', exterior: 'assets/fleet/bus-01/hero.webp', front: 'assets/fleet/bus-01/front.webp', side: 'assets/fleet/bus-01/side.webp', rear: 'assets/fleet/bus-01/rear.webp' },
    { id: 'bus-02', name: 'Armada 02', style: 'Foto eksterior', capacity: '', facilities: [], description: 'Lihat tampilan unit dari berbagai sudut sebelum menyampaikan kebutuhan perjalanan.', exterior: 'assets/fleet/bus-02/hero.webp', front: 'assets/fleet/bus-02/front.webp', side: 'assets/fleet/bus-02/side.webp', rear: 'assets/fleet/bus-02/rear.webp' },
    { id: 'bus-03', name: 'Armada 03', style: 'Foto eksterior', capacity: '', facilities: [], description: 'Lihat tampilan unit dari berbagai sudut sebelum menyampaikan kebutuhan perjalanan.', exterior: 'assets/fleet/bus-03/hero.webp', front: 'assets/fleet/bus-03/front.webp', side: 'assets/fleet/bus-03/side.webp', rear: 'assets/fleet/bus-03/rear.webp' },
    { id: 'bus-04', name: 'Armada 04', style: 'Foto eksterior', capacity: '', facilities: [], description: 'Lihat tampilan unit dari berbagai sudut sebelum menyampaikan kebutuhan perjalanan.', exterior: 'assets/fleet/bus-04/hero.webp', front: 'assets/fleet/bus-04/front.webp', side: 'assets/fleet/bus-04/side.webp', rear: 'assets/fleet/bus-04/rear.webp' }
  ],
  services: [
    { id: 'pariwisata', name: 'Wisata rombongan', description: 'Susun perjalanan wisata bersama komunitas, organisasi, atau rombongan Anda.' },
    { id: 'study-tour', name: 'Study tour', description: 'Rencanakan transportasi untuk kunjungan edukasi dan kegiatan sekolah.' },
    { id: 'umroh-haji', name: 'Umroh & haji', description: 'Konsultasikan kebutuhan transportasi rombongan untuk kegiatan ibadah.' },
    { id: 'wisata-keluarga', name: 'Wisata keluarga', description: 'Buat perjalanan keluarga besar lebih mudah direncanakan bersama.' },
    { id: 'event', name: 'Event & acara', description: 'Atur kebutuhan transportasi peserta untuk kegiatan perusahaan dan acara khusus.' }
  ]
};
window.RAMITA = (() => {
  const keys = { data: 'ramita-rental-v2-data', content: 'ramita-rental-v1-content', requests: 'ramita-rental-v1-requests' };
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key) || 'null') || clone(fallback); } catch { return clone(fallback); } };
  const data = read(keys.data, window.RAMITA_RENTAL_DEFAULTS);
  for (const key of ['fleet', 'services']) if (!Array.isArray(data[key])) data[key] = clone(window.RAMITA_RENTAL_DEFAULTS[key]);
  const oldFleetTerm = new RegExp('dokumen' + 'tasi', 'gi');
  data.fleet.forEach((item) => {
    item.style = String(item.style || '').replace(oldFleetTerm, 'Foto');
    item.description = String(item.description || '').replace(oldFleetTerm, 'tampilan');
  });
  const content = read(keys.content, { title: '', description: '', contactPhone: '', address: '', hours: '', maps: '' });
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const phone = (value) => { const digits = String(value || '').replace(/\D/g, ''); return digits.startsWith('0') ? `62${digits.slice(1)}` : digits; };
  if (!phone(content.contactPhone)) content.contactPhone = '085280028725';
  if (String(content.address || '').includes('Jl. Contoh No. 10')) content.address = '';
  const validPhone = (value) => !value || /^(\+?62|0)[0-9 ]{8,17}$/.test(value);
  const safeMaps = (value) => /^https:\/\/(maps\.google\.[a-z.]+|www\.google\.[a-z.]+\/maps\/|maps\.app\.goo\.gl\/)/i.test(value || '') ? value : '';
  const asset = (value, fallback = 'assets/fleet/bus-01/hero.webp') => /^(assets\/[a-z0-9_./-]+|https:\/\/[^\s"<>]+)$/i.test(value || '') ? value : fallback;
  const dateLabel = (value) => new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value}T12:00:00`));
  const dateValue = (value) => Date.parse(`${value}T00:00:00Z`);
  const duration = (from, to) => Math.round((dateValue(to) - dateValue(from)) / 86400000) + 1;
  const today = () => { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`; };
  const waLink = (message = '') => `https://wa.me/${encodeURIComponent(phone(content.contactPhone))}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
  function mountFloatingWhatsApp() {
    if (document.querySelector('.floating-wa')) return;
    const box = document.createElement('div');
    box.className = 'floating-wa';
    const icon = '<svg viewBox="0 0 32 32" width="29" height="29" fill="none" aria-hidden="true"><path d="M6.5 24.8 4.5 29l4.8-1.8A13 13 0 1 0 6.5 24.8Z" stroke="currentColor" stroke-width="2.3" stroke-linejoin="round"/><path d="M11.1 10.2c-.5 0-1.1.8-1.2 1.5-.3 1.9 1.1 4.2 3.3 6.4 2.2 2.1 4.7 3.4 6.4 3.1.8-.1 1.8-.9 1.9-1.5l-2.8-1.5-1.4 1.1c-1.8-.7-3.4-2.2-4.3-4l1.1-1.4-1.7-3.4Z" fill="currentColor"/></svg>';
    if (phone(content.contactPhone)) {
      box.innerHTML = `<a class="floating-wa-button" href="${waLink('Halo RAMITA TRANS, saya ingin berkonsultasi tentang penyewaan bus.')}" target="_blank" rel="noopener noreferrer" aria-label="Konsultasi sewa bus via WhatsApp" title="Chat via WhatsApp">${icon}</a>`;
    } else {
      const formHref = location.pathname.toLowerCase().endsWith('/index.html') || location.pathname.endsWith('/') ? '#penawaran' : 'index.html#penawaran';
      box.innerHTML = `<div class="floating-wa-panel" id="floating-wa-panel" hidden><button class="floating-wa-close" type="button" aria-label="Tutup informasi WhatsApp">×</button><strong>Konsultasi via WhatsApp</strong><p>Isi kebutuhan perjalanan agar tim kami dapat menyiapkan penawaran yang sesuai.</p><a class="button button-primary" href="${formHref}">Isi Formulir Penawaran ↗</a></div><button class="floating-wa-button" type="button" aria-label="Informasi konsultasi WhatsApp" aria-expanded="false" aria-controls="floating-wa-panel" title="Konsultasi WhatsApp">${icon}</button>`;
      const trigger = box.querySelector('.floating-wa-button');
      const panel = box.querySelector('.floating-wa-panel');
      const close = () => { panel.hidden = true; trigger.setAttribute('aria-expanded', 'false'); trigger.focus(); };
      trigger.addEventListener('click', () => { const open = panel.hidden; panel.hidden = !open; trigger.setAttribute('aria-expanded', String(open)); if (open) panel.querySelector('.floating-wa-close').focus(); });
      panel.querySelector('.floating-wa-close').addEventListener('click', close);
      document.addEventListener('click', (event) => { if (!box.contains(event.target) && !panel.hidden) { panel.hidden = true; trigger.setAttribute('aria-expanded', 'false'); } });
      box.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !panel.hidden) { event.preventDefault(); close(); } });
    }
    document.body.append(box);
  }
  const fleetPhotos = (item) => [
    { src: asset(item.exterior), label: 'Sudut depan' },
    ...['front', 'side', 'rear'].filter((key) => item[key]).map((key) => ({ src: asset(item[key]), label: { front: 'Tampak depan', side: 'Tampak samping', rear: 'Tampak belakang' }[key] }))
  ];
  const fleetCards = (items) => items.map((item) => `<article class="rental-fleet-card"><div class="fleet-card-photo"><img src="${esc(asset(item.exterior))}" alt="${esc(item.name)} dari sudut depan" loading="lazy"></div><div class="fleet-card-body"><div class="fleet-card-head"><span class="section-kicker">GALERI ARMADA</span><span class="fleet-card-index">${fleetPhotos(item).length} FOTO EKSTERIOR</span></div><h3>${esc(item.name)}</h3><p>Jelajahi tampilan unit dari depan, samping, dan belakang sebelum mengajukan penawaran.</p><p class="fleet-spec-note">${item.capacity ? `${esc(item.capacity)} kursi / unit` : 'Kapasitas: konfirmasi admin'} · ${(item.facilities || []).length ? esc(item.facilities.join(', ')) : 'Fasilitas: konfirmasi admin'}</p><div class="fleet-card-actions"><span class="fleet-card-hint">Pilih foto untuk melihat detail</span><a class="button button-secondary" href="index.html?fleet=${encodeURIComponent(item.id)}#penawaran">Minta Penawaran <span aria-hidden="true">↗</span></a></div></div></article>`).join('');
  const serviceCards = (items) => items.map((item, index) => `<article class="rental-service-card"><span class="service-index">${String(index + 1).padStart(2, '0')}</span><h3>${esc(item.name)}</h3><p>${esc(item.description)}</p><a class="text-button" href="index.html?service=${encodeURIComponent(item.id)}#penawaran">Rencanakan perjalanan ↗</a></article>`).join('');
  return { keys, clone, read, data, content, esc, phone, validPhone, safeMaps, asset, dateLabel, dateValue, duration, today, waLink, fleetPhotos, fleetCards, serviceCards, mountFloatingWhatsApp };
})();
