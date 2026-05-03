const BACKUP_REMINDER_KEY = 'in-tray-last-backup-at';
const APP_VERSION = '1.0';

function normalizeInputText(str = '') {
  return String(str).trim();
}

function formatReminderDate(iso) {
  if (!iso) return 'Not yet';
  return new Date(iso).toLocaleString([], {
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
  const lastBackupAt = localStorage.getItem(BACKUP_REMINDER_KEY);
  if (!lastBackupAt) return true;
  const lastBackupTime = new Date(lastBackupAt).getTime();
  return Number.isNaN(lastBackupTime) || lastBackupTime < getCurrentWeeklyBackupReminderAt().getTime();
}

function ensureBackupStatusElement() {
  const existing = document.getElementById('backupStatus');
  if (existing) return existing;

  const backup = document.querySelector('.backup');
  if (!backup) return null;

  const status = document.createElement('div');
  status.id = 'backupStatus';
  status.className = 'backup-status';
  status.setAttribute('aria-live', 'polite');
  backup.appendChild(status);
  return status;
}

function ensureEnhancementStyles() {
  if (document.getElementById('appEnhancementStyles')) return;

  const style = document.createElement('style');
  style.id = 'appEnhancementStyles';
  style.textContent = `
    .backup-status {
      margin-top: 7px;
      padding: 7px 9px;
      border-radius: 14px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(255, 255, 255, 0.07);
      color: rgba(247, 247, 251, 0.82);
      font-size: 0.74rem;
      font-weight: 720;
      line-height: 1.25;
      text-align: center;
    }

    .backup-status.recommended {
      background: rgba(255, 159, 10, 0.22);
      color: var(--warning-text);
      border-color: rgba(255, 159, 10, 0.34);
    }
  `;
  document.head.appendChild(style);
}

function renderBackupStatus() {
  ensureEnhancementStyles();
  const status = ensureBackupStatusElement();
  if (!status) return;

  const lastBackupAt = localStorage.getItem(BACKUP_REMINDER_KEY);
  const nextReminder = getNextWeeklyBackupReminderAt();
  const recommended = isWeeklyBackupRecommended();

  status.classList.toggle('recommended', recommended);
  status.textContent = recommended
    ? `Backup recommended. Last backup: ${formatReminderDate(lastBackupAt)}.`
    : `Last backup: ${formatReminderDate(lastBackupAt)}. Next reminder: ${formatReminderDate(nextReminder)}.`;
}

function saveIntrayWithExactText() {
  const name = normalizeInputText(els.nameInput.value);
  const cadenceNumber = Number(els.cadenceNumberInput.value);
  const cadenceUnit = els.cadenceUnitInput.value;
  const notes = normalizeInputText(els.notesInput.value);

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

function cleanImportedIntrayWithExactText(raw, usedIds) {
  if (!isPlainObject(raw)) throw new Error('Invalid In-Tray');

  const cadenceNumber = Number(raw.cadenceNumber);
  const cadenceUnit = VALID_CADENCE_UNITS.includes(raw.cadenceUnit) ? raw.cadenceUnit : 'months';
  let id = typeof raw.id === 'string' && raw.id.trim() ? raw.id.trim() : cryptoRandomId();

  while (usedIds.has(id)) id = cryptoRandomId();
  usedIds.add(id);

  return {
    id,
    name: normalizeInputText(raw.name || 'Untitled In-Tray'),
    notes: normalizeInputText(raw.notes || ''),
    cadenceNumber: Number.isFinite(cadenceNumber) && cadenceNumber >= 1 ? cadenceNumber : 1,
    cadenceUnit,
    createdAt: cleanImportedDate(raw.createdAt) || nowISO(),
    lastClearedAt: cleanImportedDate(raw.lastClearedAt),
    lastWorkedOnAt: cleanImportedDate(raw.lastWorkedOnAt)
  };
}

function importBackupFileWithStrongerConfirm(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      const imported = Array.isArray(data) ? data : isPlainObject(data) ? data.intrays : null;

      if (!Array.isArray(imported)) throw new Error('Invalid Backup File');

      const usedIds = new Set();
      const clean = imported.map(item => cleanImportedIntrayWithExactText(item, usedIds));

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

function exportBackupWithReminderUpdate() {
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
  localStorage.setItem(BACKUP_REMINDER_KEY, nowISO());
  renderBackupStatus();
}

function addVersionToHelpPanel() {
  const helpContent = document.querySelector('.help-content');
  if (!helpContent || document.getElementById('appVersionSection')) return;

  const section = document.createElement('section');
  section.id = 'appVersionSection';
  section.innerHTML = `<h3>Version</h3><p>Version ${APP_VERSION}</p>`;
  helpContent.appendChild(section);
}

function addBackupReminderToHelpPanel() {
  const sections = [...document.querySelectorAll('.help-content section')];
  const backupSection = sections.find(section => section.querySelector('h3')?.textContent.trim() === 'Undo And Backups');
  const list = backupSection?.querySelector('ul');
  if (!list || document.getElementById('backupReminderHelpItem')) return;

  const item = document.createElement('li');
  item.id = 'backupReminderHelpItem';
  item.innerHTML = 'The app reminds you to export once a week after Sunday at 6:00 AM if you have not backed up since then.';
  list.insertBefore(item, list.lastElementChild);
}

els.saveBtn.removeEventListener('click', saveIntray);
els.saveBtn.addEventListener('click', saveIntrayWithExactText);

els.exportBtn.removeEventListener('click', exportBackup);
els.exportBtn.addEventListener('click', exportBackupWithReminderUpdate);

cleanImportedIntray = cleanImportedIntrayWithExactText;
importBackupFile = importBackupFileWithStrongerConfirm;

renderBackupStatus();
addBackupReminderToHelpPanel();
addVersionToHelpPanel();
