'use client';

import { useState, useEffect } from 'react';
import TopBar from '@/components/navigation/TopBar';
import BottomNavigation from '@/components/navigation/BottomNavigation';
import WarningPopup from '@/components/ui/WarningPopup';
import { useGroup } from '@/hooks/useGroup';
import { useChores } from '@/hooks/useChores';

export default function HomePage() {
  const { group, isLoading: groupLoading } = useGroup();
  const { chores, isLoading: choresLoading } = useChores();
  const [showWarning, setShowWarning] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TopBar title="Chore Dashboard" />
      
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="space-y-6">
          {/* Today's Chores */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Chores</h2>
            {chores && chores.length > 0 ? (
              <div className="space-y-3">
                {chores.map((chore) => (
                  <div key={chore.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{chore.title}</h3>
                      <p className="text-sm text-gray-600 capitalize">{chore.frequency}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {chore.assignmentType === 'single' ? 'Single' : 'Alternating'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">There are no chores currently</p>
            )}
          </div>
          
          {/* Upcoming Chores */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Chores</h2>
            {chores && chores.length > 0 ? (
              <div className="space-y-3">
                {chores.map((chore) => (
                  <div key={chore.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{chore.title}</h3>
                      <p className="text-sm text-gray-600 capitalize">{chore.frequency}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {chore.assignmentType === 'single' ? 'Single' : 'Alternating'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">There are no chores currently</p>
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