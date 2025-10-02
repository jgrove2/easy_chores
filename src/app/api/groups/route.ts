import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/database';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's groups
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      include: {
        groupMemberships: {
          include: {
            group: {
              include: {
                memberships: {
                  include: {
                    user: true,
                  },
                },
                chores: {
                  where: {
                    isActive: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const groups = user.groupMemberships.map(membership => membership.group);
    
    return NextResponse.json({ 
      success: true,
      groups,
      currentGroup: groups.length > 0 ? groups[0] : null 
    });
  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Group name is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Generate a unique join code
    const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Create new group
    const group = await prisma.group.create({
      data: {
        name: name.trim(),
        joinCode,
      },
    });

    // Add the creator as the first member with admin role
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.groupMembership.create({
      data: {
        userId: user.id,
        groupId: group.id,
        role: 'admin',
      },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Group created successfully',
      group: {
        id: group.id,
        name: group.name,
        joinCode: group.joinCode,
      }
    });
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
