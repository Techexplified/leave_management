import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import EmployeeDashboard from './components/EmployeeDashboard';
import RequestLeaveModal from './components/RequestLeaveModal';
import ManagerReviewView from './components/ManagerReviewView';
import TeamRosterView from './components/TeamRosterView';
import BoardBadgesPreview from './components/BoardBadgesPreview';
import { DEFAULT_STANDALONE_MEMBERS } from './data/mockData';
import { getLeaveRecords, addLeaveRecord, updateLeaveStatus, deleteLeaveRecord } from './services/leaveStorage';
import { getTrelloContext, autoSize, isInsideTrello, getBoardMembers, getCurrentTrelloMember, getBoardName } from './trelloPowerUp';

export default function App() {
  const [tContext, setTContext] = useState(null);
  const [boardMembers, setBoardMembers] = useState(DEFAULT_STANDALONE_MEMBERS);
  const [currentUser, setCurrentUser] = useState(DEFAULT_STANDALONE_MEMBERS[0]);
  const [boardName, setBoardName] = useState('Trello Board');
  const [activeTab, setActiveTab] = useState('employee'); // 'employee' | 'manager' | 'roster' | 'board'
  const [records, setRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const inTrello = isInsideTrello();

  // Initialize Trello Power-Up context and load real board data
  useEffect(() => {
    async function init() {
      const t = getTrelloContext();
      if (t) {
        setTContext(t);
        autoSize(t);

        try {
          // 1. Fetch real members of this Trello board
          const members = await getBoardMembers(t);
          if (members && members.length > 0) {
            setBoardMembers(members);
          }

          // 2. Fetch the currently logged-in Trello user
          const me = await getCurrentTrelloMember(t);
          if (me) {
            const matched = members.find(m => m.id === me.id);
            setCurrentUser(matched || me);
          } else if (members.length > 0) {
            setCurrentUser(members[0]);
          }

          // 3. Fetch board name
          const name = await getBoardName(t);
          setBoardName(name);
        } catch (e) {
          console.warn('Error fetching Trello board data:', e);
        }
      }

      // 4. Load saved leave records from Trello board shared storage
      try {
        const loaded = await getLeaveRecords(t);
        setRecords(loaded || []);
      } catch (err) {
        console.error('Error loading leaves:', err);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  // Update Trello iframe height if resized
  useEffect(() => {
    if (tContext) {
      autoSize(tContext);
    }
  }, [activeTab, records, isModalOpen]);

  // Handle new leave submission
  const handleCreateLeave = async (newRecord) => {
    try {
      const updated = await addLeaveRecord(tContext, newRecord);
      setRecords(updated);
    } catch (err) {
      console.error('Failed to create leave:', err);
    }
  };

  // Handle manager status changes (Approve / Reject / Discussion)
  const handleUpdateStatus = async (recordId, status, approver, note) => {
    try {
      const updated = await updateLeaveStatus(tContext, recordId, status, approver, note);
      setRecords(updated);
    } catch (err) {
      console.error('Failed to update leave status:', err);
    }
  };

  // Handle deleting a leave record
  const handleDeleteLeave = async (recordId) => {
    try {
      const updated = await deleteLeaveRecord(tContext, recordId);
      setRecords(updated);
    } catch (err) {
      console.error('Failed to delete leave:', err);
    }
  };

  // STRICT RULE: Pending count for Approvals tab:
  // ONLY requests sent to the active user AND NOT created by the active user!
  const pendingCount = records.filter(
    r => (r.status === 'Pending' || r.status === 'Discussion') &&
         r.taggedApprovers?.includes(currentUser.id) &&
         r.requesterId !== currentUser.id
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-500">Loading Leave Management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
      <div>
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
          pendingCount={pendingCount}
        />

        <main className="pb-8">
          {activeTab === 'employee' && (
            <EmployeeDashboard
              currentUser={currentUser}
              records={records}
              onRequestLeave={() => setIsModalOpen(true)}
              onDeleteLeave={handleDeleteLeave}
            />
          )}

          {activeTab === 'manager' && (
            <ManagerReviewView
              currentUser={currentUser}
              records={records}
              onUpdateStatus={handleUpdateStatus}
            />
          )}

          {activeTab === 'roster' && (
            <TeamRosterView records={records} />
          )}

          {activeTab === 'board' && (
            <BoardBadgesPreview
              records={records}
              tContext={tContext}
              boardName={boardName}
            />
          )}
        </main>
      </div>

      {/* Request Leave Modal */}
      <RequestLeaveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentUser={currentUser}
        boardMembers={boardMembers}
        boardName={boardName}
        onSubmitLeave={handleCreateLeave}
        existingRecords={records}
      />
    </div>
  );
}
