const STORAGE_KEY = 'in-tray-tracker-v1';
const UNDO_KEY = 'in-tray-last-undo';
const els = {
  list: document.getElementById('list'),
  stats: document.getElementById('stats'),
  searchInput: document.getElementById('searchInput'),
  filterStatus: document.getElementById('filterStatus'),
  toggleFormBtn: document.getElementById('toggleFormBtn'),
  formWrap: document.getElementById('formWrap'),
  nameInput: document.getElementById('nameInput'),
  cadenceNumberInput: document.getElementById('cadenceNumberInput'),
  cadenceUnitInput: document.getElementById('cadenceUnitInput'),
  notesInput: document.getElementById('notesInput'),
  saveBtn: document.getElementById('saveBtn'),
  cancelBtn: document.getElementById('cancelBtn'),
  deleteEditBtn: document.getElementById('deleteEditBtn'),
  undoBtn: document.getElementById('undoBtn'),
  exportBtn: document.getElementById('exportBtn'),
  importBtn: document.getElementById('importBtn'),
  importFile: document.getElementById('importFile')
};

let intrays = load();
let editingId = null;
let expandedId = null;
let lastUndo = loadUndo();
let statsMode = localStorage.getItem('in-tray-stats-mode') || 'count';

if (!intrays.length) {
  intrays = seedData();
  persist();
}

updateUndoButton();

function seedData() {
  return [
    makeIntray('Personal Email', 1, 'days', 'Clear Inbox To Zero Or Close To Zero.'),
    makeIntray('Work Email', 1, 'business-days', 'Process Messages And Next Actions.'),
    makeIntray('Physical Papers', 1, 'weeks', 'Sort, Discard, File, Or Act.'),
    makeIntray('Downloads Folder', 1, 'months', 'Rename, File, Delete, Or Act.')
  ];
}

function makeIntray(name, cadenceNumber, cadenceUnit, notes = '') {
  return {
    id: cryptoRandomId(),
    name: toTitleCase(name),
    notes: toTitleCase(notes),
    cadenceNumber,
    cadenceUnit,
    createdAt: new Date().toISOString(),
    lastClearedAt: null,
    lastWorkedOnAt: null
  };
}

function cryptoRandomId() {
  return 'i_' + Math.random().toString(36).slice(2, 11);
}

function toTitleCase(str = '') {
  return String(str)
    .replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase())
    .replace(/\bIn-tray\b/g, 'In-Tray');
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(intrays));
}

function loadUndo() {
  try {
    const raw = localStorage.getItem(UNDO_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistUndo() {
  if (lastUndo) localStorage.setItem(UNDO_KEY, JSON.stringify(lastUndo));
  else localStorage.removeItem(UNDO_KEY);
  updateUndoButton();
}

function setUndo(label) {
  lastUndo = {
    label,
    intrays: JSON.parse(JSON.stringify(intrays)),
    expandedId,
    at: nowISO()
  };
  persistUndo();
}

function updateUndoButton() {
  if (!els.undoBtn) return;
  els.undoBtn.disabled = !lastUndo;
  els.undoBtn.textContent = 'Undo';
}

function undoLast() {
  if (!lastUndo) return;
  intrays = lastUndo.intrays || [];
  expandedId = lastUndo.expandedId || null;
  lastUndo = null;
  persist();
  persistUndo();
  resetForm();
  showForm(false);
  render();
}

function nowISO() {
  return new Date().toISOString();
}

function unitToDays(unit) {
  switch (unit) {
    case 'days': return 1;
    case 'business-days': return 1;
    case 'weeks': return 7;
    case 'months': return 30.44;
    case 'years': return 365.25;
    default: return 1;
  }
}

function businessDaysSince(iso) {
  if (!iso) return null;
  const start = new Date(iso);
  const end = new Date();
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  let count = 0;
  const d = new Date(start);
  d.setDate(d.getDate() + 1);
  while (d <= end) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) count++;
    d.setDate(d.getDate() + 1);
  }
  return count;
}

function elapsedForCadence(item) {
  return item.cadenceUnit === 'business-days' ? businessDaysSince(item.lastClearedAt) : daysSince(item.lastClearedAt);
}

function cadenceDays(item) {
  return item.cadenceNumber * unitToDays(item.cadenceUnit);
}

function daysSince(iso) {
  if (!iso) return null;
  return Math.max(0, (Date.now() - new Date(iso).getTime()) / 86400000);
}

function getStatus(item) {
  if (!item.lastClearedAt) return 'overdue';
  const elapsed = elapsedForCadence(item), target = cadenceDays(item);
  if (elapsed <= target) return 'good';
  if (elapsed <= target * 2) return 'warning';
  return 'overdue';
}

function statusLabel(status, item) {
  if (!item.lastClearedAt) return 'Never Cleared';
  if (status === 'good') return 'Good';
  if (status === 'warning') return 'Needs Attention';
  return 'Overdue';
}

function formatDateTime(iso) {
  if (!iso) return 'Not Yet';
  return new Date(iso).toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function formatCadence(item) {
  const n = item.cadenceNumber, u = item.cadenceUnit;
  if (u === 'business-days') return `Every ${n} ${n === 1 ? 'Business Day' : 'Business Days'}`;
  const singular = u.endsWith('s') ? u.slice(0, -1) : u;
  return `Every ${n} ${toTitleCase(n === 1 ? singular : u)}`;
}

function activityTime(item) {
  return new Date(item.lastWorkedOnAt || item.lastClearedAt || item.createdAt || 0).getTime();
}

function sortIntrays(items) {
  const priority = { overdue: 0, warning: 1, good: 2 };
  return [...items].sort((a, b) => {
    const sa = getStatus(a), sb = getStatus(b);
    if (priority[sa] !== priority[sb]) return priority[sa] - priority[sb];
    const act = activityTime(a), bct = activityTime(b);
    if (act !== bct) return act - bct;
    return a.name.localeCompare(b.name);
  });
}

function filteredIntrays() {
  const q = els.searchInput.value.trim().toLowerCase(), statusFilter = els.filterStatus.value;
  return sortIntrays(intrays).filter(item => {
    const text = [item.name, item.notes].join(' ').toLowerCase(), status = getStatus(item);
    return (!q || text.includes(q)) && (statusFilter === 'all' || status === statusFilter);
  });
}

function pct(n, total) {
  return total ? `${Math.round((n / total) * 100)}%` : '0%';
}

function renderStats() {
  const counts = { total: intrays.length, good: 0, warning: 0, overdue: 0 };
  for (const item of intrays) counts[getStatus(item)]++;
  els.stats.innerHTML = statsMode === 'percent'
    ? `<div class="stat total">${counts.total} Total</div><div class="stat good">${pct(counts.good, counts.total)} Good</div><div class="stat warning">${pct(counts.warning, counts.total)} Needs Attention</div><div class="stat overdue">${pct(counts.overdue, counts.total)} Overdue</div>`
    : `<div class="stat total">${counts.total} Total</div><div class="stat good">${counts.good} Good</div><div class="stat warning">${counts.warning} Needs Attention</div><div class="stat overdue">${counts.overdue} Overdue</div>`;
}

function render() {
  renderStats();
  updateUndoButton();
  const items = filteredIntrays();
  if (!items.length) {
    els.list.innerHTML = `<div class="empty">No In-Trays Match Your Current Filter.</div>`;
    return;
  }
  els.list.innerHTML = items.map(item => item.id === expandedId ? expandedCard(item) : compactCard(item)).join('');
  attachHandlers();
}

function swipeBg() {
  return `<div class="swipe-bg"><div class="swipe-bg-left">Worked On</div><div class="swipe-bg-right">Fully Cleared</div></div>`;
}

function compactCard(item) {
  const status = getStatus(item), statusText = statusLabel(status, item);
  return `<div class="swipe-wrap">${swipeBg()}<div class="compact-card swipe-card status-${status}" data-id="${item.id}"><div class="compact-title">${escapeHtml(item.name)}</div><div class="badge ${status}">${statusText}</div><div class="swipe-hint">Tap To Expand • ← Fully Cleared • Worked On →</div></div></div>`;
}

function expandedCard(item) {
  const status = getStatus(item), statusText = statusLabel(status, item), elapsed = item.lastClearedAt ? Math.floor(elapsedForCadence(item)) : '—', elapsedLabel = item.cadenceUnit === 'business-days' ? 'Business Days Since Full Clear' : 'Days Since Full Clear';
  return `<div class="swipe-wrap">${swipeBg()}<div class="card swipe-card status-${status}" data-id="${item.id}"><div class="card-toggle" data-id="${item.id}"><div class="card-top"><div class="title-row"><div class="title">${escapeHtml(item.name)}</div><div class="badge ${status}">${statusText}</div></div><div class="meta"><div class="meta-row"><div class="meta-label">Cadence</div><div class="meta-value">${formatCadence(item)}</div></div><div class="meta-row"><div class="meta-label">${elapsedLabel}</div><div class="meta-value">${elapsed}</div></div><div class="meta-row"><div class="meta-label">Last Fully Cleared</div><div class="meta-value">${formatDateTime(item.lastClearedAt)}</div></div><div class="meta-row"><div class="meta-label">Last Worked On</div><div class="meta-value">${formatDateTime(item.lastWorkedOnAt)}</div></div></div>${item.notes ? `<div class="notes">${escapeHtml(item.notes)}</div>` : ``}</div></div><div class="card-actions"><button class="small" data-action="cleared">Fully Cleared</button><button class="small secondary" data-action="worked-on">Worked On</button><button class="small secondary" data-action="edit">Edit</button></div></div></div>`;
}

function attachHandlers() {
  document.querySelectorAll('.swipe-card').forEach(card => {
    let startX = 0, startY = 0;
    card.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      card.dataset.swiped = '0';
      card.style.transition = 'none';
    }, { passive: true });

    card.addEventListener('touchmove', e => {
      const dx = e.touches[0].clientX - startX, dy = e.touches[0].clientY - startY;
      if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        card.dataset.swiped = '1';
        card.style.transform = `translateX(${Math.max(-135, Math.min(135, dx))}px)`;
      }
    }, { passive: true });

    card.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX, id = card.dataset.id;
      card.style.transition = 'transform .24s cubic-bezier(.2,.8,.2,1)';
      if (dx < -85) {
        card.style.transform = 'translateX(-135px)';
        setTimeout(() => markCleared(id), 90);
        return;
      }
      if (dx > 85) {
        card.style.transform = 'translateX(135px)';
        setTimeout(() => markWorkedOn(id), 90);
        return;
      }
      card.style.transform = 'translateX(0)';
      setTimeout(() => {
        card.style.transition = '';
        card.dataset.swiped = '0';
      }, 260);
    });
  });
}

function handleListClick(event) {
  const button = event.target.closest('button[data-action]');
  if (button) {
    const card = button.closest('.swipe-card');
    if (!card) return;

    event.stopPropagation();
    const id = card.dataset.id;

    if (button.dataset.action === 'cleared') markCleared(id);
    if (button.dataset.action === 'worked-on') markWorkedOn(id);
    if (button.dataset.action === 'edit') startEdit(id);
    return;
  }

  const card = event.target.closest('.swipe-card');
  if (!card || card.dataset.swiped === '1') return;

  if (card.classList.contains('compact-card')) {
    expandedId = expandedId === card.dataset.id ? null : card.dataset.id;
    render();
    return;
  }

  if (event.target.closest('.card-toggle')) {
    expandedId = null;
    render();
  }
}

function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function resetForm() {
  editingId = null;
  els.nameInput.value = '';
  els.cadenceNumberInput.value = 1;
  els.cadenceUnitInput.value = 'months';
  els.notesInput.value = '';
  els.saveBtn.textContent = 'Save In-Tray';
  els.deleteEditBtn.classList.add('hidden');
}

function showForm(show = true) {
  els.formWrap.classList.toggle('hidden', !show);
  if (show) els.nameInput.focus();
}

function startEdit(id) {
  const item = intrays.find(x => x.id === id);
  if (!item) return;
  editingId = id;
  els.nameInput.value = item.name;
  els.cadenceNumberInput.value = item.cadenceNumber;
  els.cadenceUnitInput.value = item.cadenceUnit;
  els.notesInput.value = item.notes || '';
  els.saveBtn.textContent = 'Save Changes';
  els.deleteEditBtn.classList.remove('hidden');
  showForm(true);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function saveIntray() {
  const name = toTitleCase(els.nameInput.value.trim()), cadenceNumber = Number(els.cadenceNumberInput.value), cadenceUnit = els.cadenceUnitInput.value, notes = toTitleCase(els.notesInput.value.trim());
  if (!name) {
    alert('Please Enter An In-Tray Name.');
    return;
  }
  if (!Number.isFinite(cadenceNumber) || cadenceNumber < 1) {
    alert('Cadence Number Must Be 1 Or Greater.');
    return;
  }
  setUndo(editingId ? 'Edit In-Tray' : 'Add In-Tray');
  if (editingId) {
    const item = intrays.find(x => x.id === editingId);
    if (!item) return;
    item.name = name;
    item.cadenceNumber = cadenceNumber;
    item.cadenceUnit = cadenceUnit;
    item.notes = notes;
  } else {
    intrays.push({
      id: cryptoRandomId(),
      name,
      notes,
      cadenceNumber,
      cadenceUnit,
      createdAt: nowISO(),
      lastClearedAt: null,
      lastWorkedOnAt: null
    });
  }
  persist();
  resetForm();
  showForm(false);
  render();
}

function markCleared(id) {
  const item = intrays.find(x => x.id === id);
  if (!item) return;
  setUndo('Fully Cleared');
  item.lastClearedAt = nowISO();
  item.lastWorkedOnAt = nowISO();
  expandedId = null;
  persist();
  render();
}

function markWorkedOn(id) {
  const item = intrays.find(x => x.id === id);
  if (!item) return;
  setUndo('Worked On');
  item.lastWorkedOnAt = nowISO();
  expandedId = null;
  persist();
  render();
}

function deleteCurrentEdit() {
  if (!editingId) return;
  const item = intrays.find(x => x.id === editingId);
  if (!item) return;
  if (!confirm(`Delete "${item.name}"?`)) return;
  setUndo('Delete In-Tray');
  intrays = intrays.filter(x => x.id !== editingId);
  persist();
  resetForm();
  showForm(false);
  render();
}

function exportBackup() {
  const backup = { app: 'in-tray-tracker', version: 1, exportedAt: nowISO(), intrays };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `in-tray-tracker-backup-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const VALID_CADENCE_UNITS = ['days', 'business-days', 'weeks', 'months', 'years'];

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function cleanImportedDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function cleanImportedIntray(raw, usedIds) {
  if (!isPlainObject(raw)) throw new Error('Invalid In-Tray');

  const cadenceNumber = Number(raw.cadenceNumber);
  const cadenceUnit = VALID_CADENCE_UNITS.includes(raw.cadenceUnit) ? raw.cadenceUnit : 'months';
  let id = typeof raw.id === 'string' && raw.id.trim() ? raw.id.trim() : cryptoRandomId();

  while (usedIds.has(id)) id = cryptoRandomId();
  usedIds.add(id);

  return {
    id,
    name: toTitleCase(raw.name || 'Untitled In-Tray'),
    notes: toTitleCase(raw.notes || ''),
    cadenceNumber: Number.isFinite(cadenceNumber) && cadenceNumber >= 1 ? cadenceNumber : 1,
    cadenceUnit,
    createdAt: cleanImportedDate(raw.createdAt) || nowISO(),
    lastClearedAt: cleanImportedDate(raw.lastClearedAt),
    lastWorkedOnAt: cleanImportedDate(raw.lastWorkedOnAt)
  };
}

function importBackupFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      const imported = Array.isArray(data) ? data : isPlainObject(data) ? data.intrays : null;

      if (!Array.isArray(imported)) throw new Error('Invalid Backup File');

      const usedIds = new Set();
      const clean = imported.map(item => cleanImportedIntray(item, usedIds));

      if (!confirm(`Import ${clean.length} In-Trays? This Will Replace Your Current List.`)) return;
      setUndo('Import Backup');
      intrays = clean;
      expandedId = null;
      persist();
      resetForm();
      showForm(false);
      render();
      alert('Backup Imported.');
    } catch (e) {
      alert('Could Not Import Backup. Make Sure You Selected A Valid In-Tray Tracker JSON Backup File.');
    }
  };
  reader.readAsText(file);
}

els.toggleFormBtn.addEventListener('click', () => {
  const hidden = els.formWrap.classList.contains('hidden');
  if (hidden) {
    resetForm();
    showForm(true);
  } else {
    showForm(false);
  }
});
els.saveBtn.addEventListener('click', saveIntray);
els.deleteEditBtn.addEventListener('click', deleteCurrentEdit);
els.cancelBtn.addEventListener('click', () => {
  resetForm();
  showForm(false);
});
els.undoBtn.addEventListener('click', undoLast);
els.searchInput.addEventListener('input', render);
els.filterStatus.addEventListener('change', render);
els.stats.addEventListener('click', () => {
  statsMode = statsMode === 'count' ? 'percent' : 'count';
  localStorage.setItem('in-tray-stats-mode', statsMode);
  renderStats();
});
els.exportBtn.addEventListener('click', exportBackup);
els.importBtn.addEventListener('click', () => els.importFile.click());
els.importFile.addEventListener('change', e => {
  const file = e.target.files && e.target.files[0];
  if (file) importBackupFile(file);
  els.importFile.value = '';
});
els.list.addEventListener('click', handleListClick);

render();
