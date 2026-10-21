import React from 'react';
import { Plus, Clock, CheckCircle2, AlertCircle, CalendarDays, Trash2 } from 'lucide-react';

export default function EmployeeDashboard({
  currentUser,
  records,
  onRequestLeave,
  onDeleteLeave
}) {
  // Filter leaves submitted by the currently active user
  const userLeaves = records.filter(r => r.requesterId === currentUser.id);

  const approvedLeaves = userLeaves.filter(r => r.status === 'Approved');
  const pendingLeaves = userLeaves.filter(r => r.status === 'Pending' || r.status === 'Discussion');

  const totalApprovedDays = approvedLeaves.reduce((sum, item) => sum + (item.businessDays || 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 space-y-5">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
            My Leaves & Time-Off
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your personal leave requests, review responses, and track your board availability status.
          </p>
        </div>

        <button
          onClick={onRequestLeave}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium rounded-lg text-sm shadow-xs transition-colors cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Request Leave</span>
        </button>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Metric 1: Approved Leave Taken */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs transition-all hover:border-slate-300">
          <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
            APPROVED LEAVE TAKEN
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalApprovedDays}</span>
            <span className="text-xs sm:text-sm text-slate-600 font-medium">working days</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across {approvedLeaves.length} scheduled periods
          </div>
        </div>

        {/* Metric 2: Pending Approvals */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs transition-all hover:border-slate-300">
          <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
            PENDING APPROVALS
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className={`text-2xl sm:text-3xl font-extrabold ${pendingLeaves.length > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {pendingLeaves.length}
            </span>
            <span className="text-xs sm:text-sm text-slate-600 font-medium">requests</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Awaiting reviewer feedback
          </div>
        </div>

        {/* Metric 3: Active Workspace User */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs transition-all hover:border-slate-300 flex items-center gap-3">
          {currentUser.avatar ? (
            <img src={currentUser.avatar} alt="" className="w-10 h-10 rounded-full object-cover shrink-0 shadow-2xs" />
          ) : (
            <div className={`w-10 h-10 rounded-full ${currentUser.avatarColor || 'bg-emerald-600'} text-white font-bold flex items-center justify-center text-xs shadow-2xs shrink-0`}>
              {currentUser.initials}
            </div>
          )}
          <div className="min-w-0">
            <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              ACTIVE WORKSPACE USER
            </div>
            <div className="text-sm font-bold text-slate-900 truncate">
              {currentUser.name}
            </div>
            <div className="text-xs text-slate-500 truncate">
              {currentUser.username || 'Board Member'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {userLeaves.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300/90 p-8 sm:p-12 text-center shadow-2xs">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3.5 border border-emerald-100">
            <CalendarDays className="w-6 h-6" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">No leaves</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-5">
            You do not have any scheduled leaves or time-off requests registered on this board yet.
          </p>
          <button
            onClick={onRequestLeave}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Leave Request</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 text-xs sm:text-sm">
              Your Scheduled Leaves ({userLeaves.length})
            </h3>
            <span className="text-[11px] text-slate-500">
              Board Availability Status
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {userLeaves.map((leave) => {
              const isApproved = leave.status === 'Approved';
              const isPending = leave.status === 'Pending' || leave.status === 'Discussion';
              const isRejected = leave.status === 'Rejected';

              return (
                <div key={leave.id} className="p-4 sm:p-5 hover:bg-slate-50/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900 text-sm sm:text-base">
                        {leave.category}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs sm:text-sm font-medium text-slate-700">
                        {leave.startDate} to {leave.endDate}
                      </span>
                      <span className="bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded font-mono font-medium">
                        {leave.businessDays} business {leave.businessDays === 1 ? 'day' : 'days'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isApproved && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approved
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
                          <Clock className="w-3.5 h-3.5" />
                          Awaiting Review
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Rejected
                        </span>
                      )}

                      {/* Cancel / Delete action */}
                      {onDeleteLeave && (
                        <button
                          onClick={() => {
                            if (confirm('Cancel and delete this leave record?')) {
                              onDeleteLeave(leave.id);
                            }
                          }}
                          title="Delete / Cancel this request"
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 bg-slate-50 rounded-lg p-2.5 my-2.5 border border-slate-100/80">
                    "{leave.reason}"
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span>Submitted {leave.submittedAt ? leave.submittedAt.slice(0, 10) : 'Recent'}</span>
                      {leave.statusNote && (
                        <>
                          <span>•</span>
                          <span className="text-slate-600 font-medium">{leave.statusNote}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
