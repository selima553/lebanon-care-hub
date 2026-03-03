import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CheckCircle2, Loader2, Locate, MapPin, MapPinned, Navigation } from 'lucide-react';
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

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
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

const splitAddress = (displayName: string) => {
  const [primary, ...rest] = displayName.split(',').map((part) => part.trim());
  return {
    primary,
    secondary: rest.join(', '),
  };
};

const LocationPicker = ({ lat, lng, onLocationChange }: LocationPickerProps) => {
  const [isLocating, setIsLocating] = useState(false);
  const [locationPicked, setLocationPicked] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [skipNextSearch, setSkipNextSearch] = useState(false);
  const defaultCenter: [number, number] = [33.8938, 35.5018]; // Beirut

  useEffect(() => {
    const query = searchQuery.trim();

    if (!query) {
      setSearchResults([]);
      return;
    }

    if (skipNextSearch) {
      setSkipNextSearch(false);
      return;
    }

    const timeout = setTimeout(async () => {
      setIsSearching(true);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&countrycodes=lb&accept-language=en&q=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
          throw new Error('Search failed');
        }

        const results = (await response.json()) as SearchResult[];
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchQuery, skipNextSearch]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setLocationPicked(false);
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocationChange(pos.coords.latitude, pos.coords.longitude);
        setIsLocating(false);
        setLocationPicked(true);
        toast.success('Current location selected');

        setTimeout(() => {
          setLocationPicked(false);
        }, 2000);
      },
      () => {
        toast.error('Could not get your current location');
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleResultSelect = (result: SearchResult) => {
    onLocationChange(parseFloat(result.lat), parseFloat(result.lon));
    setSkipNextSearch(true);
    setSearchQuery(result.display_name);
    setSearchResults([]);
    setIsInputFocused(false);
    toast.success('Google map location selected');
  };

  const center: [number, number] = lat && lng ? [lat, lng] : defaultCenter;
  const showSuggestions = isInputFocused && (isSearching || searchResults.length > 0);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">
        <Navigation className="w-3.5 h-3.5 inline mr-1" />
        Google Map Location *
      </label>

      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => {
            setTimeout(() => setIsInputFocused(false), 150);
          }}
          placeholder="Search location in Lebanon for directions"
          className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />

        {showSuggestions && (
          <div className="absolute z-[1000] mt-1 w-full rounded-xl border border-border bg-card shadow-lg overflow-hidden">
            {isSearching ? (
              <p className="px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Searching in Lebanon...
              </p>
            ) : (
              searchResults.map((result) => {
                const { primary, secondary } = splitAddress(result.display_name);

                return (
                  <button
                    key={result.place_id}
                    type="button"
                    onClick={() => handleResultSelect(result)}
                    className="w-full text-left px-3 py-2.5 hover:bg-accent transition-colors border-b border-border last:border-b-0"
                  >
                    <span className="flex items-start gap-2">
                      <MapPinned className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-foreground truncate">{primary}</span>
                        {secondary && <span className="block text-xs text-muted-foreground truncate">{secondary}</span>}
                      </span>
                    </span>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isLocating}
          className={`flex-1 flex items-center justify-center gap-1 text-xs py-2 rounded-xl border transition-all disabled:opacity-70 ${
            isLocating
              ? 'bg-primary text-primary-foreground border-primary animate-pulse'
              : locationPicked
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'border-border hover:bg-accent'
          }`}
        >
          {isLocating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : locationPicked ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <Locate className="w-3.5 h-3.5" />
          )}
          {isLocating ? 'Getting your location...' : locationPicked ? 'Location Selected' : 'Use My Current Location'}
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
