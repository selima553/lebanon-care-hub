import { useEffect, useState } from 'react';

type Language = 'en' | 'ar';

const STORAGE_KEY = 'preferred-language';

const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';

  const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
  if (savedLanguage === 'ar' || savedLanguage === 'en') return savedLanguage;

  return 'en';
};

const applyLanguage = (language: Language) => {
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  document.body.classList.toggle('rtl', language === 'ar');
};

const GoogleTranslate = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    applyLanguage(currentLanguage);
    window.localStorage.setItem(STORAGE_KEY, currentLanguage);
  }, [currentLanguage]);

  const nextLanguage: Language = currentLanguage === 'en' ? 'ar' : 'en';

  return (
    <div className="language-toggle-wrapper">
      <button
        type="button"
        onClick={() => setCurrentLanguage(nextLanguage)}
        className="language-toggle-button"
        aria-label={`Switch website language to ${nextLanguage === 'ar' ? 'Arabic' : 'English'}`}
      >
        {currentLanguage === 'en' ? 'العربية' : 'English'}
      </button>
    </div>
  );
};

export default GoogleTranslate;
