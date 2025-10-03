import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/database';

export async function GET(
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

    // Get chore by ID
    const chore = await db.getChoreById(choreId);

    if (!chore) {
      return NextResponse.json(
        { error: 'Chore not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ chore });
  } catch (error) {
    console.error('Error fetching chore:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const choreId = params.id;
    const body = await request.json();
    const { title, frequency, frequencyValue, assignmentType, isActive, assignedUserId } = body;

    if (!choreId) {
      return NextResponse.json(
        { error: 'Chore ID is required' },
        { status: 400 }
      );
    }

    // Check if chore exists
    const existingChore = await db.getChoreById(choreId);
    if (!existingChore) {
      return NextResponse.json(
        { error: 'Chore not found' },
        { status: 404 }
      );
    }

    // Update chore
    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found in session' },
        { status: 400 }
      );
    }

    const updateData: any = {
      lastModifiedBy: userId,
    };

    if (title !== undefined) updateData.title = title;
    if (frequency !== undefined) updateData.frequency = frequency;
    if (frequencyValue !== undefined) {
      updateData.customInterval = frequencyValue > 1 ? frequencyValue : null;
    }
    if (assignmentType !== undefined) updateData.assignmentType = assignmentType;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (assignedUserId !== undefined) updateData.assignedUserId = assignedUserId;

    const chore = await db.updateChore(choreId, updateData);
    
    return NextResponse.json({ 
      message: 'Chore updated successfully',
      chore
    });
  } catch (error) {
    console.error('Error updating chore:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Check if chore exists
    const existingChore = await db.getChoreById(choreId);
    if (!existingChore) {
      return NextResponse.json(
        { error: 'Chore not found' },
        { status: 404 }
      );
    }

    // Delete chore
    await db.deleteChore(choreId);
    
    return NextResponse.json({ 
      message: 'Chore deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting chore:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
