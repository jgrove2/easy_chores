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
    createdBy?: string;
  }) {
    const group = await prisma.group.create({
      data: groupData,
    });

    // Log activity if createdBy is provided
    if (groupData.createdBy) {
      await this.logActivity({
        groupId: group.id,
        userId: groupData.createdBy,
        type: 'group_created',
        description: `created group "${groupData.name}"`,
        metadata: {
          groupName: groupData.name,
          joinCode: groupData.joinCode,
        },
      });
    }

    return group;
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
    const membership = await prisma.groupMembership.create({
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

    // Log activity
    await this.logActivity({
      groupId: groupId,
      userId: userId,
      type: 'user_joined',
      description: `joined the group`,
      metadata: {
        role: role,
        groupName: membership.group.name,
      },
    });

    return membership;
  }

  async removeUserFromGroup(userId: string, groupId: string) {
    // Get user and group details for activity logging
    const membership = await prisma.groupMembership.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
      include: {
        user: true,
        group: true,
      },
    });

    if (!membership) {
      throw new Error('Membership not found');
    }

    // Log activity before deletion
    await this.logActivity({
      groupId: groupId,
      userId: userId,
      type: 'user_left',
      description: `left the group`,
      metadata: {
        role: membership.role,
        groupName: membership.group.name,
      },
    });

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
    const chore = await prisma.chore.create({
      data: choreData,
      include: {
        group: true,
        // lastModifier is not a valid relation; remove it to fix the type error
      },
    });

    // Log activity
    if (choreData.lastModifiedBy) {
      await this.logActivity({
        groupId: choreData.groupId,
        userId: choreData.lastModifiedBy,
        type: 'chore_created',
        description: `created chore "${choreData.title}"`,
        metadata: {
          choreId: chore.id,
          choreTitle: choreData.title,
        },
      });
    }

    return chore;
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
    // Get chore details for activity logging
    const chore = await prisma.chore.findUnique({
      where: { id: choreId },
      include: { group: true },
    });

    if (!chore) {
      throw new Error('Chore not found');
    }

    // Update the chore's nextDueDate instead of creating a completion record
    const updatedChore = await prisma.chore.update({
      where: { id: choreId },
      data: {
        nextDueDate: nextDueDate,
        lastModifiedBy: userId,
      },
    });

    // Log activity
    await this.logActivity({
      groupId: chore.groupId,
      userId: userId,
      type: 'chore_completed',
      description: `completed chore "${chore.title}"`,
      metadata: {
        choreId: chore.id,
        choreTitle: chore.title,
        nextDueDate: nextDueDate.toISOString(),
      },
    });

    return updatedChore;
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
    // Get original chore for activity logging
    const originalChore = await prisma.chore.findUnique({
      where: { id },
      include: { group: true },
    });

    if (!originalChore) {
      throw new Error('Chore not found');
    }

    const updatedChore = await prisma.chore.update({
      where: { id },
      data,
      include: {
        group: true,
      },
    });

    // Log activity if there's a lastModifiedBy
    if (data.lastModifiedBy) {
      await this.logActivity({
        groupId: originalChore.groupId,
        userId: data.lastModifiedBy,
        type: 'chore_updated',
        description: `updated chore "${originalChore.title}"`,
        metadata: {
          choreId: originalChore.id,
          choreTitle: originalChore.title,
          changes: data,
        },
      });
    }

    return updatedChore;
  }

  async deleteChore(id: string, userId?: string) {
    // Get chore details for activity logging
    const chore = await prisma.chore.findUnique({
      where: { id },
      include: { group: true },
    });

    if (!chore) {
      throw new Error('Chore not found');
    }

    const deletedChore = await prisma.chore.delete({
      where: { id },
    });

    // Log activity if userId is provided
    if (userId) {
      await this.logActivity({
        groupId: chore.groupId,
        userId: userId,
        type: 'chore_deleted',
        description: `deleted chore "${chore.title}"`,
        metadata: {
          choreId: chore.id,
          choreTitle: chore.title,
        },
      });
    }

    return deletedChore;
  }

  // Activity logging operations
  async logActivity(data: {
    groupId: string;
    userId: string;
    type: string;
    description: string;
    metadata?: Record<string, unknown>;
  }) {
    return await prisma.activity.create({
      data: {
        ...data,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      },
      include: {
        user: true,
        group: true,
      },
    });
  }

  async getActivitiesByGroup(groupId: string, limit: number = 50) {
    return await prisma.activity.findMany({
      where: { groupId },
      include: {
        user: true,
        group: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }
}

// Export a singleton instance
export const db = new DatabaseService();