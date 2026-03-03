import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '@/context/AppContext';
import { ShelterStatus, SHELTER_STATUS_CONFIG } from '@/types';
import { generateId } from '@/lib/helpers';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const AddShelterPage = () => {
  const navigate = useNavigate();
  const { addShelter } = useAppData();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [capacity, setCapacity] = useState('');
  const [status, setStatus] = useState<ShelterStatus>('available');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !phone || !capacity) {
      toast.error('Please fill in all required fields');
      return;
    }
    addShelter({
      id: generateId(),
      name,
      description: description || undefined,
      address,
      phone,
      lat: 33.89 + Math.random() * 0.1,
      lng: 35.50 + Math.random() * 0.1,
      capacity: parseInt(capacity),
      status,
      createdAt: new Date().toISOString(),
    });
    toast.success('Shelter added successfully!');
    navigate('/');
  };

  return (
    <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
      <button
        onClick={() => navigate('/add')}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <h2 className="text-xl font-bold text-foreground">🏠 Add a Shelter</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Shelter name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[80px]"
            placeholder="Brief description of the shelter..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Full Address *</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Street, City, Region"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Phone Number *</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="+961 ..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Capacity *</label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Number of people"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Status *</label>
          <div className="flex gap-2">
            {(Object.keys(SHELTER_STATUS_CONFIG) as ShelterStatus[]).map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setStatus(s)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  status === s
                    ? `${SHELTER_STATUS_CONFIG[s].className} shadow-md`
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                {SHELTER_STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
        >
          Add Shelter
        </button>
      </form>
    </div>
  );
};

export default AddShelterPage;
