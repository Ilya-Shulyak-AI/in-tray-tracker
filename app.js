// Constants
const STORAGE_KEY = 'in-tray-tracker-v1';
const UNDO_KEY = 'in-tray-last-undo';
const STATS_MODE_KEY = 'in-tray-stats-mode';
const BACKUP_REMINDER_KEY = 'in-tray-last-backup-at';
const TAG_FILTER_KEY = 'in-tray-tag-filter';
const TAG_UNTAGGED = 'Untagged';
const TAG_ALL = 'all';
const TAG_NEW_VALUE = '__new_tag__';
const APP_VERSION = '1.0';
const VALID_CADENCE_UNITS = ['days', 'business-days', 'weeks', 'months', 'years'];

// DOM references
const els = {
  list: document.getElementById('list'),
  stats: document.getElementById('stats'),
  searchInput: document.getElementById('searchInput'),
  filterStatus: document.getElementById('filterStatus'),
  filterTag: document.getElementById('filterTag'),
  toggleFormBtn: document.getElementById('toggleFormBtn'),
  formWrap: document.getElementById('formWrap'),
  nameInput: document.getElementById('nameInput'),
  cadenceNumberInput: document.getElementById('cadenceNumberInput'),
  cadenceUnitInput: document.getElementById('cadenceUnitInput'),
  tagInput: document.getElementById('tagInput'),
  notesInput: document.getElementById('notesInput'),
  saveBtn: document.getElementById('saveBtn'),
  cancelBtn: document.getElementById('cancelBtn'),
  deleteEditBtn: document.getElementById('deleteEditBtn'),
  undoBtn: document.getElementById('undoBtn'),
  exportBtn: document.getElementById('exportBtn'),
  importBtn: document.getElementById('importBtn'),
  importFile: document.getElementById('importFile'),
  backupStatus: document.getElementById('backupStatus'),
  appVersion: document.getElementById('appVersion')
};

// State
let intrays = loadIntrays();
let editingId = null;
let expandedId = null;
let lastUndo = loadUndo();
let statsMode = safeStorageGet(STATS_MODE_KEY) || 'count';
let activeTagFilter = safeStorageGet(TAG_FILTER_KEY) || TAG_ALL;

if (!intrays.length) {
  intrays = seedData();
  persist();
}

if (els.appVersion) els.appVersion.textContent = APP_VERSION;
updateUndoButton();

// Seed/default data
function seedData() {
  return [
    makeIntray('Personal Email', 1, 'days', 'Clear Inbox to zero or close to zero.'),
    makeIntray('Work Email', 1, 'business-days', 'Process messages and next actions.'),
    makeIntray('Physical Papers', 1, 'weeks', 'Sort, discard, file, or act.'),
    makeIntray('Downloads Folder', 1, 'months', 'Rename, file, delete, or act.')
  ];
}

function makeIntray(name, cadenceNumber, cadenceUnit, notes = '', tag = TAG_UNTAGGED) {
  return {
    id: cryptoRandomId(),
    name: normalizeInputText(name),
    notes: normalizeInputText(notes),
    tag: normalizeTag(tag),
    cadenceNumber: sanitizeCadenceNumber(cadenceNumber),
    cadenceUnit: sanitizeCadenceUnit(cadenceUnit),
    createdAt: nowISO(),
    lastClearedAt: null,
    lastWorkedOnAt: null
  };
}

function cryptoRandomId() {
  if (window.crypto?.getRandomValues) {
    const bytes = new Uint32Array(2);
    window.crypto.getRandomValues(bytes);
    return `i_${bytes[0].toString(36)}${bytes[1].toString(36)}`;
  }
  return 'i_' + Math.random().toString(36).slice(2, 11);
}

function normalizeInputText(str = '') {
  return String(str).trim();
}

function normalizeTag(value = '') {
  const tag = normalizeInputText(value);
  return tag || TAG_UNTAGGED;
}

function getItemTag(item) {
  return normalizeTag(item.tag);
}

function sanitizeCadenceNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 1 ? Math.floor(number) : 1;
}

function sanitizeCadenceUnit(value) {
  return VALID_CADENCE_UNITS.includes(value) ? value : 'months';
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

// Storage helpers
function safeStorageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // LocalStorage can be unavailable in private browsing or restricted contexts.
  }
}

function safeStorageRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // LocalStorage can be unavailable in private browsing or restricted contexts.
  }
}

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function loadIntrays() {
  const raw = loadJson(STORAGE_KEY, []);
  if (!Array.isArray(raw)) return [];

  const usedIds = new Set();
  return raw
    .filter(isPlainObject)
    .map(item => cleanStoredIntray(item, usedIds));
}

function cleanStoredIntray(raw, usedIds) {
  let id = typeof raw.id === 'string' && raw.id.trim() ? raw.id.trim() : cryptoRandomId();
  while (usedIds.has(id)) id = cryptoRandomId();
  usedIds.add(id);

  return {
    id,
    name: normalizeInputText(raw.name || 'Untitled In-Tray'),
    notes: normalizeInputText(raw.notes || ''),
    tag: normalizeTag(raw.tag || TAG_UNTAGGED),
    cadenceNumber: sanitizeCadenceNumber(raw.cadenceNumber),
    cadenceUnit: sanitizeCadenceUnit(raw.cadenceUnit),
    createdAt: cleanImportedDate(raw.createdAt) || nowISO(),
    lastClearedAt: cleanImportedDate(raw.lastClearedAt),
    lastWorkedOnAt: cleanImportedDate(raw.lastWorkedOnAt)
  };
}

function persist() {
  safeStorageSet(STORAGE_KEY, JSON.stringify(intrays));
}

function loadUndo() {
  const undo = loadJson(UNDO_KEY, null);
  if (!isPlainObject(undo) || !Array.isArray(undo.intrays)) return null;
  const usedIds = new Set();
  return {
    label: normalizeInputText(undo.label || 'Undo'),
    intrays: undo.intrays.filter(isPlainObject).map(item => cleanStoredIntray(item, usedIds)),
    expandedId: typeof undo.expandedId === 'string' ? undo.expandedId : null,
    at: cleanImportedDate(undo.at) || nowISO()
  };
}

function persistUndo() {
  if (lastUndo) safeStorageSet(UNDO_KEY, JSON.stringify(lastUndo));
  else safeStorageRemove(UNDO_KEY);
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
  els.undoBtn.textContent = lastUndo ? `Undo ${lastUndo.label || ''}`.trim() : 'Undo';
}

function undoLast() {
  if (!lastUndo) return;
  intrays = Array.isArray(lastUndo.intrays) ? lastUndo.intrays : [];
  expandedId = lastUndo.expandedId || null;
  lastUndo = null;
  persist();
  persistUndo();
  resetForm();
  showForm(false);
  render();
}

// Date/cadence/status helpers
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
  if (Number.isNaN(start.getTime())) return null;
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  if (start >= end) return 0;

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
  return sanitizeCadenceNumber(item.cadenceNumber) * unitToDays(item.cadenceUnit);
}

function daysSince(iso) {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;
  return Math.max(0, (Date.now() - then) / 86400000);
}

function getStatus(item) {
  if (!item.lastClearedAt) return 'overdue';
  const elapsed = elapsedForCadence(item);
  const target = cadenceDays(item);
  if (elapsed === null) return 'overdue';
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
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Not Yet';
  return date.toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function formatCadence(item) {
  const n = sanitizeCadenceNumber(item.cadenceNumber);
  const u = sanitizeCadenceUnit(item.cadenceUnit);
  if (u === 'business-days') return `Every ${n} ${n === 1 ? 'Business Day' : 'Business Days'}`;
  const singular = u.endsWith('s') ? u.slice(0, -1) : u;
  return `Every ${n} ${titleCase(n === 1 ? singular : u)}`;
}

function titleCase(str = '') {
  return String(str).replace(/\w\S*/g, token => token.charAt(0).toUpperCase() + token.slice(1).toLowerCase());
}

function activityTime(item) {
  const time = new Date(item.lastWorkedOnAt || item.lastClearedAt || item.createdAt || 0).getTime();
  return Number.isNaN(time) ? 0 : time;
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
  const q = els.searchInput.value.trim().toLowerCase();
  const statusFilter = els.filterStatus.value;
  return sortIntrays(intrays).filter(item => {
    const text = [item.name, item.notes, getItemTag(item)].join(' ').toLowerCase();
    const status = getStatus(item);
    return (!q || text.includes(q)) &&
      (statusFilter === 'all' || status === statusFilter) &&
      matchesTagFilter(item);
  });
}

function matchesTagFilter(item) {
  return activeTagFilter === TAG_ALL || getItemTag(item) === activeTagFilter;
}

function pct(n, total) {
  return total ? `${Math.round((n / total) * 100)}%` : '0%';
}

// Render helpers
function renderStats() {
  const counts = { total: intrays.length, good: 0, warning: 0, overdue: 0 };
  for (const item of intrays) counts[getStatus(item)]++;
  els.stats.innerHTML = statsMode === 'percent'
    ? `<div class="stat total">${counts.total} Total</div><div class="stat good">${pct(counts.good, counts.total)} Good</div><div class="stat warning">${pct(counts.warning, counts.total)} Needs Attention</div><div class="stat overdue">${pct(counts.overdue, counts.total)} Overdue</div>`
    : `<div class="stat total">${counts.total} Total</div><div class="stat good">${counts.good} Good</div><div class="stat warning">${counts.warning} Needs Attention</div><div class="stat overdue">${counts.overdue} Overdue</div>`;
}

function render() {
  renderStats();
  renderBackupStatus();
  updateUndoButton();
  updateTagControls();

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

function tagPillHtml(item, compact = false) {
  const tag = getItemTag(item);
  if (tag === TAG_UNTAGGED) return '';
  return `<div class="tag-row${compact ? ' compact-tag-row' : ''}"><span class="tag-pill">${escapeHtml(tag)}</span></div>`;
}

function compactCard(item) {
  const status = getStatus(item);
  const statusText = statusLabel(status, item);
  return `<div class="swipe-wrap">${swipeBg()}<div class="compact-card swipe-card status-${status}" data-id="${escapeAttr(item.id)}" role="button" tabindex="0" aria-label="Expand ${escapeAttr(item.name)}"><div class="compact-title">${escapeHtml(item.name)}</div><div class="badge ${status}">${statusText}</div>${tagPillHtml(item, true)}<div class="swipe-hint">Tap To Expand • ← Fully Cleared • Worked On →</div></div></div>`;
}

function expandedCard(item) {
  const status = getStatus(item);
  const statusText = statusLabel(status, item);
  const elapsed = item.lastClearedAt ? Math.floor(elapsedForCadence(item) || 0) : '—';
  const elapsedLabel = item.cadenceUnit === 'business-days' ? 'Business Days Since Full Clear' : 'Days Since Full Clear';
  return `<div class="swipe-wrap">${swipeBg()}<div class="card swipe-card status-${status}" data-id="${escapeAttr(item.id)}"><div class="card-toggle" data-id="${escapeAttr(item.id)}" role="button" tabindex="0" aria-label="Collapse ${escapeAttr(item.name)}"><div class="card-top"><div class="title-row"><div class="title">${escapeHtml(item.name)}</div><div class="badge ${status}">${statusText}</div></div>${tagPillHtml(item)}<div class="meta"><div class="meta-row"><div class="meta-label">Cadence</div><div class="meta-value">${formatCadence(item)}</div></div><div class="meta-row"><div class="meta-label">${elapsedLabel}</div><div class="meta-value">${elapsed}</div></div><div class="meta-row"><div class="meta-label">Last Fully Cleared</div><div class="meta-value">${formatDateTime(item.lastClearedAt)}</div></div><div class="meta-row"><div class="meta-label">Last Worked On</div><div class="meta-value">${formatDateTime(item.lastWorkedOnAt)}</div></div></div>${item.notes ? `<div class="notes">${escapeHtml(item.notes)}</div>` : ''}</div></div><div class="card-actions"><button class="small" data-action="cleared">Fully Cleared</button><button class="small secondary" data-action="worked-on">Worked On</button><button class="small secondary" data-action="edit">Edit</button></div></div></div>`;
}

function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeAttr(value = '') {
  return escapeHtml(value);
}

// Tag helpers
function getCustomTags(extraTag = '') {
  const tags = new Set();
  for (const item of intrays) {
    const tag = getItemTag(item);
    if (tag !== TAG_UNTAGGED) tags.add(tag);
  }
  const extra = normalizeTag(extraTag);
  if (extra !== TAG_UNTAGGED) tags.add(extra);
  return [...tags].sort((a, b) => a.localeCompare(b));
}

function tagOptionsHtml(selectedTag = TAG_UNTAGGED) {
  const selected = normalizeTag(selectedTag);
  const tags = getCustomTags(selected);
  return `<option value="${TAG_UNTAGGED}"${selected === TAG_UNTAGGED ? ' selected' : ''}>Untagged</option>` +
    tags.map(tag => `<option value="${escapeAttr(tag)}"${tag === selected ? ' selected' : ''}>${escapeHtml(tag)}</option>`).join('') +
    `<option value="${TAG_NEW_VALUE}">+ Add New Tag</option>`;
}

function tagFilterOptionsHtml() {
  const tags = getCustomTags();
  const selected = activeTagFilter;
  return `<option value="${TAG_ALL}"${selected === TAG_ALL ? ' selected' : ''}>All Tags</option>` +
    `<option value="${TAG_UNTAGGED}"${selected === TAG_UNTAGGED ? ' selected' : ''}>Untagged</option>` +
    tags.map(tag => `<option value="${escapeAttr(tag)}"${tag === selected ? ' selected' : ''}>${escapeHtml(tag)}</option>`).join('');
}

function updateTagControls(selectedFormTag = els.tagInput?.value || TAG_UNTAGGED) {
  const tags = getCustomTags();
  if (activeTagFilter !== TAG_ALL && activeTagFilter !== TAG_UNTAGGED && !tags.includes(activeTagFilter)) {
    activeTagFilter = TAG_ALL;
    safeStorageSet(TAG_FILTER_KEY, activeTagFilter);
  }

  if (els.filterTag) {
    els.filterTag.innerHTML = tagFilterOptionsHtml();
    els.filterTag.value = activeTagFilter;
  }

  if (els.tagInput) {
    const selected = normalizeTag(selectedFormTag);
    els.tagInput.innerHTML = tagOptionsHtml(selected);
    els.tagInput.value = selected;
  }
}

function handleTagInputChange() {
  if (els.tagInput.value !== TAG_NEW_VALUE) return;
  const entered = prompt('Enter New Tag Name:');
  const tag = normalizeTag(entered || '');
  updateTagControls(tag);
}

// Backup reminder helpers
function formatReminderDate(iso) {
  if (!iso) return 'Not yet';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Not yet';
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function getCurrentWeeklyBackupReminderAt(now = new Date()) {
  const reminder = new Date(now);
  reminder.setHours(6, 0, 0, 0);
  reminder.setDate(reminder.getDate() - reminder.getDay());
  if (now < reminder) reminder.setDate(reminder.getDate() - 7);
  return reminder;
}

function getNextWeeklyBackupReminderAt(now = new Date()) {
  const reminder = new Date(now);
  reminder.setHours(6, 0, 0, 0);
  reminder.setDate(reminder.getDate() - reminder.getDay());
  if (now >= reminder) reminder.setDate(reminder.getDate() + 7);
  return reminder;
}

function isWeeklyBackupRecommended() {
  const lastBackupAt = safeStorageGet(BACKUP_REMINDER_KEY);
  if (!lastBackupAt) return true;
  const lastBackupTime = new Date(lastBackupAt).getTime();
  return Number.isNaN(lastBackupTime) || lastBackupTime < getCurrentWeeklyBackupReminderAt().getTime();
}

function renderBackupStatus() {
  if (!els.backupStatus) return;
  const lastBackupAt = safeStorageGet(BACKUP_REMINDER_KEY);
  const recommended = isWeeklyBackupRecommended();
  els.backupStatus.classList.toggle('recommended', recommended);
  els.backupStatus.textContent = recommended
    ? `Backup recommended. Last backup: ${formatReminderDate(lastBackupAt)}.`
    : `Last backup: ${formatReminderDate(lastBackupAt)}. Next reminder: ${formatReminderDate(getNextWeeklyBackupReminderAt())}.`;
}

// Swipe and card event handlers
function clearSwipeLabel(card) {
  const wrap = card.closest('.swipe-wrap');
  if (wrap) wrap.classList.remove('swiping-left', 'swiping-right');
}

function resetCardSwipe(card) {
  clearSwipeLabel(card);
  card.dataset.swiped = '0';
}

function attachHandlers() {
  document.querySelectorAll('.swipe-card').forEach(card => {
    let startX = 0;
    let startY = 0;
    let mode = null;

    card.addEventListener('touchstart', event => {
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
      mode = null;
      resetCardSwipe(card);
      card.style.transition = 'none';
    }, { passive: true });

    card.addEventListener('touchmove', event => {
      const dx = event.touches[0].clientX - startX;
      const dy = event.touches[0].clientY - startY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      const width = card.offsetWidth || window.innerWidth || 320;
      const intent = Math.max(24, width * 0.08);
      const reveal = Math.max(80, width * 0.25);
      const limit = Math.min(width * 0.58, width - 28);
      const wrap = card.closest('.swipe-wrap');

      if (mode === 'vertical') return;

      if (!mode) {
        if (absY > 12 && absY > absX * 1.15) {
          mode = 'vertical';
          resetCardSwipe(card);
          card.style.transform = 'translateX(0)';
          return;
        }

        if (absX > intent && absX > absY * 1.8) mode = 'horizontal';
        else {
          clearSwipeLabel(card);
          return;
        }
      }

      if (mode === 'horizontal') {
        event.preventDefault();
        card.dataset.swiped = '1';
        if (wrap) {
          wrap.classList.toggle('swiping-left', absX >= reveal && dx < 0);
          wrap.classList.toggle('swiping-right', absX >= reveal && dx > 0);
        }
        card.style.transform = `translateX(${Math.max(-limit, Math.min(limit, dx))}px)`;
      }
    }, { passive: false });

    card.addEventListener('touchend', event => {
      const dx = event.changedTouches[0].clientX - startX;
      const width = card.offsetWidth || window.innerWidth || 320;
      const action = Math.max(150, width * 0.5);
      const limit = Math.min(width * 0.58, width - 28);
      const id = card.dataset.id;
      card.style.transition = 'transform .24s cubic-bezier(.2,.8,.2,1)';

      if (mode === 'horizontal' && dx <= -action) {
        card.style.transform = `translateX(${-limit}px)`;
        setTimeout(() => markCleared(id), 90);
        return;
      }

      if (mode === 'horizontal' && dx >= action) {
        card.style.transform = `translateX(${limit}px)`;
        setTimeout(() => markWorkedOn(id), 90);
        return;
      }

      clearSwipeLabel(card);
      card.style.transform = 'translateX(0)';
      setTimeout(() => {
        card.style.transition = '';
        resetCardSwipe(card);
      }, 260);
    });

    card.addEventListener('touchcancel', () => {
      card.style.transition = 'transform .18s ease';
      card.style.transform = 'translateX(0)';
      setTimeout(() => {
        card.style.transition = '';
        resetCardSwipe(card);
      }, 200);
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

  const toggle = event.target.closest('.compact-card, .card-toggle');
  if (!toggle || toggle.dataset.swiped === '1') return;

  if (toggle.classList.contains('compact-card')) {
    expandedId = expandedId === toggle.dataset.id ? null : toggle.dataset.id;
    render();
    return;
  }

  if (toggle.classList.contains('card-toggle')) {
    expandedId = null;
    render();
  }
}

function handleListKeydown(event) {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const toggle = event.target.closest('.compact-card, .card-toggle');
  if (!toggle) return;
  event.preventDefault();
  toggle.click();
}

// Form/action handlers
function resetForm() {
  editingId = null;
  els.nameInput.value = '';
  els.cadenceNumberInput.value = 1;
  els.cadenceUnitInput.value = 'months';
  els.notesInput.value = '';
  els.saveBtn.textContent = 'Save In-Tray';
  els.deleteEditBtn.classList.add('hidden');
  updateTagControls(TAG_UNTAGGED);
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
  els.cadenceNumberInput.value = sanitizeCadenceNumber(item.cadenceNumber);
  els.cadenceUnitInput.value = sanitizeCadenceUnit(item.cadenceUnit);
  els.notesInput.value = item.notes || '';
  els.saveBtn.textContent = 'Save Changes';
  els.deleteEditBtn.classList.remove('hidden');
  updateTagControls(getItemTag(item));
  showForm(true);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function saveIntray() {
  const name = normalizeInputText(els.nameInput.value);
  const cadenceNumber = Number(els.cadenceNumberInput.value);
  const cadenceUnit = sanitizeCadenceUnit(els.cadenceUnitInput.value);
  const notes = normalizeInputText(els.notesInput.value);
  const tag = normalizeTag(els.tagInput?.value || TAG_UNTAGGED);

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
    item.cadenceNumber = Math.floor(cadenceNumber);
    item.cadenceUnit = cadenceUnit;
    item.notes = notes;
    item.tag = tag;
  } else {
    intrays.push(makeIntray(name, cadenceNumber, cadenceUnit, notes, tag));
  }

  persist();
  resetForm();
  showForm(false);
  render();
}

function markCleared(id) {
  const item = intrays.find(x => x.id === id);
  if (!item) return;
  const timestamp = nowISO();
  setUndo('Fully Cleared');
  item.lastClearedAt = timestamp;
  item.lastWorkedOnAt = timestamp;
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
  expandedId = expandedId === editingId ? null : expandedId;
  persist();
  resetForm();
  showForm(false);
  render();
}

// Import/export
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
  safeStorageSet(BACKUP_REMINDER_KEY, nowISO());
  renderBackupStatus();
}

function cleanImportedDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function cleanImportedIntray(raw, usedIds) {
  if (!isPlainObject(raw)) throw new Error('Invalid In-Tray');
  return cleanStoredIntray(raw, usedIds);
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

      if (!confirm(`Import ${clean.length} In-Trays? This will replace your current list. Export a backup first if needed.`)) return;
      setUndo('Import Backup');
      intrays = clean;
      expandedId = null;
      persist();
      resetForm();
      showForm(false);
      render();
      alert('Backup Imported.');
    } catch {
      alert('Could Not Import Backup. Make Sure You Selected A Valid In-Tray Tracker JSON Backup File.');
    }
  };
  reader.readAsText(file);
}

// Event listener wiring
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
els.filterTag.addEventListener('change', () => {
  activeTagFilter = els.filterTag.value;
  safeStorageSet(TAG_FILTER_KEY, activeTagFilter);
  render();
});
els.tagInput.addEventListener('change', handleTagInputChange);
els.stats.addEventListener('click', () => {
  statsMode = statsMode === 'count' ? 'percent' : 'count';
  safeStorageSet(STATS_MODE_KEY, statsMode);
  renderStats();
});
els.exportBtn.addEventListener('click', exportBackup);
els.importBtn.addEventListener('click', () => els.importFile.click());
els.importFile.addEventListener('change', event => {
  const file = event.target.files && event.target.files[0];
  if (file) importBackupFile(file);
  els.importFile.value = '';
});
els.list.addEventListener('click', handleListClick);
els.list.addEventListener('keydown', handleListKeydown);

// Initial render
render();
