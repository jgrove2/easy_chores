'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/navigation/TopBar';
import BottomNavigation from '@/components/navigation/BottomNavigation';
import ChoreCard from '@/components/chore/ChoreCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useGroup } from '@/hooks/useGroup';
import { useChores } from '@/hooks/useChores';

export default function ChoresPage() {
  const router = useRouter();
  const { group, isLoading: groupLoading } = useGroup();
  const { chores, isLoading: choresLoading } = useChores();

  const handleEditChore = (choreId: string) => {
    router.push(`/chores/edit/${choreId}`);
  };

  const handleCreateChore = () => {
    router.push('/chores/create');
  };

  // Show loading state
  if (groupLoading || choresLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <TopBar title="Manage Chores" />
        <div className="max-w-4xl mx-auto py-6 px-4">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" text="Loading chores..." />
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TopBar title="Manage Chores" />
      
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="space-y-6">
          {/* Header with Create Button */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">All Chores</h1>
            <button
              onClick={handleCreateChore}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6h6m-6 0H6" />
              </svg>
              Create Chore
            </button>
          </div>

          {/* Chores List */}
          <div className="bg-white rounded-lg shadow">
            {chores && chores.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {chores.map((chore) => (
                  <div key={chore.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <ChoreCard
                          chore={chore}
                        />
                      </div>
                      <div className="ml-4 flex space-x-2">
                        <button
                          onClick={() => handleEditChore(chore.id)}
                          className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
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
                <p className="text-gray-600 mb-4">
                  There are no chores currently assigned to your group.
                </p>
                <button
                  onClick={handleCreateChore}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create your first chore
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
}