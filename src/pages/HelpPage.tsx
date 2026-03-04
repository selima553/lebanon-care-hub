import { useAppData } from '@/context/AppContext';
import HelpRequestCard from '@/components/HelpRequestCard';
import { HELP_TYPE_CONFIG, HelpType, getLocalizedLabel } from '@/types';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const HelpPage = () => {
  const { helpRequests } = useAppData();
  const { language, isArabic } = useLanguage();
  const [filter, setFilter] = useState<HelpType | 'all'>('all');
  const filtered = filter === 'all' ? helpRequests : helpRequests.filter((r) => r.type === filter);

  return (
    <div className="px-4 py-4 space-y-4 max-w-lg mx-auto">
      <h2 className="text-lg font-bold text-foreground">{isArabic ? 'طلبات المساعدة' : 'Help Requests'}</h2>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
        <button onClick={() => setFilter('all')} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>{isArabic ? 'الكل' : 'All'}</button>
        {(Object.keys(HELP_TYPE_CONFIG) as HelpType[]).map((type) => <button key={type} onClick={() => setFilter(type)} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === type ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>{HELP_TYPE_CONFIG[type].emoji} {getLocalizedLabel(HELP_TYPE_CONFIG[type], language)}</button>)}
      </div>
      <p className="text-xs text-muted-foreground">{filtered.length} {isArabic ? 'طلب' : `request${filtered.length !== 1 ? 's' : ''}`}</p>
      <div className="space-y-3">{filtered.map((req) => <HelpRequestCard key={req.id} request={req} />)}</div>
      {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground"><p className="text-lg">{isArabic ? 'لا توجد طلبات مساعدة' : 'No help requests'}</p></div>}
    </div>
  );
};

export default HelpPage;
