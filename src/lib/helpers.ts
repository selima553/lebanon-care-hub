import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { Language } from '@/context/LanguageContext';

export const timeAgo = (dateStr: string, language: Language = 'en') => {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: language === 'ar' ? ar : enUS });
};

export const generateId = () => Math.random().toString(36).substring(2, 10);
