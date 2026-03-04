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

export type HelpType =
  | 'transport'
  | 'medicine'
  | 'food'
  | 'shelter'
  | 'elderly'
  | 'baby'
  | 'blood'
  | 'disability'
  | 'medical'
  | 'other';

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

export type DonationType =
  | 'food'
  | 'water'
  | 'medicine'
  | 'shelter'
  | 'transport'
  | 'financial'
  | 'blood'
  | 'clothes'
  | 'other';

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

export const HELP_TYPE_CONFIG: Record<HelpType, { emoji: string; label: string }> = {
  transport: { emoji: '🚗', label: 'Transport' },
  medicine: { emoji: '💊', label: 'Medicine' },
  food: { emoji: '🍲', label: 'Food' },
  shelter: { emoji: '🏠', label: 'Temporary Shelter' },
  elderly: { emoji: '🧓', label: 'Elderly Assistance' },
  baby: { emoji: '🍼', label: 'Baby Supplies' },
  blood: { emoji: '🩸', label: 'Blood Request' },
  disability: { emoji: '🧑‍🦽', label: 'Disability Support' },
  medical: { emoji: '🏥', label: 'Medical Assistance' },
  other: { emoji: '📋', label: 'Other' },
};

export const DONATION_TYPE_CONFIG: Record<DonationType, { emoji: string; label: string }> = {
  food: { emoji: '🍲', label: 'Food' },
  water: { emoji: '💧', label: 'Water' },
  medicine: { emoji: '💊', label: 'Medicine' },
  shelter: { emoji: '🏠', label: 'Shelter Space' },
  transport: { emoji: '🚗', label: 'Transport' },
  financial: { emoji: '💰', label: 'Financial Support' },
  blood: { emoji: '🩸', label: 'Blood Donation' },
  clothes: { emoji: '🧥', label: 'Clothes & Blankets' },
  other: { emoji: '📦', label: 'Other' },
};

export const SHELTER_STATUS_CONFIG: Record<ShelterStatus, { label: string; className: string }> = {
  available: { label: 'Available', className: 'status-available' },
  limited: { label: 'Limited', className: 'status-limited' },
  full: { label: 'Not Available', className: 'status-full' },
};
