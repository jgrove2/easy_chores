'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/navigation/TopBar';
import BottomNavigation from '@/components/navigation/BottomNavigation';
import CreateGroupForm from '@/components/group/CreateGroupForm';
import JoinGroupForm from '@/components/group/JoinGroupForm';
import GroupDetailsCard from '@/components/group/GroupDetailsCard';
import DeleteGroupConfirmation from '@/components/group/DeleteGroupConfirmation';
import { useGroup } from '@/hooks/useGroup';

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { group, isLoading: groupLoading } = useGroup();
  
  // User settings state
  const [displayName, setDisplayName] = useState('');
  const [originalDisplayName, setOriginalDisplayName] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [nameError, setNameError] = useState(false);

  // Group management state
  const [groupAction, setGroupAction] = useState<'none' | 'create' | 'join'>('none');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isJoiningGroup, setIsJoiningGroup] = useState(false);
  const [isLeavingGroup, setIsLeavingGroup] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [groupError, setGroupError] = useState('');

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.email) return;
      
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const userData = await response.json();
          const userName = userData.user?.name || '';
          setDisplayName(userName);
          setOriginalDisplayName(userName);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [session]);

  const handleDisplayNameChange = (value: string) => {
    setDisplayName(value);
    setHasChanges(value !== originalDisplayName);
    
    // Validate name
    const isEmpty = value.trim().length === 0;
    setNameError(isEmpty);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: displayName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update name');
      }

      const result = await response.json();
      console.log('Name updated successfully:', result);
      setHasChanges(false);
      setOriginalDisplayName(displayName); // Update original value after successful save
      // TODO: Show success message to user
    } catch (error) {
      console.error('Error updating name:', error);
      // TODO: Show error message to user
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/login' });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Group management functions
  const handleCreateGroup = async (groupName: string) => {
    setIsCreatingGroup(true);
    setGroupError('');
    
    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: groupName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create group');
      }

      // Refresh the page to show the new group
      window.location.reload();
    } catch (error) {
      console.error('Error creating group:', error);
      setGroupError(error instanceof Error ? error.message : 'Failed to create group');
    } finally {
      setIsCreatingGroup(false);
    }
  };

  const handleJoinGroup = async (joinCode: string) => {
    setIsJoiningGroup(true);
    setGroupError('');
    
    try {
      const response = await fetch('/api/groups/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ joinCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join group');
      }

      // Refresh the page to show the joined group
      window.location.reload();
    } catch (error) {
      console.error('Error joining group:', error);
      setGroupError(error instanceof Error ? error.message : 'Failed to join group');
    } finally {
      setIsJoiningGroup(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!group) return;
    
    setIsLeavingGroup(true);
    setGroupError('');
    
    try {
      const response = await fetch('/api/groups/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupId: group.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to leave group');
      }

      if (data.groupDeleted) {
        setShowDeleteConfirmation(false);
        // Show success message and refresh
        window.location.reload();
      } else {
        // Just refresh to show no group state
        window.location.reload();
      }
    } catch (error) {
      console.error('Error leaving group:', error);
      setGroupError(error instanceof Error ? error.message : 'Failed to leave group');
    } finally {
      setIsLeavingGroup(false);
    }
  };

  const handleDeleteGroup = async () => {
    await handleLeaveGroup();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TopBar title="Settings" />
      
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="space-y-6">
          {/* Group Management Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Group Management</h2>
            
            {groupLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-gray-600">Loading group information...</div>
              </div>
            ) : group ? (
              // User is in a group - show group details
              <GroupDetailsCard
                group={group}
                onLeaveGroup={async () => {
                  // Check if user is the last member
                  if (group.memberships.length === 1) {
                    setShowDeleteConfirmation(true);
                  } else {
                    await handleLeaveGroup();
                  }
                }}
                onDeleteGroup={async () => setShowDeleteConfirmation(true)}
                isLeaving={isLeavingGroup}
              />
            ) : (
              // User is not in a group - show options
              <div className="space-y-4">
                {groupError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600">{groupError}</p>
                  </div>
                )}
                
                {groupAction === 'none' && (
                  <div className="space-y-3">
                    <p className="text-gray-600 text-sm">
                      You're not currently part of any group. Choose an option below to get started.
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setGroupAction('create')}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Create Group
                      </button>
                      <button
                        onClick={() => setGroupAction('join')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Join Group
                      </button>
                    </div>
                  </div>
                )}
                
                {groupAction === 'create' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">Create New Group</h3>
                      <button
                        onClick={() => setGroupAction('none')}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ← Back
                      </button>
                    </div>
                    <CreateGroupForm
                      onCreateGroup={handleCreateGroup}
                      isLoading={isCreatingGroup}
                    />
                  </div>
                )}
                
                {groupAction === 'join' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">Join Existing Group</h3>
                      <button
                        onClick={() => setGroupAction('none')}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ← Back
                      </button>
                    </div>
                    <JoinGroupForm
                      onJoinGroup={handleJoinGroup}
                      isLoading={isJoiningGroup}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* User Settings Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="displayName" className="block text-xs font-medium text-gray-600 mb-2">
                  Display Name
                </label>
                {isLoading ? (
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 animate-pulse">
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </div>
                ) : (
                  <input
                    type="text"
                    id="displayName"
                    value={displayName}
                    onChange={(e) => handleDisplayNameChange(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                      nameError 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                    placeholder="Enter your display name"
                  />
                )}
                {nameError && (
                  <p className="text-xs text-red-600 mt-1">Display name is required</p>
                )}
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={!hasChanges || isSaving || isLoading || nameError}
                  className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                    hasChanges && !isSaving && !isLoading && !nameError
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSaving ? 'Saving...' : isLoading ? 'Loading...' : 'Save'}
                </button>
              </div>
            </div>
          </div>

          {/* Logout Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Sign out of your account. You'll need to sign in again to access your chores.
                </p>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <BottomNavigation />
      
      {/* Delete Group Confirmation Popup */}
      <DeleteGroupConfirmation
        isVisible={showDeleteConfirmation}
        onConfirm={handleDeleteGroup}
        onCancel={() => setShowDeleteConfirmation(false)}
        isDeleting={isLeavingGroup}
      />
    </div>
  );
}
