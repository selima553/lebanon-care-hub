import { useEffect, useMemo, useRef } from 'react';
import { useAppData } from '@/context/AppContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Fix default marker icon
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const SheltersMapPage = () => {
  const { shelters } = useAppData();
  const navigate = useNavigate();
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const center = useMemo<[number, number]>(() => {
    if (shelters.length === 0) {
      return [33.8938, 35.5018];
    }

    return [
      shelters.reduce((sum, shelter) => sum + shelter.lat, 0) / shelters.length,
      shelters.reduce((sum, shelter) => sum + shelter.lng, 0) / shelters.length,
    ];
  }, [shelters]);

  useEffect(() => {
    if (!mapContainerRef.current) {
      return;
    }

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);
    }

    const map = mapRef.current;
    map.setView(center, 9);

    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    shelters.forEach((shelter) => {
      const popupContent = `
        <div style="min-width:200px; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;">
          <h3 style="margin:0 0 6px; font-size:14px; font-weight:700;">${shelter.name}</h3>
          ${shelter.description ? `<p style="margin:0 0 6px; color:#6b7280; font-size:12px;">${shelter.description}</p>` : ''}
          <p style="margin:0 0 4px; color:#6b7280; font-size:12px;">Capacity: ${shelter.capacity}</p>
          <p style="margin:0 0 8px; color:#6b7280; font-size:12px;">${shelter.address}</p>
          ${shelter.phone ? `<a href="tel:${shelter.phone}" style="font-size:12px; color:#2563eb; text-decoration:none;">Call shelter</a>` : ''}
        </div>
      `;

      L.marker([shelter.lat, shelter.lng]).addTo(map).bindPopup(popupContent);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [center, shelters]);

  return (
    <div className="px-4 py-4 max-w-lg mx-auto space-y-3">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to List
        </button>
        <span className="text-xs text-muted-foreground">{shelters.length} shelters</span>
      </div>

      <div className="rounded-xl overflow-hidden border border-border h-[calc(100vh-220px)]">
        <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
};

export default SheltersMapPage;
