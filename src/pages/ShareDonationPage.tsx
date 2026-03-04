import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '@/context/AppContext';
import { DonationType, DONATION_TYPE_CONFIG, getLocalizedLabel } from '@/types';
import { generateId } from '@/lib/helpers';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import LocationPicker from '@/components/LocationPicker';
import { useLanguage } from '@/context/LanguageContext';

const ShareDonationPage = () => {
  const navigate = useNavigate();
  const { addDonation } = useAppData();
  const { language, isArabic } = useLanguage();
  const [type, setType] = useState<DonationType>('food');
  const [description, setDescription] = useState('');
  const [isNgo, setIsNgo] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !address) return toast.error(isArabic ? 'يرجى تعبئة الحقول المطلوبة' : 'Please fill in required fields');
    const created = await addDonation({ id: generateId(), type, description: description || undefined, isNgo, name: name || undefined, phone, lat: lat ?? undefined, lng: lng ?? undefined, address, createdAt: new Date().toISOString() });
    if (!created) return toast.error(isArabic ? 'تعذر نشر التبرع. حاول مرة أخرى.' : 'Could not post donation. Please try again.');
    toast.success(isArabic ? 'تم نشر عرض التبرع!' : 'Donation offer posted!');
    navigate('/donations');
  };

  return (
    <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
      <button onClick={() => navigate('/add')} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft className="w-4 h-4" /> {isArabic ? 'رجوع' : 'Back'}</button>
      <h2 className="text-xl font-bold text-foreground">💝 {isArabic ? 'مشاركة تبرع' : 'Share a Donation'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className="block text-sm font-medium text-foreground mb-2">{isArabic ? 'نوع التبرع' : 'Donation Type'} *</label><div className="grid grid-cols-2 gap-2">{(Object.keys(DONATION_TYPE_CONFIG) as DonationType[]).map((t) => <button type="button" key={t} onClick={() => setType(t)} className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all text-left ${type === t ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>{DONATION_TYPE_CONFIG[t].emoji} {getLocalizedLabel(DONATION_TYPE_CONFIG[t], language)}</button>)}</div></div>
        <div><label className="block text-sm font-medium text-foreground mb-1">{isArabic ? 'الوصف (اختياري)' : 'Description (optional)'}</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[80px]" placeholder={isArabic ? 'صف التبرع...' : 'Describe the donation...'} /></div>
        <div><label className="block text-sm font-medium text-foreground mb-2">{isArabic ? 'هل أنت جهة/منظمة أم فرد؟' : 'Are you an NGO or Personal?'}</label><div className="flex gap-2"><button type="button" onClick={() => setIsNgo(false)} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${!isNgo ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground'}`}>{isArabic ? 'فرد' : 'Personal'}</button><button type="button" onClick={() => setIsNgo(true)} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${isNgo ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground'}`}>NGO</button></div></div>
        <div><label className="block text-sm font-medium text-foreground mb-1">{isArabic ? 'الاسم (اختياري)' : 'Name (optional)'}</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder={isArabic ? 'اسمك أو اسم المنظمة' : 'Your name or organization'} /></div>
        <div><label className="block text-sm font-medium text-foreground mb-1">{isArabic ? 'العنوان الكامل' : 'Full Address Details'} *</label><input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder={isArabic ? 'الشارع، المبنى، الطابق، المدينة، المنطقة' : 'Street, building, floor, city, region'} /></div>
        <LocationPicker lat={lat} lng={lng} onLocationChange={(newLat, newLng) => { setLat(newLat); setLng(newLng); }} />
        <div><label className="block text-sm font-medium text-foreground mb-1">{isArabic ? 'رقم الهاتف' : 'Phone Number'} *</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="+961 ..." /></div>
        <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">{isArabic ? 'نشر التبرع' : 'Post Donation'}</button>
      </form>
    </div>
  );
};

export default ShareDonationPage;
