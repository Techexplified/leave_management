import React from 'react';
import { Clock, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export default function BoardBadgesPreview({ records }) {
  // Check approved leaves to dynamically inject badges on cards
  const elenaLeave = records.find(r => r.requesterId === 'mem_ev' && r.status === 'Approved');
  const priyaLeave = records.find(r => r.requesterId === 'mem_pp' && r.status === 'Approved');
  const davidLeave = records.find(r => r.requesterId === 'mem_dk' && r.status === 'Approved');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Banner explaining Trello Card Badges capability */}
      <div className="bg-indigo-50/80 border border-indigo-200/90 rounded-xl p-4 flex items-start justify-between gap-3 text-xs text-indigo-950">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-indigo-900">Live Trello Board Integration Simulation (Image 1):</strong>
            <p className="text-indigo-800 mt-0.5">
              The Power-Up hooks into Trello's official <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-indigo-700">card-badges</code> API. When an assignee on a card is on an approved leave, Trello automatically renders the unavailability warning badge on their active task cards.
            </p>
          </div>
        </div>
        <span className="bg-indigo-600 text-white font-semibold px-2 py-0.5 rounded text-[10px] shrink-0">
          Trello Native Hook
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Sprint 42 — Platform & Engine (Board View)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cards with team members away display automatic warning badges
          </p>
        </div>
      </div>

      {/* Trello Board Grid (4 columns matching Image 1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {/* Column 1: TO DO */}
        <div className="bg-slate-100/90 rounded-xl p-3 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1 uppercase tracking-wider">
            <span>TO DO</span>
            <span className="text-slate-400">1</span>
          </div>

          <div className="bg-white rounded-lg p-3.5 shadow-xs border border-slate-200 hover:border-slate-300 transition-all space-y-2.5">
            <span className="inline-block bg-amber-100 text-amber-800 text-[11px] font-semibold px-2 py-0.5 rounded">
              Design System
            </span>
            <div className="text-xs font-semibold text-slate-900 leading-snug">
              Design Dark Mode Elevation Tokens for Trello Modal UI
            </div>
            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> 10-18
              </span>
              <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-[10px] flex items-center justify-center">
                AR
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: IN PROGRESS */}
        <div className="bg-slate-100/90 rounded-xl p-3 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1 uppercase tracking-wider">
            <span>IN PROGRESS</span>
            <span className="text-slate-400">2</span>
          </div>

          {/* Card 1 */}
          <div className="bg-white rounded-lg p-3.5 shadow-xs border border-slate-200 hover:border-slate-300 transition-all space-y-2.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="bg-blue-100 text-blue-800 text-[11px] font-semibold px-2 py-0.5 rounded">
                Backend
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-semibold px-2 py-0.5 rounded">
                Security
              </span>
            </div>
            <div className="text-xs font-semibold text-slate-900 leading-snug">
              Finalize OAuth 2.0 Token Refresh Lifecycle
            </div>

            {davidLeave && (
              <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-md px-2 py-1 text-[11px] font-medium flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                <span>David on Leave (10-19 - 10-21)</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> 10-14
              </span>
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white font-bold text-[10px] flex items-center justify-center">
                DK
              </div>
            </div>
          </div>

          {/* Card 2: Elena with Live Warning Badge */}
          <div className="bg-white rounded-lg p-3.5 shadow-xs border border-slate-200 hover:border-slate-300 transition-all space-y-2.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="bg-purple-100 text-purple-800 text-[11px] font-semibold px-2 py-0.5 rounded">
                Product Spec
              </span>
              <span className="bg-rose-100 text-rose-800 text-[11px] font-semibold px-2 py-0.5 rounded">
                High Priority
              </span>
            </div>
            <div className="text-xs font-semibold text-slate-900 leading-snug">
              Customer Discovery Synthesis: Multi-tenant Workspace Sync
            </div>

            {/* LIVE BADGE matching Image 1 */}
            {elenaLeave && (
              <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-md px-2 py-1 text-[11px] font-medium flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                <span>Elena on Leave (10-12 - 10-16)</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> 10-14
              </span>
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
                  EV
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-amber-500 border border-white rounded-full"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: UNDER REVIEW */}
        <div className="bg-slate-100/90 rounded-xl p-3 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1 uppercase tracking-wider">
            <span>UNDER REVIEW</span>
            <span className="text-slate-400">1</span>
          </div>

          <div className="bg-white rounded-lg p-3.5 shadow-xs border border-slate-200 hover:border-slate-300 transition-all space-y-2.5">
            <span className="inline-block bg-sky-100 text-sky-800 text-[11px] font-semibold px-2 py-0.5 rounded">
              DevOps
            </span>
            <div className="text-xs font-semibold text-slate-900 leading-snug">
              PostgreSQL Connection Pooling Zero-Downtime Migration
            </div>

            {/* LIVE BADGE matching Image 1 */}
            {priyaLeave && (
              <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-md px-2 py-1 text-[11px] font-medium flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                <span>Priya on Leave (10-08 - 10-09)</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> 10-09
              </span>
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-rose-600 text-white font-bold text-[10px] flex items-center justify-center">
                  PP
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-amber-500 border border-white rounded-full"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 4: COMPLETED */}
        <div className="bg-slate-100/90 rounded-xl p-3 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1 uppercase tracking-wider">
            <span>COMPLETED</span>
            <span className="text-slate-400">1</span>
          </div>

          <div className="bg-white rounded-lg p-3.5 shadow-xs border border-slate-200 hover:border-slate-300 transition-all space-y-2.5">
            <span className="inline-block bg-teal-100 text-teal-800 text-[11px] font-semibold px-2 py-0.5 rounded">
              Integration
            </span>
            <div className="text-xs font-semibold text-slate-900 leading-snug">
              Employee Leaves Power-Up Manifest & Connector Spec
            </div>
            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> 10-04
              </span>
              <div className="w-6 h-6 rounded-full bg-blue-700 text-white font-bold text-[10px] flex items-center justify-center">
                MC
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
