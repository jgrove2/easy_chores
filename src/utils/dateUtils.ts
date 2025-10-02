export function formatDueDate(date: Date): string {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else if (diffDays === -1) {
    return 'Yesterday';
  } else if (diffDays > 1) {
    return `In ${diffDays} days`;
  } else {
    return `${Math.abs(diffDays)} days ago`;
  }
}

export function calculateNextDueDate(
  frequency: 'daily' | 'weekly' | 'custom',
  customInterval?: number,
  lastCompleted?: Date
): Date {
  const baseDate = lastCompleted || new Date();
  const nextDate = new Date(baseDate);

  switch (frequency) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'custom':
      if (customInterval) {
        nextDate.setDate(nextDate.getDate() + customInterval);
      }
      break;
  }

  return nextDate;
}

export function isOverdue(dueDate: Date): boolean {
  return dueDate < new Date();
}

export function isDueToday(dueDate: Date): boolean {
  const today = new Date();
  return (
    dueDate.getDate() === today.getDate() &&
    dueDate.getMonth() === today.getMonth() &&
    dueDate.getFullYear() === today.getFullYear()
  );
}
