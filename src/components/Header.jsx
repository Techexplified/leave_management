import React, { useState, useRef, useEffect } from 'react';
import { Calendar, CheckCircle2, Users, ShieldAlert, LayoutGrid, ChevronDown, Check } from 'lucide-react';
import { TEAM_MEMBERS } from '../data/mockData';
import { isInsideTrello } from '../trelloPowerUp';

export default function Header({
  activeTab,
  setActiveTab,
  currentUser,
  setCurrentUser,
  pendingCount
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const inTrello = isInsideTrello();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-3">
          {/* Logo & Power-Up Title */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-slate-900 text-sm tracking-tight">Leave Management</span>
            </div>
          </div>

          {/* Clean Segmented Navigation Tabs */}
          <nav className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs">
            <button
              onClick={() => setActiveTab('employee')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
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
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
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
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'roster'
                  ? 'bg-white text-emerald-800 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Team Roster</span>
            </button>

            {/* Only show Board Simulation tab outside Trello */}
            {!inTrello && (
              <button
                onClick={() => setActiveTab('board')}
                className={`hidden md:flex px-2.5 py-1.5 rounded-lg font-medium transition-all items-center gap-1.5 cursor-pointer ${
                  activeTab === 'board'
                    ? 'bg-white text-emerald-800 shadow-2xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Board Preview</span>
              </button>
            )}
          </nav>

          {/* Sleek User / Persona Switcher */}
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-800 transition-colors shadow-2xs cursor-pointer"
            >
              <div className={`w-6 h-6 rounded-full ${currentUser.avatarColor || 'bg-blue-600'} text-white font-bold flex items-center justify-center text-[10px] shrink-0`}>
                {currentUser.initials}
              </div>
              <span className="hidden md:inline font-semibold text-slate-900 truncate max-w-[110px]">
                {currentUser.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Persona Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Active Role
                </div>
                <div className="max-h-64 overflow-y-auto py-1">
                  {TEAM_MEMBERS.map((member) => {
                    const isSelected = member.id === currentUser.id;
                    return (
                      <button
                        key={member.id}
                        onClick={() => {
                          setCurrentUser(member);
                          setDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                          isSelected ? 'bg-emerald-50 text-emerald-900' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-6 h-6 rounded-full ${member.avatarColor} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}>
                            {member.initials}
                          </div>
                          <div className="truncate">
                            <div className="font-semibold text-slate-900 truncate">{member.name}</div>
                            <div className="text-[10px] text-slate-500 truncate">{member.role}</div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
