import { useState, useEffect } from 'react';

interface Activity {
  id: string;
  type: string;
  description: string;
  metadata?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  group: {
    id: string;
    name: string;
  };
}

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/activities');
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }
      
      const data = await response.json();
      setActivities(data.activities || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activities');
      console.error('Error fetching activities:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const refreshActivities = () => {
    fetchActivities();
  };

  return {
    activities,
    isLoading,
    error,
    refreshActivities,
  };
}
