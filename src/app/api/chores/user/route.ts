import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || (session.user as any).id;
    const groupId = searchParams.get('groupId');

    // Get user's chores
    let chores;
    
    if (groupId) {
      // Get chores for specific group
      const groupChores = await db.getChoresByGroup(groupId);
      // Filter chores assigned to the user
      chores = groupChores.filter(chore => 
        chore.assignments.some(assignment => 
          assignment.userId === userId && assignment.isActive
        )
      );
    } else {
      // Get all chores for the user across all groups
      const user = await db.getUserById(userId);
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Get chores from all user's groups
      const allChores = [];
      for (const membership of user.groupMemberships) {
        const groupChores = await db.getChoresByGroup(membership.group.id);
        const userChores = groupChores.filter(chore => 
          chore.assignments.some(assignment => 
            assignment.userId === userId && assignment.isActive
          )
        );
        allChores.push(...userChores);
      }
      chores = allChores;
    }
    
    return NextResponse.json({ chores });
  } catch (error) {
    console.error('Error fetching user chores:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
