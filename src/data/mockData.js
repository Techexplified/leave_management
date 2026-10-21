// Leave management categories and helper functions

export const LEAVE_CATEGORIES = [
  'Annual Vacation (PTO)',
  'Personal / Family Care',
  'Sick / Medical Leave',
  'Remote / WFH Day',
  'Parental Leave',
  'Compensatory Off'
];

// Helper to compute initials from a full name
export function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AVATAR_COLORS = [
  'bg-blue-600',
  'bg-emerald-600',
  'bg-purple-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-indigo-600',
  'bg-teal-600',
  'bg-sky-600'
];

// Deterministic avatar color based on user ID or name
export function getAvatarColor(idOrName = '') {
  let hash = 0;
  for (let i = 0; i < idOrName.length; i++) {
    hash = idOrName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// Fallback members ONLY when running outside Trello in standalone mode (no designations)
export const DEFAULT_STANDALONE_MEMBERS = [
  {
    id: 'user_1',
    name: 'Pranjal Singh',
    username: 'pranjalsingh',
    initials: 'PS',
    avatarColor: 'bg-emerald-600'
  },
  {
    id: 'user_2',
    name: 'Alex Rivera',
    username: 'alexrivera',
    initials: 'AR',
    avatarColor: 'bg-amber-600'
  },
  {
    id: 'user_3',
    name: 'Sarah Jenkins',
    username: 'sarahjenkins',
    initials: 'SJ',
    avatarColor: 'bg-purple-600'
  }
];

// Calculate business days between two dates (excluding Saturday and Sunday)
export function calculateBusinessDays(startDateStr, endDateStr) {
  if (!startDateStr || !endDateStr) return 0;
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  if (end < start) return 0;

  let count = 0;
  const current = new Date(start);
  while (current <= end) {
    const dayOfWeek = current.getDay();
    // 0 is Sunday, 6 is Saturday
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
}
