const STORAGE_KEY = 'trello_leave_records_v2';

export async function getLeaveRecords(t) {
  // If in Trello iframe, read board shared storage
  if (t && typeof t.get === 'function') {
    try {
      const records = await t.get('board', 'shared', 'leave_records');
      if (Array.isArray(records)) {
        return records;
      }
    } catch (err) {
      console.warn('Could not read from Trello board storage:', err);
    }
  }

  // Fallback to localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('LocalStorage error:', err);
  }

  return [];
}

export async function saveLeaveRecords(t, records) {
  // Save to localStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }

  // Save to Trello board shared storage so all board members see it
  if (t && typeof t.set === 'function') {
    try {
      await t.set('board', 'shared', 'leave_records', records);
    } catch (err) {
      console.warn('Failed to save to Trello board storage:', err);
    }
  }

  return records;
}

export async function addLeaveRecord(t, newRecord) {
  const current = await getLeaveRecords(t);
  const updated = [newRecord, ...current];
  await saveLeaveRecords(t, updated);
  return updated;
}

export async function updateLeaveStatus(t, recordId, status, approver, note = '') {
  const current = await getLeaveRecords(t);
  const updated = current.map(item => {
    if (item.id === recordId) {
      const newSignOff = {
        approverId: approver.id,
        approverName: approver.name,
        decision: status,
        date: new Date().toISOString().slice(0, 10),
        note: note
      };
      const existingSignOffs = item.signOffs || [];
      return {
        ...item,
        status: status,
        statusNote: status === 'Approved' ? `Approved by ${approver.name}` :
                    status === 'Rejected' ? `Rejected by ${approver.name}` :
                    `Discussion requested by ${approver.name}`,
        signOffs: [...existingSignOffs.filter(s => s.approverId !== approver.id), newSignOff]
      };
    }
    return item;
  });

  await saveLeaveRecords(t, updated);
  return updated;
}

export async function deleteLeaveRecord(t, recordId) {
  const current = await getLeaveRecords(t);
  const updated = current.filter(item => item.id !== recordId);
  await saveLeaveRecords(t, updated);
  return updated;
}
