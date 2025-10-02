export interface ValidationError {
  field: string;
  message: string;
}

export function validateChoreTitle(title: string): ValidationError | null {
  if (!title || title.trim().length === 0) {
    return { field: 'title', message: 'Chore title is required' };
  }
  
  if (title.length > 100) {
    return { field: 'title', message: 'Chore title must be less than 100 characters' };
  }
  
  return null;
}

export function validateGroupName(name: string): ValidationError | null {
  if (!name || name.trim().length === 0) {
    return { field: 'name', message: 'Group name is required' };
  }
  
  if (name.length > 50) {
    return { field: 'name', message: 'Group name must be less than 50 characters' };
  }
  return null;
}

export function validateJoinCode(code: string): ValidationError | null {
  if (!code || code.trim().length === 0) {
    return { field: 'joinCode', message: 'Join code is required' };
  }
  
  if (code.length !== 6) {
    return { field: 'joinCode', message: 'Join code must be 6 characters' };
  }
  
  return null;
}

export function validateCustomInterval(interval: number): ValidationError | null {
  if (interval < 1) {
    return { field: 'customInterval', message: 'Custom interval must be at least 1 day' };
  }
  
  if (interval > 365) {
    return { field: 'customInterval', message: 'Custom interval must be less than 365 days' };
  }
  
  return null;
}
