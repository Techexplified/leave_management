import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertTriangle, Check, UserCheck, ShieldCheck } from 'lucide-react';
import { TEAM_MEMBERS, LEAVE_CATEGORIES, BOARDS, calculateBusinessDays } from '../data/mockData';

export default function RequestLeaveModal({
  isOpen,
  onClose,
  currentUser,
  onSubmitLeave,
  existingRecords
}) {
  const [category, setCategory] = useState(LEAVE_CATEGORIES[0]);
  const [startDate, setStartDate] = useState('2026-10-26');
  const [endDate, setEndDate] = useState('2026-10-30');
  const [businessDays, setBusinessDays] = useState(5);
  const [reason, setReason] = useState('');
  const [coverageNotes, setCoverageNotes] = useState('');
  const [selectedApprovers, setSelectedApprovers] = useState(['mem_mc']);
  const [attachedBoard, setAttachedBoard] = useState(BOARDS[0]);
  const [departmentClash, setDepartmentClash] = useState(null);

  // Recalculate business days when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const days = calculateBusinessDays(startDate, endDate);
      setBusinessDays(days);

      // Check for department leave clash
      const clash = existingRecords.find(r =>
        r.status === 'Approved' &&
        r.requesterDept === currentUser.department &&
        r.requesterId !== currentUser.id &&
        ((r.startDate <= endDate && r.endDate >= startDate))
      );
      setDepartmentClash(clash || null);
    }
  }, [startDate, endDate, existingRecords, currentUser]);

  if (!isOpen) return null;

  const toggleApprover = (id) => {
    if (selectedApprovers.includes(id)) {
      setSelectedApprovers(selectedApprovers.filter(a => a !== id));
    } else {
      setSelectedApprovers([...selectedApprovers, id]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate || businessDays <= 0) {
      alert('Please select a valid date range.');
      return;
    }
    if (!reason.trim()) {
      alert('Please provide a reason for the leave.');
      return;
    }
    if (selectedApprovers.length === 0) {
      alert('Please select at least 1 board member for approval.');
      return;
    }

    const newRecord = {
      id: 'leave_' + Date.now(),
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterRole: currentUser.role,
      requesterDept: currentUser.department,
      requesterInitials: currentUser.initials,
      requesterColor: currentUser.avatarColor,
      category,
      startDate,
      endDate,
      businessDays,
      relativeNotice: 'Upcoming',
      reason,
      coverageNotes: coverageNotes.trim() || 'Colleagues on-call for urgent items.',
      attachedBoards: [attachedBoard],
      taggedApprovers: selectedApprovers,
      status: 'Pending',
      statusNote: 'Awaiting Review',
      submittedAt: new Date().toISOString(),
      signOffs: []
    };

    onSubmitLeave(newRecord);
    onClose();
  };

  // Candidates for approvers (other board members)
  const candidateApprovers = TEAM_MEMBERS.filter(m => m.id !== currentUser.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">Request Leave & Time-Off</h2>
              <p className="text-xs text-slate-500">Submit a scheduled absence for board approval</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Leave Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Leave Category *
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-800 text-sm font-medium rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs appearance-none cursor-pointer"
              >
                {LEAVE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Date Range Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date From <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs cursor-pointer"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date To <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="w-full bg-white border border-slate-300 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs cursor-pointer"
                  required
                />
              </div>
            </div>
          </div>

          {/* Calculated Business Days Box matching Image 5 */}
          <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Calculated Business Days:</span>
            <span className="font-mono font-bold text-slate-900 text-sm tracking-wide">
              {businessDays} working {businessDays === 1 ? 'day' : 'days'}
            </span>
          </div>

          {/* Department Clash Warning if detected */}
          {departmentClash && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Team Coverage Note:</strong> {departmentClash.requesterName} from your department ({currentUser.department}) also has an approved leave from {departmentClash.startDate} to {departmentClash.endDate}. Please coordinate coverage notes.
              </div>
            </div>
          )}

          {/* Reason for Leave */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reason for Leave <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide context for your team lead and board members (e.g., Annual family travel, scheduled dentist appointment, personal recharge)..."
              className="w-full bg-white border border-slate-300 text-slate-800 text-sm rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs resize-none"
              required
            />
          </div>

          {/* Coverage Handover Plan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Coverage & Handover Plan <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={coverageNotes}
              onChange={(e) => setCoverageNotes(e.target.value)}
              placeholder="e.g. Alex Rivera covers design reviews; Marcus Chen handles engineering queries."
              className="w-full bg-white border border-slate-300 text-slate-800 text-sm rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs"
            />
          </div>

          {/* Tag Board Members for Approval matching Image 5 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Tag Board Members for Approval <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs font-medium text-slate-500">
                {selectedApprovers.length} tagged
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-2.5">
              Tagged members will receive this request in their Review Requests tab to approve, reject, or request discussion.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50/40">
              {candidateApprovers.map((member) => {
                const isSelected = selectedApprovers.includes(member.id);
                return (
                  <div
                    key={member.id}
                    onClick={() => toggleApprover(member.id)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-300 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-7 h-7 rounded-full ${member.avatarColor} text-white font-bold flex items-center justify-center text-[10px] shrink-0`}>
                        {member.initials}
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-slate-900 truncate flex items-center gap-1">
                          {member.name}
                          {member.isManager && (
                            <ShieldCheck className="w-3 h-3 text-emerald-600 inline shrink-0" />
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">{member.role}</div>
                      </div>
                    </div>

                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ml-2 transition-colors ${
                      isSelected
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-3" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
