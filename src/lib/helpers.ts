import { formatDistanceToNow } from 'date-fns';

export const timeAgo = (dateStr: string) => {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
};

export const generateId = () => Math.random().toString(36).substring(2, 10);
