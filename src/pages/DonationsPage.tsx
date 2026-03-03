import { useAppData } from '@/context/AppContext';
import DonationCard from '@/components/DonationCard';
import { DONATION_TYPE_CONFIG, DonationType } from '@/types';
import { useState } from 'react';

const DonationsPage = () => {
  const { donations } = useAppData();
  const [filter, setFilter] = useState<DonationType | 'all'>('all');
  const [orgFilter, setOrgFilter] = useState<'all' | 'ngo' | 'personal'>('all');

  let filtered = filter === 'all'
    ? donations
    : donations.filter((d) => d.type === filter);

  if (orgFilter !== 'all') {
    filtered = filtered.filter((d) => orgFilter === 'ngo' ? d.isNgo : !d.isNgo);
  }

  return (
    <div className="px-4 py-4 space-y-4 max-w-lg mx-auto">
      <h2 className="text-lg font-bold text-foreground">Donations Offered</h2>

      {/* Type filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
        <button
          onClick={() => setFilter('all')}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            filter === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-accent'
          }`}
        >
          All
        </button>
        {(Object.keys(DONATION_TYPE_CONFIG) as DonationType[]).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === type
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            {DONATION_TYPE_CONFIG[type].emoji} {DONATION_TYPE_CONFIG[type].label}
          </button>
        ))}
      </div>

      {/* Org filter */}
      <div className="flex gap-2">
        {(['all', 'ngo', 'personal'] as const).map((o) => (
          <button
            key={o}
            onClick={() => setOrgFilter(o)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              orgFilter === o
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            {o === 'all' ? 'All Sources' : o === 'ngo' ? 'NGO' : 'Personal'}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} donation{filtered.length !== 1 ? 's' : ''}</p>

      <div className="space-y-3">
        {filtered.map((donation) => (
          <DonationCard key={donation.id} donation={donation} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">No donations found</p>
        </div>
      )}
    </div>
  );
};

export default DonationsPage;
