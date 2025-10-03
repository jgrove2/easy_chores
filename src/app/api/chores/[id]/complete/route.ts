import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/database';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const choreId = params.id;

    if (!choreId) {
      return NextResponse.json(
        { error: 'Chore ID is required' },
        { status: 400 }
      );
    }

    // Get the chore to check if it exists and get its details
    const chore = await db.getChoreById(choreId);
    if (!chore) {
      return NextResponse.json(
        { error: 'Chore not found' },
        { status: 404 }
      );
    }

    // Calculate next due date based on frequency
    const now = new Date();
    const nextDueDate = new Date(now);
    const interval = chore.customInterval || 1;

    switch (chore.frequency) {
      case 'daily':
        nextDueDate.setDate(nextDueDate.getDate() + interval);
        break;
      case 'weekly':
        nextDueDate.setDate(nextDueDate.getDate() + (interval * 7));
        break;
      case 'monthly':
        nextDueDate.setMonth(nextDueDate.getMonth() + interval);
        break;
      default:
        // Custom interval in days
        nextDueDate.setDate(nextDueDate.getDate() + interval);
    }

    // Complete the chore
    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found in session' },
        { status: 400 }
      );
    }

    const completion = await db.completeChore(
      choreId,
      userId,
      nextDueDate
    );

    return NextResponse.json({ 
      message: 'Chore completed successfully',
      completion,
      nextDueDate
    });
  } catch (error) {
    console.error('Error completing chore:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
