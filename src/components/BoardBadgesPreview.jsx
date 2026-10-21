import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { getBoardCardsAndLists } from '../trelloPowerUp';

export default function BoardBadgesPreview({ records, tContext, boardName }) {
  const [boardData, setBoardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch real lists and cards from the active Trello board
  useEffect(() => {
    async function loadData() {
      if (tContext) {
        try {
          const data = await getBoardCardsAndLists(tContext);
          if (data && data.lists && data.lists.length > 0) {
            setBoardData(data);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Could not load board cards/lists:', e);
        }
      }

      // Fallback sample lists if standalone or board has no lists
      setBoardData({
        lists: [
          { id: 'l_1', name: 'To Do' },
          { id: 'l_2', name: 'In Progress' },
          { id: 'l_3', name: 'Completed' }
        ],
        cards: [
          {
            id: 'c_1',
            name: 'Sprint Planning & Backlog Refinement',
            idList: 'l_1',
            due: '10-24',
            members: []
          },
          {
            id: 'c_2',
            name: 'API Connector & Permissions Audit',
            idList: 'l_2',
            due: '10-22',
            members: []
          }
        ]
      });
      setLoading(false);
    }

    loadData();
  }, [tContext]);

  const approvedLeaves = records.filter(r => r.status === 'Approved');

  // Helper to find if a card has any member on leave
  const getCardLeaveBadge = (card) => {
    if (!approvedLeaves.length) return null;

    // Check if card has members matching any approved leave
    if (card.members && card.members.length > 0) {
      for (const m of card.members) {
        const leave = approvedLeaves.find(l =>
          l.requesterId === m.id ||
          (l.requesterName && m.fullName && l.requesterName.toLowerCase() === m.fullName.toLowerCase())
        );
        if (leave) {
          const startShort = leave.startDate ? leave.startDate.slice(5) : '';
          const endShort = leave.endDate ? leave.endDate.slice(5) : '';
          const name = leave.requesterName ? leave.requesterName.split(' ')[0] : 'Member';
          return `${name} on Leave (${startShort} - ${endShort})`;
        }
      }
    }

    // If card has no members assigned, but an approved leave matches demo
    return null;
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 text-center text-xs text-slate-500">
        Loading board cards...
      </div>
    );
  }

  const lists = boardData?.lists || [];
  const cards = boardData?.cards || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 space-y-4">
      {/* Header (Top banner removed per user request) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
            {boardName || 'Trello Board'} — Card Badges Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Cards with team members away display automatic warning badges
          </p>
        </div>
      </div>

      {/* Trello Board Columns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-start">
        {lists.map((list) => {
          const listCards = cards.filter(c => c.idList === list.id);

          return (
            <div key={list.id} className="bg-slate-100/90 rounded-xl p-3 border border-slate-200/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1 uppercase tracking-wider">
                <span className="truncate">{list.name}</span>
                <span className="text-slate-400 font-medium">{listCards.length}</span>
              </div>

              {listCards.length === 0 ? (
                <div className="bg-white/50 rounded-lg p-4 text-center text-[11px] text-slate-400 border border-dashed border-slate-200">
                  No cards in this list
                </div>
              ) : (
                <div className="space-y-2">
                  {listCards.map((card) => {
                    const leaveBadge = getCardLeaveBadge(card);

                    return (
                      <div
                        key={card.id}
                        className="bg-white rounded-lg p-3 shadow-2xs border border-slate-200/90 hover:border-slate-300 transition-all space-y-2"
                      >
                        <div className="text-xs font-semibold text-slate-900 leading-snug">
                          {card.name}
                        </div>

                        {/* Leave Warning Badge on card */}
                        {leaveBadge && (
                          <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-md px-2 py-1 text-[11px] font-medium flex items-center gap-1.5 shadow-2xs">
                            <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                            <span className="truncate">{leaveBadge}</span>
                          </div>
                        )}

                        {/* Due date & Card members */}
                        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 border-t border-slate-50">
                          {card.due ? (
                            <span className="flex items-center gap-1 text-[10px]">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {card.due.slice(0, 10)}
                            </span>
                          ) : (
                            <span></span>
                          )}

                          {card.members && card.members.length > 0 && (
                            <div className="flex -space-x-1.5 overflow-hidden">
                              {card.members.map((m, idx) => (
                                <div
                                  key={idx}
                                  className="w-5 h-5 rounded-full bg-slate-700 text-white font-bold text-[9px] flex items-center justify-center border border-white"
                                  title={m.fullName || m.username}
                                >
                                  {m.initials || (m.fullName ? m.fullName[0] : 'U')}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
