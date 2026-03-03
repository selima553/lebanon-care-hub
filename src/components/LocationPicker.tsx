import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2, Locate, MapPin, Navigation } from 'lucide-react';
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

interface LocationSuggestion {
  title: string;
  subtitle: string;
  lat: string;
  lon: string;
  displayName: string;
}

const LEBANON_VIEWBOX = '35.1,34.7,36.7,33.0';

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

const toSuggestion = (displayName: string, lat: string, lon: string): LocationSuggestion => {
  const parts = displayName.split(',').map((part) => part.trim()).filter(Boolean);
  const title = parts[0] ?? displayName;
  const subtitle = parts.slice(1).join(', ');

  return {
    title,
    subtitle,
    lat,
    lon,
    displayName,
  };
};

const LocationPicker = ({ lat, lng, onLocationChange }: LocationPickerProps) => {
  const [isLocating, setIsLocating] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCurrentLocationActive, setIsCurrentLocationActive] = useState(false);
  const debounceRef = useRef<number | null>(null);
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
        setShowSuggestions(false);
        setSuggestions([]);
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
    const query = searchQuery.trim();

    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    if (query.length < 2) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      return;
    }

    debounceRef.current = window.setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&countrycodes=lb&bounded=1&viewbox=${LEBANON_VIEWBOX}&q=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
          throw new Error('Autocomplete failed');
        }

        const results = (await response.json()) as Array<{ display_name: string; lat: string; lon: string }>;
        const uniqueByDisplayName = new Map<string, LocationSuggestion>();

        results.forEach((result) => {
          if (!uniqueByDisplayName.has(result.display_name)) {
            uniqueByDisplayName.set(result.display_name, toSuggestion(result.display_name, result.lat, result.lon));
          }
        });

        setSuggestions(Array.from(uniqueByDisplayName.values()));
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 250);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery]);

  useEffect(() => {
    return () => {
      if (currentLocationStateTimeoutRef.current) {
        window.clearTimeout(currentLocationStateTimeoutRef.current);
      }
    };
  }, []);

  const selectSuggestion = (suggestion: LocationSuggestion) => {
    setSearchQuery(suggestion.displayName);
    setShowSuggestions(false);
    setSuggestions([]);
    setIsCurrentLocationActive(false);
    onLocationChange(parseFloat(suggestion.lat), parseFloat(suggestion.lon));
    toast.success('Location selected');
  };

  const center: [number, number] = lat && lng ? [lat, lng] : defaultCenter;

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
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
            setIsCurrentLocationActive(false);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            window.setTimeout(() => {
              setShowSuggestions(false);
            }, 120);
          }}
          placeholder="Search in Lebanon (city, street, area...)"
          className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />

        {showSuggestions && (searchQuery.trim().length >= 2 || isLoadingSuggestions) && (
          <div className="absolute z-[1200] mt-1 w-full rounded-xl border border-border bg-card shadow-lg overflow-hidden">
            {isLoadingSuggestions ? (
              <div className="px-3 py-2 text-sm text-muted-foreground inline-flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Searching Lebanon locations...
              </div>
            ) : suggestions.length > 0 ? (
              <ul className="max-h-60 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <li key={`${suggestion.lat}-${suggestion.lon}-${suggestion.displayName}`}>
                    <button
                      type="button"
                      onMouseDown={() => selectSuggestion(suggestion)}
                      className="w-full text-left px-3 py-2 hover:bg-accent"
                    >
                      <p className="text-sm text-foreground leading-tight">{suggestion.title}</p>
                      {suggestion.subtitle && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{suggestion.subtitle}</p>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground">No Lebanon locations found.</div>
            )}
          </div>
        )}
      </div>

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
      <p className="text-xs text-muted-foreground">Full address and Google map location can be different.</p>
    </div>
  );
};

export default LocationPicker;
