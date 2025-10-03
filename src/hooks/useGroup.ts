import { useGroupQuery } from './queries/useGroupQuery';
import { 
  useCreateGroupMutation, 
  useJoinGroupMutation, 
  useLeaveGroupMutation 
} from './mutations/useGroupMutations';
import { CreateGroupData, JoinGroupData, LeaveGroupData } from '@/types/group';

export function useGroup() {
  // Query for fetching groups
  const { data: groupsData, isLoading, error, refetch } = useGroupQuery();
  
  // Mutations for group operations
  const createGroupMutation = useCreateGroupMutation();
  const joinGroupMutation = useJoinGroupMutation();
  const leaveGroupMutation = useLeaveGroupMutation();

  // Helper functions that use the mutations
  const createGroup = async (groupData: CreateGroupData) => {
    return createGroupMutation.mutateAsync(groupData);
  };

  const joinGroup = async (joinData: JoinGroupData) => {
    return joinGroupMutation.mutateAsync(joinData);
  };

  const leaveGroup = async (leaveData: LeaveGroupData) => {
    return leaveGroupMutation.mutateAsync(leaveData);
  };

  return {
    // Data
    group: groupsData?.currentGroup || null,
    groups: groupsData?.groups || [],
    isLoading,
    error,
    
    // Actions
    createGroup,
    joinGroup,
    leaveGroup,
    refetch,
    
    // Mutation states for UI feedback
    isCreating: createGroupMutation.isPending,
    isJoining: joinGroupMutation.isPending,
    isLeaving: leaveGroupMutation.isPending,
    
    // Mutation errors
    createError: createGroupMutation.error,
    joinError: joinGroupMutation.error,
    leaveError: leaveGroupMutation.error,
  };
}