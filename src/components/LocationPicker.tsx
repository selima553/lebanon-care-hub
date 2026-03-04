import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Locate, MapPin, Navigation } from 'lucide-react';
import { toast } from 'sonner';

// Fix default marker icon
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface LocationPickerProps {
  lat: number | null;
  lng: number | null;
  onLocationChange: (lat: number, lng: number) => void;
}

const MapClickHandler = ({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
      toast.success('Map pin selected');
    },
  });
  return null;
};

const FlyToLocation = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 15);
  }, [lat, lng, map]);
  return null;
};

const LocationPicker = ({ lat, lng, onLocationChange }: LocationPickerProps) => {
  const [isLocating, setIsLocating] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [isCurrentLocationActive, setIsCurrentLocationActive] = useState(false);
  const currentLocationStateTimeoutRef = useRef<number | null>(null);
  const defaultCenter: [number, number] = [33.8938, 35.5018]; // Beirut

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocationChange(pos.coords.latitude, pos.coords.longitude);
        setIsLocating(false);
        setIsCurrentLocationActive(true);
        toast.success('Current location selected');

        if (currentLocationStateTimeoutRef.current) {
          window.clearTimeout(currentLocationStateTimeoutRef.current);
        }

        currentLocationStateTimeoutRef.current = window.setTimeout(() => {
          setIsCurrentLocationActive(false);
        }, 2500);
      },
      () => {
        toast.error('Could not get your current location');
        setIsLocating(false);
        setIsCurrentLocationActive(false);
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    return () => {
      if (currentLocationStateTimeoutRef.current) {
        window.clearTimeout(currentLocationStateTimeoutRef.current);
      }
    };
  }, []);

  const center: [number, number] = lat && lng ? [lat, lng] : defaultCenter;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">
        <Navigation className="w-3.5 h-3.5 inline mr-1" />
        Optional map pin
      </label>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isLocating}
          className={`flex-1 flex items-center justify-center gap-1 text-xs py-2 rounded-xl border transition-colors disabled:opacity-50 ${
            isCurrentLocationActive
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-border hover:bg-accent'
          }`}
        >
          <Locate className="w-3.5 h-3.5" />
          {isLocating ? 'Locating...' : isCurrentLocationActive ? 'Current Location Activated ✓' : 'Use My Current Location'}
        </button>

        <button
          type="button"
          onClick={() => setShowMap((prev) => !prev)}
          className="flex-1 flex items-center justify-center gap-1 text-xs py-2 rounded-xl border border-border hover:bg-accent"
        >
          <MapPin className="w-3.5 h-3.5" />
          {showMap ? 'Hide Manual Pin Map' : 'Pin Manually on Map'}
        </button>
      </div>

      {showMap && (
        <div className="rounded-xl overflow-hidden border border-border h-[220px]">
          <MapContainer
            center={center}
            zoom={lat && lng ? 15 : 9}
            style={{ height: '100%', width: '100%' }}
            attributionControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapClickHandler onLocationChange={onLocationChange} />
            {lat && lng && (
              <>
                <Marker position={[lat, lng]} />
                <FlyToLocation lat={lat} lng={lng} />
              </>
            )}
          </MapContainer>
        </div>
      )}

      {lat && lng && (
        <p className="text-xs text-muted-foreground">
          📍 Selected map coordinates: {lat.toFixed(4)}, {lng.toFixed(4)}
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        This location pin is optional. If skipped, directions will use the full address text.
      </p>
    </div>
  );
};

export default LocationPicker;
