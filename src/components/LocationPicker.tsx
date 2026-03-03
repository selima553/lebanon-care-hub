import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Locate } from 'lucide-react';

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
  const defaultCenter: [number, number] = [33.8938, 35.5018]; // Beirut

  const getCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocationChange(pos.coords.latitude, pos.coords.longitude);
        setIsLocating(false);
      },
      () => setIsLocating(false),
      { enableHighAccuracy: true }
    );
  };

  const center: [number, number] = lat && lng ? [lat, lng] : defaultCenter;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-foreground">
          <MapPin className="w-3.5 h-3.5 inline mr-1" />
          Pin Location on Map
        </label>
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isLocating}
          className="flex items-center gap-1 text-xs text-primary font-medium hover:underline disabled:opacity-50"
        >
          <Locate className="w-3.5 h-3.5" />
          {isLocating ? 'Locating...' : 'Use My Location'}
        </button>
      </div>
      <div className="rounded-xl overflow-hidden border border-border h-[200px]">
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
      {lat && lng && (
        <p className="text-xs text-muted-foreground">
          📍 {lat.toFixed(4)}, {lng.toFixed(4)}
        </p>
      )}
    </div>
  );
};

export default LocationPicker;
