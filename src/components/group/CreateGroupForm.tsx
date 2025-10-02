'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface CreateGroupFormProps {
  onCreateGroup: (groupName: string) => Promise<void>;
  isLoading: boolean;
}

export default function CreateGroupForm({ onCreateGroup, isLoading }: CreateGroupFormProps) {
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    
    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }

    if (groupName.trim().length < 2) {
      setError('Group name must be at least 2 characters long');
      return;
    }

    setError('');
    await onCreateGroup(groupName.trim());
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2">
          Group Name
        </label>
        <Input
          id="groupName"
          type="text"
          value={groupName}
          onChange={(value) => {
            setGroupName(value);
            setError('');
          }}
          placeholder="Enter group name"
          className={error ? 'border-red-500' : ''}
        />
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
      </div>
      
      <div className="flex space-x-3">
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={isLoading || !groupName.trim()}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300"
        >
          {isLoading ? 'Creating...' : 'Create Group'}
        </Button>
      </div>
    </div>
  );
}
