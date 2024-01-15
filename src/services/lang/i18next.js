import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from '../../local/en.json';
import fa from '../../local/fa.json';

export const languageResources = {
  en: {translation: en},
  fa: {translation: fa},
};

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'fa',
  fallbackLng: 'fa',
  resources: languageResources,
});

export default i18next;