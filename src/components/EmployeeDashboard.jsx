import React from 'react';
import { Calendar, Plus, Clock, CheckCircle, AlertCircle, CalendarDays, ExternalLink } from 'lucide-react';

export default function EmployeeDashboard({
  currentUser,
  records,
  onRequestLeave
}) {
  // Filter leaves submitted by the currently active user
  const userLeaves = records.filter(r => r.requesterId === currentUser.id);

  const approvedLeaves = userLeaves.filter(r => r.status === 'Approved');
  const pendingLeaves = userLeaves.filter(r => r.status === 'Pending' || r.status === 'Discussion');

  const totalApprovedDays = approvedLeaves.reduce((sum, item) => sum + (item.businessDays || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Leaves & Time-Off
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your personal leave requests, review responses, and track your board availability status.
          </p>
        </div>

        <button
          onClick={onRequestLeave}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Request Leave
        </button>
      </div>

      {/* Top 3 Metric Cards matching Image 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1: Approved Leave Taken */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs transition-all hover:border-slate-300">
          <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            APPROVED LEAVE TAKEN
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalApprovedDays}</span>
            <span className="text-sm text-slate-600 font-medium">working days</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Across {approvedLeaves.length} scheduled periods
          </div>
        </div>

        {/* Metric 2: Pending Approvals */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs transition-all hover:border-slate-300">
          <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            PENDING APPROVALS
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold ${pendingLeaves.length > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {pendingLeaves.length}
            </span>
            <span className="text-sm text-slate-600 font-medium">requests</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Awaiting reviewer feedback
          </div>
        </div>

        {/* Metric 3: Active Workspace User */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs transition-all hover:border-slate-300 flex items-center gap-3">
          <div className={`w-11 h-11 rounded-full ${currentUser.avatarColor || 'bg-blue-600'} text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0`}>
            {currentUser.initials}
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
              ACTIVE WORKSPACE USER
            </div>
            <div className="text-base font-bold text-slate-900 truncate">
              {currentUser.name}
            </div>
            <div className="text-xs text-slate-500 truncate">
              {currentUser.department}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Empty State or Leaves List */}
      {userLeaves.length === 0 ? (
        /* Empty State directly matching Image 2 */
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center shadow-xs">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
            <CalendarDays className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No leaves</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            You do not have any scheduled leaves or time-off requests registered on this board yet.
          </p>
          <button
            onClick={onRequestLeave}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Leave Request
          </button>
        </div>
      ) : (
        /* Active User Leaves Table / Cards */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 text-sm">
              Your Leave Applications ({userLeaves.length})
            </h3>
            <span className="text-xs text-slate-500">
              Synced with Trello board records
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {userLeaves.map((leave) => {
              const isApproved = leave.status === 'Approved';
              const isPending = leave.status === 'Pending' || leave.status === 'Discussion';
              const isRejected = leave.status === 'Rejected';

              return (
                <div key={leave.id} className="p-6 hover:bg-slate-50/60 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900 text-base">
                        {leave.category}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-sm font-medium text-slate-700">
                        {leave.startDate} to {leave.endDate}
                      </span>
                      <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded font-mono font-medium">
                        {leave.businessDays} business {leave.businessDays === 1 ? 'day' : 'days'}
                      </span>
                    </div>

                    <div>
                      {isApproved && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Approved
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3.5 h-3.5" />
                          Awaiting Review
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3 my-3 border border-slate-100">
                    "{leave.reason}"
                  </p>

                  {leave.coverageNotes && (
                    <div className="text-xs text-slate-500 mb-2">
                      <strong className="text-slate-700">Coverage Plan:</strong> {leave.coverageNotes}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span>Submitted on {leave.submittedAt ? leave.submittedAt.slice(0, 10) : 'Recent'}</span>
                      {leave.statusNote && (
                        <>
                          <span>•</span>
                          <span className="text-slate-600 font-medium">{leave.statusNote}</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-slate-600">
                      <span>Attached:</span>
                      {leave.attachedBoards?.map((b, i) => (
                        <span key={i} className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px] font-medium text-slate-700">
                          {b}
                        </span>
                      ))}
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
