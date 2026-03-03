import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '@/context/AppContext';
import { HelpType, HELP_TYPE_CONFIG } from '@/types';
import { generateId } from '@/lib/helpers';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import LocationPicker from '@/components/LocationPicker';

const RequestHelpPage = () => {
  const navigate = useNavigate();
  const { addHelpRequest } = useAppData();

  const [type, setType] = useState<HelpType>('food');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !address) {
      toast.error('Please fill in required fields');
      return;
    }
    if (!lat || !lng) {
      toast.error('Please select a location on the map');
      return;
    }
    addHelpRequest({
      id: generateId(),
      type,
      description: description || undefined,
      name: name || undefined,
      phone,
      lat,
      lng,
      address,
      createdAt: new Date().toISOString(),
    });
    toast.success('Help request posted!');
    navigate('/help');
  };

  return (
    <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
      <button onClick={() => navigate('/add')}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h2 className="text-xl font-bold text-foreground">🤝 Request Help</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Type of Help Needed *</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(HELP_TYPE_CONFIG) as HelpType[]).map((t) => (
              <button type="button" key={t} onClick={() => setType(t)}
                className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all text-left ${
                  type === t ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}>
                {HELP_TYPE_CONFIG[t].emoji} {HELP_TYPE_CONFIG[t].label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Description (optional)</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[80px]"
            placeholder="Describe what you need..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Your Name (optional)</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Leave empty for anonymous" />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Location / Address *</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Your current location" />
        </div>

        <LocationPicker lat={lat} lng={lng} onLocationChange={(newLat, newLng) => { setLat(newLat); setLng(newLng); }} />

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Phone Number *</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="+961 ..." />
        </div>

        <button type="submit"
          className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
          Post Help Request
        </button>
      </form>
    </div>
  );
};

export default RequestHelpPage;
