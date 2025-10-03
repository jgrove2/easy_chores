import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's group
    const user = await db.getUserById(session.user.id);
    if (!user || !user.groupMemberships.length) {
      return NextResponse.json({ error: 'User not in a group' }, { status: 400 });
    }

    const groupId = user.groupMemberships[0].groupId;
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50');

    // Get activities for the group
    const activities = await db.getActivitiesByGroup(groupId, limit);

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}
