import React, { useState } from 'react';
import { Search, CheckCircle2, Users, ShieldCheck, CalendarClock } from 'lucide-react';
import TimelineView from './TimelineView';

// Helper to get local date string YYYY-MM-DD
function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function TeamRosterView({ records }) {
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'timeline'
  const [filterScope, setFilterScope] = useState('upcoming'); // 'upcoming' | 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const todayStr = getTodayDateString();

  // Only approved leaves appear on the public roster
  const approvedRecords = records.filter(r => r.status === 'Approved');

  // Filter based on scope (by default: active & upcoming leaves; past dates excluded from active roster)
  const scopedRecords = approvedRecords.filter(r => {
    if (filterScope === 'upcoming') {
      return !r.endDate || r.endDate >= todayStr;
    }
    return true;
  });

  // Search filter
  const filteredRecords = scopedRecords.filter(r => {
    const approverName = r.signOffs && r.signOffs.length > 0 ? r.signOffs[r.signOffs.length - 1].approverName : '';
    return (
      r.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approverName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const activeUpcomingCount = approvedRecords.filter(r => !r.endDate || r.endDate >= todayStr).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
              Team Unavailability Roster
            </h1>
            <span className="bg-emerald-50 text-emerald-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Approved & Visible to All
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Board-wide visibility of approved leaves and scheduled absence dates.
          </p>
        </div>

        {/* View Switcher & Scope Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Active vs All Filter */}
          <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200/90 text-xs font-semibold">
            <button
              onClick={() => setFilterScope('upcoming')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterScope === 'upcoming'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active & Upcoming ({activeUpcomingCount})
            </button>
            <button
              onClick={() => setFilterScope('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterScope === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Records ({approvedRecords.length})
            </button>
          </div>

          {/* Cards vs Timeline Switcher */}
          <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200/90 text-xs font-semibold shrink-0">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Roster Cards
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Timeline View
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search team member, leave type, or approver..."
          className="w-full bg-white border border-slate-200/90 rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs"
        />
      </div>

      {/* View Content */}
      {viewMode === 'timeline' ? (
        <TimelineView records={filteredRecords} />
      ) : (
        /* Roster Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecords.map((item) => {
            const approverName = item.signOffs && item.signOffs.length > 0
              ? item.signOffs[item.signOffs.length - 1].approverName
              : (item.statusNote?.replace('Approved by ', '') || 'Board Approver');

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all p-4.5 flex flex-col justify-between space-y-3.5"
              >
                <div>
                  {/* Header: Member info + Approved badge */}
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-2.5">
                      {item.requesterAvatar ? (
                        <img src={item.requesterAvatar} alt="" className="w-10 h-10 rounded-full object-cover shrink-0 shadow-2xs" />
                      ) : (
                        <div className={`w-10 h-10 rounded-full ${item.requesterColor || 'bg-emerald-600'} text-white font-bold flex items-center justify-center text-xs shadow-2xs`}>
                          {item.requesterInitials}
                        </div>
                      )}

                      <div>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                          {item.requesterName}
                        </h3>
                        {item.requesterUsername && (
                          <div className="text-xs text-slate-500">
                            {item.requesterUsername}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.endDate && item.endDate < todayStr ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Approved
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Unavailability Window Box */}
                  <div className="bg-slate-50/70 border border-slate-100 rounded-lg p-2.5 my-2.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      <span>UNAVAILABILITY WINDOW</span>
                      <span className="text-slate-600 normal-case font-semibold">
                        {item.businessDays} business {item.businessDays === 1 ? 'day' : 'days'}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900">
                      {item.startDate} – {item.endDate}
                    </div>
                  </div>

                  {/* Category & Approver Details (Coverage removed per user request) */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-500 font-medium">Category: </span>
                      <span className="font-semibold text-slate-800">{item.category}</span>
                    </div>

                    {/* Approver Name */}
                    <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-slate-500 font-medium">Approved by:</span>
                      <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {approverName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredRecords.length === 0 && (
            <div className="col-span-full bg-white rounded-xl border border-slate-200 p-8 text-center">
              <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <div className="text-xs font-semibold text-slate-700">No approved leaves on this board</div>
              <div className="text-[11px] text-slate-400 mt-1">When a leave request is submitted and approved by an assigned approver, it will automatically appear here.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
