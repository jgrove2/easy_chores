'use client';

interface ChoreCardProps {
  chore: {
    id: string;
    title: string;
    frequency: string;
    customInterval?: number;
    assignmentType: string;
    isActive: boolean;
    nextDueDate?: Date;
    isCompleted?: boolean;
    createdAt?: Date;
    assignedUser?: {
      id: string;
      name: string;
      email: string;
    };
  };
  onComplete?: (choreId: string) => void;
  isCompleting?: boolean;
}

export default function ChoreCard({ chore, onComplete, isCompleting = false }: ChoreCardProps) {
  // Get the next due date from the chore
  const getNextDueDate = () => {
    if (chore.nextDueDate) {
      return new Date(chore.nextDueDate);
    }
    
    // If no nextDueDate is set, calculate it from creation date
    const now = new Date();
    const baseDate = new Date(chore.createdAt || now);
    const nextDue = new Date(baseDate);
    const interval = chore.customInterval || 1;
    
    switch (chore.frequency) {
      case 'daily':
        nextDue.setDate(nextDue.getDate() + interval);
        break;
      case 'weekly':
        nextDue.setDate(nextDue.getDate() + (interval * 7));
        break;
      case 'monthly':
        nextDue.setMonth(nextDue.getMonth() + interval);
        break;
      default:
        nextDue.setDate(nextDue.getDate() + interval);
    }
    
    return nextDue;
  };

  const getDueDateInfo = () => {
    const nextDue = getNextDueDate();
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayStr = today.toDateString();
    const tomorrowStr = tomorrow.toDateString();
    const dueStr = nextDue.toDateString();
    
    if (dueStr === todayStr) {
      return { text: 'Today', days: 0, status: 'today' };
    } else if (dueStr === tomorrowStr) {
      return { text: 'Tomorrow', days: 1, status: 'tomorrow' };
    } else {
      const diffTime = nextDue.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { text: `${diffDays} days`, days: diffDays, status: 'future' };
    }
  };

  const getFrequencyText = () => {
    if (chore.customInterval && chore.customInterval > 1) {
      return `Every ${chore.customInterval} ${chore.frequency === 'daily' ? 'days' : chore.frequency === 'weekly' ? 'weeks' : 'months'}`;
    }
    return chore.frequency.charAt(0).toUpperCase() + chore.frequency.slice(1);
  };

  const getAssignmentText = () => {
    return chore.assignmentType === 'single' ? 'Single person' : 'Alternating';
  };

  const getAssignedUserDisplay = () => {
    if (!chore.assignedUser) {
      return 'Unassigned';
    }
    
    return chore.assignedUser.name || 'Unknown';
  };

  const getStatusColor = () => {
    if (chore.isCompleted) {
      return 'bg-green-50 border-green-200';
    }
    
    const dueInfo = getDueDateInfo();
    
    switch (dueInfo.status) {
      case 'today':
        return 'bg-yellow-50 border-yellow-300';
      case 'tomorrow':
        return 'bg-orange-50 border-orange-300';
      case 'future':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getStatusText = () => {
    if (chore.isCompleted) {
      return 'Completed';
    }
    
    const dueInfo = getDueDateInfo();
    return dueInfo.text;
  };

  const getStatusTextColor = () => {
    if (chore.isCompleted) {
      return 'bg-green-100 text-green-800';
    }
    
    const dueInfo = getDueDateInfo();
    
    switch (dueInfo.status) {
      case 'today':
        return 'bg-yellow-100 text-yellow-800';
      case 'tomorrow':
        return 'bg-orange-100 text-orange-800';
      case 'future':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getStatusColor()} transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{chore.title}</h3>
          <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
            <span className="px-2 py-1 bg-white rounded-md">
              {getFrequencyText()}
            </span>
            <span className="px-2 py-1 bg-white rounded-md">
              {getAssignmentText()}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">
              Due: {getStatusText()}
            </p>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium">Assigned to:</span>
              <span className="ml-1 text-gray-700">{getAssignedUserDisplay()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusTextColor()}`}>
            {getStatusText()}
          </span>
          
          <div className="flex space-x-2">
            {!chore.isCompleted && onComplete && (
              <button
                onClick={() => onComplete(chore.id)}
                disabled={isCompleting}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  isCompleting
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isCompleting ? 'Completing...' : 'Complete'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
