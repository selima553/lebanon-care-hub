import { useEffect } from 'react';

const TRANSLATE_ELEMENT_ID = 'google_translate_element';
const TRANSLATE_SCRIPT_ID = 'google-translate-script';

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

const GoogleTranslate = () => {
  useEffect(() => {
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
      return;
    }

    if (!document.getElementById(TRANSLATE_SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = TRANSLATE_SCRIPT_ID;
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return <div id={TRANSLATE_ELEMENT_ID} className="google-translate-widget" aria-label="Translate website" />;
};

export default GoogleTranslate;
