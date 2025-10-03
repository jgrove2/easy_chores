export interface Group {
  id: string;
  name: string;
  joinCode: string;
  memberships: GroupMembership[];
  chores?: Chore[];
}

export interface GroupMembership {
  id: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Chore {
  id: string;
  title: string;
  frequency: string;
  customInterval?: number;
  assignmentType: string;
  isActive: boolean;
}

export interface CreateGroupData {
  name: string;
}

export interface JoinGroupData {
  joinCode: string;
}

export interface LeaveGroupData {
  groupId: string;
}

export interface GroupResponse {
  success: boolean;
  groups: Group[];
  currentGroup: Group | null;
}

export interface CreateGroupResponse {
  success: boolean;
  message: string;
  group: {
    id: string;
    name: string;
    joinCode: string;
  };
}

export interface JoinGroupResponse {
  success: boolean;
  message: string;
  group: {
    id: string;
    name: string;
    joinCode: string;
  };
}

export interface LeaveGroupResponse {
  success: boolean;
  message: string;
  groupDeleted: boolean;
}
