import { useAppData } from '@/context/AppContext';
import ShelterCard from '@/components/ShelterCard';
import { Search, Map } from 'lucide-react';
import { useState } from 'react';
import { ShelterStatus } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

const SheltersPage = () => {
  const { shelters } = useAppData();
  const { isArabic } = useLanguage();
  const [search, setSearch] = useState('');
  const [pricingFilter, setPricingFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ShelterStatus>('all');
  const navigate = useNavigate();

  const filtered = shelters.filter((s) => {
    const searchMatch = s.name.toLowerCase().includes(search.toLowerCase()) || s.address.toLowerCase().includes(search.toLowerCase());
    const effectivePricing = s.pricing || 'free';
    return searchMatch && (pricingFilter === 'all' || effectivePricing === pricingFilter) && (statusFilter === 'all' || s.status === statusFilter);
  });

  return (
    <div className="px-4 py-4 space-y-4 max-w-lg mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder={isArabic ? 'ابحث عن الملاجئ...' : 'Search shelters...'} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <button onClick={() => navigate('/shelters/map')} className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
          <Map className="w-4 h-4" />
          {isArabic ? 'الخريطة' : 'Map'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <select value={pricingFilter} onChange={(e) => setPricingFilter(e.target.value as 'all' | 'free' | 'paid')} className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
          <option value="all">{isArabic ? 'كل الأسعار' : 'All pricing'}</option><option value="free">{isArabic ? 'مجاني' : 'Free'}</option><option value="paid">{isArabic ? 'مدفوع' : 'Paid'}</option>
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | ShelterStatus)} className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
          <option value="all">{isArabic ? 'كل الحالات' : 'All statuses'}</option><option value="available">{isArabic ? 'متاح' : 'Available'}</option><option value="limited">{isArabic ? 'محدود' : 'Limited'}</option><option value="full">{isArabic ? 'غير متاح' : 'Not available'}</option>
        </select>
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} {isArabic ? 'ملجأ' : `shelter${filtered.length !== 1 ? 's' : ''}`} {isArabic ? 'موجود' : 'found'}</p>
      <div className="space-y-3">{filtered.map((shelter) => <ShelterCard key={shelter.id} shelter={shelter} />)}</div>

      {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground"><p className="text-lg">{isArabic ? 'لا توجد ملاجئ' : 'No shelters found'}</p><p className="text-sm mt-1">{isArabic ? 'جرّب فلاتر مختلفة أو أضف ملجأ جديداً' : 'Try different filters or add a new shelter'}</p></div>}
    </div>
  );
};

export default SheltersPage;
