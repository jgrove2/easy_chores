import { useQuery } from '@tanstack/react-query';
import { useGroup } from '../useGroup';
import { ActivityResponse, ActivityQueryParams } from '@/types/activity';

const fetchActivities = async (params?: ActivityQueryParams): Promise<ActivityResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.limit) {
    searchParams.set('limit', params.limit.toString());
  }
  
  const url = `/api/activities${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch activities');
  }
  
  return response.json();
};

export function useActivitiesQuery(params?: ActivityQueryParams) {
  const { group } = useGroup();

  return useQuery({
    queryKey: ['activities', group?.id, params],
    queryFn: () => fetchActivities(params),
    enabled: !!group?.id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
