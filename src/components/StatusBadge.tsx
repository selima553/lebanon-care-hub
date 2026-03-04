import { SHELTER_STATUS_CONFIG, ShelterStatus, getLocalizedLabel } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface StatusBadgeProps {
  status: ShelterStatus;
  label?: string;
}

const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  const { language } = useLanguage();
  const config = SHELTER_STATUS_CONFIG[status];
  return <span className={`${config.className} px-2.5 py-0.5 rounded-full text-xs font-semibold`}>{label || getLocalizedLabel(config, language)}</span>;
};

export default StatusBadge;
