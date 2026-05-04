const TAG_UNTAGGED = 'Untagged';
const TAG_FILTER_KEY = 'in-tray-tag-filter';
const TAG_NEW_VALUE = '__new_tag__';
let activeTagFilter = localStorage.getItem(TAG_FILTER_KEY) || 'all';

function normalizeTag(value = '') {
  const tag = String(value).trim();
  return tag || TAG_UNTAGGED;
}

function getItemTag(item) {
  return normalizeTag(item.tag);
}

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

function escapeAttr(value = '') {
  return escapeHtml(value);
}

function ensureTagStyles() {
  if (document.getElementById('tagFeatureStyles')) return;
  const style = document.createElement('style');
  style.id = 'tagFeatureStyles';
  style.textContent = `
    .toolbar-row.tag-enabled {
      grid-template-columns: minmax(0, 1.4fr) minmax(0, .9fr) minmax(0, .9fr) minmax(0, .7fr);
    }

    .tag-form-field {
      margin-top: 8px;
    }

    .tag-pill {
      display: inline-flex;
      align-items: center;
      max-width: 100%;
      width: fit-content;
      padding: 4px 8px;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.16);
      background: rgba(255, 255, 255, 0.11);
      color: rgba(247, 247, 251, 0.88);
      font-size: 0.7rem;
      font-weight: 820;
      line-height: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      backdrop-filter: var(--blur);
      -webkit-backdrop-filter: var(--blur);
    }

    .tag-row {
      display: flex;
      min-width: 0;
      margin-top: -3px;
    }

    .compact-tag-row {
      grid-column: 1 / -1;
      margin-top: -4px;
    }

    @media (max-width: 520px) {
      .toolbar-row.tag-enabled {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
  `;
  document.head.appendChild(style);
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
  return `<option value="all"${selected === 'all' ? ' selected' : ''}>All Tags</option>` +
    `<option value="${TAG_UNTAGGED}"${selected === TAG_UNTAGGED ? ' selected' : ''}>Untagged</option>` +
    tags.map(tag => `<option value="${escapeAttr(tag)}"${tag === selected ? ' selected' : ''}>${escapeHtml(tag)}</option>`).join('');
}

function ensureTagUi() {
  ensureTagStyles();

  const toolbarRow = document.querySelector('.toolbar-row');
  if (toolbarRow && !document.getElementById('filterTag')) {
    toolbarRow.classList.add('tag-enabled');
    els.filterTag = document.createElement('select');
    els.filterTag.id = 'filterTag';
    els.filterTag.setAttribute('aria-label', 'Filter by tag');
    els.filterTag.innerHTML = tagFilterOptionsHtml();
    els.filterTag.addEventListener('change', () => {
      activeTagFilter = els.filterTag.value;
      localStorage.setItem(TAG_FILTER_KEY, activeTagFilter);
      render();
    });
    toolbarRow.insertBefore(els.filterTag, els.toggleFormBtn);
  }

  if (!document.getElementById('tagInput')) {
    const notesField = document.querySelector('label[for="notesInput"]')?.closest('.field');
    const tagField = document.createElement('div');
    tagField.className = 'field tag-form-field';
    tagField.innerHTML = `<label for="tagInput">Tag</label><select id="tagInput"></select>`;
    notesField?.before(tagField);
    els.tagInput = document.getElementById('tagInput');
    els.tagInput.addEventListener('change', handleTagInputChange);
  } else {
    els.tagInput = document.getElementById('tagInput');
  }

  updateTagControls();
}

function updateTagControls(selectedFormTag = els.tagInput?.value || TAG_UNTAGGED) {
  if (els.filterTag) {
    const tags = getCustomTags();
    if (activeTagFilter !== 'all' && activeTagFilter !== TAG_UNTAGGED && !tags.includes(activeTagFilter)) {
      activeTagFilter = 'all';
      localStorage.setItem(TAG_FILTER_KEY, activeTagFilter);
    }
    els.filterTag.innerHTML = tagFilterOptionsHtml();
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
  if (tag === TAG_UNTAGGED) {
    updateTagControls(TAG_UNTAGGED);
    return;
  }
  updateTagControls(tag);
}

function migrateMissingTags() {
  let changed = false;
  for (const item of intrays) {
    if (!item.tag) {
      item.tag = TAG_UNTAGGED;
      changed = true;
    }
  }
  if (changed) persist();
}

function matchesTagFilter(item) {
  return activeTagFilter === 'all' || getItemTag(item) === activeTagFilter;
}

filteredIntrays = function () {
  const q = els.searchInput.value.trim().toLowerCase();
  const statusFilter = els.filterStatus.value;
  return sortIntrays(intrays).filter(item => {
    const text = [item.name, item.notes, getItemTag(item)].join(' ').toLowerCase();
    const status = getStatus(item);
    return (!q || text.includes(q)) &&
      (statusFilter === 'all' || status === statusFilter) &&
      matchesTagFilter(item);
  });
};

function tagPillHtml(item, compact = false) {
  const tag = getItemTag(item);
  if (tag === TAG_UNTAGGED) return '';
  return `<div class="tag-row${compact ? ' compact-tag-row' : ''}"><span class="tag-pill">${escapeHtml(tag)}</span></div>`;
}

compactCard = function (item) {
  const status = getStatus(item);
  const statusText = statusLabel(status, item);
  return `<div class="swipe-wrap">${swipeBg()}<div class="compact-card swipe-card status-${status}" data-id="${item.id}"><div class="compact-title">${escapeHtml(item.name)}</div><div class="badge ${status}">${statusText}</div>${tagPillHtml(item, true)}<div class="swipe-hint">Tap To Expand • ← Fully Cleared • Worked On →</div></div></div>`;
};

expandedCard = function (item) {
  const status = getStatus(item);
  const statusText = statusLabel(status, item);
  const elapsed = item.lastClearedAt ? Math.floor(elapsedForCadence(item)) : '—';
  const elapsedLabel = item.cadenceUnit === 'business-days' ? 'Business Days Since Full Clear' : 'Days Since Full Clear';
  return `<div class="swipe-wrap">${swipeBg()}<div class="card swipe-card status-${status}" data-id="${item.id}"><div class="card-toggle" data-id="${item.id}"><div class="card-top"><div class="title-row"><div class="title">${escapeHtml(item.name)}</div><div class="badge ${status}">${statusText}</div></div>${tagPillHtml(item)}<div class="meta"><div class="meta-row"><div class="meta-label">Cadence</div><div class="meta-value">${formatCadence(item)}</div></div><div class="meta-row"><div class="meta-label">${elapsedLabel}</div><div class="meta-value">${elapsed}</div></div><div class="meta-row"><div class="meta-label">Last Fully Cleared</div><div class="meta-value">${formatDateTime(item.lastClearedAt)}</div></div><div class="meta-row"><div class="meta-label">Last Worked On</div><div class="meta-value">${formatDateTime(item.lastWorkedOnAt)}</div></div></div>${item.notes ? `<div class="notes">${escapeHtml(item.notes)}</div>` : ``}</div></div><div class="card-actions"><button class="small" data-action="cleared">Fully Cleared</button><button class="small secondary" data-action="worked-on">Worked On</button><button class="small secondary" data-action="edit">Edit</button></div></div></div>`;
};

const renderBeforeTags = render;
render = function () {
  ensureTagUi();
  renderStats();
  updateUndoButton();
  const items = filteredIntrays();
  if (!items.length) {
    els.list.innerHTML = `<div class="empty">No In-Trays Match Your Current Filter.</div>`;
    updateTagControls();
    return;
  }
  els.list.innerHTML = items.map(item => item.id === expandedId ? expandedCard(item) : compactCard(item)).join('');
  attachHandlers();
  updateTagControls();
};

resetForm = function () {
  editingId = null;
  els.nameInput.value = '';
  els.cadenceNumberInput.value = 1;
  els.cadenceUnitInput.value = 'months';
  els.notesInput.value = '';
  els.saveBtn.textContent = 'Save In-Tray';
  els.deleteEditBtn.classList.add('hidden');
  ensureTagUi();
  updateTagControls(TAG_UNTAGGED);
};

startEdit = function (id) {
  const item = intrays.find(x => x.id === id);
  if (!item) return;
  editingId = id;
  els.nameInput.value = item.name;
  els.cadenceNumberInput.value = item.cadenceNumber;
  els.cadenceUnitInput.value = item.cadenceUnit;
  els.notesInput.value = item.notes || '';
  els.saveBtn.textContent = 'Save Changes';
  els.deleteEditBtn.classList.remove('hidden');
  ensureTagUi();
  updateTagControls(getItemTag(item));
  showForm(true);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

function saveIntrayWithTags() {
  const name = normalizeInputText(els.nameInput.value);
  const cadenceNumber = Number(els.cadenceNumberInput.value);
  const cadenceUnit = els.cadenceUnitInput.value;
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
    item.cadenceNumber = cadenceNumber;
    item.cadenceUnit = cadenceUnit;
    item.notes = notes;
    item.tag = tag;
  } else {
    intrays.push({
      id: cryptoRandomId(),
      name,
      notes,
      tag,
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

function cleanImportedIntrayWithTags(raw, usedIds) {
  if (!isPlainObject(raw)) throw new Error('Invalid In-Tray');
  const item = cleanImportedIntrayWithExactText(raw, usedIds);
  item.tag = normalizeTag(raw.tag || TAG_UNTAGGED);
  return item;
}

function importBackupFileWithTags(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      const imported = Array.isArray(data) ? data : isPlainObject(data) ? data.intrays : null;
      if (!Array.isArray(imported)) throw new Error('Invalid Backup File');
      const usedIds = new Set();
      const clean = imported.map(item => cleanImportedIntrayWithTags(item, usedIds));
      if (!confirm(`Import ${clean.length} In-Trays? This will replace your current list. Export a backup first if needed.`)) return;
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

function addTagsHelpSection() {
  const helpContent = document.querySelector('.help-content');
  if (!helpContent || document.getElementById('tagsHelpSection')) return;
  const section = document.createElement('section');
  section.id = 'tagsHelpSection';
  section.innerHTML = `<h3>Tags</h3><p>Tags are optional labels for context, such as Home, Work, Church, or a specific device. Use one clear tag per in-tray so filtering stays useful. In-trays without a custom tag are treated as Untagged.</p>`;
  const searchSection = [...helpContent.querySelectorAll('section')].find(s => s.querySelector('h3')?.textContent.trim() === 'Search, Filter, And Stats');
  helpContent.insertBefore(section, searchSection || null);
}

migrateMissingTags();
ensureTagUi();
els.saveBtn.removeEventListener('click', saveIntray);
if (typeof saveIntrayWithExactText === 'function') els.saveBtn.removeEventListener('click', saveIntrayWithExactText);
els.saveBtn.addEventListener('click', saveIntrayWithTags);
cleanImportedIntray = cleanImportedIntrayWithTags;
importBackupFile = importBackupFileWithTags;
addTagsHelpSection();
render();
