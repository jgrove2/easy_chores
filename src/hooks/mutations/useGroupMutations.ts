import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  CreateGroupData, 
  JoinGroupData, 
  LeaveGroupData,
  CreateGroupResponse,
  JoinGroupResponse,
  LeaveGroupResponse
} from '@/types/group';

// Create group mutation
export function useCreateGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (groupData: CreateGroupData): Promise<CreateGroupResponse> => {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create group');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch groups query
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

// Join group mutation
export function useJoinGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (joinData: JoinGroupData): Promise<JoinGroupResponse> => {
      const response = await fetch('/api/groups/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(joinData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to join group');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch groups query
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

// Leave group mutation
export function useLeaveGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (leaveData: LeaveGroupData): Promise<LeaveGroupResponse> => {
      const response = await fetch('/api/groups/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leaveData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to leave group');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch groups query
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}
