import { useQuery } from '@tanstack/react-query';
import { useGroup } from '../useGroup';
import { ChoreResponse } from '@/types/chore';

const fetchChores = async (groupId: string): Promise<ChoreResponse> => {
  const response = await fetch(`/api/chores?groupId=${groupId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch chores');
  }
  
  return response.json();
};

export function useChoresQuery() {
  const { group } = useGroup();

  return useQuery({
    queryKey: ['chores', group?.id],
    queryFn: () => fetchChores(group!.id),
    enabled: !!group?.id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
