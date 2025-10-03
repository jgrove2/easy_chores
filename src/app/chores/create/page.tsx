'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/navigation/TopBar';
import BottomNavigation from '@/components/navigation/BottomNavigation';
import { useGroup } from '@/hooks/useGroup';
import { useChores } from '@/hooks/useChores';

export default function CreateChorePage() {
  const router = useRouter();
  const { group } = useGroup();
  const { createChore, isCreating } = useChores();
  
  const [choreTitle, setChoreTitle] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [frequencyValue, setFrequencyValue] = useState(1);
  const [assignmentType, setAssignmentType] = useState('single');
  const [hasAssignedPerson, setHasAssignedPerson] = useState(false);
  const [showUserSelection, setShowUserSelection] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleBack = () => {
    router.back();
  };

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFrequency(e.target.value);
    // Reset frequency value to 1 when changing frequency type
    setFrequencyValue(1);
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUser(userId);
    setShowUserSelection(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!choreTitle.trim() || !group?.id) return;
    
    try {
      await createChore({
        title: choreTitle,
        frequency,
        frequencyValue,
        assignmentType,
        groupId: group.id,
        assignedUserId: hasAssignedPerson ? selectedUser || undefined : undefined,
      });
      
      // Redirect back to home page
      router.push('/home');
    } catch (error) {
      console.error('Error creating chore:', error);
      alert('Failed to create chore. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TopBar 
        title="Create Chore" 
        showBackButton={true}
        onBack={handleBack}
      />
      
      <div className="max-w-2xl mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Chore Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Chore Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={choreTitle}
                onChange={(e) => setChoreTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400 text-gray-900"
                placeholder="Enter chore title"
                required
              />
            </div>
            
            {/* Frequency */}
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
                Frequency
              </label>
              <select
                id="frequency"
                name="frequency"
                value={frequency}
                onChange={handleFrequencyChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                <option value="daily" className="text-gray-900">Daily</option>
                <option value="weekly" className="text-gray-900">Weekly</option>
                <option value="monthly" className="text-gray-900">Monthly</option>
              </select>
            </div>

            {/* Frequency Value */}
            <div>
              <label htmlFor="frequencyValue" className="block text-sm font-medium text-gray-700 mb-2">
                {frequency === 'daily' && 'Every (days)'}
                {frequency === 'weekly' && 'Every (weeks)'}
                {frequency === 'monthly' && 'Every (months)'}
              </label>
              <input
                type="number"
                id="frequencyValue"
                name="frequencyValue"
                min="1"
                value={frequencyValue}
                onChange={(e) => setFrequencyValue(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder={`Enter number of ${frequency === 'daily' ? 'days' : frequency === 'weekly' ? 'weeks' : 'months'}`}
              />
            </div>
            
            {/* Assignment Type */}
            <div>
              <label htmlFor="assignment" className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Type
              </label>
              <select
                id="assignment"
                name="assignment"
                value={assignmentType}
                onChange={(e) => setAssignmentType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                <option value="single" className="text-gray-900">Single Person</option>
                <option value="alternating" className="text-gray-900">Alternating</option>
              </select>
            </div>

            {/* Assigned Person Toggle */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="hasAssignedPerson" className="text-sm font-medium text-gray-700">
                  Assign to specific person
                </label>
                <button
                  type="button"
                  onClick={() => setHasAssignedPerson(!hasAssignedPerson)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    hasAssignedPerson ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      hasAssignedPerson ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* User Selection */}
            {hasAssignedPerson && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Person
                </label>
                <button
                  type="button"
                  onClick={() => setShowUserSelection(true)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left text-gray-900 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {selectedUser 
                    ? group?.memberships?.find(m => m.user.id === selectedUser)?.user.name || 'Select a person'
                    : 'Select a person'
                  }
                </button>
              </div>
            )}
            
            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!choreTitle.trim() || isCreating}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  !choreTitle.trim() || isCreating
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isCreating ? 'Creating...' : 'Create Chore'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* User Selection Popup */}
      {showUserSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Select Person</h3>
                <button
                  onClick={() => setShowUserSelection(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {group?.memberships?.map((membership) => (
                  <button
                    key={membership.user.id}
                    onClick={() => handleUserSelect(membership.user.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedUser === membership.user.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-gray-600">
                          {membership.user.name?.charAt(0).toUpperCase() || '?'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{membership.user.name || 'Unknown'}</p>
                        <p className="text-sm text-gray-500">{membership.user.email}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowUserSelection(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <BottomNavigation />
    </div>
  );
}
