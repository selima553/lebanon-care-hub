import { useEffect, useMemo, useState } from 'react';

const TRANSLATE_ELEMENT_ID = 'google_translate_element';
const TRANSLATE_SCRIPT_ID = 'google-translate-script';
type Language = 'en' | 'ar';

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            layout: number;
            autoDisplay: boolean;
          },
          containerId: string,
        ) => unknown;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

const getCurrentLanguage = (): Language => {
  if (typeof document === 'undefined') return 'en';

  const cookieMatch = document.cookie.match(/(?:^|; )googtrans=([^;]+)/);
  const cookieValue = cookieMatch?.[1];

  if (cookieValue?.includes('/ar')) return 'ar';

  return 'en';
};

const GoogleTranslate = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  useEffect(() => {
    setCurrentLanguage(getCurrentLanguage());

    const initializeTranslate = () => {
      if (!window.google?.translate?.TranslateElement) return;

      const element = document.getElementById(TRANSLATE_ELEMENT_ID);
      if (!element || element.childElementCount > 0) return;

      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,ar',
          layout: 0,
          autoDisplay: false,
        },
        TRANSLATE_ELEMENT_ID,
      );
    };

    window.googleTranslateElementInit = initializeTranslate;

    if (window.google?.translate?.TranslateElement) {
      initializeTranslate();
    } else if (!document.getElementById(TRANSLATE_SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = TRANSLATE_SCRIPT_ID;
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }

    const cookiePoll = window.setInterval(() => {
      setCurrentLanguage(getCurrentLanguage());
    }, 1000);

    return () => {
      window.clearInterval(cookiePoll);
    };
  }, []);

  const nextLanguage = useMemo<Language>(() => (currentLanguage === 'en' ? 'ar' : 'en'), [currentLanguage]);

  const toggleLanguage = () => {
    const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (!select) return;

    select.value = nextLanguage;
    select.dispatchEvent(new Event('change'));
    setCurrentLanguage(nextLanguage);
  };

  return (
    <div className="google-translate-wrapper">
      <button
        type="button"
        onClick={toggleLanguage}
        className="google-translate-toggle"
        aria-label={`Switch website language to ${nextLanguage === 'ar' ? 'Arabic' : 'English'}`}
      >
        {nextLanguage === 'ar' ? 'Arabic' : 'English'}
      </button>
      <div id={TRANSLATE_ELEMENT_ID} className="google-translate-widget" aria-hidden="true" />
    </div>
  );
};

export default GoogleTranslate;
