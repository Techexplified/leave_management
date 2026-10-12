import React from 'react';
import { Calendar, User, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TimelineView({ records }) {
  // Calendar days for October 2026 (matching screenshots)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  // Filter approved records
  const approvedRecords = records.filter(r => r.status === 'Approved');

  // Helper to parse day from "2026-10-XX"
  const getDayNum = (dateStr) => {
    if (!dateStr) return 1;
    const parts = dateStr.split('-');
    return parseInt(parts[2], 10);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Month Bar */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-slate-900 text-sm">October 2026 Availability Schedule</h3>
          <span className="text-xs text-slate-500">Highlighted spans represent approved leaves</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <span className="inline-block w-3 h-3 rounded bg-emerald-500"></span> Annual Vacation
          <span className="inline-block w-3 h-3 rounded bg-teal-500 ml-2"></span> Remote / WFH
          <span className="inline-block w-3 h-3 rounded bg-indigo-500 ml-2"></span> Family Care
        </div>
      </div>

      {/* Gantt Timeline Grid */}
      <div className="overflow-x-auto p-4">
        <div className="min-w-[900px]">
          {/* Days Header */}
          <div className="grid grid-cols-[200px_repeat(31,minmax(20px,1fr))] gap-1 text-[11px] text-slate-400 font-semibold text-center border-b border-slate-100 pb-2 mb-3">
            <div className="text-left text-slate-600 pl-2">Team Member</div>
            {daysInMonth.map((day) => {
              // 2026-10-01 is Thursday
              // Weekends: Oct 3-4, 10-11, 17-18, 24-25, 31
              const dayOfWeek = (day + 3) % 7; // Thursday = 4
              const isWeekend = dayOfWeek === 6 || dayOfWeek === 0;

              return (
                <div
                  key={day}
                  className={`py-1 rounded ${isWeekend ? 'bg-slate-100 text-slate-400 font-bold' : 'text-slate-600'}`}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {/* Member Rows */}
          <div className="space-y-3">
            {approvedRecords.map((rec) => {
              const startDay = getDayNum(rec.startDate);
              const endDay = getDayNum(rec.endDate);

              const colorClass =
                rec.category.includes('Vacation') ? 'bg-emerald-500 text-white' :
                rec.category.includes('Remote') ? 'bg-teal-500 text-white' :
                'bg-indigo-500 text-white';

              return (
                <div
                  key={rec.id}
                  className="grid grid-cols-[200px_repeat(31,minmax(20px,1fr))] gap-1 items-center py-1.5 hover:bg-slate-50/80 rounded-lg transition-colors"
                >
                  {/* Left: Member */}
                  <div className="flex items-center gap-2 pl-2 overflow-hidden pr-2">
                    <div className={`w-6 h-6 rounded-full ${rec.requesterColor || 'bg-blue-600'} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}>
                      {rec.requesterInitials}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-900 truncate">{rec.requesterName}</div>
                      <div className="text-[10px] text-slate-400 truncate">{rec.category}</div>
                    </div>
                  </div>

                  {/* 31 Calendar Day Cells */}
                  {daysInMonth.map((day) => {
                    const isWithin = day >= startDay && day <= endDay;
                    const isStart = day === startDay;
                    const isEnd = day === endDay;

                    // Weekend check
                    const dayOfWeek = (day + 3) % 7;
                    const isWeekend = dayOfWeek === 6 || dayOfWeek === 0;

                    return (
                      <div
                        key={day}
                        className={`h-7 flex items-center justify-center text-[10px] font-bold transition-all ${
                          isWithin
                            ? `${colorClass} ${isStart ? 'rounded-l-md' : ''} ${isEnd ? 'rounded-r-md' : ''} shadow-2xs`
                            : isWeekend
                            ? 'bg-slate-50 text-transparent'
                            : 'text-transparent'
                        }`}
                        title={isWithin ? `${rec.requesterName}: ${rec.category} (${rec.startDate} - ${rec.endDate})` : ''}
                      >
                        {isStart ? '●' : ''}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
