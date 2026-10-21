import React, { useState } from 'react';
import { Check, X, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ManagerReviewView({
  currentUser,
  records,
  onUpdateStatus
}) {
  const [filterTab, setFilterTab] = useState('pending'); // 'pending' | 'all' | 'reviewed'
  const [discussionModal, setDiscussionModal] = useState(null);
  const [discussionNote, setDiscussionNote] = useState('');

  // STRICT RULE:
  // 1. Only show requests sent to the current user (taggedApprovers.includes(currentUser.id))
  // 2. You can NEVER see or approve your own request (requesterId !== currentUser.id)!
  const assignedRecords = records.filter(
    r => r.taggedApprovers?.includes(currentUser.id) && r.requesterId !== currentUser.id
  );

  const pendingRecords = assignedRecords.filter(r => r.status === 'Pending' || r.status === 'Discussion');
  const reviewedRecords = assignedRecords.filter(r => r.status === 'Approved' || r.status === 'Rejected');

  let displayedRecords = assignedRecords;
  if (filterTab === 'pending') {
    displayedRecords = pendingRecords;
  } else if (filterTab === 'reviewed') {
    displayedRecords = reviewedRecords;
  }

  const handleApprove = (record) => {
    onUpdateStatus(record.id, 'Approved', currentUser, 'Approved.');
  };

  const handleReject = (record) => {
    const reason = prompt('Please enter the reason for rejection:', 'Coverage conflict during this period');
    if (reason !== null) {
      onUpdateStatus(record.id, 'Rejected', currentUser, reason);
    }
  };

  const handleOpenDiscussion = (record) => {
    setDiscussionModal(record);
    setDiscussionNote('');
  };

  const handleSubmitDiscussion = (e) => {
    e.preventDefault();
    if (!discussionModal) return;
    onUpdateStatus(discussionModal.id, 'Discussion', currentUser, discussionNote || 'Need sync regarding coverage before approval.');
    setDiscussionModal(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
              Assigned Leave Requests
            </h1>
            <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
              {pendingRecords.length} Pending
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Review requests sent specifically to you for approval.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200/90 text-xs font-semibold self-start sm:self-auto shrink-0">
          <button
            onClick={() => setFilterTab('pending')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterTab === 'pending'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending Action ({pendingRecords.length})
          </button>
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterTab === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Assigned ({assignedRecords.length})
          </button>
          <button
            onClick={() => setFilterTab('reviewed')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterTab === 'reviewed'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Reviewed
          </button>
        </div>
      </div>

      {/* Approver Banner */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl px-4 py-2.5 flex items-center justify-between gap-2.5 text-xs text-blue-900 shadow-2xs">
        <div className="flex items-center gap-2">
          {currentUser.avatar ? (
            <img src={currentUser.avatar} alt="" className="w-5 h-5 rounded-full object-cover shrink-0" />
          ) : (
            <div className={`w-5 h-5 rounded-full ${currentUser.avatarColor || 'bg-blue-600'} text-white font-bold flex items-center justify-center text-[9px] shrink-0`}>
              {currentUser.initials}
            </div>
          )}
          <div>
            Viewing approvals assigned to <strong className="font-bold text-blue-950">{currentUser.name}</strong>
          </div>
        </div>
      </div>

      {/* Leave Request List */}
      {displayedRecords.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center shadow-xs">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-900 mb-1">Queue is clear!</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {filterTab === 'pending'
              ? 'No pending leave requests have been assigned to you.'
              : 'No records found matching the selected filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {displayedRecords.map((req) => {
            const isPending = req.status === 'Pending' || req.status === 'Discussion';
            const isApproved = req.status === 'Approved';
            const isRejected = req.status === 'Rejected';

            return (
              <div
                key={req.id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all p-4 sm:p-5 space-y-3.5"
              >
                {/* Header row: Requester info + Dates + Status badge */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {req.requesterAvatar ? (
                      <img src={req.requesterAvatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0 shadow-2xs" />
                    ) : (
                      <div className={`w-9 h-9 rounded-full ${req.requesterColor || 'bg-blue-600'} text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs`}>
                        {req.requesterInitials}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm sm:text-base font-bold text-slate-900">{req.requesterName}</span>
                        {req.requesterUsername && (
                          <span className="text-xs text-slate-500">{req.requesterUsername}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="bg-emerald-50 text-emerald-800 text-[11px] font-semibold px-2 py-0.5 rounded border border-emerald-200">
                          {req.category}
                        </span>
                        <span className="text-xs font-semibold text-slate-700">
                          {req.startDate} – {req.endDate}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          ({req.businessDays} business days)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="self-start lg:self-auto shrink-0">
                    {isPending && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        {req.status === 'Discussion' ? 'Discussion Requested' : 'Awaiting Your Review'}
                      </span>
                    )}
                    {isApproved && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Approved
                      </span>
                    )}
                    {isRejected && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-300">
                        <X className="w-3.5 h-3.5 text-rose-600" />
                        Rejected
                      </span>
                    )}
                  </div>
                </div>

                {/* Reason */}
                <div className="bg-slate-50/90 border border-slate-100 rounded-lg p-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <span className="font-semibold text-slate-900">Reason: </span>
                  {req.reason}
                </div>

                {/* Coverage note */}
                {req.coverageNotes && (
                  <div className="text-xs text-slate-600 bg-emerald-50/40 border border-emerald-100 rounded-lg px-3 py-2">
                    <strong className="text-emerald-900">Coverage Handover: </strong>
                    {req.coverageNotes}
                  </div>
                )}

                {/* Sign-offs history */}
                {req.signOffs && req.signOffs.length > 0 && (
                  <div className="text-xs pt-2 border-t border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      SIGN-OFF HISTORY
                    </div>
                    <div className="space-y-1">
                      {req.signOffs.map((s, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-slate-700 text-[11px]">
                          <span className="font-medium">{s.approverName}</span>
                          <span className="text-slate-300">•</span>
                          <span className={`font-semibold ${
                            s.decision === 'Approved' ? 'text-emerald-600' :
                            s.decision === 'Rejected' ? 'text-rose-600' : 'text-blue-600'
                          }`}>{s.decision}</span>
                          <span className="text-slate-400">({s.date})</span>
                          {s.note && <span className="text-slate-500 italic">"{s.note}"</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons: ONLY the tagged approver can click */}
                {isPending && (
                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleApprove(req)}
                      className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium px-3.5 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>

                    <button
                      onClick={() => handleOpenDiscussion(req)}
                      className="bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-300 font-medium px-3.5 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Need Discussion</span>
                    </button>

                    <button
                      onClick={() => handleReject(req)}
                      className="bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-medium px-3.5 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Discussion Modal */}
      {discussionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Request Discussion with {discussionModal.requesterName}</h3>
            <p className="text-xs text-slate-500">
              Provide questions or points to clarify before approving this leave request.
            </p>
            <textarea
              rows={3}
              value={discussionNote}
              onChange={(e) => setDiscussionNote(e.target.value)}
              placeholder="e.g. Can you confirm task handover before this date?"
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setDiscussionModal(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitDiscussion}
                className="px-3.5 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg cursor-pointer"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
