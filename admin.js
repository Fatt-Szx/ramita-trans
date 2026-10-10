(() => {
  'use strict';
  const R = window.RAMITA;
  const { data, esc } = R;
  const $ = (selector) => document.querySelector(selector);
  const dialog = $('#admin-dialog');
  const modal = $('#admin-dialog-content');
  const titles = { fleet: 'Armada', services: 'Layanan Sewa' };
  let active = 'overview';
  let drafts = R.read(R.keys.requests, []);
  if (!Array.isArray(drafts)) drafts = [];
  function toast(message) { const el = $('#admin-toast'); el.textContent = message; el.hidden = false; clearTimeout(toast.timer); toast.timer = setTimeout(() => { el.hidden = true; }, 3500); }
  function store(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { toast('Penyimpanan browser tidak tersedia. Perubahan belum tersimpan.'); return false; } }
  function heading(title, detail, action = '') { return `<div class="admin-heading"><div><span class="section-kicker">PENYEWAAN BUS · DATA LOKAL</span><h1>${esc(title)}</h1><p>${esc(detail)}</p></div>${action}</div>`; }
  function notice() { return '<div class="admin-alert"><strong>Konsep admin untuk penyewaan bus</strong>Data tersimpan di browser ini. Draf konsultasi bukan bukti pesan terkirim atau pemesanan sewa yang dikonfirmasi.</div>'; }
  function stats() { return `<div class="stat-grid"><div class="stat-card"><span>Konfigurasi Armada</span><strong>${data.fleet.length}</strong><small>DATA LOKAL</small></div><div class="stat-card"><span>Layanan Sewa</span><strong>${data.services.length}</strong><small>KONTEN</small></div><div class="stat-card"><span>Draf Konsultasi</span><strong>${drafts.length}</strong><small>LOKAL</small></div><div class="stat-card"><span>Kontak WhatsApp</span><strong style="font-size:23px">${R.phone(R.content.contactPhone) ? 'Terisi' : 'Belum diisi'}</strong><small>KONSULTASI SEWA</small></div></div>`; }
  function overview() {
    return heading('Ringkasan penyewaan', 'Kelola armada, layanan rombongan, dan kontak konsultasi.') + notice() + stats() + `<div class="admin-callout"><div><h3>Mulai dari armada</h3><p>Atur kapasitas, fasilitas, serta foto tampak depan, samping, dan belakang setiap bus.</p><a href="#" data-view-link="fleet">Kelola Armada ↗</a></div><div><h3>Lengkapi kontak konsultasi</h3><p>Nomor WhatsApp menghubungkan ringkasan kebutuhan pelanggan dengan layanan konsultasi.</p><a href="#" data-view-link="content">Atur Kontak ↗</a></div></div><div class="admin-panel"><div class="admin-panel-header"><div><h2>Alur permintaan penawaran</h2><p>Kebutuhan perjalanan menjadi dasar penawaran sewa.</p></div></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>LANGKAH</th><th>INFORMASI</th></tr></thead><tbody><tr><td><strong>1. Isi kebutuhan</strong></td><td>Lokasi jemput, tujuan, tanggal pergi dan kembali, peserta, dan preferensi armada.</td></tr><tr><td><strong>2. Tinjau ringkasan</strong></td><td>Pengunjung memeriksa rencana sebelum melanjutkan konsultasi.</td></tr><tr><td><strong>3. WhatsApp</strong></td><td>Pesan terisi otomatis. Konsep website belum memverifikasi pengiriman pesan.</td></tr><tr><td><strong>4. Penawaran & konfirmasi</strong></td><td>Harga, ketersediaan unit, dan ketentuan sewa dibahas langsung dengan admin.</td></tr></tbody></table></div></div>`;
  }
  function list(type) {
    const rows = data[type].map((item) => `<tr><td><strong>${esc(item.name)}</strong><small>${esc(item.description)}</small></td>${type === 'fleet' ? `<td>${item.capacity ? `${esc(item.capacity)} kursi / unit` : 'Belum diisi'}</td><td>${esc((item.facilities || []).join(', ') || 'Belum diisi')}</td>` : ''}<td class="admin-actions"><button type="button" data-edit="${type}" data-id="${esc(item.id)}">Ubah</button><button class="danger" type="button" data-delete="${type}" data-id="${esc(item.id)}">Hapus</button></td></tr>`).join('');
    return heading(titles[type], type === 'fleet' ? 'Empat bus dari Media/Aset Bus. Kapasitas dan fasilitas perlu diisi sesuai data resmi.' : 'Jenis kegiatan dan deskripsi layanan rombongan.', `<button class="button button-primary" type="button" data-add="${type}">+ Tambah ${titles[type]}</button>`) + notice() + `<div class="admin-panel"><div class="admin-panel-header"><div><h2>Daftar ${titles[type]}</h2><p>${data[type].length} data tersedia.</p></div><span class="admin-pill">TERSIMPAN LOKAL</span></div><div class="admin-table-wrap">${rows ? `<table class="admin-table"><thead><tr><th>${type === 'fleet' ? 'ARMADA' : 'LAYANAN'}</th>${type === 'fleet' ? '<th>KAPASITAS</th><th>FASILITAS</th>' : ''}<th>AKSI</th></tr></thead><tbody>${rows}</tbody></table>` : '<div class="admin-empty">Belum ada data. Tambahkan konfigurasi pertama.</div>'}</div></div>`;
  }
  function requests() {
    return heading('Draf konsultasi', 'Salinan lokal dari ringkasan yang dibuka ke WhatsApp atau disalin pada browser ini.') + notice() + `<div class="admin-panel"><div class="admin-panel-header"><div><h2>Rencana perjalanan</h2><p>Pengiriman pesan dan persetujuan sewa belum diverifikasi oleh website.</p></div></div><div class="admin-table-wrap">${drafts.length ? `<table class="admin-table"><thead><tr><th>PERJALANAN</th><th>TANGGAL / PESERTA</th><th>STATUS</th><th>AKSI</th></tr></thead><tbody>${drafts.map((item) => `<tr><td><strong>${esc(item.pickup)} → ${esc(item.destination)}</strong><small>${esc(item.serviceName)}</small></td><td>${esc(R.dateLabel(item.departureDate))}<br>${esc(item.duration)} hari · ${esc(item.participants)} orang</td><td><span class="admin-pill warn">DRAF LOKAL</span><small>Pengiriman belum diverifikasi</small></td><td class="admin-actions"><button type="button" data-request="${esc(item.id)}">Detail</button><button class="danger" type="button" data-delete="requests" data-id="${esc(item.id)}">Hapus</button></td></tr>`).join('')}</tbody></table>` : '<div class="admin-empty">Belum ada draf konsultasi di browser ini. Draf tersimpan saat ringkasan diteruskan ke WhatsApp atau berhasil disalin.</div>'}</div></div>`;
  }
  function content() {
    const saved = R.content;
    return heading('Konten & kontak', 'Atur judul, deskripsi, dan informasi konsultasi sewa bus.') + notice() + `<section class="content-card"><form id="content-form" class="admin-form"><label>Judul banner<input name="title" maxlength="80" required value="${esc(saved.title || 'Satu bus. Banyak cerita.')}"></label><label>WhatsApp konsultasi (opsional)<input name="contactPhone" maxlength="20" inputmode="tel" value="${esc(saved.contactPhone || '')}" placeholder="628xxxxxxxxxx"></label><label class="wide">Deskripsi banner<textarea name="description" maxlength="240" required>${esc(saved.description || 'Untuk wisata, study tour, dan acara bersama. Ceritakan rencana perjalanan Anda, kami bantu menyiapkan penawarannya.')}</textarea></label><label>Alamat kantor<input name="address" maxlength="200" value="${esc(saved.address || '')}"></label><label>Jam layanan<input name="hours" maxlength="100" value="${esc(saved.hours || '')}"></label><label class="wide">URL Google Maps<input name="maps" type="url" value="${esc(saved.maps || '')}" placeholder="https://maps.app.goo.gl/..."></label><p class="form-message" id="content-error" role="alert" hidden></p><button class="button button-primary" type="submit">Simpan Konten & Kontak</button></form></section>`;
  }
  function render(view) {
    active = view;
    document.querySelectorAll('#admin-nav [data-view]').forEach((button) => button.classList.toggle('active', button.dataset.view === view));
    $('#admin-view').innerHTML = view === 'overview' ? overview() : view === 'requests' ? requests() : view === 'content' ? content() : list(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function field(name, label, value, attrs = '') { return `<label>${label}<input name="${name}" value="${esc(value || '')}" ${attrs}></label>`; }
  function openForm(type, id = '') {
    const item = data[type].find((entry) => entry.id === id) || {};
    modal.innerHTML = `<span class="section-kicker">${id ? 'UBAH' : 'TAMBAH'} DATA ARMADA</span><h2>${id ? 'Ubah' : 'Tambah'} ${titles[type]}</h2><form id="entity-form" class="admin-form" data-type="${type}" data-id="${esc(id)}">${field('name', 'Nama', item.name, 'required maxlength="100"')}${type === 'fleet' ? field('style', 'Label tampilan', item.style, 'maxlength="100"') + field('capacity', 'Kapasitas kursi / unit (opsional)', item.capacity, 'type="number" min="1" max="100" step="1"') + field('facilities', 'Fasilitas (pisahkan koma)', (item.facilities || []).join(', '), 'maxlength="200"') + field('exterior', 'Foto sudut depan', item.exterior, 'placeholder="assets/fleet/bus-01/hero.webp"') + field('front', 'Foto tampak depan', item.front, 'placeholder="assets/fleet/bus-01/front.webp"') + field('side', 'Foto tampak samping', item.side, 'placeholder="assets/fleet/bus-01/side.webp"') + field('rear', 'Foto tampak belakang', item.rear, 'placeholder="assets/fleet/bus-01/rear.webp"') : ''}<label class="wide">Deskripsi<textarea name="description" maxlength="240" required>${esc(item.description || '')}</textarea></label><p class="form-message" id="entity-error" role="alert" hidden></p><button class="button button-primary" type="submit">Simpan ${titles[type]}</button></form>`;
    dialog.showModal();
  }
  function remove(type, id) {
    const item = type === 'requests' ? drafts.find((entry) => entry.id === id) : data[type].find((entry) => entry.id === id);
    if (!item) return;
    modal.innerHTML = `<span class="section-kicker">KONFIRMASI</span><h2>Hapus data ini?</h2><p>${esc(item.name || `${item.pickup} → ${item.destination}`)} akan dihapus dari penyimpanan browser ini.</p><button class="button button-primary" id="confirm-delete" type="button">Ya, Hapus Data</button>`;
    $('#confirm-delete').addEventListener('click', () => {
      if (type === 'requests') { const next = drafts.filter((entry) => entry.id !== id); if (!store(R.keys.requests, next)) return; drafts = next; }
      else { const next = { ...data, [type]: data[type].filter((entry) => entry.id !== id) }; if (!store(R.keys.data, next)) return; data[type] = next[type]; }
      dialog.close(); render(active); toast('Data lokal dihapus.');
    });
    dialog.showModal();
  }
  function requestDetail(id) {
    const item = drafts.find((entry) => entry.id === id); if (!item) return;
    modal.innerHTML = `<span class="section-kicker">DRAF KONSULTASI LOKAL</span><h2>Rencana sewa bus</h2><div class="admin-alert">Draf ini bukan bukti pesan terkirim, penawaran disetujui, atau pemesanan dikonfirmasi.</div><dl><div><dt>Penjemputan</dt><dd>${esc(item.pickup)}</dd></div><div><dt>Tujuan</dt><dd>${esc(item.destination)}</dd></div><div><dt>Berangkat</dt><dd>${esc(R.dateLabel(item.departureDate))}</dd></div><div><dt>Kembali</dt><dd>${esc(R.dateLabel(item.returnDate))}</dd></div><div><dt>Jumlah peserta</dt><dd>${esc(item.participants)} orang</dd></div><div><dt>Preferensi armada</dt><dd>${esc(item.fleetName)}</dd></div></dl><p><strong>Keperluan:</strong> ${esc(item.serviceName)}<br><strong>Catatan:</strong> ${esc(item.notes || 'Tidak ada')}</p>`;
    dialog.showModal();
  }
  document.addEventListener('click', (event) => {
    const nav = event.target.closest('[data-view], [data-view-link]');
    if (nav) { event.preventDefault(); render(nav.dataset.view || nav.dataset.viewLink); $('#admin-sidebar').classList.remove('open'); $('.admin-menu').setAttribute('aria-expanded', 'false'); }
    const add = event.target.closest('[data-add]'); if (add) openForm(add.dataset.add);
    const edit = event.target.closest('[data-edit]'); if (edit) openForm(edit.dataset.edit, edit.dataset.id);
    const del = event.target.closest('[data-delete]'); if (del) remove(del.dataset.delete, del.dataset.id);
    const request = event.target.closest('[data-request]'); if (request) requestDetail(request.dataset.request);
  });
  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!['entity-form', 'content-form'].includes(form.id)) return;
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form));
    for (const key of Object.keys(values)) values[key] = values[key].trim();
    const error = form.querySelector('.form-message');
    const fail = (message) => { error.textContent = message; error.hidden = false; };
    if (form.id === 'content-form') {
      if (!values.title || !values.description) return fail('Isi judul dan deskripsi banner.');
      if (!R.validPhone(values.contactPhone)) return fail('Gunakan nomor Indonesia, misalnya 628xxxxxxxxxx.');
      if (values.maps && !R.safeMaps(values.maps)) return fail('Gunakan URL Google Maps HTTPS.');
      if (!store(R.keys.content, values)) return;
      Object.assign(R.content, values); toast('Konten dan kontak disimpan di browser ini.'); error.hidden = true;
    } else {
      const type = form.dataset.type, id = form.dataset.id;
      if (!values.name || !values.description) return fail('Isi nama dan deskripsi.');
      if (type === 'fleet') {
        values.capacity = values.capacity ? Number(values.capacity) : '';
        if (values.capacity && (!Number.isInteger(values.capacity) || values.capacity < 1 || values.capacity > 100)) return fail('Isi kapasitas antara 1 dan 100 kursi.');
        values.facilities = values.facilities.split(',').map((value) => value.trim()).filter(Boolean);
        if (['exterior', 'front', 'side', 'rear'].some((key) => values[key] && R.asset(values[key], '') === '')) return fail('Gunakan path dalam assets/ atau URL foto HTTPS.');
      }
      const item = { id: id || `${type}-${Date.now().toString(36)}`, ...values };
      const next = { ...data, [type]: id ? data[type].map((entry) => entry.id === id ? item : entry) : [...data[type], item] };
      if (!store(R.keys.data, next)) return;
      data[type] = next[type]; dialog.close(); render(type); toast('Perubahan disimpan. Muat ulang website untuk melihat hasilnya.');
    }
  });
  $('.modal-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  $('.admin-menu').addEventListener('click', () => { const open = $('#admin-sidebar').classList.toggle('open'); $('.admin-menu').setAttribute('aria-expanded', String(open)); });
  render('overview');
})();
