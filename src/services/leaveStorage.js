import { INITIAL_LEAVE_RECORDS } from '../data/mockData';

const STORAGE_KEY = 'trello_leave_records_v1';

export async function getLeaveRecords(t) {
  // If in Trello iframe, try board shared storage
  if (t && typeof t.get === 'function') {
    try {
      const records = await t.get('board', 'shared', 'leave_records');
      if (Array.isArray(records) && records.length > 0) {
        return records;
      }
    } catch (err) {
      console.warn('Could not read from Trello board storage:', err);
    }
  }

  // Fallback to localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('LocalStorage error:', err);
  }

  // Seed default data matching screenshots
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LEAVE_RECORDS));
  } catch {}
  return [...INITIAL_LEAVE_RECORDS];
}

export async function saveLeaveRecords(t, records) {
  // Save to localStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }

  // Save to Trello board storage if available
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
        approverName: approver.name,
        approverRole: approver.role,
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
        signOffs: [...existingSignOffs.filter(s => s.approverName !== approver.name), newSignOff]
      };
    }
    return item;
  });

  await saveLeaveRecords(t, updated);
  return updated;
}

export async function resetDemoData(t) {
  await saveLeaveRecords(t, INITIAL_LEAVE_RECORDS);
  return [...INITIAL_LEAVE_RECORDS];
}
