import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { translations } from "../constants/languages";

const resources = {};
Object.keys(translations).forEach((lang) => {
  resources[lang] = { translation: translations[lang] };
});

i18n
  .use(LanguageDetector) // auto-detect browser language
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;
