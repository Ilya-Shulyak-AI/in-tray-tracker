function normalizeIntrayName(str = '') {
  return String(str).trim();
}

function saveIntrayPreservingName() {
  const name = normalizeIntrayName(els.nameInput.value);
  const cadenceNumber = Number(els.cadenceNumberInput.value);
  const cadenceUnit = els.cadenceUnitInput.value;
  const notes = toTitleCase(els.notesInput.value.trim());

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

function cleanImportedIntrayPreservingName(raw, usedIds) {
  if (!isPlainObject(raw)) throw new Error('Invalid In-Tray');

  const cadenceNumber = Number(raw.cadenceNumber);
  const cadenceUnit = VALID_CADENCE_UNITS.includes(raw.cadenceUnit) ? raw.cadenceUnit : 'months';
  let id = typeof raw.id === 'string' && raw.id.trim() ? raw.id.trim() : cryptoRandomId();

  while (usedIds.has(id)) id = cryptoRandomId();
  usedIds.add(id);

  return {
    id,
    name: normalizeIntrayName(raw.name || 'Untitled In-Tray'),
    notes: toTitleCase(raw.notes || ''),
    cadenceNumber: Number.isFinite(cadenceNumber) && cadenceNumber >= 1 ? cadenceNumber : 1,
    cadenceUnit,
    createdAt: cleanImportedDate(raw.createdAt) || nowISO(),
    lastClearedAt: cleanImportedDate(raw.lastClearedAt),
    lastWorkedOnAt: cleanImportedDate(raw.lastWorkedOnAt)
  };
}

els.saveBtn.removeEventListener('click', saveIntray);
els.saveBtn.addEventListener('click', saveIntrayPreservingName);
cleanImportedIntray = cleanImportedIntrayPreservingName;
