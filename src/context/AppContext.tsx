import React, { createContext, useContext, useEffect, useState } from 'react';
import { Shelter, HelpRequest, Donation } from '@/types';
import { mockShelters, mockHelpRequests, mockDonations } from '@/data/mockData';

interface AppContextType {
  shelters: Shelter[];
  helpRequests: HelpRequest[];
  donations: Donation[];
  addShelter: (shelter: Shelter) => void;
  updateShelter: (id: string, shelter: Omit<Shelter, 'id' | 'createdAt'>) => void;
  addHelpRequest: (req: HelpRequest) => void;
  addDonation: (donation: Donation) => void;
  updateShelterCommunityStatus: (id: string, status: Shelter['status'], comment?: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppData = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppData must be used within AppProvider');
  return ctx;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shelters, setShelters] = useState<Shelter[]>(() => {
    const saved = localStorage.getItem('lch_shelters');
    const initialShelters = saved ? JSON.parse(saved) as Shelter[] : mockShelters;
    return initialShelters.map((s) => ({ ...s, pricing: s.pricing || 'free' }));
  });
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>(mockHelpRequests);
  const [donations, setDonations] = useState<Donation[]>(mockDonations);

  const addShelter = (shelter: Shelter) => setShelters(prev => [shelter, ...prev]);
  const updateShelter = (id: string, shelter: Omit<Shelter, 'id' | 'createdAt'>) => {
    setShelters(prev => prev.map(s => (s.id === id ? { ...s, ...shelter } : s)));
  };
  const addHelpRequest = (req: HelpRequest) => setHelpRequests(prev => [req, ...prev]);
  const addDonation = (donation: Donation) => setDonations(prev => [donation, ...prev]);

  const updateShelterCommunityStatus = (id: string, status: Shelter['status'], comment?: string) => {
    setShelters(prev =>
      prev.map(s =>
        s.id === id
          ? {
              ...s,
              communityStatus: status,
              communityStatusComment: comment?.trim() || undefined,
              communityStatusUpdatedAt: new Date().toISOString(),
            }
          : s
      )
    );
  };


  useEffect(() => {
    localStorage.setItem('lch_shelters', JSON.stringify(shelters));
  }, [shelters]);

  return (
    <AppContext.Provider
      value={{ shelters, helpRequests, donations, addShelter, updateShelter, addHelpRequest, addDonation, updateShelterCommunityStatus }}
    >
      {children}
    </AppContext.Provider>
  );
};
