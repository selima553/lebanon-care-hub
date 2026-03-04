import { Donation, DONATION_TYPE_CONFIG } from '@/types';
import { timeAgo } from '@/lib/helpers';
import ContactButtons from './ContactButtons';
import DirectionsButton from './DirectionsButton';
import { MapPin, Clock } from 'lucide-react';

interface DonationCardProps {
  donation: Donation;
}

const DonationCard = ({ donation }: DonationCardProps) => {
  const config = DONATION_TYPE_CONFIG[donation.type];

  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{config.emoji}</span>
          <div>
            <h3 className="font-bold text-base text-card-foreground">{config.label}</h3>
            {donation.name && (
              <p className="text-sm text-muted-foreground">{donation.name}</p>
            )}
          </div>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${donation.isNgo ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
          {donation.isNgo ? 'NGO' : 'Personal'}
        </span>
      </div>

      {donation.description && (
        <p className="text-sm text-muted-foreground">{donation.description}</p>
      )}

      <div className="space-y-1.5 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{donation.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>{timeAgo(donation.createdAt)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ContactButtons phone={donation.phone} />
        <DirectionsButton address={donation.address} lat={donation.lat} lng={donation.lng} />
      </div>
    </div>
  );
};

export default DonationCard;
