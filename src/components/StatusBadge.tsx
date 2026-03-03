import { SHELTER_STATUS_CONFIG, ShelterStatus } from '@/types';

interface StatusBadgeProps {
  status: ShelterStatus;
  label?: string;
}

const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  const config = SHELTER_STATUS_CONFIG[status];
  return (
    <span className={`${config.className} px-2.5 py-0.5 rounded-full text-xs font-semibold`}>
      {label || config.label}
    </span>
  );
};

export default StatusBadge;
