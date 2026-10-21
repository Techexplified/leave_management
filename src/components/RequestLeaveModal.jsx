import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertTriangle, Check, UserCheck, AlertCircle } from 'lucide-react';
import { LEAVE_CATEGORIES, calculateBusinessDays } from '../data/mockData';

export default function RequestLeaveModal({
  isOpen,
  onClose,
  currentUser,
  boardMembers,
  boardName,
  onSubmitLeave,
  existingRecords
}) {
  const [category, setCategory] = useState(LEAVE_CATEGORIES[0]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [businessDays, setBusinessDays] = useState(0);
  const [reason, setReason] = useState('');
  const [coverageNotes, setCoverageNotes] = useState('');
  const [selectedApproverId, setSelectedApproverId] = useState('');
  const [overlapWarning, setOverlapWarning] = useState(null);

  // Candidate approvers: Strictly EXCLUDE the current user (you cannot approve your own leave!)
  const candidateApprovers = boardMembers.filter(
    m => m.id !== currentUser.id && m.username !== currentUser.username
  );

  // Set default dates
  useEffect(() => {
    if (isOpen && !startDate) {
      const today = new Date();
      const nextMon = new Date(today);
      nextMon.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7 || 7));
      const nextFri = new Date(nextMon);
      nextFri.setDate(nextMon.getDate() + 4);

      setStartDate(nextMon.toISOString().slice(0, 10));
      setEndDate(nextFri.toISOString().slice(0, 10));
    }
  }, [isOpen]);

  // Auto-select first other board member as default approver
  useEffect(() => {
    if (candidateApprovers.length > 0 && !selectedApproverId) {
      setSelectedApproverId(candidateApprovers[0].id);
    }
  }, [candidateApprovers, selectedApproverId]);

  // Recalculate business days and check overlap
  useEffect(() => {
    if (startDate && endDate) {
      const days = calculateBusinessDays(startDate, endDate);
      setBusinessDays(days);

      const overlap = existingRecords.find(r =>
        r.status === 'Approved' &&
        r.requesterId !== currentUser.id &&
        ((r.startDate <= endDate && r.endDate >= startDate))
      );
      setOverlapWarning(overlap || null);
    }
  }, [startDate, endDate, existingRecords, currentUser]);

  if (!isOpen) return null;

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
    if (!selectedApproverId) {
      alert('Please select a board member to approve your leave.');
      return;
    }
    if (selectedApproverId === currentUser.id) {
      alert('You cannot approve your own leave request. Please send it to another member.');
      return;
    }

    const newRecord = {
      id: 'leave_' + Date.now(),
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterUsername: currentUser.username,
      requesterAvatar: currentUser.avatar,
      requesterInitials: currentUser.initials,
      requesterColor: currentUser.avatarColor,
      category,
      startDate,
      endDate,
      businessDays,
      reason,
      coverageNotes: coverageNotes.trim(),
      attachedBoards: [boardName || 'Trello Board'],
      // ONLY the selected person receives this request:
      taggedApprovers: [selectedApproverId],
      status: 'Pending',
      statusNote: 'Awaiting Review',
      submittedAt: new Date().toISOString(),
      signOffs: []
    };

    onSubmitLeave(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">Request Leave & Time-Off</h2>
              <p className="text-[11px] text-slate-500">Submit a scheduled absence for approval</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Leave Category Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Leave Category *
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-800 text-xs font-medium rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs appearance-none cursor-pointer"
              >
                {LEAVE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Date Range Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date From <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs cursor-pointer"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date To <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs cursor-pointer"
                required
              />
            </div>
          </div>

          {/* Calculated Business Days Box */}
          <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl px-3.5 py-2.5 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Calculated Business Days:</span>
            <span className="font-mono font-bold text-slate-900 text-xs tracking-wide">
              {businessDays} working {businessDays === 1 ? 'day' : 'days'}
            </span>
          </div>

          {/* Overlap Warning if detected */}
          {overlapWarning && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex items-start gap-2 text-[11px] text-amber-800">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Team Coverage Note:</strong> {overlapWarning.requesterName} is also scheduled on leave from {overlapWarning.startDate} to {overlapWarning.endDate}.
              </div>
            </div>
          )}

          {/* Reason for Leave */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reason for Leave <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide context for your absence..."
              className="w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs resize-none"
              required
            />
          </div>

          {/* Select Approver (Single selection - Excludes self) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Send Request to Approver <span className="text-rose-500">*</span>
              </label>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              Only the person selected below will receive this leave request and be able to approve it.
            </p>

            {candidateApprovers.length === 0 ? (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>No other board members found:</strong> You cannot approve your own leave request. Please invite your manager or colleague to this Trello board so they can approve your leaves.
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50/40">
                {candidateApprovers.map((member) => {
                  const isSelected = selectedApproverId === member.id;
                  return (
                    <div
                      key={member.id}
                      onClick={() => setSelectedApproverId(member.id)}
                      className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-emerald-50/90 border-emerald-300 shadow-2xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {member.avatar ? (
                          <img src={member.avatar} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className={`w-6 h-6 rounded-full ${member.avatarColor || 'bg-emerald-600'} text-white font-bold flex items-center justify-center text-[9px] shrink-0`}>
                            {member.initials}
                          </div>
                        )}
                        <div className="truncate">
                          <div className="font-semibold text-slate-900 truncate">{member.name}</div>
                          {member.username && <div className="text-[10px] text-slate-400 truncate">{member.username}</div>}
                        </div>
                      </div>

                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 transition-colors ${
                        isSelected
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={candidateApprovers.length === 0}
              className={`px-4 py-1.5 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5 ${
                candidateApprovers.length === 0
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Send Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
