'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

interface GroupDetailsCardProps {
  group: {
    id: string;
    name: string;
    joinCode: string;
    memberships: Array<{
      id: string;
      role: string;
      user: {
        id: string;
        name: string;
        email: string;
      };
    }>;
  };
  onLeaveGroup: () => Promise<void>;
  onDeleteGroup: () => Promise<void>;
  isLeaving: boolean;
}

export default function GroupDetailsCard({ 
  group, 
  onLeaveGroup, 
  onDeleteGroup, 
  isLeaving 
}: GroupDetailsCardProps) {
  const [showInviteCode, setShowInviteCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(group.joinCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const isAdmin = group.memberships.some(m => m.role === 'admin');
  const memberCount = group.memberships.length;

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{group.name}</h3>
        <p className="text-sm text-gray-600 mb-3">
          {memberCount} member{memberCount !== 1 ? 's' : ''}
        </p>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Join Code
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <input
                type="text"
                value={showInviteCode ? group.joinCode : '••••••'}
                readOnly
                className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-sm font-mono text-center text-gray-900"
              />
              <div className="flex space-x-2">
                <Button
                  onClick={() => setShowInviteCode(!showInviteCode)}
                  variant="secondary"
                  className="px-3 py-2 text-sm flex-1 sm:flex-none"
                >
                  {showInviteCode ? 'Hide' : 'Show'}
                </Button>
                {showInviteCode && (
                  <Button
                    onClick={copyToClipboard}
                    variant="primary"
                    className="px-3 py-2 text-sm flex-1 sm:flex-none"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button
          onClick={onLeaveGroup}
          disabled={isLeaving}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-300"
        >
          {isLeaving ? 'Leaving...' : 'Leave Group'}
        </Button>
        
        {isAdmin && (
          <Button
            onClick={onDeleteGroup}
            disabled={isLeaving}
            className="flex-1 bg-red-800 hover:bg-red-900 text-white disabled:bg-gray-300"
          >
            Delete Group
          </Button>
        )}
      </div>
    </div>
  );
}
