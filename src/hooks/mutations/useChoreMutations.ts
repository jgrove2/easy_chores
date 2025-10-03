import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGroup } from '../useGroup';
import { 
  CreateChoreData, 
  UpdateChoreData, 
  CompleteChoreData, 
  ChoreMutationResponse 
} from '@/types/chore';

// Create chore mutation
export function useCreateChoreMutation() {
  const queryClient = useQueryClient();
  const { group } = useGroup();

  return useMutation({
    mutationFn: async (choreData: CreateChoreData): Promise<ChoreMutationResponse> => {
      const response = await fetch('/api/chores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(choreData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create chore');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch chores query
      queryClient.invalidateQueries({ queryKey: ['chores', group?.id] });
    },
  });
}

// Update chore mutation
export function useUpdateChoreMutation() {
  const queryClient = useQueryClient();
  const { group } = useGroup();

  return useMutation({
    mutationFn: async ({ 
      choreId, 
      updates 
    }: { 
      choreId: string; 
      updates: UpdateChoreData 
    }): Promise<ChoreMutationResponse> => {
      const response = await fetch(`/api/chores/${choreId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update chore');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch chores query
      queryClient.invalidateQueries({ queryKey: ['chores', group?.id] });
    },
  });
}

// Delete chore mutation
export function useDeleteChoreMutation() {
  const queryClient = useQueryClient();
  const { group } = useGroup();

  return useMutation({
    mutationFn: async (choreId: string): Promise<{ message: string }> => {
      const response = await fetch(`/api/chores/${choreId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete chore');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch chores query
      queryClient.invalidateQueries({ queryKey: ['chores', group?.id] });
    },
  });
}

// Complete chore mutation
export function useCompleteChoreMutation() {
  const queryClient = useQueryClient();
  const { group } = useGroup();

  return useMutation({
    mutationFn: async (completeData: CompleteChoreData): Promise<ChoreMutationResponse> => {
      const response = await fetch(`/api/chores/${completeData.choreId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nextDueDate: completeData.nextDueDate }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to complete chore');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch chores query
      queryClient.invalidateQueries({ queryKey: ['chores', group?.id] });
    },
  });
}
