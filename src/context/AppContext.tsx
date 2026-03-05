import React, { createContext, useContext, useEffect, useState } from 'react';
import { Shelter, HelpRequest, Donation } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface AppContextType {
  shelters: Shelter[];
  helpRequests: HelpRequest[];
  donations: Donation[];
  isDataLoading: boolean;
  addShelter: (shelter: Shelter) => Promise<boolean>;
  updateShelter: (id: string, shelter: Omit<Shelter, 'id' | 'createdAt'>) => Promise<boolean>;
  addHelpRequest: (req: HelpRequest) => Promise<boolean>;
  addDonation: (donation: Donation) => Promise<boolean>;
  updateShelterCommunityStatus: (id: string, status: Shelter['status'], comment?: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppData = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppData must be used within AppProvider');
  return ctx;
};

const normalizeShelter = (row: any): Shelter => ({
  id: row.id,
  name: row.name,
  description: row.description || undefined,
  address: row.address,
  phone: row.phone,
  lat: row.lat ?? undefined,
  lng: row.lng ?? undefined,
  capacity: row.capacity ?? null,
  pricing: row.pricing,
  priceAmount: row.price_amount ?? undefined,
  creatorId: row.creator_id ?? undefined,
  status: row.status,
  communityStatus: row.community_status ?? undefined,
  communityStatusComment: row.community_status_comment ?? undefined,
  communityStatusUpdatedAt: row.community_status_updated_at ?? undefined,
  createdAt: row.created_at,
});

const normalizeHelpRequest = (row: any): HelpRequest => ({
  id: row.id,
  type: row.type,
  description: row.description || undefined,
  name: row.name || undefined,
  phone: row.phone,
  lat: row.lat ?? undefined,
  lng: row.lng ?? undefined,
  address: row.address,
  createdAt: row.created_at,
});

const normalizeDonation = (row: any): Donation => ({
  id: row.id,
  type: row.type,
  description: row.description || undefined,
  isNgo: row.is_ngo,
  name: row.name || undefined,
  phone: row.phone,
  lat: row.lat ?? undefined,
  lng: row.lng ?? undefined,
  address: row.address,
  createdAt: row.created_at,
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [sheltersRes, helpRes, donationRes] = await Promise.all([
        supabase.from('shelters').select('*').order('created_at', { ascending: false }),
        supabase.from('help_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('donations').select('*').order('created_at', { ascending: false }),
      ]);

      if (!sheltersRes.error && sheltersRes.data) {
        setShelters(sheltersRes.data.map(normalizeShelter));
      }

      if (!helpRes.error && helpRes.data) {
        setHelpRequests(helpRes.data.map(normalizeHelpRequest));
      }

        if (!donationRes.error && donationRes.data) {
          setDonations(donationRes.data.map(normalizeDonation));
        }
      } finally {
        setIsDataLoading(false);
      }
    };

    loadData();
  }, []);

  const addShelter = async (shelter: Shelter) => {
    const payload = {
      id: shelter.id,
      name: shelter.name,
      description: shelter.description ?? null,
      address: shelter.address,
      phone: shelter.phone,
      lat: shelter.lat ?? null,
      lng: shelter.lng ?? null,
      capacity: shelter.capacity,
      pricing: shelter.pricing,
      price_amount: shelter.priceAmount ?? null,
      creator_id: shelter.creatorId ?? null,
      status: shelter.status,
      community_status: shelter.communityStatus ?? null,
      community_status_comment: shelter.communityStatusComment ?? null,
      community_status_updated_at: shelter.communityStatusUpdatedAt ?? null,
      created_at: shelter.createdAt,
    };

    const { data, error } = await supabase.from('shelters').insert(payload).select().single();
    if (error || !data) return false;

    setShelters(prev => [normalizeShelter(data), ...prev]);
    return true;
  };

  const updateShelter = async (id: string, shelter: Omit<Shelter, 'id' | 'createdAt'>) => {
    const payload = {
      name: shelter.name,
      description: shelter.description ?? null,
      address: shelter.address,
      phone: shelter.phone,
      lat: shelter.lat ?? null,
      lng: shelter.lng ?? null,
      capacity: shelter.capacity,
      pricing: shelter.pricing,
      price_amount: shelter.priceAmount ?? null,
      creator_id: shelter.creatorId ?? null,
      status: shelter.status,
      community_status: shelter.communityStatus ?? null,
      community_status_comment: shelter.communityStatusComment ?? null,
      community_status_updated_at: shelter.communityStatusUpdatedAt ?? null,
    };

    const { data, error } = await supabase.from('shelters').update(payload).eq('id', id).select().single();
    if (error || !data) return false;

    const normalized = normalizeShelter(data);
    setShelters(prev => prev.map(s => (s.id === id ? normalized : s)));
    return true;
  };

  const addHelpRequest = async (req: HelpRequest) => {
    const payload = {
      id: req.id,
      type: req.type,
      description: req.description ?? null,
      name: req.name ?? null,
      phone: req.phone,
      lat: req.lat ?? null,
      lng: req.lng ?? null,
      address: req.address,
      created_at: req.createdAt,
    };

    const { data, error } = await supabase.from('help_requests').insert(payload).select().single();
    if (error || !data) return false;

    setHelpRequests(prev => [normalizeHelpRequest(data), ...prev]);
    return true;
  };

  const addDonation = async (donation: Donation) => {
    const payload = {
      id: donation.id,
      type: donation.type,
      description: donation.description ?? null,
      is_ngo: donation.isNgo,
      name: donation.name ?? null,
      phone: donation.phone,
      lat: donation.lat ?? null,
      lng: donation.lng ?? null,
      address: donation.address,
      created_at: donation.createdAt,
    };

    const { data, error } = await supabase.from('donations').insert(payload).select().single();
    if (error || !data) return false;

    setDonations(prev => [normalizeDonation(data), ...prev]);
    return true;
  };

  const updateShelterCommunityStatus = async (id: string, status: Shelter['status'], comment?: string) => {
    const updatedAt = new Date().toISOString();

    const { data, error } = await supabase
      .from('shelters')
      .update({
        community_status: status,
        community_status_comment: comment?.trim() || null,
        community_status_updated_at: updatedAt,
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return false;

    const normalized = normalizeShelter(data);
    setShelters(prev => prev.map(s => (s.id === id ? normalized : s)));
    return true;
  };

  return (
    <AppContext.Provider
      value={{ shelters, helpRequests, donations, isDataLoading, addShelter, updateShelter, addHelpRequest, addDonation, updateShelterCommunityStatus }}
    >
      {children}
    </AppContext.Provider>
  );
};
