// Database connection and utilities
// This will be implemented with Prisma or direct database connection

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Group {
  id: string;
  name: string;
  joinCode: string;
  createdAt: Date;
  updatedAt: Date;
  members: User[];
}

export interface Chore {
  id: string;
  title: string;
  frequency: 'daily' | 'weekly' | 'custom';
  customInterval?: number;
  assignmentType: 'single' | 'alternating';
  groupId: string;
  createdAt: Date;
  updatedAt: Date;
  assignments: ChoreAssignment[];
  completions: ChoreCompletion[];
}

export interface ChoreAssignment {
  id: string;
  choreId: string;
  userId: string;
  isActive: boolean;
  createdAt: Date;
}

export interface ChoreCompletion {
  id: string;
  choreId: string;
  userId: string;
  completedAt: Date;
  nextDueDate: Date;
}

// Database utility functions will be implemented here
export class DatabaseService {
  // User operations
  async createUser(userData: Partial<User>): Promise<User> {
    // Implementation will be added
    throw new Error('Not implemented');
  }

  async getUserById(id: string): Promise<User | null> {
    // Implementation will be added
    throw new Error('Not implemented');
  }

  // Group operations
  async createGroup(groupData: Partial<Group>): Promise<Group> {
    // Implementation will be added
    throw new Error('Not implemented');
  }

  async getGroupByJoinCode(joinCode: string): Promise<Group | null> {
    // Implementation will be added
    throw new Error('Not implemented');
  }

  // Chore operations
  async createChore(choreData: Partial<Chore>): Promise<Chore> {
    // Implementation will be added
    throw new Error('Not implemented');
  }

  async getChoresByGroup(groupId: string): Promise<Chore[]> {
    // Implementation will be added
    throw new Error('Not implemented');
  }

  async completeChore(choreId: string, userId: string): Promise<ChoreCompletion> {
    // Implementation will be added
    throw new Error('Not implemented');
  }
}
