export interface Activity {
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

export interface ActivityResponse {
  activities: Activity[];
}

export interface ActivityQueryParams {
  limit?: number;
}
