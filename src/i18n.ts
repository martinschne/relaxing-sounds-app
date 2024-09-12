import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

export const SUPPORTED_LANGUAGES = ["cs", "de", "en", "es", "pl", "sk", "sv"];
export const FALLBACK_LANGUAGE = "en";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: SUPPORTED_LANGUAGES,
    fallbackLng: FALLBACK_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      convertDetectedLanguage: (lng) => lng.substring(0, 2),
    },
  });

export default i18n;
