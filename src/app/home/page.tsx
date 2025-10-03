'use client';

import { useState, useEffect } from 'react';
import TopBar from '@/components/navigation/TopBar';
import BottomNavigation from '@/components/navigation/BottomNavigation';
import WarningPopup from '@/components/ui/WarningPopup';
import ChoreCard from '@/components/chore/ChoreCard';
import { useGroup } from '@/hooks/useGroup';
import { useChores } from '@/hooks/useChores';

export default function HomePage() {
  const { group, isLoading: groupLoading } = useGroup();
  const { chores, isLoading: choresLoading, completeChore } = useChores();
  const [showWarning, setShowWarning] = useState(false);
  const [completingChore, setCompletingChore] = useState<string | null>(null);

  useEffect(() => {
    // Show warning if user is not in a group and not loading
    if (!groupLoading && !group) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [group, groupLoading]);

  // Show loading state
  if (groupLoading || choresLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <TopBar title="Chore Dashboard" />
        <div className="max-w-4xl mx-auto py-6 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-600">Loading...</div>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  const handleCompleteChore = async (choreId: string) => {
    try {
      setCompletingChore(choreId);
      await completeChore(choreId);
    } catch (error) {
      console.error('Error completing chore:', error);
      alert('Failed to complete chore. Please try again.');
    } finally {
      setCompletingChore(null);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TopBar title="Chore Dashboard" />
      
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="space-y-6">
          {/* All Chores */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">All Chores</h2>
            {chores && chores.length > 0 ? (
              <div className="space-y-4">
                {chores.map((chore) => (
                  <ChoreCard
                    key={chore.id}
                    chore={chore}
                    onComplete={handleCompleteChore}
                    isCompleting={completingChore === chore.id}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No chores yet</h3>
                <p className="text-gray-600">
                  There are no chores currently assigned to your group.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <BottomNavigation />
      
      {/* Warning popup for users not in a group */}
      <WarningPopup isVisible={showWarning} />
    </div>
  );
}