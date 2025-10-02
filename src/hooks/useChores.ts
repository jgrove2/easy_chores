import { useState, useEffect } from 'react';
import { useGroup } from './useGroup';

interface Chore {
  id: string;
  title: string;
  frequency: string;
  customInterval?: number;
  assignmentType: string;
  isActive: boolean;
  nextDueDate?: Date;
  isCompleted?: boolean;
}

export function useChores() {
  const { group } = useGroup();
  const [chores, setChores] = useState<Chore[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!group) {
      setChores([]);
      setIsLoading(false);
      return;
    }

    // Use chores from group data
    setChores(group.chores || []);
    setIsLoading(false);
  }, [group]);

  const createChore = async (choreData: Partial<Chore>) => {
    try {
      // Implementation will be added with API integration
      console.log('Creating chore:', choreData);
    } catch (error) {
      console.error('Error creating chore:', error);
    }
  };

  const completeChore = async (choreId: string) => {
    try {
      // Implementation will be added with API integration
      console.log('Completing chore:', choreId);
    } catch (error) {
      console.error('Error completing chore:', error);
    }
  };

  const updateChore = async (choreId: string, updates: Partial<Chore>) => {
    try {
      // Implementation will be added with API integration
      console.log('Updating chore:', choreId, updates);
    } catch (error) {
      console.error('Error updating chore:', error);
    }
  };

  const deleteChore = async (choreId: string) => {
    try {
      // Implementation will be added with API integration
      console.log('Deleting chore:', choreId);
    } catch (error) {
      console.error('Error deleting chore:', error);
    }
  };

  return {
    chores,
    isLoading,
    createChore,
    completeChore,
    updateChore,
    deleteChore,
  };
}