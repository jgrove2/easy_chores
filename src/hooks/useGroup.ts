import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

interface Group {
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
  chores: Array<{
    id: string;
    title: string;
    frequency: string;
    customInterval?: number;
    assignmentType: string;
    isActive: boolean;
  }>;
}

export function useGroup() {
  const { isAuthenticated } = useAuth();
  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    // Fetch user's group
    const fetchGroup = async () => {
      try {
        const response = await fetch('/api/groups');
        const data = await response.json();
        
        if (data.success && data.currentGroup) {
          setGroup(data.currentGroup);
        } else {
          setGroup(null);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching group:', error);
        setGroup(null);
        setIsLoading(false);
      }
    };

    fetchGroup();
  }, [isAuthenticated]);

  const joinGroup = async (joinCode: string) => {
    try {
      // Implementation will be added with API integration
      console.log('Joining group with code:', joinCode);
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const createGroup = async (name: string) => {
    try {
      // Implementation will be added with API integration
      console.log('Creating group:', name);
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return {
    group,
    isLoading,
    joinGroup,
    createGroup,
  };
}