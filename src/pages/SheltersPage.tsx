import { useAppData } from '@/context/AppContext';
import ShelterCard from '@/components/ShelterCard';
import { Search } from 'lucide-react';
import { useState } from 'react';

const SheltersPage = () => {
  const { shelters } = useAppData();
  const [search, setSearch] = useState('');

  const filtered = shelters.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 py-4 space-y-4 max-w-lg mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search shelters by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} shelter{filtered.length !== 1 ? 's' : ''} found</p>

      <div className="space-y-3">
        {filtered.map((shelter) => (
          <ShelterCard key={shelter.id} shelter={shelter} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">No shelters found</p>
          <p className="text-sm mt-1">Try a different search or add a new shelter</p>
        </div>
      )}
    </div>
  );
};

export default SheltersPage;
