import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { joinCode } = body;

    if (!joinCode || typeof joinCode !== 'string' || joinCode.trim().length === 0) {
      return NextResponse.json(
        { error: 'Join code is required' },
        { status: 400 }
      );
    }

    // Find the group by join code
    const group = await prisma.group.findUnique({
      where: { joinCode: joinCode.trim().toUpperCase() },
      include: {
        memberships: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!group) {
      return NextResponse.json(
        { error: 'Group not found with this join code' },
        { status: 404 }
      );
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user is already a member
    const existingMembership = await prisma.groupMembership.findUnique({
      where: {
        userId_groupId: {
          userId: user.id,
          groupId: group.id,
        },
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        { error: 'You are already a member of this group' },
        { status: 400 }
      );
    }

    // Add user to the group
    await prisma.groupMembership.create({
      data: {
        userId: user.id,
        groupId: group.id,
        role: 'member',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully joined the group',
      group: {
        id: group.id,
        name: group.name,
        joinCode: group.joinCode,
      },
    });
  } catch (error) {
    console.error('Error joining group:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
