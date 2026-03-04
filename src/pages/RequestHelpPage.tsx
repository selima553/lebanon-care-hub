import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '@/context/AppContext';
import { HelpType, HELP_TYPE_CONFIG, getLocalizedLabel } from '@/types';
import { generateId } from '@/lib/helpers';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import LocationPicker from '@/components/LocationPicker';
import { useLanguage } from '@/context/LanguageContext';

const RequestHelpPage = () => {
  const navigate = useNavigate();
  const { addHelpRequest } = useAppData();
  const { language, isArabic } = useLanguage();
  const [type, setType] = useState<HelpType>('food');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !address) return toast.error(isArabic ? 'يرجى تعبئة الحقول المطلوبة' : 'Please fill in required fields');
    const created = await addHelpRequest({ id: generateId(), type, description: description || undefined, name: name || undefined, phone, lat: lat ?? undefined, lng: lng ?? undefined, address, createdAt: new Date().toISOString() });
    if (!created) return toast.error(isArabic ? 'تعذر نشر طلب المساعدة. حاول مرة أخرى.' : 'Could not post help request. Please try again.');
    toast.success(isArabic ? 'تم نشر طلب المساعدة!' : 'Help request posted!');
    navigate('/help');
  };

  return (
    <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
      <button onClick={() => navigate('/add')} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft className="w-4 h-4" /> {isArabic ? 'رجوع' : 'Back'}</button>
      <h2 className="text-xl font-bold text-foreground">🤝 {isArabic ? 'طلب مساعدة' : 'Request Help'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className="block text-sm font-medium text-foreground mb-2">{isArabic ? 'نوع المساعدة المطلوبة' : 'Type of Help Needed'} *</label><div className="grid grid-cols-2 gap-2">{(Object.keys(HELP_TYPE_CONFIG) as HelpType[]).map((t) => <button type="button" key={t} onClick={() => setType(t)} className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all text-left ${type === t ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>{HELP_TYPE_CONFIG[t].emoji} {getLocalizedLabel(HELP_TYPE_CONFIG[t], language)}</button>)}</div></div>
        <div><label className="block text-sm font-medium text-foreground mb-1">{isArabic ? 'الوصف (اختياري)' : 'Description (optional)'}</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[80px]" placeholder={isArabic ? 'اشرح ما الذي تحتاجه...' : 'Describe what you need...'} /></div>
        <div><label className="block text-sm font-medium text-foreground mb-1">{isArabic ? 'الاسم (اختياري)' : 'Your Name (optional)'}</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder={isArabic ? 'اتركه فارغًا للنشر كمجهول' : 'Leave empty for anonymous'} /></div>
        <div><label className="block text-sm font-medium text-foreground mb-1">{isArabic ? 'العنوان الكامل' : 'Full Address Details'} *</label><input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder={isArabic ? 'الشارع، المبنى، الطابق، المدينة، المنطقة' : 'Street, building, floor, city, region'} /></div>
        <LocationPicker lat={lat} lng={lng} onLocationChange={(newLat, newLng) => { setLat(newLat); setLng(newLng); }} />
        <div><label className="block text-sm font-medium text-foreground mb-1">{isArabic ? 'رقم الهاتف' : 'Phone Number'} *</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="+961 ..." /></div>
        <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">{isArabic ? 'نشر طلب المساعدة' : 'Post Help Request'}</button>
      </form>
    </div>
  );
};

export default RequestHelpPage;
