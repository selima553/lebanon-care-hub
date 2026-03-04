import { Navigation } from 'lucide-react';

interface DirectionsButtonProps {
  address: string;
  lat?: number;
  lng?: number;
}

const DirectionsButton = ({ address, lat, lng }: DirectionsButtonProps) => {
  const hasCoordinates = typeof lat === 'number' && typeof lng === 'number';
  const url = hasCoordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 bg-accent text-accent-foreground px-3 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
    >
      <Navigation className="w-3.5 h-3.5" />
      Directions
    </a>
  );
};

export default DirectionsButton;
