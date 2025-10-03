import { PrismaClient } from '@prisma/client';

// Prisma client instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Database utility functions
export class DatabaseService {
  // User operations
  async createUser(userData: {
    email: string;
    name?: string;
    image?: string;
  }) {
    return await prisma.user.create({
      data: userData,
    });
  }

  async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        groupMemberships: {
          include: {
            group: true,
          },
        },
      },
    });
  }

  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        groupMemberships: {
          include: {
            group: true,
          },
        },
      },
    });
  }

  async updateUser(id: string, data: { name?: string; image?: string }) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  // Group operations
  async createGroup(groupData: {
    name: string;
    joinCode: string;
  }) {
    return await prisma.group.create({
      data: groupData,
    });
  }

  async getGroupByJoinCode(joinCode: string) {
    return await prisma.group.findUnique({
      where: { joinCode },
      include: {
        memberships: {
          include: {
            user: true,
          },
        },
        chores: {
          include: {
            assignments: {
              include: {
                user: true,
              },
            },
            completions: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
  }

  async getGroupById(id: string) {
    return await prisma.group.findUnique({
      where: { id },
      include: {
        memberships: {
          include: {
            user: true,
          },
        },
        chores: {
          include: {
            assignments: {
              include: {
                user: true,
              },
            },
            completions: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
  }

  async addUserToGroup(userId: string, groupId: string, role: string = 'member') {
    return await prisma.groupMembership.create({
      data: {
        userId,
        groupId,
        role,
      },
      include: {
        user: true,
        group: true,
      },
    });
  }

  async removeUserFromGroup(userId: string, groupId: string) {
    return await prisma.groupMembership.delete({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });
  }

  // Chore operations
  async createChore(choreData: {
    title: string;
    frequency: string;
    customInterval?: number;
    assignmentType: string;
    groupId: string;
    lastModifiedBy?: string;
    assignedUserId?: string;
    nextDueDate?: Date;
  }) {
    return await prisma.chore.create({
      data: choreData,
      include: {
        group: true,
        // lastModifier is not a valid relation; remove it to fix the type error
      },
    });
  }

  async getChoresByGroup(groupId: string) {
    return await prisma.chore.findMany({
      where: { 
        groupId,
        isActive: true,
      },
      include: {
        group: true,
        assignments: {
          include: {
            user: true,
          },
        },
        completions: {
          include: {
            user: true,
          },
        },
        lastModifier: true,
        assignedUser: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getChoreById(id: string) {
    return await prisma.chore.findUnique({
      where: { id },
      include: {
        group: true,
        assignments: true,
        completions: true,
      },
    });
  }

  async assignChoreToUser(choreId: string, userId: string) {
    return await prisma.choreAssignment.create({
      data: {
        choreId,
        userId,
      },
      include: {
        chore: true,
        user: true,
      },
    });
  }

  async deactivateChoreAssignments(choreId: string) {
    return await prisma.choreAssignment.updateMany({
      where: { choreId },
      data: { isActive: false },
    });
  }

  async completeChore(choreId: string, userId: string, nextDueDate: Date) {
    // Update the chore's nextDueDate instead of creating a completion record
    return await prisma.chore.update({
      where: { id: choreId },
      data: {
        nextDueDate: nextDueDate,
        lastModifiedBy: userId,
      },
    });
  }

  async getChoreCompletions(choreId: string) {
    return await prisma.choreCompletion.findMany({
      where: { choreId },
      include: {
        user: true,
      },
      orderBy: {
        completedAt: 'desc',
      },
    });
  }

  async getTodaysChores(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return await prisma.chore.findMany({
      where: {
        isActive: true,
        assignments: {
          some: {
            userId,
            isActive: true,
          },
        },
        OR: [
          {
            frequency: 'daily',
          },
          {
            frequency: 'weekly',
            completions: {
              none: {
                userId,
                completedAt: {
                  gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
                },
              },
            },
          },
        ],
      },
      include: {
        assignments: {
          where: {
            userId,
            isActive: true,
          },
          include: {
            user: true,
          },
        },
        completions: {
          where: {
            userId,
            completedAt: {
              gte: today,
            },
          },
        },
      },
    });
  }

  async updateChore(id: string, data: {
    title?: string;
    frequency?: string;
    customInterval?: number;
    assignmentType?: string;
    isActive?: boolean;
    lastModifiedBy?: string;
    assignedUserId?: string;
  }) {
    return await prisma.chore.update({
      where: { id },
      data,
      include: {
        group: true,
      },
    });
  }

  async deleteChore(id: string) {
    return await prisma.chore.delete({
      where: { id },
    });
  }
}

// Export a singleton instance
export const db = new DatabaseService();