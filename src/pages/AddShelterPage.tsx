import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppData } from '@/context/AppContext';
import { ShelterStatus, SHELTER_STATUS_CONFIG } from '@/types';
import { generateId } from '@/lib/helpers';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import LocationPicker from '@/components/LocationPicker';

const CREATOR_KEY = 'lch_creator_id';
const CREATED_SHELTERS_KEY = 'lch_created_shelter_ids';

const getCreatorId = () => {
  const existing = localStorage.getItem(CREATOR_KEY);
  if (existing) return existing;
  const generated = generateId();
  localStorage.setItem(CREATOR_KEY, generated);
  return generated;
};

const AddShelterPage = () => {
  const navigate = useNavigate();
  const { shelterId } = useParams();
  const { addShelter, shelters, updateShelter } = useAppData();

  const editingShelter = shelterId ? shelters.find((s) => s.id === shelterId) : undefined;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [capacity, setCapacity] = useState('');
  const [status, setStatus] = useState<ShelterStatus>('available');
  const [pricing, setPricing] = useState<'free' | 'paid'>('free');
  const [priceAmount, setPriceAmount] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  useEffect(() => {
    if (!editingShelter) return;
    setName(editingShelter.name);
    setDescription(editingShelter.description || '');
    setAddress(editingShelter.address);
    setPhone(editingShelter.phone);
    setCapacity(String(editingShelter.capacity));
    setStatus(editingShelter.status);
    setPricing(editingShelter.pricing || 'free');
    setPriceAmount(editingShelter.priceAmount ? String(editingShelter.priceAmount) : '');
    setLat(editingShelter.lat);
    setLng(editingShelter.lng);
  }, [editingShelter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !phone || !capacity) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (pricing === 'paid' && !priceAmount) {
      toast.error('Please add the amount for paid shelters');
      return;
    }

    if (editingShelter) {
      updateShelter(editingShelter.id, {
        name,
        description: description || undefined,
        address,
        phone,
        lat: lat ?? undefined,
        lng: lng ?? undefined,
        capacity: parseInt(capacity),
        pricing,
        priceAmount: pricing === 'paid' ? parseFloat(priceAmount) : undefined,
        status,
      });
      toast.success('Shelter updated successfully!');
      navigate('/my-shelters');
      return;
    }

    const newId = generateId();
    const creatorId = getCreatorId();
    const createdIds = JSON.parse(localStorage.getItem(CREATED_SHELTERS_KEY) || '[]') as string[];

    addShelter({
      id: newId,
      name,
      description: description || undefined,
      address,
      phone,
      lat: lat ?? undefined,
      lng: lng ?? undefined,
      capacity: parseInt(capacity),
      pricing,
      priceAmount: pricing === 'paid' ? parseFloat(priceAmount) : undefined,
      status,
      createdAt: new Date().toISOString(),
      creatorId,
    });

    localStorage.setItem(CREATED_SHELTERS_KEY, JSON.stringify([newId, ...createdIds]));

    toast.success('Shelter added successfully!');
    navigate('/');
  };

  return (
    <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
      <button
        onClick={() => navigate(editingShelter ? '/my-shelters' : '/add')}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <h2 className="text-xl font-bold text-foreground">🏠 {editingShelter ? 'Edit Shelter' : 'Add a Shelter'}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Name *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Shelter name" />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[80px]"
            placeholder="Brief description of the shelter..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Full Address Details *</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Street, building, floor, city, region" />
        </div>

        <LocationPicker lat={lat} lng={lng} onLocationChange={(newLat, newLng) => { setLat(newLat); setLng(newLng); }} />

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Phone Number *</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="+961 ..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Capacity *</label>
          <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)}
            className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Number of people" />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Pricing *</label>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setPricing('free')} className={`py-2.5 rounded-xl text-sm font-medium transition-all ${pricing === 'free' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>
              Free
            </button>
            <button type="button" onClick={() => setPricing('paid')} className={`py-2.5 rounded-xl text-sm font-medium transition-all ${pricing === 'paid' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>
              Paid
            </button>
          </div>
        </div>

        {pricing === 'paid' && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Amount *</label>
            <input type="number" min="0" step="0.01" value={priceAmount} onChange={(e) => setPriceAmount(e.target.value)}
              className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Price amount" />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Status *</label>
          <div className="flex gap-2">
            {(Object.keys(SHELTER_STATUS_CONFIG) as ShelterStatus[]).map((s) => (
              <button type="button" key={s} onClick={() => setStatus(s)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  status === s ? `${SHELTER_STATUS_CONFIG[s].className} shadow-md` : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}>
                {SHELTER_STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
        </div>

        <button type="submit"
          className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
          {editingShelter ? 'Save Shelter Changes' : 'Add Shelter'}
        </button>
      </form>
    </div>
  );
};

export default AddShelterPage;
