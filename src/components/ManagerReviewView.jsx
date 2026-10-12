import React, { useState } from 'react';
import { Check, X, MessageSquare, AlertCircle, CheckCircle2, Clock, User, Filter, ArrowRightLeft } from 'lucide-react';
import { TEAM_MEMBERS } from '../data/mockData';

export default function ManagerReviewView({
  currentUser,
  setCurrentUser,
  records,
  onUpdateStatus
}) {
  const [filterTab, setFilterTab] = useState('pending'); // 'pending' | 'all' | 'reviewed'
  const [discussionModal, setDiscussionModal] = useState(null); // record
  const [discussionNote, setDiscussionNote] = useState('');

  // Check if current user is an approver or manager
  const isManager = currentUser.isManager;

  // Filter requests where current user is tagged or if current user is board admin
  const assignedRecords = records.filter(r => {
    // If tagged, or if user is a manager reviewing all
    return r.taggedApprovers?.includes(currentUser.id) || isManager;
  });

  const pendingRecords = assignedRecords.filter(r => r.status === 'Pending' || r.status === 'Discussion');
  const reviewedRecords = assignedRecords.filter(r => r.status === 'Approved' || r.status === 'Rejected');

  let displayedRecords = assignedRecords;
  if (filterTab === 'pending') {
    displayedRecords = pendingRecords;
  } else if (filterTab === 'reviewed') {
    displayedRecords = reviewedRecords;
  }

  // Find alternative manager to switch to (e.g. Sarah Jenkins or Marcus Chen)
  const otherManager = TEAM_MEMBERS.find(m => m.isManager && m.id !== currentUser.id) || TEAM_MEMBERS[1];

  const handleApprove = (record) => {
    onUpdateStatus(record.id, 'Approved', currentUser, 'Approved for sprint schedule.');
  };

  const handleReject = (record) => {
    const reason = prompt('Please enter the reason for rejection:', 'Team coverage conflict during critical sprint milestone');
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
    onUpdateStatus(discussionModal.id, 'Discussion', currentUser, discussionNote || 'Need sync regarding project handover before sign-off.');
    setDiscussionModal(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Assigned Leave Requests
            </h1>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
              {pendingRecords.length} Pending
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Review and approve leave requests where you are tagged as a board reviewer or manager.
          </p>
        </div>

        {/* Filter Tabs matching Image 3 */}
        <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold self-start md:self-auto">
          <button
            onClick={() => setFilterTab('pending')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterTab === 'pending'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending Action ({pendingRecords.length})
          </button>
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Assigned ({assignedRecords.length})
          </button>
          <button
            onClick={() => setFilterTab('reviewed')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterTab === 'reviewed'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Reviewed
          </button>
        </div>
      </div>

      {/* Reviewer Banner matching Image 3 */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-900">
        <div className="flex items-center gap-2.5">
          <div className={`w-6 h-6 rounded-full ${currentUser.avatarColor || 'bg-blue-600'} text-white font-bold flex items-center justify-center text-[10px]`}>
            {currentUser.initials}
          </div>
          <div>
            You are reviewing as <strong className="font-bold text-blue-950">{currentUser.name}</strong> ({currentUser.role}).
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-blue-700">Want to test as a different manager?</span>
          <button
            onClick={() => setCurrentUser(otherManager)}
            className="bg-white hover:bg-blue-100/70 text-blue-900 border border-blue-300 px-2.5 py-1 rounded-md font-medium text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
          >
            <ArrowRightLeft className="w-3 h-3" />
            Switch to {otherManager.name.split(' ')[0]}
          </button>
        </div>
      </div>

      {/* Leave Request List */}
      {displayedRecords.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">Queue is clear!</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            {filterTab === 'pending'
              ? 'No leave requests currently awaiting your action.'
              : 'No records found matching the selected filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedRecords.map((req) => {
            const isPending = req.status === 'Pending' || req.status === 'Discussion';
            const isApproved = req.status === 'Approved';
            const isRejected = req.status === 'Rejected';

            return (
              <div
                key={req.id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all p-6 space-y-4"
              >
                {/* Header row: Requester info + Dates + Status badge */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${req.requesterColor || 'bg-blue-600'} text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-2xs`}>
                      {req.requesterInitials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-bold text-slate-900">{req.requesterName}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-xs text-slate-600">{req.requesterRole}</span>
                        <span className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded-md">
                          {req.requesterDept}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="bg-emerald-50 text-emerald-800 text-xs font-semibold px-2 py-0.5 rounded border border-emerald-200">
                          {req.category}
                        </span>
                        <span className="text-xs font-semibold text-slate-700">
                          {req.startDate} – {req.endDate}
                        </span>
                        <span className="text-xs text-slate-500">
                          ({req.businessDays} business days) · {req.relativeNotice}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status badge on right */}
                  <div className="self-start lg:self-auto">
                    {isPending && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        {req.status === 'Discussion' ? 'Discussion Requested' : 'Awaiting Review'}
                      </span>
                    )}
                    {isApproved && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Approved
                      </span>
                    )}
                    {isRejected && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-300">
                        <X className="w-3.5 h-3.5 text-rose-600" />
                        Rejected
                      </span>
                    )}
                  </div>
                </div>

                {/* Reason container matching Image 3 */}
                <div className="bg-slate-50/90 border border-slate-100 rounded-lg p-3 text-sm text-slate-700 leading-relaxed">
                  <span className="font-semibold text-slate-900">Reason: </span>
                  {req.reason}
                </div>

                {/* Coverage note if provided */}
                {req.coverageNotes && (
                  <div className="text-xs text-slate-600 bg-emerald-50/40 border border-emerald-100 rounded-lg px-3 py-2">
                    <strong className="text-emerald-900">Handover / Coverage: </strong>
                    {req.coverageNotes}
                  </div>
                )}

                {/* Attached Boards & Sign-offs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      ATTACHED TRELLO BOARDS
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {req.attachedBoards?.map((b, i) => (
                        <span key={i} className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 px-2 py-0.5 rounded text-xs border border-blue-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      REVIEWER SIGN-OFFS
                    </div>
                    {req.signOffs && req.signOffs.length > 0 ? (
                      <div className="space-y-1">
                        {req.signOffs.map((s, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-slate-700">
                            <span className="font-medium">{s.approverName}</span>
                            <span className="text-slate-400">•</span>
                            <span className={`font-semibold ${
                              s.decision === 'Approved' ? 'text-emerald-600' :
                              s.decision === 'Rejected' ? 'text-rose-600' : 'text-blue-600'
                            }`}>{s.decision}</span>
                            <span className="text-slate-400">({s.date})</span>
                            {s.note && <span className="text-slate-500 italic text-[11px]">"{s.note}"</span>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">No reviewers signed off yet</span>
                    )}
                  </div>
                </div>

                {/* Action Buttons matching Image 3 */}
                {isPending && (
                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <button
                      onClick={() => handleApprove(req)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>

                    <button
                      onClick={() => handleOpenDiscussion(req)}
                      className="bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-300 font-medium px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Need Discussion
                    </button>

                    <button
                      onClick={() => handleReject(req)}
                      className="bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-medium px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      Reject
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
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Request Discussion with {discussionModal.requesterName}</h3>
            <p className="text-xs text-slate-500">
              Provide questions or points to clarify before signing off on this leave request.
            </p>
            <textarea
              rows={3}
              value={discussionNote}
              onChange={(e) => setDiscussionNote(e.target.value)}
              placeholder="e.g. Can we ensure the API release is tagged before you log off on Oct 19?"
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDiscussionModal(null)}
                className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitDiscussion}
                className="px-4 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg"
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
