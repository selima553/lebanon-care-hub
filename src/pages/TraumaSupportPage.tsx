import BreathingExercise from '@/components/trauma/BreathingExercise';
import PtsdCopingAccordion from '@/components/trauma/PtsdCopingAccordion';
import ChildAnxietySupport from '@/components/trauma/ChildAnxietySupport';
import { useLanguage } from '@/context/LanguageContext';

const TraumaSupportPage = () => {
  const { isArabic } = useLanguage();
  return (
    <div className="px-4 py-4 space-y-4 max-w-lg mx-auto">
      <header className="space-y-1">
        <h2 className="text-lg font-bold text-foreground">{isArabic ? 'الدعم النفسي' : 'Mental Support'}</h2>
        <p className="text-sm text-muted-foreground">{isArabic ? 'خذ لحظة للتنفس واستعادة هدوئك.' : 'Take a moment to breathe and reset.'}</p>
      </header>
      <BreathingExercise />
      <PtsdCopingAccordion />
      <ChildAnxietySupport />
    </div>
  );
};

export default TraumaSupportPage;
