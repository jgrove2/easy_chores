import { useActivitiesQuery } from './queries/useActivitiesQuery';
import { ActivityQueryParams } from '@/types/activity';

export function useActivities(params?: ActivityQueryParams) {
  // Query for fetching activities
  const { data: activitiesData, isLoading, error, refetch } = useActivitiesQuery(params);

  return {
    // Data
    activities: activitiesData?.activities || [],
    isLoading,
    error,
    
    // Actions
    refreshActivities: refetch,
    refetch,
  };
}
