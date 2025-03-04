import i18n, { InitOptions } from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

interface CustomInitOptions extends InitOptions {
  backend: {
    loadPath: string;
  };
}

const options: CustomInitOptions = {
  fallbackLng: "en",
  debug: true,
  interpolation: {
    escapeValue: false,
  },
  backend: {
    loadPath: "/src/i18n/{{lng}}.json",
  },
};

i18n.use(HttpApi).use(LanguageDetector).use(initReactI18next).init(options);

export default i18n;
