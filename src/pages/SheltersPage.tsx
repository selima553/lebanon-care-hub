import { useAppData } from '@/context/AppContext';
import ShelterCard from '@/components/ShelterCard';
import { Search, Map } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SheltersPage = () => {
  const { shelters } = useAppData();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = shelters.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 py-4 space-y-4 max-w-lg mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search shelters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <button
          onClick={() => navigate('/shelters/map')}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Map className="w-4 h-4" />
          Map
        </button>
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
