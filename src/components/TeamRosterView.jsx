import React, { useState } from 'react';
import { Search, Filter, CheckCircle2, ExternalLink, Calendar, Users, LayoutList, BarChart2 } from 'lucide-react';
import { BOARDS } from '../data/mockData';
import TimelineView from './TimelineView';

export default function TeamRosterView({ records }) {
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'timeline'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('All Boards (3)');

  // Filter only approved records for the public roster
  const approvedRecords = records.filter(r => r.status === 'Approved');

  // Apply search query and board filter
  const filteredRecords = approvedRecords.filter(r => {
    const matchesSearch =
      r.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.requesterRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.coverageNotes && r.coverageNotes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBoard =
      selectedBoard === 'All Boards (3)' ||
      (r.attachedBoards && r.attachedBoards.includes(selectedBoard));

    return matchesSearch && matchesBoard;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header matching Image 4 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Team Unavailability Roster
            </h1>
            <span className="bg-emerald-50 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Approved & Visible to All
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Board-wide visibility of employee approved leaves, planned absence dates, and coverage.
          </p>
        </div>

        {/* View Switcher: Roster Cards vs Timeline View */}
        <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Roster Cards
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === 'timeline'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Timeline View
          </button>
        </div>
      </div>

      {/* Search and Board Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employee, leave type, or keyword..."
            className="w-full bg-white border border-slate-200/90 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs"
          />
        </div>

        {/* Board Filter Dropdown */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-white border border-slate-200/90 rounded-xl px-3 py-2 text-sm text-slate-700 shadow-2xs">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">Board:</span>
            <select
              value={selectedBoard}
              onChange={(e) => setSelectedBoard(e.target.value)}
              className="bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer pr-2"
            >
              <option value="All Boards (3)">All Boards (3)</option>
              {BOARDS.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* View Content */}
      {viewMode === 'timeline' ? (
        <TimelineView records={filteredRecords} />
      ) : (
        /* Cards View matching Image 4 */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredRecords.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header: Avatar with dot + Name & Role + Approved badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`w-11 h-11 rounded-full ${item.requesterColor || 'bg-emerald-600'} text-white font-bold flex items-center justify-center text-sm shadow-2xs`}>
                        {item.requesterInitials}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug">
                        {item.requesterName}
                      </h3>
                      <div className="text-xs text-slate-600 font-medium">
                        {item.requesterRole}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {item.requesterDept}
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Approved
                  </span>
                </div>

                {/* Unavailability Window Box */}
                <div className="bg-slate-50/70 border border-slate-100 rounded-lg p-3 my-3">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    <span>UNAVAILABILITY WINDOW</span>
                    <span className="text-slate-600 normal-case font-semibold">
                      {item.businessDays} business {item.businessDays === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-slate-900">
                      {item.startDate} – {item.endDate}
                    </div>
                    <div className="text-xs font-semibold text-emerald-700">
                      {item.relativeNotice}
                    </div>
                  </div>
                </div>

                {/* Category & Coverage */}
                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Category: </span>
                    <span className="font-semibold text-slate-800">{item.category}</span>
                  </div>

                  {item.coverageNotes && (
                    <div>
                      <span className="text-slate-500 font-medium">Coverage: </span>
                      <span className="text-slate-700">{item.coverageNotes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Attached Boards matching Image 4 */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
                <span className="text-slate-400 text-[11px]">Attached:</span>
                {item.attachedBoards?.map((board, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium hover:bg-slate-200/70 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    {board}
                    <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                  </span>
                ))}
              </div>
            </div>
          ))}

          {filteredRecords.length === 0 && (
            <div className="col-span-full bg-white rounded-xl border border-slate-200 p-12 text-center">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <div className="text-sm font-semibold text-slate-700">No approved leaves match your search criteria</div>
              <div className="text-xs text-slate-400 mt-1">Try clearing the search query or selecting All Boards</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
