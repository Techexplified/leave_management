import React from 'react';
import { Calendar, CheckCircle2, Users, ShieldAlert, LayoutGrid, Plus, UserCheck } from 'lucide-react';
import { TEAM_MEMBERS } from '../data/mockData';

export default function Header({
  activeTab,
  setActiveTab,
  currentUser,
  setCurrentUser,
  pendingCount,
  onRequestLeave
}) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Banner: Persona Switcher & Trello Status */}
      <div className="bg-slate-900 text-slate-100 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-slate-200">Trello Power-Up Live Environment</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300">Active Board: <strong className="text-white">Sprint 42 — Platform & Engine</strong></span>
        </div>

        {/* Persona / Role Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            Switch Active Persona:
          </span>
          <select
            value={currentUser.id}
            onChange={(e) => {
              const selected = TEAM_MEMBERS.find(m => m.id === e.target.value);
              if (selected) setCurrentUser(selected);
            }}
            className="bg-slate-800 text-emerald-300 border border-slate-700 text-xs rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 font-medium cursor-pointer"
          >
            {TEAM_MEMBERS.map(m => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.isManager ? 'Manager / Approver' : 'Employee'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-md">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 leading-tight">Leave Management</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                  Power-Up v1.0
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Track personal leaves, approval workflows & team availability
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-sm">
            <button
              onClick={() => setActiveTab('employee')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'employee'
                  ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>My Leaves</span>
            </button>

            <button
              onClick={() => setActiveTab('manager')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'manager'
                  ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Assigned Requests</span>
              {pendingCount > 0 && (
                <span className="bg-amber-100 text-amber-800 text-xs px-1.5 py-0.2 rounded-full font-bold border border-amber-300">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('roster')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'roster'
                  ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Team Roster</span>
            </button>

            <button
              onClick={() => setActiveTab('board')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'board'
                  ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Board Badges (Live)</span>
            </button>
          </nav>

          {/* Quick Request Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onRequestLeave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Request Leave</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
