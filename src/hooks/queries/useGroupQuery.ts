import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../useAuth';
import { GroupResponse } from '@/types/group';

const fetchGroups = async (): Promise<GroupResponse> => {
  const response = await fetch('/api/groups');
  
  if (!response.ok) {
    throw new Error('Failed to fetch groups');
  }
  
  return response.json();
};

export function useGroupQuery() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['groups'],
    queryFn: fetchGroups,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
