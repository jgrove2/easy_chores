'use client';

import { useState } from 'react';
import TopBar from '@/components/navigation/TopBar';
import BottomNavigation from '@/components/navigation/BottomNavigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useActivities } from '@/hooks/useActivities';

export default function ActivitiesPage() {
  const { activities, isLoading, error, refreshActivities } = useActivities({ limit: 50 });
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshActivities();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      } else {
        return date.toLocaleDateString();
      }
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'chore_created':
        return '📝';
      case 'chore_updated':
        return '✏️';
      case 'chore_deleted':
        return '🗑️';
      case 'chore_completed':
        return '✅';
      case 'user_joined':
        return '👋';
      case 'user_left':
        return '👋';
      case 'group_created':
        return '🏠';
      case 'group_deleted':
        return '🏠';
      default:
        return '📋';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <TopBar title="Activity Log" />
        <div className="max-w-4xl mx-auto py-6 px-4">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" text="Loading activities..." />
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <TopBar title="Activity Log" />
        <div className="max-w-4xl mx-auto py-6 px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Activities</h3>
              <p className="text-gray-600 mb-4">{error?.message || 'An error occurred'}</p>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300"
              >
                {refreshing ? 'Refreshing...' : 'Try Again'}
              </button>
            </div>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TopBar title="Activity Log" />
      
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="space-y-6">
          {/* Header with Refresh Button */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Group Activity</h1>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <svg className={`-ml-1 mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {/* Activities List */}
          <div className="bg-white rounded-lg shadow">
            {activities && activities.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {activities.map((activity) => (
                  <div key={activity.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">{activity.user.name}</span>
                            {' '}
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-500 ml-2">
                            {formatDate(activity.createdAt)}
                          </p>
                        </div>
                        {activity.metadata && (
                          <div className="mt-1 text-xs text-gray-600">
                            {JSON.parse(activity.metadata).details && (
                              <span>{JSON.parse(activity.metadata).details}</span>
                            )}
                          </div>
                        )}
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">No activity yet</h3>
                <p className="text-gray-600">
                  Activity will appear here as members perform actions in your group.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
}
