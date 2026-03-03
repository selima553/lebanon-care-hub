import { useAppData } from '@/context/AppContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import StatusBadge from '@/components/StatusBadge';
import ContactButtons from '@/components/ContactButtons';
import DirectionsButton from '@/components/DirectionsButton';
import { Users } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const SheltersMapPage = () => {
  const { shelters } = useAppData();
  const navigate = useNavigate();

  const center: [number, number] = shelters.length > 0
    ? [shelters.reduce((s, sh) => s + sh.lat, 0) / shelters.length, shelters.reduce((s, sh) => s + sh.lng, 0) / shelters.length]
    : [33.8938, 35.5018];

  return (
    <div className="px-4 py-4 max-w-lg mx-auto space-y-3">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to List
        </button>
        <span className="text-xs text-muted-foreground">{shelters.length} shelters</span>
      </div>

      <div className="rounded-xl overflow-hidden border border-border h-[calc(100vh-220px)]">
        <MapContainer center={center} zoom={9} style={{ height: '100%', width: '100%' }} attributionControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {shelters.map((shelter) => (
            <Marker key={shelter.id} position={[shelter.lat, shelter.lng]}>
              <Popup>
                <div className="space-y-2 min-w-[200px]">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm">{shelter.name}</h3>
                    <StatusBadge status={shelter.communityStatus || shelter.status} />
                  </div>
                  {shelter.description && <p className="text-xs text-muted-foreground">{shelter.description}</p>}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>Capacity: {shelter.capacity}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{shelter.address}</p>
                  <div className="flex items-center gap-1 flex-wrap">
                    <ContactButtons phone={shelter.phone} />
                    <DirectionsButton lat={shelter.lat} lng={shelter.lng} />
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default SheltersMapPage;
