export interface Chore {
  id: string;
  title: string;
  frequency: string;
  customInterval?: number;
  assignmentType: string;
  isActive: boolean;
  nextDueDate?: Date;
  isCompleted?: boolean;
  createdAt?: Date;
  assignedUser?: {
    id: string;
    name: string;
    email: string;
  };
  group?: {
    id: string;
    name: string;
  };
  assignments?: ChoreAssignment[];
  completions?: ChoreCompletion[];
  lastModifier?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ChoreAssignment {
  id: string;
  choreId: string;
  userId: string;
  isActive: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ChoreCompletion {
  id: string;
  choreId: string;
  userId: string;
  completedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateChoreData {
  title: string;
  frequency: string;
  frequencyValue?: number;
  assignmentType: string;
  groupId: string;
  assignedUserId?: string;
}

export interface UpdateChoreData {
  title?: string;
  frequency?: string;
  frequencyValue?: number;
  assignmentType?: string;
  isActive?: boolean;
  assignedUserId?: string;
}

export interface CompleteChoreData {
  choreId: string;
  nextDueDate: Date;
}

export interface ChoreResponse {
  chores: Chore[];
}

export interface SingleChoreResponse {
  chore: Chore;
}

export interface ChoreMutationResponse {
  message: string;
  chore: Chore;
}
