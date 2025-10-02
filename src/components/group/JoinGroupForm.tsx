'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface JoinGroupFormProps {
  onJoinGroup: (joinCode: string) => Promise<void>;
  isLoading: boolean;
}

export default function JoinGroupForm({ onJoinGroup, isLoading }: JoinGroupFormProps) {
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!joinCode.trim()) {
      setError('Join code is required');
      return;
    }

    if (joinCode.trim().length < 4) {
      setError('Join code must be at least 4 characters long');
      return;
    }

    setError('');
    await onJoinGroup(joinCode.trim().toUpperCase());
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="joinCode" className="block text-sm font-medium text-gray-700 mb-2">
          Group Join Code
        </label>
        <Input
          id="joinCode"
          type="text"
          value={joinCode}
          onChange={(value) => {
            setJoinCode(value.toUpperCase());
            setError('');
          }}
          placeholder="Enter 6-character join code"
          className={error ? 'border-red-500' : ''}
          maxLength={6}
        />
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
      </div>
      
      <div className="flex space-x-3">
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={isLoading || !joinCode.trim()}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300"
        >
          {isLoading ? 'Joining...' : 'Join Group'}
        </Button>
      </div>
    </div>
  );
}
