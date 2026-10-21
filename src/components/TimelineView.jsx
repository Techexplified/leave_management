import React from 'react';
import { Calendar, Users } from 'lucide-react';

export default function TimelineView({ records }) {
  const approvedRecords = records.filter(r => r.status === 'Approved');

  // Compute current month dynamically
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed
  const daysCount = new Date(currentYear, currentMonth + 1, 0).getDate();
  const monthName = now.toLocaleString('default', { month: 'long' });
  const daysInMonth = Array.from({ length: daysCount }, (_, i) => i + 1);

  // Helper to parse day number from "YYYY-MM-DD"
  const getDayNum = (dateStr) => {
    if (!dateStr) return 1;
    const parts = dateStr.split('-');
    return parseInt(parts[2], 10);
  };

  if (approvedRecords.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/90 p-8 text-center shadow-2xs">
        <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <div className="text-xs font-semibold text-slate-700">No scheduled leaves on timeline</div>
        <div className="text-[11px] text-slate-400 mt-1">Approved leaves will appear across the month schedule.</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Month Header */}
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
            {monthName} {currentYear} Availability Schedule
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span className="inline-block w-2.5 h-2.5 rounded bg-emerald-500"></span>
          <span>Approved Leave</span>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto p-4">
        <div className="min-w-[850px]">
          {/* Days Header */}
          <div className="grid grid-cols-[180px_repeat(31,minmax(18px,1fr))] gap-1 text-[10px] text-slate-400 font-semibold text-center border-b border-slate-100 pb-2 mb-2.5">
            <div className="text-left text-slate-600 pl-2">Team Member</div>
            {daysInMonth.map((day) => {
              const dateObj = new Date(currentYear, currentMonth, day);
              const dayOfWeek = dateObj.getDay();
              const isWeekend = dayOfWeek === 6 || dayOfWeek === 0;

              return (
                <div
                  key={day}
                  className={`py-0.5 rounded ${isWeekend ? 'bg-slate-100 text-slate-400 font-bold' : 'text-slate-600'}`}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {/* Member Rows */}
          <div className="space-y-2.5">
            {approvedRecords.map((rec) => {
              const startDay = getDayNum(rec.startDate);
              const endDay = getDayNum(rec.endDate);

              return (
                <div
                  key={rec.id}
                  className="grid grid-cols-[180px_repeat(31,minmax(18px,1fr))] gap-1 items-center py-1 hover:bg-slate-50/80 rounded-lg transition-colors"
                >
                  {/* Left: Member */}
                  <div className="flex items-center gap-2 pl-2 overflow-hidden pr-2">
                    {rec.requesterAvatar ? (
                      <img src={rec.requesterAvatar} alt="" className="w-5 h-5 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className={`w-5 h-5 rounded-full ${rec.requesterColor || 'bg-emerald-600'} text-white font-bold text-[9px] flex items-center justify-center shrink-0`}>
                        {rec.requesterInitials}
                      </div>
                    )}
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-900 truncate">{rec.requesterName}</div>
                      <div className="text-[10px] text-slate-400 truncate">{rec.category}</div>
                    </div>
                  </div>

                  {/* Day cells */}
                  {daysInMonth.map((day) => {
                    const isWithin = day >= startDay && day <= endDay;
                    const isStart = day === startDay;
                    const isEnd = day === endDay;

                    const dateObj = new Date(currentYear, currentMonth, day);
                    const dayOfWeek = dateObj.getDay();
                    const isWeekend = dayOfWeek === 6 || dayOfWeek === 0;

                    return (
                      <div
                        key={day}
                        className={`h-6 flex items-center justify-center text-[9px] font-bold transition-all ${
                          isWithin
                            ? `bg-emerald-500 text-white ${isStart ? 'rounded-l-md' : ''} ${isEnd ? 'rounded-r-md' : ''} shadow-2xs`
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
