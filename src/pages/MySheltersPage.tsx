import ShelterCard from '@/components/ShelterCard';
import { useAppData } from '@/context/AppContext';
import { ArrowLeft } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const CREATED_SHELTERS_KEY = 'lch_created_shelter_ids';

const MySheltersPage = () => {
  const navigate = useNavigate();
  const { shelters } = useAppData();

  const createdShelterIds = useMemo(() => JSON.parse(localStorage.getItem(CREATED_SHELTERS_KEY) || '[]') as string[], []);
  const myShelters = shelters.filter((s) => createdShelterIds.includes(s.id));

  return (
    <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
      <button
        onClick={() => navigate('/add')}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <h2 className="text-xl font-bold text-foreground">My Shelter Places</h2>
      <p className="text-sm text-muted-foreground">Edit the shelters you added from this device.</p>

      <div className="space-y-3">
        {myShelters.map((shelter) => (
          <ShelterCard key={shelter.id} shelter={shelter} showEdit />
        ))}
      </div>

      {myShelters.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">No shelters added yet</p>
          <p className="text-sm mt-1">Add a shelter first, then you can edit it here.</p>
        </div>
      )}
    </div>
  );
};

export default MySheltersPage;
