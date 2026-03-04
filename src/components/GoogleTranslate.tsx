import { useLanguage } from '@/context/LanguageContext';

const GoogleTranslate = () => {
  const { isArabic, toggleLanguage } = useLanguage();

  return (
    <div className="language-toggle-wrapper">
      <button
        type="button"
        onClick={toggleLanguage}
        className="language-toggle-button"
        aria-label={isArabic ? 'Switch website language to English' : 'تحويل لغة الموقع إلى العربية'}
      >
        {isArabic ? 'English' : 'العربية'}
      </button>
    </div>
  );
};

export default GoogleTranslate;
