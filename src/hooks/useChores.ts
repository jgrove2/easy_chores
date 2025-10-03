import { useChoresQuery } from './queries/useChoresQuery';
import { 
  useCreateChoreMutation, 
  useUpdateChoreMutation, 
  useDeleteChoreMutation, 
  useCompleteChoreMutation 
} from './mutations/useChoreMutations';
import { CreateChoreData, UpdateChoreData } from '@/types/chore';

export function useChores() {
  // Query for fetching chores
  const { data: choresData, isLoading, error, refetch } = useChoresQuery();
  
  // Mutations for chore operations
  const createChoreMutation = useCreateChoreMutation();
  const updateChoreMutation = useUpdateChoreMutation();
  const deleteChoreMutation = useDeleteChoreMutation();
  const completeChoreMutation = useCompleteChoreMutation();

  // Helper functions that use the mutations
  const createChore = async (choreData: CreateChoreData) => {
    return createChoreMutation.mutateAsync(choreData);
  };

  const updateChore = async (choreId: string, updates: UpdateChoreData) => {
    return updateChoreMutation.mutateAsync({ choreId, updates });
  };

  const deleteChore = async (choreId: string) => {
    return deleteChoreMutation.mutateAsync(choreId);
  };

  const completeChore = async (choreId: string, nextDueDate: Date) => {
    return completeChoreMutation.mutateAsync({ choreId, nextDueDate });
  };

  return {
    // Data
    chores: choresData?.chores || [],
    isLoading,
    error,
    
    // Actions
    createChore,
    updateChore,
    deleteChore,
    completeChore,
    refetch,
    
    // Mutation states for UI feedback
    isCreating: createChoreMutation.isPending,
    isUpdating: updateChoreMutation.isPending,
    isDeleting: deleteChoreMutation.isPending,
    isCompleting: completeChoreMutation.isPending,
    
    // Mutation errors
    createError: createChoreMutation.error,
    updateError: updateChoreMutation.error,
    deleteError: deleteChoreMutation.error,
    completeError: completeChoreMutation.error,
  };
}