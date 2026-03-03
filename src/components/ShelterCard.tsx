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
  const [statusComment, setStatusComment] = useState('');

  const handleStatusUpdate = (status: ShelterStatus) => {
    updateShelterCommunityStatus(shelter.id, status, statusComment);
    setShowStatusUpdate(false);
    setStatusComment('');
  };

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
        <div className="bg-muted rounded-lg p-2.5 text-sm space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Community update:</span>
            <StatusBadge status={shelter.communityStatus} />
          </div>
          {shelter.communityStatusComment && (
            <p className="text-xs text-card-foreground">{shelter.communityStatusComment}</p>
          )}
          {shelter.communityStatusUpdatedAt && (
            <p className="text-xs text-muted-foreground">
              Updated {timeAgo(shelter.communityStatusUpdatedAt)}
            </p>
          )}
        </div>
      )}

      <div className="pt-1 space-y-2">
        <div className="flex items-center gap-2">
          <ContactButtons phone={shelter.phone} />
          <DirectionsButton lat={shelter.lat} lng={shelter.lng} />
        </div>
        <button
          onClick={() => setShowStatusUpdate(!showStatusUpdate)}
          className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-card-foreground hover:bg-accent"
        >
          Update Status
        </button>
      </div>

      {showStatusUpdate && (
        <div className="space-y-2 pt-1">
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(SHELTER_STATUS_CONFIG) as ShelterStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => handleStatusUpdate(s)}
                className={`${SHELTER_STATUS_CONFIG[s].className} px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-90 transition-opacity`}
              >
                {SHELTER_STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
          <div className="space-y-1">
            <label htmlFor={`status-comment-${shelter.id}`} className="text-xs text-muted-foreground">
              Add comment (optional)
            </label>
            <textarea
              id={`status-comment-${shelter.id}`}
              value={statusComment}
              onChange={(e) => setStatusComment(e.target.value)}
              placeholder="Share additional details"
              className="w-full min-h-20 rounded-lg border border-border bg-background px-2.5 py-2 text-xs text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShelterCard;
