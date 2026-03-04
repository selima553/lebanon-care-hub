import ShelterCard from '@/components/ShelterCard';
import { useAppData } from '@/context/AppContext';
import { ArrowLeft } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

const CREATED_SHELTERS_KEY = 'lch_created_shelter_ids';

const MySheltersPage = () => {
  const navigate = useNavigate();
  const { shelters } = useAppData();
  const { isArabic } = useLanguage();

  const createdShelterIds = useMemo(() => JSON.parse(localStorage.getItem(CREATED_SHELTERS_KEY) || '[]') as string[], []);
  const myShelters = shelters.filter((s) => createdShelterIds.includes(s.id));

  return (
    <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
      <button onClick={() => navigate('/add')} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft className="w-4 h-4" />{isArabic ? 'رجوع' : 'Back'}</button>
      <h2 className="text-xl font-bold text-foreground">{isArabic ? 'ملاجئي' : 'My Shelter Places'}</h2>
      <p className="text-sm text-muted-foreground">{isArabic ? 'عدّل الملاجئ التي أضفتها من هذا الجهاز.' : 'Edit the shelters you added from this device.'}</p>
      <div className="space-y-3">{myShelters.map((shelter) => <ShelterCard key={shelter.id} shelter={shelter} showEdit />)}</div>
      {myShelters.length === 0 && <div className="text-center py-12 text-muted-foreground"><p className="text-lg">{isArabic ? 'لم تتم إضافة ملاجئ بعد' : 'No shelters added yet'}</p><p className="text-sm mt-1">{isArabic ? 'أضف ملجأ أولاً ثم يمكنك تعديله هنا.' : 'Add a shelter first, then you can edit it here.'}</p></div>}
    </div>
  );
};

export default MySheltersPage;
