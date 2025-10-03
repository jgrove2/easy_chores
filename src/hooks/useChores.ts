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
  createdAt?: Date;
  assignedUser?: {
    id: string;
    name: string;
    email: string;
  };
}

export function useChores() {
  const { group } = useGroup();
  const [chores, setChores] = useState<Chore[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChores = async () => {
      if (!group) {
        setChores([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`/api/chores?groupId=${group.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch chores');
        }
        
        const data = await response.json();
        setChores(data.chores || []);
      } catch (error) {
        console.error('Error fetching chores:', error);
        setChores([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChores();
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
      const response = await fetch(`/api/chores/${choreId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to complete chore');
      }

      const result = await response.json();
      console.log('Chore completed successfully:', result);
      
      // Refresh chores list
      if (group) {
        const choresResponse = await fetch(`/api/chores?groupId=${group.id}`);
        if (choresResponse.ok) {
          const data = await choresResponse.json();
          setChores(data.chores || []);
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error completing chore:', error);
      throw error;
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