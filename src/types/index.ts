import { Language } from '@/context/LanguageContext';

export type ShelterStatus = 'available' | 'limited' | 'full';

export interface Shelter {
  id: string;
  name: string;
  description?: string;
  address: string;
  phone: string;
  lat?: number;
  lng?: number;
  capacity: number | null;
  pricing: 'free' | 'paid';
  priceAmount?: number;
  creatorId?: string;
  status: ShelterStatus;
  communityStatus?: ShelterStatus;
  communityStatusComment?: string;
  communityStatusUpdatedAt?: string;
  createdAt: string;
}

export type HelpType = 'transport' | 'medicine' | 'food' | 'shelter' | 'elderly' | 'baby' | 'blood' | 'disability' | 'medical' | 'other';

export interface HelpRequest {
  id: string;
  type: HelpType;
  description?: string;
  name?: string;
  phone: string;
  lat?: number;
  lng?: number;
  address: string;
  createdAt: string;
}

export type DonationType = 'food' | 'water' | 'medicine' | 'shelter' | 'transport' | 'financial' | 'blood' | 'clothes' | 'other';

export interface Donation {
  id: string;
  type: DonationType;
  description?: string;
  isNgo: boolean;
  name?: string;
  phone: string;
  lat?: number;
  lng?: number;
  address: string;
  createdAt: string;
}

interface LocalizedLabel {
  emoji: string;
  en: string;
  ar: string;
}

export const HELP_TYPE_CONFIG: Record<HelpType, LocalizedLabel> = {
  transport: { emoji: '🚗', en: 'Transport', ar: 'نقل' },
  medicine: { emoji: '💊', en: 'Medicine', ar: 'دواء' },
  food: { emoji: '🍲', en: 'Food', ar: 'طعام' },
  shelter: { emoji: '🏠', en: 'Temporary Shelter', ar: 'مأوى مؤقت' },
  elderly: { emoji: '🧓', en: 'Elderly Assistance', ar: 'مساعدة كبار السن' },
  baby: { emoji: '🍼', en: 'Baby Supplies', ar: 'مستلزمات أطفال' },
  blood: { emoji: '🩸', en: 'Blood Request', ar: 'طلب دم' },
  disability: { emoji: '🧑‍🦽', en: 'Disability Support', ar: 'دعم ذوي الإعاقة' },
  medical: { emoji: '🏥', en: 'Medical Assistance', ar: 'مساعدة طبية' },
  other: { emoji: '📋', en: 'Other', ar: 'أخرى' },
};

export const DONATION_TYPE_CONFIG: Record<DonationType, LocalizedLabel> = {
  food: { emoji: '🍲', en: 'Food', ar: 'طعام' },
  water: { emoji: '💧', en: 'Water', ar: 'مياه' },
  medicine: { emoji: '💊', en: 'Medicine', ar: 'دواء' },
  shelter: { emoji: '🏠', en: 'Shelter Space', ar: 'مكان للإيواء' },
  transport: { emoji: '🚗', en: 'Transport', ar: 'نقل' },
  financial: { emoji: '💰', en: 'Financial Support', ar: 'دعم مالي' },
  blood: { emoji: '🩸', en: 'Blood Donation', ar: 'تبرع بالدم' },
  clothes: { emoji: '🧥', en: 'Clothes & Blankets', ar: 'ملابس وبطانيات' },
  other: { emoji: '📦', en: 'Other', ar: 'أخرى' },
};

export const SHELTER_STATUS_CONFIG: Record<ShelterStatus, { en: string; ar: string; className: string }> = {
  available: { en: 'Available', ar: 'متاح', className: 'status-available' },
  limited: { en: 'Limited', ar: 'محدود', className: 'status-limited' },
  full: { en: 'Not Available', ar: 'غير متاح', className: 'status-full' },
};

export const getLocalizedLabel = (label: { en: string; ar: string }, language: Language) =>
  language === 'ar' ? label.ar : label.en;
