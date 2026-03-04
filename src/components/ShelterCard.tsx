import { Shelter, SHELTER_STATUS_CONFIG, ShelterStatus, getLocalizedLabel } from '@/types';
import { timeAgo } from '@/lib/helpers';
import ContactButtons from './ContactButtons';
import DirectionsButton from './DirectionsButton';
import StatusBadge from './StatusBadge';
import { MapPin, Users, Clock, BadgeDollarSign, Pencil } from 'lucide-react';
import { useState } from 'react';
import { useAppData } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';

interface ShelterCardProps {
  shelter: Shelter;
  showEdit?: boolean;
}

const ShelterCard = ({ shelter, showEdit = false }: ShelterCardProps) => {
  const navigate = useNavigate();
  const { updateShelterCommunityStatus } = useAppData();
  const { language, isArabic } = useLanguage();
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [statusComment, setStatusComment] = useState('');

  const handleStatusUpdate = async (status: ShelterStatus) => {
    const updated = await updateShelterCommunityStatus(shelter.id, status, statusComment);
    if (!updated) {
      toast.error(isArabic ? 'تعذر تحديث حالة الملجأ. حاول مرة أخرى.' : 'Could not update shelter status. Please try again.');
      return;
    }
    setShowStatusUpdate(false);
    setStatusComment('');
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base text-card-foreground truncate">{shelter.name}</h3>
          {shelter.description && <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{shelter.description}</p>}
        </div>
        <StatusBadge status={shelter.status} />
      </div>

      <div className="space-y-1.5 text-sm text-muted-foreground">
        <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 shrink-0" /><span className="truncate">{shelter.address}</span></div>
        <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5 shrink-0" /><span>{isArabic ? 'السعة' : 'Capacity'}: {shelter.capacity ?? (isArabic ? 'غير معروف' : 'unknown')}</span></div>
        <div className="flex items-center gap-2"><BadgeDollarSign className="w-3.5 h-3.5 shrink-0" /><span>{shelter.pricing !== 'paid' ? (isArabic ? 'ملجأ مجاني' : 'Free shelter') : isArabic ? `مدفوع ($${shelter.priceAmount ?? 0})` : `Paid ($${shelter.priceAmount ?? 0})`}</span></div>
        <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 shrink-0" /><span>{isArabic ? 'أضيف' : 'Added'} {timeAgo(shelter.createdAt, language)}</span></div>
      </div>

      {shelter.communityStatus && (
        <div className="bg-muted rounded-lg p-2.5 text-sm space-y-1.5">
          <div className="flex items-center gap-2"><span className="text-muted-foreground">{isArabic ? 'تحديث المجتمع:' : 'Community update:'}</span><StatusBadge status={shelter.communityStatus} /></div>
          {shelter.communityStatusComment && <p className="text-xs text-card-foreground">{shelter.communityStatusComment}</p>}
          {shelter.communityStatusUpdatedAt && <p className="text-xs text-muted-foreground">{isArabic ? 'حُدّث' : 'Updated'} {timeAgo(shelter.communityStatusUpdatedAt, language)}</p>}
        </div>
      )}

      <div className="pt-1 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <ContactButtons phone={shelter.phone} />
          <DirectionsButton address={shelter.address} lat={shelter.lat} lng={shelter.lng} />
          {showEdit && <button onClick={() => navigate(`/add/shelter/${shelter.id}`)} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-card-foreground hover:bg-accent"><Pencil className="w-3.5 h-3.5" />{isArabic ? 'تعديل' : 'Edit'}</button>}
        </div>
        <button onClick={() => setShowStatusUpdate(!showStatusUpdate)} className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-card-foreground hover:bg-accent">{isArabic ? 'تحديث الحالة' : 'Update Status'}</button>
      </div>

      {showStatusUpdate && (
        <div className="space-y-2 pt-1">
          <div className="space-y-1">
            <label htmlFor={`status-comment-${shelter.id}`} className="text-xs text-muted-foreground">{isArabic ? 'أضف تعليقاً (اختياري)' : 'Add comment (optional)'}</label>
            <textarea id={`status-comment-${shelter.id}`} value={statusComment} onChange={(e) => setStatusComment(e.target.value)} placeholder={isArabic ? 'شارك تفاصيل إضافية' : 'Share additional details'} className="w-full min-h-20 rounded-lg border border-border bg-background px-2.5 py-2 text-xs text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(SHELTER_STATUS_CONFIG) as ShelterStatus[]).map((s) => (
              <button key={s} onClick={() => handleStatusUpdate(s)} className={`${SHELTER_STATUS_CONFIG[s].className} px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-90 transition-opacity`}>
                {getLocalizedLabel(SHELTER_STATUS_CONFIG[s], language)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShelterCard;
