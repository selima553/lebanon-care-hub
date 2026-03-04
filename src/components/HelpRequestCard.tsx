import { HelpRequest, HELP_TYPE_CONFIG } from '@/types';
import { timeAgo } from '@/lib/helpers';
import ContactButtons from './ContactButtons';
import DirectionsButton from './DirectionsButton';
import { MapPin, Clock } from 'lucide-react';

interface HelpRequestCardProps {
  request: HelpRequest;
}

const HelpRequestCard = ({ request }: HelpRequestCardProps) => {
  const config = HELP_TYPE_CONFIG[request.type];

  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{config.emoji}</span>
          <div>
            <h3 className="font-bold text-base text-card-foreground">{config.label}</h3>
            {request.name ? (
              <p className="text-sm text-muted-foreground">by {request.name}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">Anonymous</p>
            )}
          </div>
        </div>
      </div>

      {request.description && (
        <p className="text-sm text-muted-foreground">{request.description}</p>
      )}

      <div className="space-y-1.5 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{request.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>{timeAgo(request.createdAt)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ContactButtons phone={request.phone} />
        <DirectionsButton address={request.address} lat={request.lat} lng={request.lng} />
      </div>
    </div>
  );
};

export default HelpRequestCard;
