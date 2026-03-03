import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '@/context/AppContext';
import { DonationType, DONATION_TYPE_CONFIG } from '@/types';
import { generateId } from '@/lib/helpers';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const ShareDonationPage = () => {
  const navigate = useNavigate();
  const { addDonation } = useAppData();

  const [type, setType] = useState<DonationType>('food');
  const [isNgo, setIsNgo] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !address) {
      toast.error('Please fill in required fields');
      return;
    }
    addDonation({
      id: generateId(),
      type,
      isNgo,
      name: name || undefined,
      phone,
      lat: 33.89 + Math.random() * 0.1,
      lng: 35.50 + Math.random() * 0.1,
      address,
      createdAt: new Date().toISOString(),
    });
    toast.success('Donation offer posted!');
    navigate('/donations');
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

      <h2 className="text-xl font-bold text-foreground">💝 Share a Donation</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Donation Type *</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(DONATION_TYPE_CONFIG) as DonationType[]).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setType(t)}
                className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all text-left ${
                  type === t
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                {DONATION_TYPE_CONFIG[t].emoji} {DONATION_TYPE_CONFIG[t].label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Are you an NGO or Personal?</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsNgo(false)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                !isNgo ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground'
              }`}
            >
              Personal
            </button>
            <button
              type="button"
              onClick={() => setIsNgo(true)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isNgo ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground'
              }`}
            >
              NGO
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Name (optional)</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Your name or organization"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Location / Address *</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Pickup or delivery location"
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

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
        >
          Post Donation
        </button>
      </form>
    </div>
  );
};

export default ShareDonationPage;
