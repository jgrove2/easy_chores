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
    const groupId = searchParams.get('groupId');

    if (!groupId) {
      return NextResponse.json(
        { error: 'Group ID is required' },
        { status: 400 }
      );
    }

    // Get chores for the group
    const chores = await db.getChoresByGroup(groupId);
    
    return NextResponse.json({ chores });
  } catch (error) {
    console.error('Error fetching chores:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, frequency, frequencyValue, assignmentType, groupId, assignedUserId } = body;

    if (!title || !frequency || !assignmentType || !groupId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new chore
    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found in session' },
        { status: 400 }
      );
    }

    // Calculate initial next due date
    const now = new Date();
    const initialDueDate = new Date(now);
    const interval = frequencyValue > 1 ? frequencyValue : 1;

    switch (frequency) {
      case 'daily':
        initialDueDate.setDate(initialDueDate.getDate() + interval);
        break;
      case 'weekly':
        initialDueDate.setDate(initialDueDate.getDate() + (interval * 7));
        break;
      case 'monthly':
        initialDueDate.setMonth(initialDueDate.getMonth() + interval);
        break;
      default:
        initialDueDate.setDate(initialDueDate.getDate() + interval);
    }

    const choreData = {
      title,
      frequency,
      customInterval: frequencyValue > 1 ? frequencyValue : null,
      assignmentType,
      groupId,
      lastModifiedBy: userId,
      assignedUserId: assignedUserId || null,
      nextDueDate: initialDueDate,
    };

    const chore = await db.createChore(choreData);
    
    return NextResponse.json({ 
      message: 'Chore created successfully',
      chore
    });
  } catch (error) {
    console.error('Error creating chore:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
