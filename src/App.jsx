import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import EmployeeDashboard from './components/EmployeeDashboard';
import RequestLeaveModal from './components/RequestLeaveModal';
import ManagerReviewView from './components/ManagerReviewView';
import TeamRosterView from './components/TeamRosterView';
import BoardBadgesPreview from './components/BoardBadgesPreview';
import { TEAM_MEMBERS } from './data/mockData';
import { getLeaveRecords, addLeaveRecord, updateLeaveStatus, resetDemoData } from './services/leaveStorage';
import { getTrelloContext, autoSize, isInsideTrello } from './trelloPowerUp';
import { RotateCcw } from 'lucide-react';

export default function App() {
  const [tContext, setTContext] = useState(null);
  const [currentUser, setCurrentUser] = useState(TEAM_MEMBERS[0]); // Default: Marcus Chen
  const [activeTab, setActiveTab] = useState('employee'); // 'employee' | 'manager' | 'roster' | 'board'
  const [records, setRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const inTrello = isInsideTrello();

  // Initialize Trello Power-Up context and load records
  useEffect(() => {
    const t = getTrelloContext();
    if (t) {
      setTContext(t);
      autoSize(t);

      // Attempt to identify logged-in Trello member
      if (typeof t.member === 'function') {
        t.member('id', 'fullName')
          .then((member) => {
            if (member && member.fullName) {
              const matched = TEAM_MEMBERS.find(m =>
                m.name.toLowerCase().includes(member.fullName.toLowerCase()) ||
                member.fullName.toLowerCase().includes(m.name.toLowerCase())
              );
              if (matched) setCurrentUser(matched);
            }
          })
          .catch(() => {});
      }
    }

    // Load initial records
    getLeaveRecords(t)
      .then((loaded) => {
        setRecords(loaded);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading leaves:', err);
        setLoading(false);
      });
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

  // Reset demo data to screenshot match
  const handleResetData = async () => {
    if (confirm('Reset leaves to the default screenshot sample data?')) {
      const reset = await resetDemoData(tContext);
      setRecords(reset);
    }
  };

  // Pending count for manager tab
  const pendingCount = records.filter(
    r => (r.status === 'Pending' || r.status === 'Discussion') &&
         (r.taggedApprovers?.includes(currentUser.id) || currentUser.isManager)
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
          setCurrentUser={setCurrentUser}
          pendingCount={pendingCount}
        />

        <main className="pb-8">
          {activeTab === 'employee' && (
            <EmployeeDashboard
              currentUser={currentUser}
              records={records}
              onRequestLeave={() => setIsModalOpen(true)}
            />
          )}

          {activeTab === 'manager' && (
            <ManagerReviewView
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              records={records}
              onUpdateStatus={handleUpdateStatus}
            />
          )}

          {activeTab === 'roster' && (
            <TeamRosterView records={records} />
          )}

          {activeTab === 'board' && (
            <BoardBadgesPreview records={records} />
          )}
        </main>
      </div>

      {/* Subtle Footer (Only outside Trello iframe) */}
      {!inTrello && (
        <footer className="border-t border-slate-200/80 bg-white py-3 px-6 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">Leave Management Power-Up</span>
            <span>•</span>
            <span>Standalone Demo Environment</span>
          </div>

          <button
            onClick={handleResetData}
            className="text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors cursor-pointer text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </footer>
      )}

      {/* Request Leave Modal */}
      <RequestLeaveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentUser={currentUser}
        onSubmitLeave={handleCreateLeave}
        existingRecords={records}
      />
    </div>
  );
}
