import { Shelter, SHELTER_STATUS_CONFIG, ShelterStatus } from '@/types';
import { timeAgo } from '@/lib/helpers';
import ContactButtons from './ContactButtons';
import DirectionsButton from './DirectionsButton';
import StatusBadge from './StatusBadge';
import { MapPin, Users, Clock } from 'lucide-react';
import { useState } from 'react';
import { useAppData } from '@/context/AppContext';

interface ShelterCardProps {
  shelter: Shelter;
}

const ShelterCard = ({ shelter }: ShelterCardProps) => {
  const { updateShelterCommunityStatus } = useAppData();
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);

  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base text-card-foreground truncate">{shelter.name}</h3>
          {shelter.description && (
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{shelter.description}</p>
          )}
        </div>
        <StatusBadge status={shelter.status} />
      </div>

      <div className="space-y-1.5 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{shelter.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 shrink-0" />
          <span>Capacity: {shelter.capacity}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>Added {timeAgo(shelter.createdAt)}</span>
        </div>
      </div>

      {shelter.communityStatus && (
        <div className="bg-muted rounded-lg p-2.5 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Community update:</span>
            <StatusBadge status={shelter.communityStatus} />
          </div>
          {shelter.communityStatusUpdatedAt && (
            <p className="text-xs text-muted-foreground mt-1">
              Updated {timeAgo(shelter.communityStatusUpdatedAt)}
            </p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <ContactButtons phone={shelter.phone} />
          <DirectionsButton lat={shelter.lat} lng={shelter.lng} />
        </div>
        <button
          onClick={() => setShowStatusUpdate(!showStatusUpdate)}
          className="text-xs text-primary font-medium hover:underline"
        >
          Update Status
        </button>
      </div>

      {showStatusUpdate && (
        <div className="flex gap-2 pt-1">
          {(Object.keys(SHELTER_STATUS_CONFIG) as ShelterStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => {
                updateShelterCommunityStatus(shelter.id, s);
                setShowStatusUpdate(false);
              }}
              className={`${SHELTER_STATUS_CONFIG[s].className} px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-90 transition-opacity`}
            >
              {SHELTER_STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShelterCard;
