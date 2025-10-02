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
    const { groupId } = body;

    if (!groupId || typeof groupId !== 'string') {
      return NextResponse.json(
        { error: 'Group ID is required' },
        { status: 400 }
      );
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user is a member of the group
    const membership = await prisma.groupMembership.findUnique({
      where: {
        userId_groupId: {
          userId: user.id,
          groupId: groupId,
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: 'You are not a member of this group' },
        { status: 404 }
      );
    }

    // Get group info to check if this is the last member
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        memberships: true,
      },
    });

    if (!group) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      );
    }

    // Remove user from the group
    await prisma.groupMembership.delete({
      where: {
        userId_groupId: {
          userId: user.id,
          groupId: groupId,
        },
      },
    });

    // Check if this was the last member
    const remainingMembers = await prisma.groupMembership.count({
      where: { groupId: groupId },
    });

    let groupDeleted = false;
    if (remainingMembers === 0) {
      // Delete the group and all associated data
      await prisma.group.delete({
        where: { id: groupId },
      });
      groupDeleted = true;
    }

    return NextResponse.json({
      success: true,
      message: groupDeleted 
        ? 'You have left the group and it has been deleted since you were the last member'
        : 'Successfully left the group',
      groupDeleted,
    });
  } catch (error) {
    console.error('Error leaving group:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
