import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2, Locate, MapPin, Navigation, Search } from 'lucide-react';
import { toast } from 'sonner';

// Fix default marker icon
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
  const [isSearching, setIsSearching] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
      },
      () => {
        toast.error('Could not get your current location');
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const searchLocation = async () => {
    const query = searchQuery.trim();
    if (!query) {
      toast.error('Please enter a location to search');
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const results = (await response.json()) as Array<{ lat: string; lon: string }>;
      const firstResult = results[0];

      if (!firstResult) {
        toast.error('No location found. Try a more specific search term.');
        return;
      }

      onLocationChange(parseFloat(firstResult.lat), parseFloat(firstResult.lon));
      toast.success('Google map location selected');
    } catch {
      toast.error('Unable to search for location right now');
    } finally {
      setIsSearching(false);
    }
  };

  const center: [number, number] = lat && lng ? [lat, lng] : defaultCenter;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">
        <Navigation className="w-3.5 h-3.5 inline mr-1" />
        Google Map Location *
      </label>

      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search location for directions"
          className="flex-1 px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button
          type="button"
          onClick={searchLocation}
          disabled={isSearching}
          className="px-3 py-2.5 rounded-xl text-sm font-medium bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center gap-1"
        >
          {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
          Search
        </button>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isLocating}
          className="flex-1 flex items-center justify-center gap-1 text-xs py-2 rounded-xl border border-border hover:bg-accent disabled:opacity-50"
        >
          <Locate className="w-3.5 h-3.5" />
          {isLocating ? 'Locating...' : 'Use My Current Location'}
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
      <p className="text-xs text-muted-foreground">Full address and Google map location can be different.</p>
    </div>
  );
};

export default LocationPicker;
