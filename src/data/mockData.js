// Initial team members and leave data matching the Power-Up screenshots

export const TEAM_MEMBERS = [
  {
    id: 'mem_mc',
    name: 'Marcus Chen',
    initials: 'MC',
    role: 'Engineering Lead & Approver',
    department: 'Core Engineering',
    avatarColor: 'bg-blue-600',
    isManager: true
  },
  {
    id: 'mem_sj',
    name: 'Sarah Jenkins',
    initials: 'SJ',
    role: 'VP Operations',
    department: 'Operations & Strategy',
    avatarColor: 'bg-purple-600',
    isManager: true
  },
  {
    id: 'mem_dk',
    name: 'David Kim',
    initials: 'DK',
    role: 'Senior Full-Stack Engineer',
    department: 'Core Engineering',
    avatarColor: 'bg-blue-500',
    isManager: false
  },
  {
    id: 'mem_ev',
    name: 'Elena Vance',
    initials: 'EV',
    role: 'Staff Product Manager',
    department: 'Product & Growth',
    avatarColor: 'bg-emerald-600',
    isManager: false
  },
  {
    id: 'mem_pp',
    name: 'Priya Patel',
    initials: 'PP',
    role: 'DevOps & Reliability Lead',
    department: 'Infrastructure',
    avatarColor: 'bg-rose-600',
    isManager: false
  },
  {
    id: 'mem_ar',
    name: 'Alex Rivera',
    initials: 'AR',
    role: 'Lead UX Designer',
    department: 'Product Design',
    avatarColor: 'bg-amber-600',
    isManager: false
  }
];

export const LEAVE_CATEGORIES = [
  'Annual Vacation (PTO)',
  'Personal / Family Care',
  'Sick / Medical Leave',
  'Remote / WFH Day',
  'Parental Leave',
  'Compensatory Off'
];

export const BOARDS = [
  'Sprint 42 — Platform & Engine',
  'Product Roadmap 2026 Strategic Initiatives',
  'Infrastructure Core & Security'
];

export const INITIAL_LEAVE_RECORDS = [
  {
    id: 'leave_dk_1',
    requesterId: 'mem_dk',
    requesterName: 'David Kim',
    requesterRole: 'Senior Full-Stack Engineer',
    requesterDept: 'Core Engineering',
    requesterInitials: 'DK',
    requesterColor: 'bg-blue-500',
    category: 'Personal / Family Care',
    startDate: '2026-10-19',
    endDate: '2026-10-21',
    businessDays: 3,
    relativeNotice: 'In 12 days',
    reason: 'Attending family celebration and medical checkup appointment in hometown.',
    coverageNotes: 'Sarah covers sprint coordination; Marcus takes urgent pull request approvals.',
    attachedBoards: ['Sprint 42 — Platform & Engine'],
    taggedApprovers: ['mem_mc', 'mem_sj'],
    status: 'Pending', // 'Pending' | 'Approved' | 'Discussion' | 'Rejected'
    statusNote: 'Awaiting Review',
    submittedAt: '2026-10-10T09:30:00Z',
    signOffs: []
  },
  {
    id: 'leave_ev_1',
    requesterId: 'mem_ev',
    requesterName: 'Elena Vance',
    requesterRole: 'Staff Product Manager',
    requesterDept: 'Product & Growth',
    requesterInitials: 'EV',
    requesterColor: 'bg-emerald-600',
    category: 'Annual Vacation',
    startDate: '2026-10-12',
    endDate: '2026-10-16',
    businessDays: 5,
    relativeNotice: 'In 5 days',
    reason: 'Annual recharge and family autumn trip.',
    coverageNotes: 'Alex Rivera covers design reviews; Marcus Chen handles engineering queries.',
    attachedBoards: ['Sprint 42 — Platform & Engine', 'Product Roadmap 2026 Strategic Initiatives'],
    taggedApprovers: ['mem_sj'],
    status: 'Approved',
    statusNote: 'Approved by Sarah Jenkins',
    submittedAt: '2026-10-01T11:00:00Z',
    signOffs: [
      { approverName: 'Sarah Jenkins', approverRole: 'VP Operations', decision: 'Approved', date: '2026-10-02' }
    ]
  },
  {
    id: 'leave_pp_1',
    requesterId: 'mem_pp',
    requesterName: 'Priya Patel',
    requesterRole: 'DevOps & Reliability Lead',
    requesterDept: 'Infrastructure',
    requesterInitials: 'PP',
    requesterColor: 'bg-rose-600',
    category: 'Remote / WFH Day',
    startDate: '2026-10-08',
    endDate: '2026-10-09',
    businessDays: 2,
    relativeNotice: 'Starts tomorrow',
    reason: 'Home network upgrade and fiber maintenance in residential area.',
    coverageNotes: 'On-call alerts routed to David Kim during maintenance window.',
    attachedBoards: ['Sprint 42 — Platform & Engine'],
    taggedApprovers: ['mem_mc'],
    status: 'Approved',
    statusNote: 'Approved by Marcus Chen',
    submittedAt: '2026-10-04T14:20:00Z',
    signOffs: [
      { approverName: 'Marcus Chen', approverRole: 'Engineering Lead & Approver', decision: 'Approved', date: '2026-10-05' }
    ]
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
