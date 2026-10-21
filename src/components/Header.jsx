import React from 'react';
import { Calendar, CheckCircle2, Users, ShieldAlert, LayoutGrid } from 'lucide-react';

export default function Header({
  activeTab,
  setActiveTab,
  currentUser,
  pendingCount
}) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-5">
        <div className="flex items-center justify-between h-13 gap-2">
          {/* Logo & Title */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div className="hidden lg:block">
              <span className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight">Leave Management</span>
            </div>
          </div>

          {/* Segmented Navigation Tabs */}
          <nav className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200/80 text-[11px] sm:text-xs">
            <button
              onClick={() => setActiveTab('employee')}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'employee'
                  ? 'bg-white text-emerald-800 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>My Leaves</span>
            </button>

            <button
              onClick={() => setActiveTab('manager')}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'manager'
                  ? 'bg-white text-emerald-800 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Approvals</span>
              {pendingCount > 0 && (
                <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold border border-amber-300">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('roster')}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'roster'
                  ? 'bg-white text-emerald-800 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Team Roster</span>
            </button>

            <button
              onClick={() => setActiveTab('board')}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'board'
                  ? 'bg-white text-emerald-800 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Board Badges</span>
            </button>
          </nav>

          {/* Active User Badge - Non-clickable, strictly locked to authenticated user */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-medium text-slate-800 shadow-2xs shrink-0 select-none">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt="" className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover shrink-0" />
            ) : (
              <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${currentUser.avatarColor || 'bg-emerald-600'} text-white font-bold flex items-center justify-center text-[9px] sm:text-[10px] shrink-0`}>
                {currentUser.initials}
              </div>
            )}
            <span className="font-semibold text-slate-900 truncate max-w-[120px]">
              {currentUser.name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
